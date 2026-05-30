"use client";

import { useState } from "react";
import {
  Heart, MessageSquare, Share2, ToggleLeft, ToggleRight,
  Clock, Plus, X, Users, UserCheck, Zap, AlertCircle,
  Smile, Activity,
} from "lucide-react";
import {
  PROFILES, INTERACTION_CONFIGS,
  type InteractionConfig, type InteractionChannelConfig, type InteractionTarget,
} from "@/lib/mock-data";

type ChannelTab = "group" | "friend";

const EMOTION_META: Record<string, { label: string; emoji: string; color: string }> = {
  like:  { label: "Thích",    emoji: "👍", color: "#2C5AA0" },
  love:  { label: "Yêu thích",emoji: "❤️", color: "#E63946" },
  haha:  { label: "Haha",     emoji: "😂", color: "#F5A623" },
  wow:   { label: "Wow",      emoji: "😮", color: "#8B5CF6" },
  sad:   { label: "Buồn",     emoji: "😢", color: "#6B7280" },
  angry: { label: "Phẫn nộ", emoji: "😡", color: "#dc2626" },
};

const ALL_EMOTIONS = Object.keys(EMOTION_META);

export default function InteractionsPage() {
  const [channel, setChannel] = useState<ChannelTab>("group");
  const [configs, setConfigs] = useState<InteractionConfig[]>(INTERACTION_CONFIGS);

  const updateChannel = (
    profileId: string,
    ch: ChannelTab,
    patch: Partial<InteractionChannelConfig>,
  ) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.profileId === profileId ? { ...c, [ch]: { ...c[ch], ...patch } } : c,
      ),
    );
  };

  const totalActive = configs.filter((c) => c[channel].enabled).length;
  const totalActions = configs.reduce((sum, c) => {
    const ch = c[channel];
    if (!ch.enabled) return sum;
    return sum +
      (ch.react.enabled   ? ch.react.dailyLimit   : 0) +
      (ch.comment.enabled ? ch.comment.dailyLimit  : 0) +
      (ch.share.enabled   ? ch.share.dailyLimit    : 0);
  }, 0);

  return (
    <div className="max-w-[1100px] mx-auto space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ background: "rgba(44,90,160,0.05)", borderColor: "rgba(44,90,160,0.15)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--vt-blue)", color: "white" }}>
          <Activity size={15} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold mb-0.5" style={{ color: "var(--vt-navy)" }}>
            Tương tác tự động — nhắc qua Telegram
          </div>
          <div className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
            Hệ thống sẽ nhắc bạn thực hiện thủ công từng hành động để tránh checkpoint.
            Jitter ngẫu nhiên được thêm vào mỗi lần để Meta không phát hiện pattern.
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="text-[20px] font-bold" style={{ color: "var(--vt-blue)" }}>{totalActive}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>KOL bật</div>
          </div>
          <div className="text-center">
            <div className="text-[20px] font-bold" style={{ color: "#16a34a" }}>{totalActions}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>action/ngày</div>
          </div>
        </div>
      </div>

      {/* Channel tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl vt-card w-fit">
        {([
          { v: "group",  label: "Tương tác nhóm",   icon: Users     },
          { v: "friend", label: "Tương tác bạn bè",  icon: UserCheck },
        ] as const).map(({ v, label, icon: Icon }) => {
          const active = channel === v;
          return (
            <button key={v} onClick={() => setChannel(v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
              style={active ? { background: "var(--vt-navy)", color: "white" } : { color: "var(--vt-gray-500)" }}>
              <Icon size={14} /> {label}
            </button>
          );
        })}
      </div>

      {/* Per-KOL cards */}
      {PROFILES.map((profile) => {
        const cfg = configs.find((c) => c.profileId === profile.id);
        if (!cfg) return null;
        const ch = cfg[channel];

        return (
          <KOLInteractionCard
            key={profile.id}
            profile={profile}
            channel={channel}
            config={ch}
            onChange={(patch) => updateChannel(profile.id, channel, patch)}
          />
        );
      })}
    </div>
  );
}

// ─── KOL card ────────────────────────────────────────────────────────────────

