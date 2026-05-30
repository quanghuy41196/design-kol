"use client";

import { useState } from "react";
import {
  CalendarDays, Zap, Copy, Bell, Check, X, Plus,
  Clock, ToggleLeft, ToggleRight, Send, ExternalLink,
  AlertCircle, ChevronLeft, ChevronRight, RefreshCw, Trash2, Globe,
  CheckCircle2, FileText, Image, LayoutGrid, Video,
  PenLine, AlignLeft, Film, Search, Hash, History,
  ArrowUpDown, Download,
} from "lucide-react";
import {
  PROFILES, POSTS, POST_STATUS_META, CONTENT_LIBRARY,
  AUTO_POST_CONFIGS, TEMPLATE_PROFILE_CONFIGS, APPROVAL_SETTINGS,
  type AutoPostConfig, type TemplateProfileConfig, type ApprovalSettings,
  type Post, type ContentItem,
} from "@/lib/mock-data";
import { AIScoreBadge } from "@/components/shared/ai-score-badge";

// ─── constants ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "create",   label: "Đăng bài",          icon: PenLine      },
  { id: "schedule", label: "Lịch đăng",          icon: CalendarDays },
  { id: "approval", label: "Duyệt & Thông báo",  icon: Bell         },
  { id: "auto",     label: "Tự động hoá",         icon: Zap          },
  { id: "template", label: "Profile mẫu",         icon: Copy         },
  { id: "history",  label: "Lịch sử đăng",        icon: History      },
] as const;
type Tab = typeof TABS[number]["id"];

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const FORMAT_ICON: Record<Post["format"], typeof FileText> = {
  text:     FileText,
  image:    Image,
  carousel: LayoutGrid,
  video:    Video,
};

const CONTENT_TYPE_META: Record<ContentItem["type"], { label: string; color: string; icon: typeof FileText }> = {
  text:     { label: "Text",     color: "#2C5AA0", icon: AlignLeft  },
  image:    { label: "Ảnh",      color: "#8B5CF6", icon: Image      },
  carousel: { label: "Carousel", color: "#0891B2", icon: LayoutGrid },
  video:    { label: "Video",    color: "#dc2626", icon: Film       },
};

