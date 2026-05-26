"use client";

import { useState, useCallback } from "react";
import {
  CalendarDays, Zap, Copy, Bell, Check, X, Plus, Edit3,
  Clock, ToggleLeft, ToggleRight, Send, ExternalLink,
  AlertCircle, ChevronDown, RefreshCw, Trash2, Globe,
  CheckCircle2, Timer, FileText, Image, LayoutGrid, Video,
} from "lucide-react";
import {
  PROFILES, POSTS, POST_STATUS_META,
  AUTO_POST_CONFIGS, TEMPLATE_PROFILE_CONFIGS, APPROVAL_SETTINGS,
  type AutoPostConfig, type TemplateProfileConfig, type ApprovalSettings,
  type Post,
} from "@/lib/mock-data";

// ─── constants ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "schedule", label: "Lịch đăng",        icon: CalendarDays },
  { id: "auto",     label: "Tự động hóa",       icon: Zap          },
  { id: "template", label: "Profile mẫu",        icon: Copy         },
  { id: "approval", label: "Duyệt & Thông báo", icon: Bell         },
] as const;
type Tab = typeof TABS[number]["id"];

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const FORMAT_ICON: Record<Post["format"], typeof FileText> = {
  text:     FileText,
  image:    Image,
  carousel: LayoutGrid,
  video:    Video,
};

const MOCK_TEMPLATE_POSTS = [
  "5 bước skincare tối đơn giản mà hiệu quả — bước 3 nhiều người bỏ qua...",
  "Combo dưỡng da dưới 300K cho da khô: sản phẩm nào đáng tiền nhất?",
  "Retinol vs Niacinamide: dùng cùng được không? Đây là câu trả lời thật sự...",
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((d.getTime() - now.getTime()) / 86400000);
  const timeStr = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  if (diff === 0) return `Hôm nay · ${timeStr}`;
  if (diff === 1) return `Ngày mai · ${timeStr}`;
  if (diff === -1) return `Hôm qua · ${timeStr}`;
  return `${d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} · ${timeStr}`;
}

function groupPostsByDay(posts: Post[]) {
  const map = new Map<string, Post[]>();
  [...posts].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)).forEach((p) => {
    const key = p.scheduledAt.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  });
  return map;
}