function KOLInteractionCard({
  profile, channel, config, onChange,
}: {
  profile: typeof PROFILES[0];
  channel: ChannelTab;
  config: InteractionChannelConfig;
  onChange: (patch: Partial<InteractionChannelConfig>) => void;
}) {
  const [newTemplate, setNewTemplate] = useState("");
  const [newTarget, setNewTarget]     = useState("");

  const patchReact   = (p: Partial<typeof config.react>)   => onChange({ react:   { ...config.react,   ...p } });
  const patchComment = (p: Partial<typeof config.comment>) => onChange({ comment: { ...config.comment, ...p } });
  const patchShare   = (p: Partial<typeof config.share>)   => onChange({ share:   { ...config.share,   ...p } });

  const toggleEmotion = (e: string) => {
    const next = config.react.emotions.includes(e)
      ? config.react.emotions.filter((x) => x !== e)
      : [...config.react.emotions, e];
    patchReact({ emotions: next });
  };

  const addTemplate = () => {
    if (!newTemplate.trim()) return;
    patchComment({ templates: [...config.comment.templates, newTemplate.trim()] });
    setNewTemplate("");
  };

  const removeTemplate = (i: number) =>
    patchComment({ templates: config.comment.templates.filter((_, idx) => idx !== i) });

  const toggleTarget = (id: string) =>
    onChange({
      targets: config.targets.map((t) => t.id === id ? { ...t, active: !t.active } : t),
    });

  const addTarget = () => {
    if (!newTarget.trim()) return;
    const t: InteractionTarget = {
      id:          `t-${Date.now()}`,
      name:        newTarget.trim(),
      memberCount: 0,
      active:      true,
    };
    onChange({ targets: [...config.targets, t] });
    setNewTarget("");
  };

  const removeTarget = (id: string) =>
    onChange({ targets: config.targets.filter((t) => t.id !== id) });

  return (
    <div className="vt-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--vt-gray-100)" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
          style={{ background: profile.avatarColor }}>
          {profile.initials}
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-bold" style={{ color: "var(--vt-navy)" }}>{profile.name}</div>
          <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
            {profile.nicheLabel} · {profile.followers}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px]" style={{ color: config.enabled ? "#16a34a" : "var(--vt-gray-500)" }}>
            {config.enabled ? "Đang bật" : "Đang tắt"}
          </span>
          <button onClick={() => onChange({ enabled: !config.enabled })}>
            {config.enabled
              ? <ToggleRight size={26} style={{ color: "#16a34a" }} />
              : <ToggleLeft  size={26} style={{ color: "var(--vt-gray-400)" }} />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={`px-5 py-5 space-y-5 transition-opacity ${config.enabled ? "" : "opacity-40 pointer-events-none"}`}>

        {/* Action toggles */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-3"
            style={{ color: "var(--vt-gray-500)" }}>Hành động tương tác</div>
          <div className="grid grid-cols-3 gap-3">
            {/* React */}
            <ActionToggle
              icon={<Heart size={15} />}
              label="Thả cảm xúc"
              color="#E63946"
              enabled={config.react.enabled}
              onToggle={() => patchReact({ enabled: !config.react.enabled })}
              dailyLimit={config.react.dailyLimit}
              onLimitChange={(v) => patchReact({ dailyLimit: v })}
            />
            {/* Comment */}
            <ActionToggle
              icon={<MessageSquare size={15} />}
              label="Bình luận"
              color="var(--vt-blue)"
              enabled={config.comment.enabled}
              onToggle={() => patchComment({ enabled: !config.comment.enabled })}
              dailyLimit={config.comment.dailyLimit}
              onLimitChange={(v) => patchComment({ dailyLimit: v })}
            />
            {/* Share */}
            <ActionToggle
              icon={<Share2 size={15} />}
              label="Chia sẻ"
              color="#8B5CF6"
              enabled={config.share.enabled}
              onToggle={() => patchShare({ enabled: !config.share.enabled })}
              dailyLimit={config.share.dailyLimit}
              onLimitChange={(v) => patchShare({ dailyLimit: v })}
            />
          </div>
        </div>

        {/* Emotion picker */}
        {config.react.enabled && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-2"
              style={{ color: "var(--vt-gray-500)" }}>
              <Smile size={11} className="inline mr-1" />Loại cảm xúc
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_EMOTIONS.map((e) => {
                const meta    = EMOTION_META[e];
                const checked = config.react.emotions.includes(e);
                return (
                  <button key={e}
                    onClick={() => toggleEmotion(e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[12.5px] font-semibold transition-all"
                    style={{
                      borderColor: checked ? meta.color : "var(--vt-gray-100)",
                      background:  checked ? `${meta.color}12` : "white",
                      color:       checked ? meta.color : "var(--vt-gray-500)",
                    }}>
                    <span>{meta.emoji}</span> {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Comment templates */}
        {config.comment.enabled && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-2"
              style={{ color: "var(--vt-gray-500)" }}>
              <MessageSquare size={11} className="inline mr-1" />Template bình luận
            </div>
            <div className="space-y-1.5 mb-2">
              {config.comment.templates.map((t, i) => (
                <div key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border text-[12.5px]"
                  style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}>
                  <span className="flex-1" style={{ color: "var(--vt-gray-900)" }}>{t}</span>
                  <button onClick={() => removeTemplate(i)} style={{ color: "var(--vt-gray-400)" }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              {config.comment.templates.length === 0 && (
                <div className="text-[12px] px-3 py-2 rounded-lg border border-dashed text-center"
                  style={{ borderColor: "var(--vt-gray-200)", color: "var(--vt-gray-400)" }}>
                  Chưa có template nào — thêm bên dưới
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input className="vt-input text-[12.5px] flex-1" placeholder="Thêm template bình luận..."
                value={newTemplate} onChange={(e) => setNewTemplate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTemplate()} />
              <button className="vt-btn-secondary px-3" onClick={addTemplate}>
                <Plus size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Time range + jitter */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1"
              style={{ color: "var(--vt-gray-500)" }}>
              <Clock size={11} /> Giờ bắt đầu
            </div>
            <input type="time" className="vt-input text-[13px]"
              value={config.timeStart}
              onChange={(e) => onChange({ timeStart: e.target.value })} />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1"
              style={{ color: "var(--vt-gray-500)" }}>
              <Clock size={11} /> Giờ kết thúc
            </div>
            <input type="time" className="vt-input text-[13px]"
              value={config.timeEnd}
              onChange={(e) => onChange({ timeEnd: e.target.value })} />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1"
              style={{ color: "var(--vt-gray-500)" }}>
              <AlertCircle size={11} /> Jitter ngẫu nhiên
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-9 rounded-lg border flex items-center justify-center text-base font-bold hover:bg-gray-50"
                style={{ borderColor: "var(--vt-gray-100)" }}
                onClick={() => onChange({ jitterMinutes: Math.max(0, config.jitterMinutes - 5) })}>−</button>
              <span className="flex-1 text-center text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>
                ±{config.jitterMinutes}p
              </span>
              <button className="w-8 h-9 rounded-lg border flex items-center justify-center text-base font-bold hover:bg-gray-50"
                style={{ borderColor: "var(--vt-gray-100)" }}
                onClick={() => onChange({ jitterMinutes: Math.min(60, config.jitterMinutes + 5) })}>+</button>
            </div>
          </div>
        </div>

        {/* Mode selector + targets */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-2"
            style={{ color: "var(--vt-gray-500)" }}>
            {channel === "group"
              ? <><Users size={11} className="inline mr-1" />Chế độ tương tác nhóm</>
              : <><UserCheck size={11} className="inline mr-1" />Chế độ tương tác bạn bè</>}
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-2 mb-4">
            {(["random", "targeted"] as const).map((m) => {
              const active = config.mode === m;
              return (
                <button key={m}
                  onClick={() => onChange({ mode: m })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 flex-1 transition-all"
                  style={{
                    borderColor: active ? profile.avatarColor : "var(--vt-gray-100)",
                    background:  active ? `${profile.avatarColor}10` : "white",
                  }}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{
                      borderColor: active ? profile.avatarColor : "var(--vt-gray-200)",
                      background:  active ? profile.avatarColor : "white",
                    }}>
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div className="text-left">
                    <div className="text-[12.5px] font-bold"
                      style={{ color: active ? profile.avatarColor : "var(--vt-gray-700)" }}>
                      {m === "random" ? "Ngẫu nhiên" : "Chỉ định"}
                    </div>
                    <div className="text-[10.5px]" style={{ color: "var(--vt-gray-400)" }}>
                      {m === "random"
                        ? (channel === "group" ? "Tương tác bài ngẫu nhiên trong nhóm đã tham gia" : "Tương tác bài ngẫu nhiên của bạn bè")
                        : (channel === "group" ? "Chỉ tương tác trong các nhóm chỉ định" : "Chỉ tương tác với danh sách bạn bè chọn")}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Random mode — total count */}
          {config.mode === "random" && (
            <div className="flex items-center gap-4 p-4 rounded-xl border"
              style={{ background: "var(--vt-bg)", borderColor: "var(--vt-gray-100)" }}>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-navy)" }}>
                  Số lượng tương tác mỗi ngày
                </div>
                <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
                  Hệ thống chọn ngẫu nhiên bài viết trong khung giờ đã cài
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="w-8 h-8 rounded-lg border flex items-center justify-center text-base font-bold hover:bg-white"
                  style={{ borderColor: "var(--vt-gray-100)" }}
                  onClick={() => onChange({ randomCount: Math.max(1, config.randomCount - 5) })}>−</button>
                <span className="w-12 text-center text-[18px] font-bold" style={{ color: "var(--vt-navy)" }}>
                  {config.randomCount}
                </span>
                <button className="w-8 h-8 rounded-lg border flex items-center justify-center text-base font-bold hover:bg-white"
                  style={{ borderColor: "var(--vt-gray-100)" }}
                  onClick={() => onChange({ randomCount: Math.min(200, config.randomCount + 5) })}>+</button>
              </div>
            </div>
          )}

          {/* Targeted mode — target list */}
          {config.mode === "targeted" && (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {config.targets.map((t) => (
                  <div key={t.id}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border-2 transition-all"
                    style={{
                      borderColor: t.active ? profile.avatarColor : "var(--vt-gray-100)",
                      background:  t.active ? `${profile.avatarColor}10` : "white",
                    }}>
                    <button
                      className="flex items-center gap-1.5 text-[12.5px] font-semibold"
                      style={{ color: t.active ? profile.avatarColor : "var(--vt-gray-400)" }}
                      onClick={() => toggleTarget(t.id)}>
                      {t.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {t.name}
                      {t.memberCount > 0 && (
                        <span className="text-[10px] font-normal" style={{ color: "var(--vt-gray-400)" }}>
                          ({(t.memberCount / 1000).toFixed(0)}K)
                        </span>
                      )}
                    </button>
                    <button onClick={() => removeTarget(t.id)} style={{ color: "var(--vt-gray-300)" }}>
                      <X size={11} />
                    </button>
                  </div>
                ))}
                {config.targets.length === 0 && (
                  <div className="text-[12px] px-3 py-2 rounded-lg border border-dashed w-full text-center"
                    style={{ borderColor: "var(--vt-gray-200)", color: "var(--vt-gray-400)" }}>
                    Chưa có mục tiêu — thêm bên dưới
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input className="vt-input text-[12.5px] flex-1"
                  placeholder={channel === "group" ? "Tên nhóm Facebook..." : "Tên danh sách bạn bè..."}
                  value={newTarget} onChange={(e) => setNewTarget(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTarget()} />
                <button className="vt-btn-secondary px-3" onClick={addTarget}>
                  <Plus size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Action toggle card ───────────────────────────────────────────────────────

function ActionToggle({
  icon, label, color, enabled, onToggle, dailyLimit, onLimitChange,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  enabled: boolean;
  onToggle: () => void;
  dailyLimit: number;
  onLimitChange: (v: number) => void;
}) {
  return (
    <div className="p-3 rounded-xl border-2 transition-all"
      style={{
        borderColor: enabled ? color : "var(--vt-gray-100)",
        background:  enabled ? `${color}08` : "white",
      }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span style={{ color: enabled ? color : "var(--vt-gray-400)" }}>{icon}</span>
          <span className="text-[12.5px] font-semibold"
            style={{ color: enabled ? color : "var(--vt-gray-500)" }}>{label}</span>
        </div>
        <button onClick={onToggle}>
          {enabled
            ? <ToggleRight size={22} style={{ color }} />
            : <ToggleLeft  size={22} style={{ color: "var(--vt-gray-300)" }} />}
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          className="w-6 h-6 rounded border flex items-center justify-center text-sm font-bold hover:bg-gray-50 disabled:opacity-30"
          style={{ borderColor: "var(--vt-gray-100)" }}
          disabled={!enabled}
          onClick={() => onLimitChange(Math.max(1, dailyLimit - 1))}>−</button>
        <span className="flex-1 text-center text-[14px] font-bold"
          style={{ color: enabled ? "var(--vt-navy)" : "var(--vt-gray-300)" }}>
          {dailyLimit}
        </span>
        <button
          className="w-6 h-6 rounded border flex items-center justify-center text-sm font-bold hover:bg-gray-50 disabled:opacity-30"
          style={{ borderColor: "var(--vt-gray-100)" }}
          disabled={!enabled}
          onClick={() => onLimitChange(Math.min(100, dailyLimit + 1))}>+</button>
        <span className="text-[10px]" style={{ color: "var(--vt-gray-400)" }}>/ngày</span>
      </div>
    </div>
  );
}