const CONTENT_STATUS_META: Record<ContentItem["status"], { label: string; color: string; bg: string }> = {
  ready: { label: "Sẵn sàng", color: "#16a34a", bg: "rgba(22,163,74,0.1)"  },
  used:  { label: "Đã dùng",  color: "#6B7280", bg: "#E5E7EB"               },
  draft: { label: "Nháp",     color: "#d97706", bg: "rgba(217,119,6,0.1)"  },
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

function getWeekDates(offset: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

// ─── Create Tab ───────────────────────────────────────────────────────────────

function CreateTab() {
  const [search, setSearch]             = useState("");
  const [filterType, setFilterType]     = useState("all");
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [profileId, setProfileId]       = useState(PROFILES[0].id);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");

  const filtered = CONTENT_LIBRARY.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === "all" || item.type === filterType;
    return matchSearch && matchType;
  });

  const selected        = CONTENT_LIBRARY.find((i) => i.id === selectedId);
  const selectedProfile = PROFILES.find((p) => p.id === profileId)!;

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Left: library browser */}
      <div className="col-span-7 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-4" style={{ color: "var(--vt-navy)" }}>
          Chọn nội dung từ kho
        </h3>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--vt-gray-500)" }} />
            <input className="vt-input pl-8 text-[12.5px] py-1.5 w-full" placeholder="Tìm nội dung..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="vt-input text-[12.5px] py-1.5 w-auto"
            value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả loại</option>
            <option value="text">Text</option>
            <option value="image">Ảnh</option>
            <option value="carousel">Carousel</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Content list */}
        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="text-center py-10" style={{ color: "var(--vt-gray-400)" }}>
              <FileText size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-[13px]">Không tìm thấy nội dung</p>
            </div>
          )}
          {filtered.map((item) => {
            const typeMeta   = CONTENT_TYPE_META[item.type];
            const statusMeta = CONTENT_STATUS_META[item.status];
            const TypeIcon   = typeMeta.icon;
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(isSelected ? null : item.id)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
                style={{
                  borderColor: isSelected ? "var(--vt-blue)" : "var(--vt-gray-100)",
                  background:  isSelected ? "rgba(44,90,160,0.05)" : "white",
                }}
              >
                {/* Type icon */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: typeMeta.color + "15", color: typeMeta.color }}>
                  <TypeIcon size={17} />
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate mb-0.5"
                    style={{ color: "var(--vt-navy)" }}>{item.title}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: typeMeta.color + "15", color: typeMeta.color }}>
                      {typeMeta.label}
                    </span>
                    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: statusMeta.bg, color: statusMeta.color }}>
                      {statusMeta.label}
                    </span>
                    {item.tags.slice(0, 2).map((t) => (
                      <span key={t} className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(44,90,160,0.07)", color: "var(--vt-blue)" }}>
                        <Hash size={8} />{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score + date */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <AIScoreBadge score={item.score} size="sm" />
                  <span className="text-[10.5px]" style={{ color: "var(--vt-gray-400)" }}>
                    {item.date}
                  </span>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--vt-blue)" }}>
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: config */}
      <div className="col-span-5">
        {!selected ? (
          <div className="vt-card p-8 flex flex-col items-center justify-center text-center h-full"
            style={{ minHeight: 300 }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "rgba(44,90,160,0.08)" }}>
              <FileText size={24} style={{ color: "var(--vt-blue)", opacity: 0.5 }} />
            </div>
            <p className="text-[13.5px] font-semibold mb-1" style={{ color: "var(--vt-navy)" }}>
              Chọn nội dung để đăng
            </p>
            <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
              Click vào một bài từ kho để cấu hình profile và thời gian đăng
            </p>
          </div>
        ) : (
          <div className="vt-card p-5 space-y-4">
            {/* Selected preview */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--vt-gray-500)" }}>Nội dung đã chọn</div>
              <div className="p-3 rounded-xl border"
                style={{ background: "var(--vt-bg)", borderColor: "var(--vt-gray-100)" }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: CONTENT_TYPE_META[selected.type].color + "15",
                      color:      CONTENT_TYPE_META[selected.type].color,
                    }}>
                    {(() => { const Icon = CONTENT_TYPE_META[selected.type].icon; return <Icon size={15} />; })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold leading-snug"
                      style={{ color: "var(--vt-navy)" }}>{selected.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <AIScoreBadge score={selected.score} size="sm" />
                      <span className="text-[10.5px]" style={{ color: "var(--vt-gray-400)" }}>
                        {selected.date}
                      </span>
                    </div>
                  </div>
                  <button className="text-[11px]" style={{ color: "var(--vt-gray-400)" }}
                    onClick={() => setSelectedId(null)}>✕</button>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div>
              <label className="block text-[12px] font-semibold mb-2"
                style={{ color: "var(--vt-gray-900)" }}>Profile đăng</label>
              <div className="space-y-1.5">
                {PROFILES.map((p) => {
                  const active = profileId === p.id;
                  return (
                    <button key={p.id} onClick={() => setProfileId(p.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-2 transition-all text-left"
                      style={{
                        borderColor: active ? p.avatarColor : "var(--vt-gray-100)",
                        background:  active ? `${p.avatarColor}0d` : "white",
                      }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: p.avatarColor }}>{p.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-semibold"
                          style={{ color: active ? p.avatarColor : "var(--vt-navy)" }}>{p.name}</div>
                        <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                          {p.nicheLabel} · {p.followers}
                        </div>
                      </div>
                      {active && (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: p.avatarColor }}>
                          <Check size={9} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-[12px] font-semibold mb-2"
                style={{ color: "var(--vt-gray-900)" }}>Thời gian đăng</label>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "var(--vt-gray-500)" }}>Ngày</label>
                  <input type="date" className="vt-input text-[13px]"
                    value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "var(--vt-gray-500)" }}>Giờ</label>
                  <input type="time" className="vt-input text-[13px]"
                    value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 border-t space-y-2" style={{ borderColor: "var(--vt-gray-100)" }}>
              <button className="vt-btn-primary w-full justify-center"
                disabled={!scheduleDate}
                style={{ opacity: scheduleDate ? 1 : 0.5 }}>
                <CalendarDays size={14} /> Lên lịch đăng
              </button>
              <button className="vt-btn-secondary w-full justify-center">
                <Send size={13} /> Đăng ngay (nhắc qua Telegram)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Calendar Tab ─────────────────────────────────────────────────────────────

type CalendarView = "week" | "month" | "history";

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const offset   = startDow === 0 ? 6 : startDow - 1;
  const grid: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) grid.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

function CalendarTab({ posts, setPosts }: { posts: Post[]; setPosts: (p: Post[]) => void }) {
  const [viewMode, setViewMode]           = useState<CalendarView>("week");
  const [weekOffset, setWeekOffset]       = useState(0);
  const [monthOffset, setMonthOffset]     = useState(0);
  const [filterProfile, setFilterProfile] = useState("all");

  // Quick actions
  const [quickAction, setQuickAction]     = useState<null | "approve" | "cancel">(null);
  const [qaKol, setQaKol]                 = useState("all");
  const [selectedIds, setSelectedIds]     = useState<Set<string>>(new Set());

  const todayKey  = toDateKey(new Date());
  const weekDays  = getWeekDates(weekOffset);
  const todayDate = new Date();
  const monthBase = new Date(todayDate.getFullYear(), todayDate.getMonth() + monthOffset, 1);
  const monthGrid = getMonthGrid(monthBase.getFullYear(), monthBase.getMonth());

  const filtered = posts.filter(
    (p) => filterProfile === "all" || p.profileId === filterProfile,
  );
  const postsByDate = new Map<string, Post[]>();
  filtered.forEach((p) => {
    const key = p.scheduledAt.slice(0, 10);
    if (!postsByDate.has(key)) postsByDate.set(key, []);
    postsByDate.get(key)!.push(p);
  });

  const stats = {
    scheduled:   posts.filter((p) => p.status === "scheduled").length,
    pending:     posts.filter((p) => p.status === "draft").length,
    posted:      posts.filter((p) => p.status === "posted").length,
    total:       posts.length,
  };

  // Next upcoming post per profile (soonest scheduled, future only)
  const nowIso = new Date().toISOString();
  const upcomingByProfile = PROFILES.map((profile) => {
    const next = posts
      .filter((p) => p.profileId === profile.id && p.status === "scheduled" && p.scheduledAt >= nowIso)
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
    return { profile, next };
  }).filter((x) => x.next);

  const weekLabel = (() => {
    const d0 = weekDays[0];
    const d6 = weekDays[6];
    return `Tuần ${d0.getDate()}/${d0.getMonth() + 1} – ${d6.getDate()}/${d6.getMonth() + 1}`;
  })();
  const monthLabel = monthBase.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  const approve = (id: string) =>
    setPosts(posts.map((p) => p.id === id ? { ...p, status: "scheduled" as const } : p));
  const remove  = (id: string) => setPosts(posts.filter((p) => p.id !== id));

  return (
    <div className="space-y-4">
      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Đã lên lịch",     value: stats.scheduled, color: "var(--vt-blue)", bg: "rgba(44,90,160,0.08)"  },
          { label: "Chờ duyệt",       value: stats.pending,   color: "#d97706",        bg: "rgba(217,119,6,0.1)"   },
          { label: "Đã đăng",         value: stats.posted,    color: "#16a34a",        bg: "rgba(22,163,74,0.08)"  },
          { label: "Tổng bài",        value: stats.total,     color: "var(--vt-navy)", bg: "var(--vt-bg)"          },
        ].map((s) => (
          <div key={s.label} className="vt-card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1"
              style={{ color: "var(--vt-gray-500)" }}>{s.label}</div>
            <div className="text-[28px] font-bold leading-none" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Upcoming posts by KOL */}
      {upcomingByProfile.length > 0 && (
        <div className="vt-card p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: "var(--vt-gray-500)" }}>
            Tài khoản chuẩn bị đăng
          </div>
          <div className="flex flex-wrap gap-2">
            {upcomingByProfile.map(({ profile, next }) => {
              const time = new Date(next!.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
              const date = new Date(next!.scheduledAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
              const FmtIcon = FORMAT_ICON[next!.format];
              return (
                <div key={profile.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border"
                  style={{ borderColor: `${profile.avatarColor}30`, background: `${profile.avatarColor}08` }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: profile.avatarColor }}>
                    {profile.initials}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold leading-tight" style={{ color: "var(--vt-navy)" }}>
                      {profile.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <FmtIcon size={10} style={{ color: profile.avatarColor }} />
                      <span className="text-[11px] font-semibold" style={{ color: profile.avatarColor }}>
                        {date} · {time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          {viewMode === "week" && (
            <>
              <button className="vt-btn-secondary px-2.5 py-1.5" onClick={() => setWeekOffset((w) => w - 1)}>
                <ChevronLeft size={14} />
              </button>
              <span className="text-[13px] font-bold min-w-[180px] text-center" style={{ color: "var(--vt-navy)" }}>
                {weekLabel}
              </span>
              <button className="vt-btn-secondary px-2.5 py-1.5" onClick={() => setWeekOffset((w) => w + 1)}>
                <ChevronRight size={14} />
              </button>
              {weekOffset !== 0 && (
                <button className="vt-btn-ghost text-[12px]" onClick={() => setWeekOffset(0)}>Hôm nay</button>
              )}
            </>
          )}
          {viewMode === "month" && (
            <>
              <button className="vt-btn-secondary px-2.5 py-1.5" onClick={() => setMonthOffset((m) => m - 1)}>
                <ChevronLeft size={14} />
              </button>
              <span className="text-[13px] font-bold min-w-[160px] text-center capitalize" style={{ color: "var(--vt-navy)" }}>
                {monthLabel}
              </span>
              <button className="vt-btn-secondary px-2.5 py-1.5" onClick={() => setMonthOffset((m) => m + 1)}>
                <ChevronRight size={14} />
              </button>
              {monthOffset !== 0 && (
                <button className="vt-btn-ghost text-[12px]" onClick={() => setMonthOffset(0)}>Tháng này</button>
              )}
            </>
          )}
          {viewMode === "history" && (
            <span className="text-[13px] font-bold" style={{ color: "var(--vt-navy)" }}>Lịch sử đăng bài</span>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-0.5 rounded-lg border" style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}>
            {(["week", "month", "history"] as CalendarView[]).map((v) => (
              <button key={v}
                className="px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors"
                style={{
                  background: viewMode === v ? "var(--vt-navy)" : "transparent",
                  color:      viewMode === v ? "white" : "var(--vt-gray-500)",
                }}
                onClick={() => setViewMode(v)}>
                {v === "week" ? "Tuần" : v === "month" ? "Tháng" : "Lịch sử"}
              </button>
            ))}
          </div>
          <select className="vt-input text-[12.5px] py-1.5 w-auto"
            value={filterProfile} onChange={(e) => setFilterProfile(e.target.value)}>
            <option value="all">Tất cả KOL</option>
            {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="vt-btn-primary"><Plus size={14} /> Tạo bài</button>
          <div className="w-px h-5 shrink-0" style={{ background: "var(--vt-gray-100)" }} />
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors"
            style={{
              borderColor: quickAction === "approve" ? "#16a34a" : "var(--vt-gray-100)",
              background:  quickAction === "approve" ? "rgba(22,163,74,0.08)" : "white",
              color:       quickAction === "approve" ? "#16a34a" : "var(--vt-gray-500)",
            }}
            onClick={() => { setQuickAction(quickAction === "approve" ? null : "approve"); setSelectedIds(new Set()); }}>
            <CheckCircle2 size={13} /> Duyệt nhanh
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors"
            style={{
              borderColor: quickAction === "cancel" ? "#dc2626" : "var(--vt-gray-100)",
              background:  quickAction === "cancel" ? "rgba(220,38,38,0.07)" : "white",
              color:       quickAction === "cancel" ? "#dc2626" : "var(--vt-gray-500)",
            }}
            onClick={() => { setQuickAction(quickAction === "cancel" ? null : "cancel"); setSelectedIds(new Set()); }}>
            <X size={13} /> Huỷ đăng nhanh
          </button>
        </div>
      </div>

      {/* ── Quick action panel ── */}
      {quickAction !== null && (() => {
        const isApprove  = quickAction === "approve";
        const accentColor = isApprove ? "#16a34a" : "#dc2626";
        const accentBg    = isApprove ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.07)";
        const candidates  = posts.filter((p) =>
          (isApprove ? p.status === "draft" : p.status === "scheduled") &&
          (qaKol === "all" || p.profileId === qaKol),
        );
        const allChecked  = candidates.length > 0 && candidates.every((p) => selectedIds.has(p.id));

        const toggle = (id: string) => {
          const next = new Set(selectedIds);
          next.has(id) ? next.delete(id) : next.add(id);
          setSelectedIds(next);
        };
        const toggleAll = () => {
          if (allChecked) setSelectedIds(new Set());
          else setSelectedIds(new Set(candidates.map((p) => p.id)));
        };
        const commit = () => {
          if (isApprove) {
            setPosts(posts.map((p) => selectedIds.has(p.id) ? { ...p, status: "scheduled" as const } : p));
          } else {
            setPosts(posts.filter((p) => !selectedIds.has(p.id)));
          }
          setSelectedIds(new Set());
          setQuickAction(null);
        };

        return (
          <div className="vt-card overflow-hidden">
            {/* Panel header */}
            <div className="px-5 py-3.5 flex items-center gap-3 border-b"
              style={{ borderColor: "var(--vt-gray-100)", background: accentBg }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: accentColor + "20", color: accentColor }}>
                {isApprove ? <CheckCircle2 size={15} /> : <X size={15} />}
              </div>
              <span className="text-[13.5px] font-bold flex-1" style={{ color: "var(--vt-navy)" }}>
                {isApprove ? "Duyệt nhanh bài chờ duyệt" : "Huỷ lịch đăng nhanh"}
              </span>
              {/* KOL filter */}
              <select className="vt-input text-[12.5px] py-1.5 w-auto"
                value={qaKol} onChange={(e) => { setQaKol(e.target.value); setSelectedIds(new Set()); }}>
                <option value="all">Tất cả KOL</option>
                {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="vt-btn-ghost text-[12px]"
                onClick={() => { setQuickAction(null); setSelectedIds(new Set()); }}>
                <X size={13} /> Đóng
              </button>
            </div>

            {/* Select all row */}
            <div className="px-5 py-2.5 flex items-center gap-3 border-b text-[12px]"
              style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}>
              <input type="checkbox" className="w-4 h-4 cursor-pointer accent-current rounded"
                style={{ accentColor }}
                checked={allChecked} onChange={toggleAll} />
              <span className="font-semibold" style={{ color: "var(--vt-gray-900)" }}>
                Chọn tất cả ({candidates.length} bài)
              </span>
              {selectedIds.size > 0 && (
                <span className="ml-auto text-[11.5px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: accentBg, color: accentColor }}>
                  {selectedIds.size} đã chọn
                </span>
              )}
            </div>

            {/* Post list */}
            {candidates.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-[13px]" style={{ color: "var(--vt-gray-400)" }}>
                  Không có bài {isApprove ? "chờ duyệt" : "đang lên lịch"} nào
                  {qaKol !== "all" ? " cho KOL này" : ""}.
                </p>
              </div>
            ) : (
              <div className="divide-y max-h-[320px] overflow-y-auto" style={{ borderColor: "var(--vt-gray-100)" }}>
                {candidates.map((post) => {
                  const profile   = PROFILES.find((p) => p.id === post.profileId);
                  const meta      = POST_STATUS_META[post.status];
                  const FmtIcon   = FORMAT_ICON[post.format];
                  const checked   = selectedIds.has(post.id);
                  const time      = new Date(post.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                  const date      = new Date(post.scheduledAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
                  return (
                    <label key={post.id}
                      className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ background: checked ? (isApprove ? "rgba(22,163,74,0.03)" : "rgba(220,38,38,0.03)") : "white" }}>
                      <input type="checkbox"
                        className="w-4 h-4 rounded cursor-pointer shrink-0"
                        style={{ accentColor }}
                        checked={checked}
                        onChange={() => toggle(post.id)} />
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: profile?.avatarColor ?? "#6B7280" }}>
                        {profile?.initials ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate" style={{ color: "var(--vt-navy)" }}>
                          {post.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                            {profile?.name}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--vt-gray-400)" }}>·</span>
                          <FmtIcon size={11} style={{ color: "var(--vt-gray-400)" }} />
                          <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                            {date} {time}
                          </span>
                          <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: meta.bg, color: meta.color }}>
                            {meta.label}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Confirm footer */}
            {selectedIds.size > 0 && (
              <div className="px-5 py-3.5 border-t flex items-center justify-between"
                style={{ borderColor: "var(--vt-gray-100)", background: accentBg }}>
                <span className="text-[12.5px] font-semibold" style={{ color: "var(--vt-gray-900)" }}>
                  {selectedIds.size} bài được chọn
                </span>
                <div className="flex items-center gap-2">
                  <button className="vt-btn-ghost text-[12px]"
                    onClick={() => setSelectedIds(new Set())}>Bỏ chọn tất cả</button>
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-[12.5px] text-white transition-opacity"
                    style={{ background: accentColor }}
                    onClick={commit}>
                    {isApprove
                      ? <><CheckCircle2 size={13} /> Duyệt {selectedIds.size} bài</>
                      : <><Trash2 size={13} /> Huỷ {selectedIds.size} lịch</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Week view ── */}
      {viewMode === "week" && (
        <div className="vt-card overflow-hidden">
          <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--vt-gray-100)" }}>
            {weekDays.map((d, i) => {
              const key     = toDateKey(d);
              const isToday = key === todayKey;
              const count   = postsByDate.get(key)?.length ?? 0;
              return (
                <div key={i} className="px-3 py-3 text-center"
                  style={{
                    borderRight: i < 6 ? "1px solid var(--vt-gray-100)" : "none",
                    background:  isToday ? "rgba(44,90,160,0.04)" : "var(--vt-bg)",
                  }}>
                  <div className="text-[10.5px] font-bold uppercase tracking-wide mb-1.5"
                    style={{ color: isToday ? "var(--vt-blue)" : "var(--vt-gray-500)" }}>
                    {DAY_LABELS[i]}
                  </div>
                  <div className="text-[17px] font-bold inline-flex items-center justify-center w-8 h-8 rounded-full mx-auto"
                    style={isToday ? { background: "var(--vt-blue)", color: "white" } : { color: "var(--vt-navy)" }}>
                    {d.getDate()}
                  </div>
                  {count > 0 && (
                    <div className="mt-1 text-[10px] font-semibold" style={{ color: "var(--vt-blue)" }}>
                      {count} bài
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7" style={{ minHeight: 380 }}>
            {weekDays.map((d, i) => {
              const key      = toDateKey(d);
              const isToday  = key === todayKey;
              const dayPosts = (postsByDate.get(key) ?? [])
                .slice().sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

              return (
                <div key={i} className="p-2 space-y-1.5"
                  style={{
                    borderRight: i < 6 ? "1px solid var(--vt-gray-100)" : "none",
                    background:  isToday ? "rgba(44,90,160,0.02)" : "white",
                    minHeight:   380,
                  }}>
                  {dayPosts.map((post) => {
                    const meta      = POST_STATUS_META[post.status];
                    const profile   = PROFILES.find((p) => p.id === post.profileId);
                    const time      = new Date(post.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                    const FmtIcon   = FORMAT_ICON[post.format];
                    const isPending = post.status === "draft";
                    return (
                      <div key={post.id}
                        className="p-2 rounded-lg cursor-pointer hover:shadow-sm transition-shadow group"
                        style={{
                          background: meta.bg,
                          border:     `1px solid ${meta.color}30`,
                          borderLeft: isPending ? `3px solid ${meta.color}` : `1px solid ${meta.color}30`,
                        }}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                            style={{ background: profile?.avatarColor ?? "#6B7280" }}>
                            {(profile?.initials ?? "?")[0]}
                          </div>
                          <span className="text-[10px] font-semibold flex-1" style={{ color: meta.color }}>{time}</span>
                          <FmtIcon size={9} style={{ color: meta.color, opacity: 0.5 }} />
                        </div>
                        <p className="text-[10.5px] font-medium leading-tight line-clamp-2 mb-1"
                          style={{ color: "var(--vt-navy)" }}>
                          {post.title}
                        </p>
                        <div className="hidden group-hover:flex items-center gap-1">
                          {isPending && (
                            <button className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(22,163,74,0.15)", color: "#16a34a" }}
                              onClick={(e) => { e.stopPropagation(); approve(post.id); }}>
                              Duyệt
                            </button>
                          )}
                          <button className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded ml-auto"
                            style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626" }}
                            onClick={(e) => { e.stopPropagation(); remove(post.id); }}>
                            Xoá
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {dayPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 opacity-70">
                      <AlertCircle size={18} style={{ color: "#d97706" }} />
                      <span className="text-[10.5px] text-center leading-tight" style={{ color: "var(--vt-gray-500)" }}>
                        {DAY_LABELS[i]} {d.getDate()}/{d.getMonth() + 1} · Trống
                      </span>
                      <button className="text-[10.5px] px-2.5 py-1 rounded-lg border font-semibold"
                        style={{ borderColor: "var(--vt-gray-200)", color: "var(--vt-gray-500)" }}>
                        Tạo bài cho ngày này
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Month view ── */}
      {viewMode === "month" && (
        <div className="vt-card overflow-hidden">
          {/* DOW headers */}
          <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--vt-gray-100)", background: "var(--vt-bg)" }}>
            {DAY_LABELS.map((lbl, i) => (
              <div key={i} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wide"
                style={{
                  color:       "var(--vt-gray-500)",
                  borderRight: i < 6 ? "1px solid var(--vt-gray-100)" : "none",
                }}>
                {lbl}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {monthGrid.map((d, idx) => {
              if (!d) {
                return (
                  <div key={idx} className="h-24 p-2"
                    style={{
                      background:   "#fafafa",
                      borderRight:  idx % 7 < 6 ? "1px solid var(--vt-gray-100)" : "none",
                      borderBottom: "1px solid var(--vt-gray-100)",
                    }} />
                );
              }
              const key       = toDateKey(d);
              const isToday   = key === todayKey;
              const dayPosts  = (postsByDate.get(key) ?? [])
                .slice().sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

              return (
                <div key={idx}
                  className="h-24 p-1.5 transition-colors hover:bg-blue-50 cursor-pointer"
                  style={{
                    borderRight:  idx % 7 < 6 ? "1px solid var(--vt-gray-100)" : "none",
                    borderBottom: "1px solid var(--vt-gray-100)",
                    background:   isToday ? "rgba(44,90,160,0.03)" : "white",
                  }}>
                  {/* Date number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[12px] font-bold inline-flex items-center justify-center w-6 h-6 rounded-full"
                      style={isToday
                        ? { background: "var(--vt-blue)", color: "white" }
                        : { color: "var(--vt-navy)" }}>
                      {d.getDate()}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[9.5px] font-semibold" style={{ color: "var(--vt-blue)" }}>
                        {dayPosts.length}
                      </span>
                    )}
                  </div>
                  {/* Post chips */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayPosts.slice(0, 3).map((post) => {
                      const meta    = POST_STATUS_META[post.status];
                      const profile = PROFILES.find((p) => p.id === post.profileId);
                      const time    = new Date(post.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                      return (
                        <div key={post.id}
                          className="flex items-center gap-1 px-1 py-0.5 rounded text-[9px] truncate"
                          style={{ background: meta.bg, color: meta.color }}>
                          <div className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: profile?.avatarColor ?? "#6B7280" }} />
                          <span className="font-semibold shrink-0">{time}</span>
                          <span className="truncate opacity-80">{post.title}</span>
                        </div>
                      );
                    })}
                    {dayPosts.length > 3 && (
                      <div className="text-[9px] font-semibold px-1" style={{ color: "var(--vt-gray-400)" }}>
                        +{dayPosts.length - 3} bài khác
                      </div>
                    )}
                    {dayPosts.length === 0 && (
                      <div className="flex items-center justify-center h-10 opacity-0 hover:opacity-40 transition-opacity">
                        <Plus size={10} style={{ color: "var(--vt-gray-400)" }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── History view ── */}
      {viewMode === "history" && (
        <div className="vt-card overflow-hidden">
          <div className="divide-y" style={{ borderColor: "var(--vt-gray-100)" }}>
            {[...posts]
              .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))
              .map((post) => {
                const meta    = POST_STATUS_META[post.status];
                const profile = PROFILES.find((p) => p.id === post.profileId);
                const FmtIcon = FORMAT_ICON[post.format];
                return (
                  <div key={post.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: profile?.avatarColor ?? "#6B7280" }}>
                      {profile?.initials ?? "?"}
                    </div>
                    <FmtIcon size={14} className="shrink-0" style={{ color: "var(--vt-gray-400)" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate" style={{ color: "var(--vt-navy)" }}>{post.title}</div>
                      <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
                        {formatDate(post.scheduledAt)} · {post.charCount} ký tự
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: meta.bg, color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="vt-card p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--vt-gray-500)" }}>
            Bài tuần này
          </div>
          <div className="text-[26px] font-bold" style={{ color: "var(--vt-navy)" }}>
            {stats.scheduled} / {stats.total}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 size={12} style={{ color: "#16a34a" }} />
            <span className="text-[11.5px]" style={{ color: "#16a34a" }}>Đạt KPI sau khi lấp T5+CN</span>
          </div>
        </div>
        <div className="vt-card p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--vt-gray-500)" }}>
            Phân bổ giờ đăng
          </div>
          <div className="text-[15px] font-bold mt-1" style={{ color: "var(--vt-navy)" }}>
            Sáng 33% · Chiều 25% · Tối 42%
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CheckCircle2 size={12} style={{ color: "#16a34a" }} />
            <span className="text-[11.5px]" style={{ color: "#16a34a" }}>Cân bằng tốt</span>
          </div>
        </div>
        <div className="vt-card p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--vt-gray-500)" }}>
            Jitter ngẫu nhiên
          </div>
          <div className="text-[26px] font-bold" style={{ color: "var(--vt-navy)" }}>±15 phút</div>
          <div className="text-[11.5px] mt-1" style={{ color: "var(--vt-gray-500)" }}>
            Để Meta không đánh dấu pattern
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(Object.entries(POST_STATUS_META) as [string, { label: string; color: string; bg: string }][]).map(([, meta]) => (
          <div key={meta.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: meta.color }} />
            <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{meta.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Automation Tab ───────────────────────────────────────────────────────────

function AutomationTab({ configs, setConfigs }: { configs: AutoPostConfig[]; setConfigs: (c: AutoPostConfig[]) => void }) {
  const update = (profileId: string, patch: Partial<AutoPostConfig>) =>
    setConfigs(configs.map((c) => c.profileId === profileId ? { ...c, ...patch } : c));

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
                          background:  active ? "rgba(44,90,160,0.08)" : "white",
                          color:       active ? "var(--vt-blue)"       : "var(--vt-gray-500)",
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
                    background:   isFetching ? "rgba(124,58,237,0.08)" : "white",
                    borderColor:  "#7c3aed",
                    color:        "#7c3aed",
                  }}
                  onClick={() => simulateFetch(profile.id)}
                  disabled={isFetching}>
                  <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
                  {isFetching ? "Đang lấy bài..." : "Fetch ngay"}
                </button>
              </div>

              {cfg.templateLabel && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "var(--vt-gray-500)" }}>
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
              desc:  "Bài do AI tạo sẽ vào hàng chờ, cần duyệt trước khi đăng",
            },
            {
              key: "requireApprovalForManual" as const,
              label: "Duyệt bài tạo thủ công",
              desc:  "Bài do người tự viết cũng cần phê duyệt",
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
                background:  settings.notifyChannel === ch ? "rgba(44,90,160,0.06)" : "white",
                color:       settings.notifyChannel === ch ? "var(--vt-blue)" : "var(--vt-gray-500)",
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

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({ posts }: { posts: Post[] }) {
  const [filterKol, setFilterKol]       = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch]             = useState("");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [sortDir, setSortDir]           = useState<"desc" | "asc">("desc");

  const stats = {
    posted:    posts.filter((p) => p.status === "posted").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    reminded:  posts.filter((p) => p.status === "reminded").length,
    draft:     posts.filter((p) => p.status === "draft").length,
    archived:  posts.filter((p) => p.status === "archived").length,
  };

  const filtered = posts
    .filter((p) => {
      if (filterKol    !== "all" && p.profileId !== filterKol) return false;
      if (filterStatus !== "all" && p.status    !== filterStatus) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFrom && p.scheduledAt < dateFrom) return false;
      if (dateTo   && p.scheduledAt > dateTo + "T23:59:59") return false;
      return true;
    })
    .sort((a, b) => {
      const cmp = a.scheduledAt.localeCompare(b.scheduledAt);
      return sortDir === "desc" ? -cmp : cmp;
    });

  const exportCSV = () => {
    const formatLabel: Record<Post["format"], string> = {
      text: "Text", image: "Ảnh", carousel: "Carousel", video: "Video",
    };
    const now = new Date().toLocaleDateString("vi-VN");

    // Summary header block
    const summaryRows = [
      ["BÁO CÁO LỊCH SỬ ĐĂNG BÀI", "", "", "", "", "", "", ""],
      [`Xuất ngày: ${now}`, "", "", "", "", "", "", ""],
      [`KOL: ${filterKol === "all" ? "Tất cả" : PROFILES.find((p) => p.id === filterKol)?.name ?? filterKol}`, "", "", "", "", "", "", ""],
      [`Trạng thái: ${filterStatus === "all" ? "Tất cả" : POST_STATUS_META[filterStatus as Post["status"]]?.label ?? filterStatus}`, "", "", "", "", "", "", ""],
      [`Tổng bài xuất: ${filtered.length}`, "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      // Stats
      ["Thống kê", "Đã đăng", "Đã lên lịch", "Đã nhắc", "Nháp", "Lưu trữ", "Tổng", ""],
      ["Số lượng", stats.posted, stats.scheduled, stats.reminded, stats.draft, stats.archived, posts.length, ""],
      ["", "", "", "", "", "", "", ""],
      // Column headers
      ["STT", "KOL", "Tiêu đề bài", "Định dạng", "Ngày đăng", "Giờ đăng", "Trạng thái", "Số ký tự"],
    ];

    // Data rows
    const dataRows = filtered.map((p, i) => {
      const profile = PROFILES.find((x) => x.id === p.profileId);
      const d       = new Date(p.scheduledAt);
      return [
        i + 1,
        profile?.name ?? p.profileId,
        `"${p.title.replace(/"/g, '""')}"`,
        formatLabel[p.format],
        d.toLocaleDateString("vi-VN"),
        d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        POST_STATUS_META[p.status]?.label ?? p.status,
        p.charCount,
      ];
    });

    const allRows = [...summaryRows, ...dataRows];
    const csv     = allRows.map((r) => r.join(",")).join("\n");
    const bom     = "﻿"; // UTF-8 BOM for Excel
    const blob    = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href        = url;
    a.download    = `lich-su-dang-bai-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Đã đăng",     value: stats.posted,    color: "#16a34a",        bg: "rgba(22,163,74,0.08)"  },
          { label: "Đã lên lịch", value: stats.scheduled, color: "var(--vt-blue)", bg: "rgba(44,90,160,0.08)"  },
          { label: "Đã nhắc",     value: stats.reminded,  color: "#d97706",        bg: "rgba(217,119,6,0.08)"  },
          { label: "Nháp",        value: stats.draft,     color: "#6B7280",        bg: "#F3F4F6"               },
          { label: "Lưu trữ",     value: stats.archived,  color: "#6B7280",        bg: "#F3F4F6"               },
        ].map((s) => (
          <div key={s.label} className="vt-card p-4 cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => setFilterStatus(filterStatus === s.label.toLowerCase() ? "all" : (() => {
              const map: Record<string, string> = { "Đã đăng": "posted", "Đã lên lịch": "scheduled", "Đã nhắc": "reminded", "Nháp": "draft", "Lưu trữ": "archived" };
              return map[s.label];
            })())}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide mb-1"
              style={{ color: "var(--vt-gray-500)" }}>{s.label}</div>
            <div className="text-[26px] font-bold leading-none" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* KOL filter chips */}
      <div className="vt-card px-4 py-3 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold uppercase tracking-wide shrink-0"
          style={{ color: "var(--vt-gray-400)" }}>KOL</span>
        <button onClick={() => setFilterKol("all")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[12px] font-semibold transition-all"
          style={{
            borderColor: filterKol === "all" ? "var(--vt-blue)" : "var(--vt-gray-100)",
            background:  filterKol === "all" ? "rgba(44,90,160,0.07)" : "white",
            color:       filterKol === "all" ? "var(--vt-blue)" : "var(--vt-gray-500)",
          }}>
          Tất cả
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: filterKol === "all" ? "var(--vt-blue)" : "var(--vt-bg)", color: filterKol === "all" ? "white" : "var(--vt-gray-500)" }}>
            {posts.length}
          </span>
        </button>
        {PROFILES.map((p) => {
          const count  = posts.filter((x) => x.profileId === p.id).length;
          const active = filterKol === p.id;
          return (
            <button key={p.id} onClick={() => setFilterKol(active ? "all" : p.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all"
              style={{
                borderColor: active ? p.avatarColor : "var(--vt-gray-100)",
                background:  active ? `${p.avatarColor}12` : "white",
              }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: p.avatarColor }}>{p.initials}</div>
              <span className="text-[12px] font-semibold"
                style={{ color: active ? p.avatarColor : "var(--vt-gray-900)" }}>{p.name}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--vt-bg)", color: "var(--vt-gray-500)" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter + search bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--vt-gray-400)" }} />
          <input className="vt-input pl-8 text-[12.5px]" placeholder="Tìm tiêu đề bài..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="vt-input text-[12.5px] py-1.5 w-auto"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="posted">Đã đăng</option>
          <option value="scheduled">Đã lên lịch</option>
          <option value="reminded">Đã nhắc</option>
          <option value="draft">Nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>Từ</span>
          <input type="date" className="vt-input text-[12px] py-1.5 w-auto"
            value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <span className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>đến</span>
          <input type="date" className="vt-input text-[12px] py-1.5 w-auto"
            value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className="vt-btn-ghost text-[12px]" onClick={() => setSortDir((d) => d === "desc" ? "asc" : "desc")}>
          <ArrowUpDown size={13} /> {sortDir === "desc" ? "Mới nhất" : "Cũ nhất"}
        </button>
        <button className="vt-btn-secondary text-[12px]" onClick={exportCSV}>
          <Download size={13} /> Xuất báo cáo ({filtered.length} bài)
        </button>
      </div>

      {/* Table */}
      <div className="vt-card overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}>
          <span className="text-[12px] font-semibold" style={{ color: "var(--vt-gray-500)" }}>
            {filtered.length} bài
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <History size={28} className="mx-auto mb-2 opacity-20" />
            <p className="text-[13px]" style={{ color: "var(--vt-gray-400)" }}>
              Không tìm thấy bài nào
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--vt-gray-100)" }}>
            {filtered.map((post) => {
              const meta     = POST_STATUS_META[post.status];
              const profile  = PROFILES.find((p) => p.id === post.profileId);
              const FmtIcon  = FORMAT_ICON[post.format];
              const dateStr  = new Date(post.scheduledAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
              const timeStr  = new Date(post.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={post.id}
                  className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  {/* KOL avatar */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: profile?.avatarColor ?? "#6B7280" }}>
                    {profile?.initials ?? "?"}
                  </div>

                  {/* Format icon */}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "var(--vt-bg)" }}>
                    <FmtIcon size={13} style={{ color: "var(--vt-gray-400)" }} />
                  </div>

                  {/* Title + KOL name */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{ color: "var(--vt-navy)" }}>
                      {post.title}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>
                      {profile?.name} · {post.charCount} ký tự
                    </div>
                  </div>

                  {/* Date/time */}
                  <div className="text-right shrink-0">
                    <div className="text-[12.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>{timeStr}</div>
                    <div className="text-[11px]" style={{ color: "var(--vt-gray-400)" }}>{dateStr}</div>
                  </div>

                  {/* Status */}
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: meta.bg, color: meta.color }}>
                    {meta.label}
                  </span>
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
  const [activeTab, setActiveTab]           = useState<Tab>("schedule");
  const [posts, setPosts]                   = useState(POSTS);
  const [autoConfigs, setAutoConfigs]       = useState<AutoPostConfig[]>(AUTO_POST_CONFIGS);
  const [templateConfigs, setTemplateConfigs] = useState<TemplateProfileConfig[]>(TEMPLATE_PROFILE_CONFIGS);
  const [approvalSettings, setApprovalSettings] = useState<ApprovalSettings>(APPROVAL_SETTINGS);

  const pendingCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="max-w-[1200px] mx-auto">
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

      {activeTab === "create"   && <CreateTab />}
      {activeTab === "schedule" && <CalendarTab posts={posts} setPosts={setPosts} />}
      {activeTab === "approval" && <ApprovalTab settings={approvalSettings} setSettings={setApprovalSettings} posts={posts} />}
      {activeTab === "auto"     && <AutomationTab configs={autoConfigs} setConfigs={setAutoConfigs} />}
      {activeTab === "template" && <TemplateTab configs={templateConfigs} setConfigs={setTemplateConfigs} />}
      {activeTab === "history"  && <HistoryTab posts={posts} />}
    </div>
  );
}