function dayLabel(isoDate: string) {
  const d = new Date(isoDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((d.getTime() - now.getTime()) / 86400000);
  if (diff === 0) return "Hôm nay";
  if (diff === 1) return "Ngày mai";
  if (diff === -1) return "Hôm qua";
  return d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" });
}

// ─── Schedule Tab ─────────────────────────────────────────────────────────────

function ScheduleTab({ posts, setPosts }: { posts: Post[]; setPosts: (p: Post[]) => void }) {
  const [filterProfile, setFilterProfile] = useState("all");
  const [filterStatus, setFilterStatus]   = useState("all");

  const filtered = posts.filter((p) => {
    const profileOk = filterProfile === "all" || p.profileId === filterProfile;
    const statusOk  = filterStatus  === "all" || p.status    === filterStatus;
    return profileOk && statusOk;
  });

  const grouped = groupPostsByDay(filtered);

  const approve = (id: string) =>
    setPosts(posts.map((p) => p.id === id ? { ...p, status: "scheduled" as const } : p));
  const remove = (id: string) => setPosts(posts.filter((p) => p.id !== id));

  const scheduled  = posts.filter((p) => p.status === "scheduled").length;
  const pending    = posts.filter((p) => p.status === "draft").length;
  const postedToday = posts.filter((p) => p.status === "posted" && p.scheduledAt.startsWith("2026-05-26")).length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Đã lên lịch", value: scheduled, color: "var(--vt-blue)", bg: "rgba(44,90,160,0.08)" },
          { label: "Chờ duyệt",   value: pending,   color: "#d97706",         bg: "rgba(217,119,6,0.1)"  },
          { label: "Đã đăng hôm nay", value: postedToday, color: "#16a34a",  bg: "rgba(22,163,74,0.08)" },
          { label: "Tổng bài",    value: posts.length, color: "var(--vt-navy)", bg: "var(--vt-bg)"       },
        ].map((s) => (
          <div key={s.label} className="vt-card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--vt-gray-500)" }}>{s.label}</div>
            <div className="text-[26px] font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select className="vt-input text-[12.5px] w-auto"
          value={filterProfile} onChange={(e) => setFilterProfile(e.target.value)}>
          <option value="all">Tất cả profile</option>
          {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="vt-input text-[12.5px] w-auto"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="draft">Chờ duyệt</option>
          <option value="scheduled">Đã lên lịch</option>
          <option value="reminded">Đã nhắc</option>
          <option value="posted">Đã đăng</option>
        </select>
        <div className="flex-1" />
        <button className="vt-btn-primary"><Plus size={14} /> Tạo bài mới</button>
      </div>

      {/* Timeline */}
      {grouped.size === 0 ? (
        <div className="vt-card p-12 text-center">
          <CalendarDays size={32} className="mx-auto mb-3" style={{ color: "var(--vt-gray-500)" }} />
          <p className="text-[13px] font-medium" style={{ color: "var(--vt-navy)" }}>Không có bài nào</p>
        </div>
      ) : (
        Array.from(grouped.entries()).map(([day, dayPosts]) => (
          <div key={day}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>
                {dayLabel(day)}
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--vt-gray-100)" }} />
              <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{dayPosts.length} bài</span>
            </div>
            <div className="space-y-2">
              {dayPosts.map((post) => {
                const profile = PROFILES.find((p) => p.id === post.profileId);
                const meta    = POST_STATUS_META[post.status];
                const FmtIcon = FORMAT_ICON[post.format];
                const isPending = post.status === "draft";
                return (
                  <div key={post.id}
                    className="vt-card p-4 flex items-center gap-4"
                    style={isPending ? { borderLeft: "3px solid #d97706" } : {}}>
                    {/* Profile avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: profile?.avatarColor ?? "#6B7280" }}>
                      {profile?.initials ?? "?"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold truncate" style={{ color: "var(--vt-navy)" }}>
                          {post.title}
                        </span>
                        {isPending && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(217,119,6,0.12)", color: "#d97706" }}>
                            Chờ duyệt
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] truncate" style={{ color: "var(--vt-gray-500)" }}>
                        {post.content}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
                        <FmtIcon size={12} />
                        <span>{post.format}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
                        <Clock size={12} />
                        <span>{formatDate(post.scheduledAt)}</span>
                      </div>
                      <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isPending && (
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition-colors hover:opacity-90"
                          style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}
                          onClick={() => approve(post.id)}>
                          <Check size={12} /> Duyệt
                        </button>
                      )}
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100">
                        <Edit3 size={13} style={{ color: "var(--vt-gray-500)" }} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                        onClick={() => remove(post.id)}>
                        <Trash2 size={13} style={{ color: "#dc2626" }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Automation Tab ───────────────────────────────────────────────────────────

function AutomationTab({ configs, setConfigs }: { configs: AutoPostConfig[]; setConfigs: (c: AutoPostConfig[]) => void }) {
  const update = (profileId: string, patch: Partial<AutoPostConfig>) =>
    setConfigs(configs.map((c) => c.profileId === profileId ? { ...c, ...patch } : c));

  const toggleTime = (profileId: string, time: string) => {
    const cfg = configs.find((c) => c.profileId === profileId)!;
    const times = cfg.postingTimes.includes(time)
      ? cfg.postingTimes.filter((t) => t !== time)
      : [...cfg.postingTimes, time].sort();
    update(profileId, { postingTimes: times });
  };

  const addTime = (profileId: string, time: string) => {
    if (!time) return;
    const cfg = configs.find((c) => c.profileId === profileId)!;
    if (!cfg.postingTimes.includes(time)) {
      update(profileId, { postingTimes: [...cfg.postingTimes, time].sort() });
    }
  };

  const removeTime = (profileId: string, time: string) => {
    const cfg = configs.find((c) => c.profileId === profileId)!;
    update(profileId, { postingTimes: cfg.postingTimes.filter((t) => t !== time) });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl flex items-start gap-2.5"
        style={{ background: "rgba(44,90,160,0.06)", border: "1px solid rgba(44,90,160,0.1)" }}>
        <Zap size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vt-blue)" }} />
        <p className="text-[12px]" style={{ color: "var(--vt-blue)" }}>
          Cài đặt lịch tự động theo từng KOL. Bài sẽ được tạo từ nguồn nội dung và đăng đúng khung giờ.
          Bật "Cần duyệt" nếu muốn xem trước trước khi đăng.
        </p>
      </div>

      {PROFILES.map((profile) => {
        const cfg = configs.find((c) => c.profileId === profile.id)!;
        if (!cfg) return null;

        return (
          <div key={profile.id} className="vt-card overflow-hidden">
            {/* Profile header */}
            <div className="px-5 py-4 flex items-center gap-3 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: profile.avatarColor }}>{profile.initials}</div>
              <div className="flex-1">
                <div className="text-[13.5px] font-bold" style={{ color: "var(--vt-navy)" }}>{profile.name}</div>
                <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{profile.nicheLabel}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px]" style={{ color: cfg.enabled ? "#16a34a" : "var(--vt-gray-500)" }}>
                  {cfg.enabled ? "Đang bật" : "Đang tắt"}
                </span>
                <button onClick={() => update(profile.id, { enabled: !cfg.enabled })}>
                  {cfg.enabled
                    ? <ToggleRight size={26} style={{ color: "#16a34a" }} />
                    : <ToggleLeft  size={26} style={{ color: "var(--vt-gray-500)" }} />}
                </button>
              </div>
            </div>

            <div className={`px-5 py-4 space-y-4 transition-opacity ${cfg.enabled ? "" : "opacity-40 pointer-events-none"}`}>
              {/* Posts per day */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--vt-gray-500)" }}>
                    Số bài mỗi ngày
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 rounded-lg border flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                      style={{ borderColor: "var(--vt-gray-100)" }}
                      onClick={() => update(profile.id, { postsPerDay: Math.max(1, cfg.postsPerDay - 1) })}>−</button>
                    <span className="w-8 text-center text-[16px] font-bold" style={{ color: "var(--vt-navy)" }}>
                      {cfg.postsPerDay}
                    </span>
                    <button className="w-7 h-7 rounded-lg border flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                      style={{ borderColor: "var(--vt-gray-100)" }}
                      onClick={() => update(profile.id, { postsPerDay: Math.min(10, cfg.postsPerDay + 1) })}>+</button>
                  </div>
                </div>

                {/* Require approval */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                  <AlertCircle size={14} style={{ color: cfg.requireApproval ? "#d97706" : "var(--vt-gray-500)" }} />
                  <span className="text-[12px] font-medium" style={{ color: "var(--vt-gray-900)" }}>Cần duyệt trước</span>
                  <button onClick={() => update(profile.id, { requireApproval: !cfg.requireApproval })}>
                    {cfg.requireApproval
                      ? <ToggleRight size={22} style={{ color: "#d97706" }} />
                      : <ToggleLeft  size={22} style={{ color: "var(--vt-gray-500)" }} />}
                  </button>
                </div>

                {/* Auto from sources */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                  <RefreshCw size={14} style={{ color: cfg.autoFromSources ? "var(--vt-blue)" : "var(--vt-gray-500)" }} />
                  <span className="text-[12px] font-medium" style={{ color: "var(--vt-gray-900)" }}>Tự lấy từ nguồn</span>
                  <button onClick={() => update(profile.id, { autoFromSources: !cfg.autoFromSources })}>
                    {cfg.autoFromSources
                      ? <ToggleRight size={22} style={{ color: "var(--vt-blue)" }} />
                      : <ToggleLeft  size={22} style={{ color: "var(--vt-gray-500)" }} />}
                  </button>
                </div>
              </div>

              {/* Posting times */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--vt-gray-500)" }}>
                  Khung giờ đăng
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {cfg.postingTimes.map((t) => (
                    <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-[12.5px]"
                      style={{ background: "rgba(245,166,35,0.12)", color: "#b45309" }}>
                      <Clock size={12} />{t}
                      <button className="ml-0.5 hover:opacity-70" onClick={() => removeTime(profile.id, t)}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <TimeAdder onAdd={(t) => addTime(profile.id, t)} />
                </div>
              </div>

              {/* Days of week */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--vt-gray-500)" }}>
                  Ngày hoạt động
                </div>
                <div className="flex gap-1.5">
                  {DAY_LABELS.map((d, i) => {
                    const active = cfg.daysActive.includes(i);
                    return (
                      <button key={i}
                        className="w-9 h-9 rounded-lg text-[12px] font-semibold border-2 transition-colors"
                        style={{
                          borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                          background: active ? "rgba(44,90,160,0.08)" : "white",
                          color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                        }}
                        onClick={() => update(profile.id, {
                          daysActive: active
                            ? cfg.daysActive.filter((x) => x !== i)
                            : [...cfg.daysActive, i].sort(),
                        })}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimeAdder({ onAdd }: { onAdd: (t: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-1.5">
      <input type="time" className="vt-input text-[12px] w-[90px] py-1"
        value={val} onChange={(e) => setVal(e.target.value)} />
      <button className="vt-btn-secondary px-2.5 py-1.5 text-[12px]"
        onClick={() => { onAdd(val); setVal(""); }}>
        <Plus size={12} />
      </button>
    </div>
  );
}

// ─── Template Profile Tab ─────────────────────────────────────────────────────

function TemplateTab({ configs, setConfigs }: { configs: TemplateProfileConfig[]; setConfigs: (c: TemplateProfileConfig[]) => void }) {
  const update = (profileId: string, patch: Partial<TemplateProfileConfig>) =>
    setConfigs(configs.map((c) => c.profileId === profileId ? { ...c, ...patch } : c));

  const [fetching, setFetching] = useState<string | null>(null);
  const simulateFetch = (profileId: string) => {
    setFetching(profileId);
    setTimeout(() => setFetching(null), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl flex items-start gap-2.5"
        style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.1)" }}>
        <Copy size={14} className="mt-0.5 shrink-0" style={{ color: "#7c3aed" }} />
        <p className="text-[12px]" style={{ color: "#7c3aed" }}>
          Trỏ từng KOL đến một profile Facebook/Page làm mẫu. AI sẽ lấy bài từ profile đó,
          viết lại theo giọng KOL và đưa vào hàng chờ lên lịch.
        </p>
      </div>

      {PROFILES.map((profile) => {
        const cfg = configs.find((c) => c.profileId === profile.id)!;
        if (!cfg) return null;
        const isFetching = fetching === profile.id;

        return (
          <div key={profile.id} className="vt-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: profile.avatarColor }}>{profile.initials}</div>
              <div className="flex-1">
                <div className="text-[13.5px] font-bold" style={{ color: "var(--vt-navy)" }}>{profile.name}</div>
                <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{profile.nicheLabel}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px]" style={{ color: cfg.enabled ? "#7c3aed" : "var(--vt-gray-500)" }}>
                  {cfg.enabled ? "Đang bật" : "Đang tắt"}
                </span>
                <button onClick={() => update(profile.id, { enabled: !cfg.enabled })}>
                  {cfg.enabled
                    ? <ToggleRight size={26} style={{ color: "#7c3aed" }} />
                    : <ToggleLeft  size={26} style={{ color: "var(--vt-gray-500)" }} />}
                </button>
              </div>
            </div>

            <div className={`px-5 py-4 space-y-4 ${cfg.enabled ? "" : "opacity-40 pointer-events-none"}`}>
              {/* Template URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                    style={{ color: "var(--vt-gray-500)" }}>Tên profile mẫu</label>
                  <input className="vt-input text-[13px]" placeholder="VD: Beauty Guru VN"
                    value={cfg.templateLabel}
                    onChange={(e) => update(profile.id, { templateLabel: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                    style={{ color: "var(--vt-gray-500)" }}>URL profile / Page</label>
                  <div className="flex gap-2">
                    <input className="vt-input text-[13px] font-mono flex-1" placeholder="https://facebook.com/..."
                      value={cfg.templateUrl}
                      onChange={(e) => update(profile.id, { templateUrl: e.target.value })} />
                    {cfg.templateUrl && (
                      <a href={cfg.templateUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-gray-50 shrink-0"
                        style={{ borderColor: "var(--vt-gray-100)" }}>
                        <ExternalLink size={13} style={{ color: "var(--vt-gray-500)" }} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
                  style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                  <Globe size={14} style={{ color: cfg.autoRewrite ? "#7c3aed" : "var(--vt-gray-500)" }} />
                  <span className="text-[12px] font-medium flex-1" style={{ color: "var(--vt-gray-900)" }}>
                    Viết lại theo giọng KOL
                  </span>
                  <button onClick={() => update(profile.id, { autoRewrite: !cfg.autoRewrite })}>
                    {cfg.autoRewrite
                      ? <ToggleRight size={22} style={{ color: "#7c3aed" }} />
                      : <ToggleLeft  size={22} style={{ color: "var(--vt-gray-500)" }} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
                  style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                  <CalendarDays size={14} style={{ color: cfg.autoSchedule ? "var(--vt-blue)" : "var(--vt-gray-500)" }} />
                  <span className="text-[12px] font-medium flex-1" style={{ color: "var(--vt-gray-900)" }}>
                    Tự động lên lịch
                  </span>
                  <button onClick={() => update(profile.id, { autoSchedule: !cfg.autoSchedule })}>
                    {cfg.autoSchedule
                      ? <ToggleRight size={22} style={{ color: "var(--vt-blue)" }} />
                      : <ToggleLeft  size={22} style={{ color: "var(--vt-gray-500)" }} />}
                  </button>
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[12.5px] transition-colors border"
                  style={{
                    background: isFetching ? "rgba(124,58,237,0.08)" : "white",
                    borderColor: "#7c3aed",
                    color: "#7c3aed",
                  }}
                  onClick={() => simulateFetch(profile.id)}
                  disabled={isFetching}>
                  <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
                  {isFetching ? "Đang lấy bài..." : "Fetch ngay"}
                </button>
              </div>

              {/* Preview fetched posts */}
              {cfg.templateLabel && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--vt-gray-500)" }}>
                    Bài gần nhất từ {cfg.templateLabel}
                  </div>
                  <div className="space-y-2">
                    {MOCK_TEMPLATE_POSTS.map((text, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                          style={{ background: "#7c3aed" }}>{i + 1}</div>
                        <p className="text-[12.5px] flex-1" style={{ color: "var(--vt-gray-900)" }}>{text}</p>
                        <button className="vt-btn-secondary px-2.5 py-1 text-[11.5px] shrink-0">
                          <Plus size={11} /> Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Approval Tab ─────────────────────────────────────────────────────────────

function ApprovalTab({
  settings, setSettings, posts,
}: {
  settings: ApprovalSettings;
  setSettings: (s: ApprovalSettings) => void;
  posts: Post[];
}) {
  const patch = (p: Partial<ApprovalSettings>) => setSettings({ ...settings, ...p });
  const pending = posts.filter((p) => p.status === "draft");

  return (
    <div className="space-y-5">
      {/* Approval rules */}
      <div className="vt-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(217,119,6,0.1)", color: "#d97706" }}>
            <AlertCircle size={14} />
          </div>
          <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>Quy tắc duyệt bài</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              key: "requireApprovalForAuto" as const,
              label: "Duyệt bài đăng tự động",
              desc: "Bài do AI tạo sẽ vào hàng chờ, cần duyệt trước khi đăng",
            },
            {
              key: "requireApprovalForManual" as const,
              label: "Duyệt bài tạo thủ công",
              desc: "Bài do người tự viết cũng cần phê duyệt",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{label}</div>
                <div className="text-[11.5px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>{desc}</div>
              </div>
              <button onClick={() => patch({ [key]: !settings[key] })}>
                {settings[key]
                  ? <ToggleRight size={26} style={{ color: "#d97706" }} />
                  : <ToggleLeft  size={26} style={{ color: "var(--vt-gray-500)" }} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification channel */}
      <div className="vt-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
            <Bell size={14} />
          </div>
          <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>Kênh thông báo</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(["telegram", "lark", "none"] as const).map((ch) => (
            <button key={ch}
              className="p-3 rounded-xl border-2 text-[13px] font-semibold transition-colors"
              style={{
                borderColor: settings.notifyChannel === ch ? "var(--vt-blue)" : "var(--vt-gray-100)",
                background: settings.notifyChannel === ch ? "rgba(44,90,160,0.06)" : "white",
                color: settings.notifyChannel === ch ? "var(--vt-blue)" : "var(--vt-gray-500)",
              }}
              onClick={() => patch({ notifyChannel: ch })}>
              {settings.notifyChannel === ch && <Check size={13} className="inline mr-1" />}
              {ch === "none" ? "Không thông báo" : ch.charAt(0).toUpperCase() + ch.slice(1)}
            </button>
          ))}
        </div>

        {settings.notifyChannel !== "none" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: "var(--vt-gray-500)" }}>
                {settings.notifyChannel === "telegram" ? "Username / Chat ID" : "Webhook URL / Bot token"}
              </label>
              <input className="vt-input text-[13px]"
                placeholder={settings.notifyChannel === "telegram" ? "@username hoặc -100xxxxxx" : "https://open.larksuite.com/..."}
                value={settings.notifyContact}
                onChange={(e) => patch({ notifyContact: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: "var(--vt-gray-500)" }}>Nhắc lại sau (giờ)</label>
              <div className="flex items-center gap-2">
                <button className="w-8 h-9 rounded-lg border flex items-center justify-center font-bold hover:bg-gray-50"
                  style={{ borderColor: "var(--vt-gray-100)" }}
                  onClick={() => patch({ reminderAfterHours: Math.max(1, settings.reminderAfterHours - 1) })}>−</button>
                <span className="w-10 text-center text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>
                  {settings.reminderAfterHours}h
                </span>
                <button className="w-8 h-9 rounded-lg border flex items-center justify-center font-bold hover:bg-gray-50"
                  style={{ borderColor: "var(--vt-gray-100)" }}
                  onClick={() => patch({ reminderAfterHours: Math.min(48, settings.reminderAfterHours + 1) })}>+</button>
              </div>
            </div>
          </div>
        )}

        {settings.notifyChannel !== "none" && (
          <button className="vt-btn-secondary flex items-center gap-2">
            <Send size={13} /> Gửi tin nhắn thử
          </button>
        )}
      </div>

      {/* Pending approvals */}
      <div className="vt-card overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)" }}>
          <div>
            <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>Bài chờ duyệt</h3>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>
              {pending.length} bài đang chờ phê duyệt
            </p>
          </div>
          {pending.length > 0 && (
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: "#d97706" }}>{pending.length}</span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <CheckCircle2 size={28} className="mx-auto mb-2" style={{ color: "#16a34a" }} />
            <p className="text-[13px] font-medium" style={{ color: "var(--vt-navy)" }}>Không có bài nào chờ duyệt</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--vt-gray-100)" }}>
            {pending.map((post) => {
              const profile = PROFILES.find((p) => p.id === post.profileId);
              return (
                <div key={post.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: profile?.avatarColor ?? "#6B7280" }}>
                    {profile?.initials ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{ color: "var(--vt-navy)" }}>{post.title}</div>
                    <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
                      {formatDate(post.scheduledAt)} · {post.charCount} ký tự
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                      style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>
                      <Check size={12} /> Duyệt
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                      style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
                      <X size={12} /> Từ chối
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PostingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("schedule");
  const [posts, setPosts]         = useState(POSTS);
  const [autoConfigs, setAutoConfigs] = useState<AutoPostConfig[]>(AUTO_POST_CONFIGS);
  const [templateConfigs, setTemplateConfigs] = useState<TemplateProfileConfig[]>(TEMPLATE_PROFILE_CONFIGS);
  const [approvalSettings, setApprovalSettings] = useState<ApprovalSettings>(APPROVAL_SETTINGS);

  const pendingCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl vt-card w-fit mb-5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors whitespace-nowrap relative"
              style={active ? { background: "var(--vt-navy)", color: "white" } : { color: "var(--vt-gray-500)" }}>
              <Icon size={13} />{label}
              {id === "approval" && pendingCount > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: active ? "rgba(255,255,255,0.25)" : "#d97706", color: "white" }}>
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "schedule"  && <ScheduleTab  posts={posts} setPosts={setPosts} />}
      {activeTab === "auto"      && <AutomationTab configs={autoConfigs} setConfigs={setAutoConfigs} />}
      {activeTab === "template"  && <TemplateTab   configs={templateConfigs} setConfigs={setTemplateConfigs} />}
      {activeTab === "approval"  && <ApprovalTab   settings={approvalSettings} setSettings={setApprovalSettings} posts={posts} />}
    </div>
  );
}
