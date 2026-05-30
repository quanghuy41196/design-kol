"use client";

import { useState, useCallback } from "react";
import {
  Edit3, Clock, Hash, Palette, Target, Mic2, BookOpen,
  Plus, Check, ChevronRight, Zap, User, X, Save, Link,
  Globe, Users, UserCircle, Trash2, ToggleLeft, ToggleRight,
  ExternalLink, Camera, Search, Heart, Sparkles, Monitor,
  Briefcase, Coffee, ShoppingBag, TrendingUp, GraduationCap, Gamepad2, PawPrint,
} from "lucide-react";
import {
  PROFILES, KOL_BRANDS, SOCIAL_ACCOUNTS, ACCOUNT_STATUS_META,
  type KOLBrand, type KOLProfile, type SourceLink, type SourceLinkType,
} from "@/lib/mock-data";

// ─── constants ────────────────────────────────────────────────────────────────

const EMOJI_OPTIONS: { v: KOLBrand["emojiUsage"]; l: string }[] = [
  { v: "none",     l: "Không dùng"     },
  { v: "minimal",  l: "Ít (1–2/bài)"  },
  { v: "moderate", l: "Vừa phải (3–5)" },
  { v: "heavy",    l: "Nhiều (5+)"     },
];

const TONE_OPTIONS = [
  "Thân thiện","Gần gũi","Chân thật","Vui tươi","Chuyên nghiệp",
  "Hài hước","Truyền cảm hứng","Khách quan","Ấm áp","Trực tiếp","Đồng cảm",
];

const SOURCE_TYPE_META: Record<SourceLinkType, { label: string; icon: typeof Globe; color: string; bg: string }> = {
  website:          { label: "Website",         icon: Globe,       color: "#7c3aed", bg: "rgba(124,58,237,0.09)" },
  facebook_profile: { label: "Profile Facebook",icon: UserCircle,  color: "#1877F2", bg: "rgba(24,119,242,0.09)" },
  facebook_page:    { label: "Facebook Page",   icon: Users,       color: "#1877F2", bg: "rgba(24,119,242,0.09)" },
  facebook_group:   { label: "Facebook Group",  icon: Users,       color: "#1877F2", bg: "rgba(24,119,242,0.09)" },
};

const TAB_ITEMS = [
  { id: "persona", label: "Phong cách KOL", icon: UserCircle },
  { id: "fans",    label: "Mục tiêu fans",  icon: Users },
  { id: "refs",    label: "KOL tham khảo",  icon: ExternalLink },
] as const;
type Tab = typeof TAB_ITEMS[number]["id"];

const AVATAR_COLORS = [
  "#F5A623", "#2C5AA0", "#3FB1B5", "#8B5CF6",
  "#EF4444", "#10B981", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6",
];

const BRAND_COLOR_PRESETS = [
  "#F5A623", "#EC4899", "#EF4444", "#F97316",
  "#10B981", "#2C5AA0", "#8B5CF6", "#0891B2",
  "#FBBF24", "#6366F1", "#14B8A6", "#1a1a1a",
];

const NICHE_QUICK: { v: string; l: string; icon: typeof Heart }[] = [
  { v: "mom",       l: "Mẹ & Con",    icon: Heart        },
  { v: "beauty",    l: "Làm đẹp",     icon: Sparkles     },
  { v: "fitness",   l: "Sức khoẻ",    icon: Zap          },
  { v: "food",      l: "Ẩm thực",     icon: Coffee       },
  { v: "fashion",   l: "Thời trang",  icon: ShoppingBag  },
  { v: "travel",    l: "Du lịch",     icon: Globe        },
  { v: "tech",      l: "Tech",        icon: Monitor      },
  { v: "business",  l: "Kinh doanh",  icon: Briefcase    },
  { v: "finance",   l: "Tài chính",   icon: TrendingUp   },
  { v: "education", l: "Giáo dục",    icon: GraduationCap},
  { v: "gaming",    l: "Gaming",      icon: Gamepad2     },
  { v: "pets",      l: "Thú cưng",    icon: PawPrint     },
  { v: "lifestyle", l: "Lifestyle",   icon: Heart        },
  { v: "other",     l: "Khác",        icon: BookOpen     },
];

const AGE_GROUPS = [
  { v: "13-17", l: "13–17 (teen)"        },
  { v: "18-24", l: "18–24 (Gen Z)"       },
  { v: "25-34", l: "25–34 (Millennials)" },
  { v: "35-44", l: "35–44"               },
  { v: "45+",   l: "45+"                 },
];

const SPENDING_OPTIONS = [
  "Tiết kiệm (<200k)",
  "Tầm trung (200k–1tr)",
  "Khá giả (1tr–5tr)",
  "Cao cấp (>5tr)",
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function Pill({ text, color, bg, onRemove }: { text: string; color?: string; bg?: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium"
      style={{ background: bg ?? "var(--vt-bg)", color: color ?? "var(--vt-navy)" }}>
      {text}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 ml-0.5">
          <X size={10} />
        </button>
      )}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide mb-2"
        style={{ color: "var(--vt-gray-500)" }}>{label}</div>
      {children}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Edit3; children: React.ReactNode }) {
  return (
    <div className="vt-card p-5 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
          <Icon size={14} />
        </div>
        <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Chip input (add chips from text) ─────────────────────────────────────────

function ChipInput({ value, onChange, placeholder, color, bg }: {
  value: string[]; onChange: (v: string[]) => void;
  placeholder?: string; color?: string; bg?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((v) => (
          <Pill key={v} text={v} color={color} bg={bg}
            onRemove={() => onChange(value.filter((x) => x !== v))} />
        ))}
      </div>
      <div className="flex gap-2">
        <input className="vt-input text-[12.5px] flex-1" placeholder={placeholder ?? "Nhập rồi Enter"}
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <button className="vt-btn-secondary px-3" onClick={add}><Plus size={13} /></button>
      </div>
    </div>
  );
}

// ─── PersonaTab ───────────────────────────────────────────────────────────────

function PersonaTab({
  profile, brand, editing, onProfileChange, onBrandChange,
}: {
  profile: KOLProfile;
  brand: KOLBrand;
  editing: boolean;
  onProfileChange?: (p: KOLProfile) => void;
  onBrandChange?: (b: KOLBrand) => void;
}) {
  const personalityChips = (brand.brandPersonality ?? []);
  const contentTopics    = (brand.defaultHashtags ?? []);
  const faceCount        = profile.faceCount ?? 0;
  const niche            = profile.niche;

  const nichePersonalitySuggestions = PERSONALITY_SUGGESTIONS[niche] ?? PERSONALITY_SUGGESTIONS.other;
  const nicheTopicSuggestions       = TOPIC_SUGGESTIONS[niche]       ?? TOPIC_SUGGESTIONS.other;

  const togglePersonality = (t: string) => {
    if (!onBrandChange) return;
    const next = personalityChips.includes(t)
      ? personalityChips.filter((x) => x !== t)
      : personalityChips.length < 5 ? [...personalityChips, t] : personalityChips;
    onBrandChange({ ...brand, brandPersonality: next });
  };

  return (
    <div className="grid grid-cols-5 gap-5">
      {/* Left col: niche + face photos */}
      <div className="col-span-2 space-y-4">
        {/* Niche grid */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--vt-gray-500)" }}>
            Niche / template nhanh
          </p>
          <p className="text-[10.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
            Chọn niche để AI gợi ý sẵn tính cách, chủ đề và pain points phù hợp.
          </p>
          {editing ? (
            <div className="grid grid-cols-4 gap-1.5">
              {NICHE_QUICK.map(({ v, l, icon: Icon }) => {
                const active = niche === v;
                return (
                  <button key={v}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-[10.5px] font-medium transition-colors"
                    style={{
                      borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                      background:  active ? "rgba(44,90,160,0.06)" : "white",
                      color:       active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                    }}
                    onClick={() => onProfileChange?.({ ...profile, niche: v as KOLProfile["niche"], nicheLabel: l })}>
                    <Icon size={18} />{l}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {NICHE_QUICK.map(({ v, l, icon: Icon }) => {
                const active = niche === v;
                return active ? (
                  <div key={v} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-[12px] font-semibold"
                    style={{ borderColor: "var(--vt-blue)", background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>
                    <Icon size={14} />{l}
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Face photos */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>
              Bộ ảnh khuôn mặt KOL
            </p>
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: faceCount >= 5 ? "rgba(22,163,74,0.1)" : faceCount >= 3 ? "rgba(217,119,6,0.1)" : "rgba(156,163,175,0.15)",
                color: faceCount >= 5 ? "#16a34a" : faceCount >= 3 ? "#d97706" : "var(--vt-gray-500)",
              }}>
              {faceCount >= 10 ? "Đầy đủ ✓" : faceCount >= 5 ? "Tốt ✓" : faceCount >= 3 ? "Tạm ổn" : "Chưa đủ"}
            </span>
          </div>
          <p className="text-[10.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
            Upload ảnh chân dung KOL ảo — AI học mặt để ghép vào ảnh bài đăng mới. Tối thiểu 3 ảnh.
          </p>

          {editing ? (
            <div className="rounded-xl border-2 border-dashed p-3 mb-2 transition-colors"
              style={{
                borderColor: faceCount > 0 ? "var(--vt-blue)" : "var(--vt-gray-100)",
                background:  faceCount > 0 ? "rgba(44,90,160,0.03)" : "var(--vt-bg)",
              }}>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <button key={i}
                    className="aspect-square rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-105"
                    style={{
                      borderColor: i < faceCount ? "var(--vt-blue)" : "var(--vt-gray-100)",
                      background:  i < faceCount ? "rgba(44,90,160,0.08)" : "white",
                      borderStyle: i < faceCount ? "solid" : "dashed",
                    }}
                    onClick={() => onProfileChange?.({ ...profile, faceCount: i < faceCount ? i : Math.min(10, i + 1) })}>
                    {i < faceCount
                      ? <><User size={14} style={{ color: "var(--vt-blue)" }} />
                        <span className="text-[8px] mt-0.5 font-semibold" style={{ color: "var(--vt-blue)" }}>#{i + 1}</span></>
                      : <><Camera size={10} style={{ color: "var(--vt-gray-400)" }} />
                        <span className="text-[8px] mt-0.5" style={{ color: "var(--vt-gray-400)" }}>#{i + 1}</span></>
                    }
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>Nhấn ô để thêm · Nhấn lại để xoá</p>
                <button className="text-[10px] font-semibold px-2 py-1 rounded-md"
                  style={{ color: "var(--vt-blue)", background: "rgba(44,90,160,0.08)" }}
                  onClick={() => onProfileChange?.({ ...profile, faceCount: 10 })}>
                  + Tải hàng loạt
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(faceCount, 5) }, (_, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(44,90,160,0.08)", border: "1px solid var(--vt-blue)" }}>
                    <User size={12} style={{ color: "var(--vt-blue)" }} />
                  </div>
                ))}
                {faceCount > 5 && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>
                    +{faceCount - 5}
                  </div>
                )}
                {faceCount === 0 && (
                  <span className="text-[12px] italic" style={{ color: "var(--vt-gray-400)" }}>Chưa upload</span>
                )}
              </div>
            </div>
          )}

          <div className="rounded-lg p-2.5" style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>Chất lượng nhận diện AI</span>
              <span className="text-[10px] font-semibold"
                style={{ color: faceCount >= 5 ? "#16a34a" : faceCount >= 3 ? "#d97706" : "var(--vt-gray-400)" }}>
                {faceCount === 0 ? "—" : faceCount >= 8 ? "≥99.5%" : faceCount >= 5 ? "≥99%" : faceCount >= 3 ? "≥95%" : "~80%"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, faceCount * 10)}%`,
                  background: faceCount >= 5 ? "var(--vt-gradient-sun)" : faceCount >= 3 ? "#d97706" : "var(--vt-gray-300)",
                }} />
            </div>
            <p className="text-[9.5px] mt-1.5 leading-snug" style={{ color: "var(--vt-gray-500)" }}>
              {faceCount === 0 ? "Upload ảnh chân dung KOL ảo. AI học mặt từ đây."
                : faceCount < 3 ? `${faceCount}/10 · Cần tối thiểu 3 ảnh để AI nhận diện.`
                : faceCount < 5 ? `${faceCount}/10 · Thêm ${5 - faceCount} nữa để đạt ≥99%.`
                : `${faceCount}/10 · ${faceCount < 10 ? `Thêm ${10 - faceCount} nữa để tối ưu.` : "AI đã học đủ mặt ✓"}`}
            </p>
          </div>
        </div>

        {/* Brand colors */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>
              Màu nhận diện thương hiệu
            </p>
            <span className="text-[10px]" style={{ color: "var(--vt-gray-400)" }}>
              {(brand.brandColors ?? []).length}/6
            </span>
          </div>
          <p className="text-[10.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
            AI dùng màu này tạo ảnh &amp; banner nhất quán theo thương hiệu.
          </p>
          {editing ? (
            <>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {BRAND_COLOR_PRESETS.map((c) => {
                  const active = (brand.brandColors ?? []).includes(c);
                  return (
                    <button key={c}
                      className="w-7 h-7 rounded-full transition-all hover:scale-110"
                      style={{
                        background: c,
                        outline: active ? `3px solid ${c}` : "none",
                        outlineOffset: "2px",
                        border: "2px solid white",
                        boxShadow: active ? "0 0 0 1px var(--vt-navy)" : "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                      onClick={() => {
                        if (!onBrandChange) return;
                        const colors = brand.brandColors ?? [];
                        const next = active ? colors.filter((x) => x !== c) : colors.length < 6 ? [...colors, c] : colors;
                        onBrandChange({ ...brand, brandColors: next });
                      }}
                      title={c}
                    />
                  );
                })}
                <label className="w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                  style={{ borderColor: "var(--vt-gray-300)", background: "white" }}
                  title="Màu tuỳ chỉnh">
                  <input type="color" className="sr-only"
                    onChange={(e) => {
                      if (!onBrandChange) return;
                      const c = e.target.value;
                      const colors = brand.brandColors ?? [];
                      if (!colors.includes(c) && colors.length < 6) onBrandChange({ ...brand, brandColors: [...colors, c] });
                    }} />
                  <Plus size={10} style={{ color: "var(--vt-gray-400)" }} />
                </label>
              </div>
              {(brand.brandColors ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(brand.brandColors ?? []).map((c) => (
                    <div key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
                      style={{ background: c + "22", border: `1.5px solid ${c}` }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      {c}
                      <button onClick={() => onBrandChange?.({ ...brand, brandColors: (brand.brandColors ?? []).filter((x) => x !== c) })}
                        className="ml-0.5 opacity-50 hover:opacity-100">
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(brand.brandColors ?? []).length === 0
                ? <span className="text-[12px] italic" style={{ color: "var(--vt-gray-400)" }}>Chưa thiết lập màu</span>
                : (brand.brandColors ?? []).map((c) => (
                  <div key={c} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-mono"
                    style={{ background: c + "18", border: `1.5px solid ${c}88` }}>
                    <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: c }} />
                    {c}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Right col: form fields */}
      <div className="col-span-3 space-y-3">
        {/* Badge legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10.5px] p-3 rounded-xl"
          style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
          <span className="col-span-2 font-semibold mb-0.5" style={{ color: "var(--vt-gray-600)" }}>Ý nghĩa badge:</span>
          <span className="flex items-center gap-1.5">
            <FieldBadge label="🔒 KHOÁ TỪ NICK" color="#d97706" bg="rgba(217,119,6,0.1)" />
            <span style={{ color: "var(--vt-gray-500)" }}>Lấy từ nick, không sửa được</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
            <span style={{ color: "var(--vt-gray-500)" }}>Không hiện FB, chỉ AI biết</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FieldBadge label="AI TRAINING" color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
            <span style={{ color: "var(--vt-gray-500)" }}>AI học từ đây để tạo nội dung</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FieldBadge label="AI GUARDRAIL" color="#dc2626" bg="rgba(220,38,38,0.08)" />
            <span style={{ color: "var(--vt-gray-500)" }}>AI tuyệt đối không đề cập</span>
          </span>
        </div>

        {/* Name */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>TÊN KOL</span>
            {profile.linkedAccountId && <FieldBadge label="🔒 KHOÁ TỪ NICK" color="#d97706" bg="rgba(217,119,6,0.1)" />}
          </div>
          {editing ? (
            <input className="vt-input text-[13px]" value={profile.name}
              disabled={!!profile.linkedAccountId}
              style={profile.linkedAccountId ? { background: "rgba(245,166,35,0.04)" } : {}}
              onChange={(e) => onProfileChange?.({ ...profile, name: e.target.value })} />
          ) : (
            <p className="text-[14px] font-semibold" style={{ color: "var(--vt-navy)" }}>{profile.name}</p>
          )}
        </div>

        {/* Age + Gender + Occupation */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>TUỔI · GIỚI TÍNH</span>
              <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
            </div>
            {editing ? (
              <div className="flex gap-2">
                <input type="number" min={16} max={65} className="vt-input text-[13px] text-center w-16 shrink-0"
                  placeholder="26" value={profile.age ?? ""}
                  onChange={(e) => onProfileChange?.({ ...profile, age: e.target.value })} />
                <select className="vt-input text-[13px] flex-1" value={profile.gender ?? ""}
                  onChange={(e) => onProfileChange?.({ ...profile, gender: e.target.value })}>
                  <option value="">Giới tính</option>
                  <option value="female">Nữ</option>
                  <option value="male">Nam</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            ) : (
              <p className="text-[13px]" style={{ color: "var(--vt-gray-900)" }}>
                {[profile.age, profile.gender].filter(Boolean).join(" · ") || "—"}
              </p>
            )}
            <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>Tuổi & giới tính của nhân vật KOL ảo</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>NGHỀ NGHIỆP</span>
              <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
            </div>
            {editing ? (
              <input className="vt-input text-[13px]" placeholder="Beauty blogger · KOC mỹ phẩm"
                value={profile.occupation ?? ""}
                onChange={(e) => onProfileChange?.({ ...profile, occupation: e.target.value })} />
            ) : (
              <p className="text-[13px]" style={{ color: "var(--vt-gray-900)" }}>{profile.occupation || "—"}</p>
            )}
            <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>AI dùng để xây backstory nhân vật</p>
          </div>
        </div>

        {/* Personality chips */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>TÍNH CÁCH (CHỌN 3–5)</span>
            <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
            <FieldBadge label="AI TRAINING" color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
          </div>
          {editing ? (
            <>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {nichePersonalitySuggestions.map((t) => {
                  const active = personalityChips.includes(t);
                  return (
                    <button key={t}
                      className="px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-colors"
                      style={{
                        borderColor: active ? "#7c3aed" : "var(--vt-gray-100)",
                        background:  active ? "rgba(124,58,237,0.08)" : "white",
                        color:       active ? "#7c3aed" : "var(--vt-gray-500)",
                      }}
                      onClick={() => togglePersonality(t)}>
                      {active ? "✓ " : ""}{t}
                    </button>
                  );
                })}
              </div>
              <ChipInput value={personalityChips} color="#7c3aed" bg="rgba(124,58,237,0.08)"
                placeholder="Hoặc nhập tự do, cách nhau bằng dấu phẩy..."
                onChange={(v) => onBrandChange?.({ ...brand, brandPersonality: v })} />
              <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>
                AI dùng để chọn tone & cách diễn đạt · {personalityChips.length}/5 đã chọn
              </p>
            </>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {personalityChips.length > 0
                ? personalityChips.map((t) => <Pill key={t} text={t} color="#7c3aed" bg="rgba(124,58,237,0.08)" />)
                : <span className="text-[12px] italic" style={{ color: "var(--vt-gray-400)" }}>—</span>}
            </div>
          )}
        </div>

        {/* Content topics */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>CHỦ ĐỀ HAY VIẾT</span>
            <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
          </div>
          {editing ? (
            <>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {nicheTopicSuggestions.map((t) => {
                  const active = contentTopics.includes(t);
                  return (
                    <button key={t}
                      className="px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-colors"
                      style={{
                        borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                        background:  active ? "rgba(44,90,160,0.08)" : "white",
                        color:       active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                      }}
                      onClick={() => onBrandChange?.({ ...brand, defaultHashtags: active ? contentTopics.filter((x) => x !== t) : [...contentTopics, t] })}>
                      {active ? "✓ " : "#"}{t}
                    </button>
                  );
                })}
              </div>
              <ChipInput value={contentTopics} onChange={(v) => onBrandChange?.({ ...brand, defaultHashtags: v })}
                placeholder="Thêm chủ đề khác..." color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
              <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>
                AI xoay quanh các chủ đề này khi đề xuất ý tưởng bài đăng
              </p>
            </>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {contentTopics.length > 0
                ? contentTopics.map((t) => (
                    <span key={t} className="font-mono text-[12px] px-2 py-0.5 rounded-lg font-medium"
                      style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>{t}</span>
                  ))
                : <span className="text-[12px] italic" style={{ color: "var(--vt-gray-400)" }}>—</span>}
            </div>
          )}
        </div>

        {/* Sample writing */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>VĂN PHONG MẪU</span>
            <FieldBadge label="AI TRAINING" color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
          </div>
          {editing ? (
            <>
              <textarea className="vt-input vt-textarea text-[13px]" rows={3}
                placeholder={`Paste 1–3 đoạn hội thoại / caption đại diện giọng KOL.\nAI học cách dùng từ, độ dài câu, emoji, hook — càng nhiều mẫu → càng đúng chất.`}
                value={brand.writingStyle}
                onChange={(e) => onBrandChange?.({ ...brand, writingStyle: e.target.value })} />
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>Trường quan trọng nhất — AI học văn phong chủ yếu từ đây</p>
                <span className="text-[10px] font-semibold"
                  style={{ color: brand.writingStyle.length >= 200 ? "#16a34a" : brand.writingStyle.length >= 50 ? "#d97706" : "var(--vt-gray-400)" }}>
                  {brand.writingStyle.length} ký tự {brand.writingStyle.length >= 200 ? "✓ Tốt" : brand.writingStyle.length >= 50 ? "· Nên thêm" : "· Cần điền"}
                </span>
              </div>
            </>
          ) : (
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--vt-gray-900)" }}>
              {brand.writingStyle || <span className="italic" style={{ color: "var(--vt-gray-400)" }}>—</span>}
            </p>
          )}
        </div>

        {/* Forbidden topics */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>CHỦ ĐỀ CẤM</span>
            <FieldBadge label="AI GUARDRAIL" color="#dc2626" bg="rgba(220,38,38,0.08)" />
          </div>
          {editing ? (
            <>
              <input className="vt-input text-[13px]" placeholder="chính trị, rượu bia, y tế, đối thủ cạnh tranh..."
                value={brand.vocabularyAvoid.join(", ")}
                onChange={(e) => onBrandChange?.({ ...brand, vocabularyAvoid: e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean) })} />
              <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>
                AI sẽ không bao giờ đề cập dù được yêu cầu · Ngăn cách bằng dấu phẩy
              </p>
            </>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {brand.vocabularyAvoid.length > 0
                ? brand.vocabularyAvoid.map((w) => <Pill key={w} text={w} color="#dc2626" bg="rgba(220,38,38,0.08)" />)
                : <span className="text-[12px] italic" style={{ color: "var(--vt-gray-400)" }}>—</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FansTab ──────────────────────────────────────────────────────────────────

function FansTab({
  brand, niche, editing, onBrandChange,
}: {
  brand: KOLBrand;
  niche: string;
  editing: boolean;
  onBrandChange?: (b: KOLBrand) => void;
}) {
  const fanAgeGroups  = brand.fanAgeGroups  ?? [];
  const fanGender     = brand.fanGender     ?? "";
  const fanSpending   = brand.fanSpending   ?? "";
  const fanInterests  = brand.fanInterests  ?? [];
  const targetAudience = brand.targetAudience ?? "";

  const nicheInterestSuggestions = INTEREST_SUGGESTIONS[niche] ?? INTEREST_SUGGESTIONS.other;

  return (
    <div className="space-y-4">
      {/* Why callout */}
      <div className="flex items-start gap-3 p-3 rounded-xl"
        style={{ background: "rgba(217,119,6,0.05)", border: "1px solid rgba(217,119,6,0.15)" }}>
        <Target size={16} className="mt-0.5 shrink-0" style={{ color: "#d97706" }} />
        <div>
          <p className="text-[12px] font-semibold mb-0.5" style={{ color: "#b45309" }}>Tại sao cần thông tin này?</p>
          <p className="text-[11.5px] leading-relaxed" style={{ color: "#92400e" }}>
            Thông tin này <strong>không hiển thị trên Facebook</strong> — chỉ AI biết. AI dùng để viết đúng tệp:
            Gen Z cần slang & emoji, 35–44 cần tone uy tín; người chi tiêu cao cần "đầu tư xứng đáng" thay vì "giá rẻ".
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Age groups */}
          <div>
            <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>
              Độ tuổi fans chính
              <span className="font-normal text-[11.5px] ml-1.5" style={{ color: "var(--vt-gray-500)" }}>(chọn nhiều)</span>
            </p>
            <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
              Gen Z (18–24): emoji, slang · Millennial (25–34): thực dụng · 35+: uy tín & chi tiết
            </p>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {AGE_GROUPS.map(({ v, l }) => {
                  const active = fanAgeGroups.includes(v);
                  return (
                    <button key={v}
                      className="px-3 py-1.5 rounded-full text-[12px] font-medium border-2 transition-colors"
                      style={{
                        borderColor: active ? "var(--vt-navy)" : "var(--vt-gray-100)",
                        background:  active ? "var(--vt-navy)" : "white",
                        color:       active ? "white" : "var(--vt-gray-500)",
                      }}
                      onClick={() => onBrandChange?.({ ...brand, fanAgeGroups: active ? fanAgeGroups.filter((x) => x !== v) : [...fanAgeGroups, v] })}>
                      {l}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {fanAgeGroups.length > 0
                  ? fanAgeGroups.map((v) => {
                      const l = AGE_GROUPS.find((a) => a.v === v)?.l ?? v;
                      return <Pill key={v} text={l} color="var(--vt-navy)" bg="rgba(44,90,160,0.1)" />;
                    })
                  : <span className="text-[12px] italic" style={{ color: "var(--vt-gray-400)" }}>—</span>}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>Giới tính fans chính</p>
            <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
              Ảnh hưởng đến xưng hô, ví dụ so sánh và độ dài bài viết
            </p>
            {editing ? (
              <div className="flex gap-2">
                {([["female", "Nữ chính"], ["male", "Nam chính"], ["both", "Cả 2"]] as [string, string][]).map(([v, l]) => {
                  const active = fanGender === v;
                  return (
                    <button key={v}
                      className="flex-1 py-2 rounded-xl text-[12.5px] font-semibold border-2 transition-colors"
                      style={{
                        borderColor: active ? "var(--vt-navy)" : "var(--vt-gray-100)",
                        background:  active ? "var(--vt-navy)" : "white",
                        color:       active ? "white" : "var(--vt-gray-500)",
                      }}
                      onClick={() => onBrandChange?.({ ...brand, fanGender: v })}>{l}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px]" style={{ color: "var(--vt-gray-900)" }}>
                {fanGender === "female" ? "Nữ chính" : fanGender === "male" ? "Nam chính" : fanGender === "both" ? "Cả 2" : "—"}
              </p>
            )}
          </div>

          {/* Spending */}
          <div>
            <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>Mức chi tiêu của fans</p>
            <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
              AI chọn wording: "giá hợp lý" vs "đầu tư xứng đáng" vs "hàng top tier"
            </p>
            {editing ? (
              <select className="vt-input text-[13px]" value={fanSpending}
                onChange={(e) => onBrandChange?.({ ...brand, fanSpending: e.target.value })}>
                <option value="">Chọn mức chi tiêu...</option>
                {SPENDING_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <p className="text-[13px]" style={{ color: "var(--vt-gray-900)" }}>{fanSpending || "—"}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Pain points */}
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[12.5px] font-semibold" style={{ color: "var(--vt-gray-900)" }}>Pain points & mong muốn của fans</p>
              {editing && (
                <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                  style={{ color: "#d97706", background: "rgba(217,119,6,0.08)" }}
                  onClick={() => onBrandChange?.({ ...brand, targetAudience: PAIN_SUGGESTIONS[niche] ?? "" })}>
                  Gợi ý theo niche ↗
                </button>
              )}
            </div>
            <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
              Cốt lõi — AI đưa pain này vào hook đầu bài để fans dừng cuộn lại đọc
            </p>
            {editing ? (
              <>
                <textarea className="vt-input vt-textarea text-[13px]" rows={5}
                  placeholder="Mô tả vấn đề và mong muốn fans đang gặp..."
                  value={targetAudience}
                  onChange={(e) => onBrandChange?.({ ...brand, targetAudience: e.target.value })} />
                {targetAudience.length > 20 && (
                  <p className="text-[10.5px] mt-1" style={{ color: "#16a34a" }}>
                    ✓ AI sẽ dùng thông tin này làm hook mở đầu bài viết
                  </p>
                )}
              </>
            ) : (
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--vt-gray-900)" }}>
                {targetAudience || <span className="italic" style={{ color: "var(--vt-gray-400)" }}>—</span>}
              </p>
            )}
          </div>

          {/* Fan interests */}
          <div>
            <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>Sở thích & quan tâm của fans</p>
            <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
              AI dùng để chọn ví dụ so sánh và cultural reference phù hợp
            </p>
            {editing ? (
              <>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {nicheInterestSuggestions.map((t) => {
                    const active = fanInterests.includes(t);
                    return (
                      <button key={t}
                        className="px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-colors"
                        style={{
                          borderColor: active ? "#7c3aed" : "var(--vt-gray-100)",
                          background:  active ? "rgba(124,58,237,0.08)" : "white",
                          color:       active ? "#7c3aed" : "var(--vt-gray-500)",
                        }}
                        onClick={() => onBrandChange?.({ ...brand, fanInterests: active ? fanInterests.filter((x) => x !== t) : [...fanInterests, t] })}>
                        {active ? "✓ " : ""}{t}
                      </button>
                    );
                  })}
                </div>
                <ChipInput value={fanInterests} onChange={(v) => onBrandChange?.({ ...brand, fanInterests: v })}
                  placeholder="Thêm sở thích khác..." color="#7c3aed" bg="rgba(124,58,237,0.08)" />
              </>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {fanInterests.length > 0
                  ? fanInterests.map((t) => <Pill key={t} text={t} color="#7c3aed" bg="rgba(124,58,237,0.08)" />)
                  : <span className="text-[12px] italic" style={{ color: "var(--vt-gray-400)" }}>—</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RefsTab ──────────────────────────────────────────────────────────────────

function RefsTab({ brand, onChange }: { brand: KOLBrand; onChange: (b: KOLBrand) => void }) {
  const [refUrl, setRefUrl] = useState("");

  const fbLinks    = brand.sourceLinks.filter((l) => l.type === "facebook_profile");
  const otherLinks = brand.sourceLinks.filter((l) => l.type !== "facebook_profile");

  const addRef = () => {
    const url = refUrl.trim();
    if (!url) return;
    const slug  = url.replace(/\/$/, "").split("/").pop() ?? url;
    const link: SourceLink = { id: "ref_" + Date.now(), type: "facebook_profile", label: slug, url, active: true };
    onChange({ ...brand, sourceLinks: [...brand.sourceLinks, link] });
    setRefUrl("");
  };

  const removeLink = (id: string) =>
    onChange({ ...brand, sourceLinks: brand.sourceLinks.filter((l) => l.id !== id) });

  const toggleLink = (id: string) =>
    onChange({ ...brand, sourceLinks: brand.sourceLinks.map((l) => l.id === id ? { ...l, active: !l.active } : l) });

  return (
    <div className="space-y-4">
      {/* How AI learns */}
      <div className="flex items-start gap-3 p-3 rounded-xl"
        style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}>
        <Sparkles size={14} className="mt-0.5 shrink-0" style={{ color: "#6366f1" }} />
        <div>
          <p className="text-[12px] font-semibold mb-0.5" style={{ color: "#4f46e5" }}>AI học từ KOL thật như thế nào?</p>
          <p className="text-[11.5px] leading-relaxed" style={{ color: "#4338ca" }}>
            AI thu thập bài public → phân tích cấu trúc câu, cách đặt hook, dùng emoji, kết CTA →
            bổ sung vào văn phong đã học ở tab Phong cách. Thêm <strong>1–3 link</strong> là đủ.
          </p>
        </div>
      </div>

      {/* Add URL form */}
      <div className="p-4 rounded-xl border space-y-2" style={{ borderColor: "var(--vt-gray-100)" }}>
        <label className="block text-[10.5px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--vt-gray-500)" }}>Link Facebook Profile</label>
        <div className="flex gap-2">
          <input className="vt-input text-[13px] font-mono flex-1" placeholder="https://facebook.com/..."
            value={refUrl} onChange={(e) => setRefUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRef(); } }} />
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold border-2 transition-colors shrink-0"
            style={{
              borderColor: refUrl.trim() ? "var(--vt-blue)" : "var(--vt-gray-100)",
              color:       refUrl.trim() ? "var(--vt-blue)" : "var(--vt-gray-400)",
              background:  refUrl.trim() ? "rgba(44,90,160,0.06)" : "white",
            }}
            disabled={!refUrl.trim()}
            onClick={addRef}>
            <Plus size={13} /> Thêm
          </button>
        </div>
        <p className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>
          Profile công khai · Nhấn Enter hoặc nút Thêm · Tên hiển thị tự lấy từ URL slug
        </p>
      </div>

      {/* FB profile links */}
      {fbLinks.length === 0 ? (
        <div className="text-center py-8">
          <UserCircle size={28} className="mx-auto mb-2" style={{ color: "var(--vt-gray-400)" }} />
          <p className="text-[13px] font-medium mb-1" style={{ color: "var(--vt-navy)" }}>Chưa có KOL tham khảo</p>
          <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>Thêm link Facebook profile của KOL có phong cách bạn muốn học</p>
        </div>
      ) : (
        <div className="space-y-2">
          {fbLinks.map((link, i) => (
            <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ borderColor: "var(--vt-gray-100)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                {link.label.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{link.label}</div>
                <div className="font-mono text-[10.5px] truncate" style={{ color: "var(--vt-gray-500)" }}>{link.url}</div>
              </div>
              <button onClick={() => toggleLink(link.id)} title={link.active ? "Đang bật" : "Đang tắt"}>
                {link.active
                  ? <ToggleRight size={22} style={{ color: "#16a34a" }} />
                  : <ToggleLeft size={22} style={{ color: "var(--vt-gray-500)" }} />}
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                onClick={() => removeLink(link.id)}>
                <Trash2 size={13} style={{ color: "#dc2626" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Other source links */}
      {otherLinks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>
            Nguồn khác
          </p>
          {otherLinks.map((link) => {
            const meta = SOURCE_TYPE_META[link.type];
            const Icon = meta.icon;
            return (
              <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: "var(--vt-gray-100)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: meta.bg, color: meta.color }}>
                  <Icon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium" style={{ color: "var(--vt-navy)" }}>{link.label}</div>
                  <div className="font-mono text-[10.5px] truncate" style={{ color: "var(--vt-gray-500)" }}>{link.url}</div>
                </div>
                <button onClick={() => toggleLink(link.id)}>
                  {link.active
                    ? <ToggleRight size={22} style={{ color: "#16a34a" }} />
                    : <ToggleLeft size={22} style={{ color: "var(--vt-gray-500)" }} />}
                </button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                  onClick={() => removeLink(link.id)}>
                  <Trash2 size={13} style={{ color: "#dc2626" }} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-3.5 rounded-xl flex items-start gap-2.5"
        style={{ background: "rgba(44,90,160,0.06)", border: "1px solid rgba(44,90,160,0.12)" }}>
        <Zap size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vt-blue)" }} />
        <p className="text-[12px]" style={{ color: "var(--vt-blue)" }}>
          Các nguồn đang bật sẽ được AI tham khảo khi tạo bài cho profile này. Nguồn tắt vẫn được lưu nhưng không sử dụng.
        </p>
      </div>
    </div>
  );
}

// ─── Add KOL Modal ─────────────────────────────────────────────────────────────

const STEP_META = [
  { title: "Chọn nick Facebook",          badge: "Bắt buộc",   badgeColor: "#dc2626", badgeBg: "rgba(220,38,38,0.08)",
    desc: "Nick FB là 'vỏ bọc' thật — tên, ảnh đại diện, bạn bè. KOL ảo là AI layer bên trên: giọng văn, bài đăng, persona do AI tạo ra." },
  { title: "Phong cách & nhân vật KOL",   badge: "Bắt buộc",   badgeColor: "#dc2626", badgeBg: "rgba(220,38,38,0.08)",
    desc: "Định hình nhân vật AI: niche, khuôn mặt, tính cách, văn phong mẫu. Càng chi tiết → AI viết càng đúng chất KOL." },
  { title: "Mục tiêu fans & thị trường",  badge: "Quan trọng", badgeColor: "#d97706", badgeBg: "rgba(217,119,6,0.1)",
    desc: "AI dùng để chọn từ ngữ, xây hook, đặt CTA phù hợp tệp. Thông tin này không hiển thị FB — chỉ AI biết và dùng khi viết bài." },
  { title: "KOL tham khảo phong cách",    badge: "Tuỳ chọn",   badgeColor: "#6B7280", badgeBg: "var(--vt-bg)",
    desc: "AI phân tích bài public của KOL tham khảo → bổ sung vào văn phong đã học ở bước 2. Có thể bỏ qua và thêm sau." },
] as const;

const PERSONALITY_SUGGESTIONS: Record<string, string[]> = {
  beauty:    ["gần gũi", "tự tin", "chi tiết", "hài hước", "truyền cảm hứng"],
  tech:      ["logic", "chuyên sâu", "trung thực", "thực tế", "cuốn hút"],
  mom:       ["ấm áp", "chân thật", "yêu thương", "đồng cảm", "kinh nghiệm"],
  fitness:   ["năng động", "truyền lửa", "kỷ luật", "thực chiến", "tích cực"],
  business:  ["chuyên nghiệp", "sắc bén", "thực tế", "dẫn dắt", "phân tích"],
  food:      ["đam mê", "sành ăn", "chi tiết", "vui tươi", "chân thật"],
  fashion:   ["thẩm mỹ", "trendy", "tự tin", "sáng tạo", "cá tính"],
  travel:    ["phiêu lưu", "cởi mở", "truyền cảm hứng", "chi tiết", "tự do"],
  finance:   ["phân tích", "cẩn thận", "thực tế", "rõ ràng", "tin cậy"],
  education: ["kiên nhẫn", "chi tiết", "truyền cảm hứng", "thực tế", "dễ hiểu"],
  gaming:    ["năng động", "hài hước", "thẳng thắn", "đam mê", "cộng đồng"],
  pets:      ["yêu thương", "chăm chút", "chia sẻ", "ấm áp", "trách nhiệm"],
  lifestyle: ["cân bằng", "truyền cảm hứng", "tích cực", "authentic", "gần gũi"],
  other:     ["vui tươi", "học hỏi", "cởi mở", "sáng tạo", "thân thiện"],
};

const TOPIC_SUGGESTIONS: Record<string, string[]> = {
  beauty:    ["skincare", "makeup", "review mỹ phẩm", "làm đẹp tự nhiên", "unbox"],
  tech:      ["review gadget", "AI tools", "coding tips", "công nghệ mới", "so sánh"],
  mom:       ["nuôi con", "ăn dặm", "review đồ baby", "mẹ bỉm", "thai kỳ"],
  fitness:   ["gym tips", "dinh dưỡng", "giảm cân", "tập tại nhà", "cardio"],
  business:  ["khởi nghiệp", "marketing", "tư duy kinh doanh", "case study", "sales"],
  food:      ["review quán", "công thức nấu ăn", "ẩm thực vùng miền", "unbox thực phẩm", "food tour"],
  fashion:   ["outfit of the day", "haul thời trang", "mix & match", "streetwear", "thời trang bền vững"],
  travel:    ["review điểm đến", "tips du lịch tiết kiệm", "vlog hành trình", "ẩm thực địa phương", "check-in"],
  finance:   ["tiết kiệm", "đầu tư cổ phiếu", "quản lý chi tiêu", "passive income", "review tài khoản"],
  education: ["học tiếng Anh", "tips học tập", "review khoá học", "tư duy phản biện", "career path"],
  gaming:    ["review game", "gameplay", "tips & tricks", "esports", "unbox gear"],
  pets:      ["chăm sóc thú cưng", "review đồ cho thú", "chia sẻ kinh nghiệm", "dạy thú cưng", "vlog cùng pet"],
  lifestyle: ["morning routine", "work-life balance", "self-care", "minimalism", "productivity"],
  other:     ["cuộc sống", "học tập", "chia sẻ trải nghiệm", "kinh nghiệm", "review"],
};

const PAIN_SUGGESTIONS: Record<string, string> = {
  beauty:    "da dầu mụn ẩn, ngại retinol mạnh, sợ kích ứng. Mong da mịn mà không tốn nhiều time skincare.",
  tech:      "không theo kịp công nghệ mới, chọn gadget sai, mua đồ đắt không dùng được. Muốn đồ tốt giá hợp lý.",
  mom:       "bé hay ốm vặt, không biết ăn dặm đúng cách, thiếu ngủ. Mong có công thức đơn giản để con khỏe.",
  fitness:   "tập mãi không thấy thay đổi, không có thời gian, ăn kiêng quá khổ. Muốn body đẹp mà không kiệt sức.",
  business:  "doanh thu giảm, không biết chạy ads, khó tuyển team tốt. Muốn scale mà không mất kiểm soát chi phí.",
  food:      "không biết ăn ở đâu ngon, hay bị chặt chém, ngại nấu vì không có công thức đơn giản. Muốn ăn ngon mà không tốn kém.",
  fashion:   "không biết mix đồ, sợ lỗi mốt, mua nhiều nhưng mặc ít. Muốn mặc đẹp mà không cần tủ đồ quá đắt.",
  travel:    "sợ đi không biết ăn chơi ở đâu, ngại vì tốn kém, không có bạn đồng hành. Muốn khám phá mà an toàn và tiết kiệm.",
  finance:   "không biết bắt đầu đầu tư từ đâu, sợ mất tiền, không hiểu các thuật ngữ tài chính. Muốn tiền đẻ ra tiền mà không rủi ro cao.",
  education: "học mãi không vào, không tập trung được, không biết học cái gì có giá trị. Muốn có lộ trình rõ ràng và hiệu quả.",
  gaming:    "stuck ở một rank mãi không lên, không tìm được team chơi cùng, lag và gear kém. Muốn improve nhanh mà vui.",
  pets:      "không biết chăm thú cưng đúng cách, lo lắng khi bé bệnh, tốn kém vet. Muốn nuôi thú khoẻ mạnh và hạnh phúc.",
  lifestyle: "cuộc sống bị mất cân bằng, hay burnout, không có thời gian cho bản thân. Muốn sống tốt hơn mà không cần thay đổi quá nhiều.",
  other:     "không biết bắt đầu từ đâu, thiếu kinh nghiệm, sợ thất bại. Muốn có lộ trình rõ ràng để tiến bộ.",
};

const INTEREST_SUGGESTIONS: Record<string, string[]> = {
  beauty:    ["K-beauty", "organic skincare", "budget beauty", "skincare routine", "haul mỹ phẩm"],
  tech:      ["AI tools", "smartphone", "coding", "smart home", "gaming gear"],
  mom:       ["sức khỏe gia đình", "đồ cho bé", "trường học", "dinh dưỡng trẻ em", "mẹ đơn thân"],
  fitness:   ["yoga", "pilates", "chạy bộ", "calisthenics", "healthy food"],
  business:  ["đầu tư", "digital marketing", "e-commerce", "tài chính cá nhân", "leadership"],
  food:      ["street food", "fine dining", "nấu ăn tại nhà", "ẩm thực Nhật", "coffee & cafe"],
  fashion:   ["sustainable fashion", "streetwear", "Korean fashion", "vintage", "accessories"],
  travel:    ["backpacking", "resort & spa", "solo travel", "food travel", "hidden gems"],
  finance:   ["chứng khoán", "crypto", "bất động sản", "quỹ ETF", "FIRE movement"],
  education: ["IELTS", "lập trình", "kỹ năng mềm", "MBA", "học online"],
  gaming:    ["MOBA", "FPS", "RPG", "mobile gaming", "esports"],
  pets:      ["chó", "mèo", "thú cưng nhỏ", "aquarium", "hamster"],
  lifestyle: ["minimalism", "wellness", "reading", "journaling", "self-improvement"],
  other:     ["du lịch", "ẩm thực", "phim ảnh", "âm nhạc", "đọc sách"],
};

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: bg, color }}>{label}</span>
  );
}

function FieldBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
      style={{ background: bg, color }}>{label}</span>
  );
}

function AddKOLModal({ onAdd, onClose, linkedProfiles }: {
  onAdd: (p: KOLProfile, b: KOLBrand) => void;
  onClose: () => void;
  linkedProfiles: KOLProfile[];
}) {
  const TOTAL = 4;
  const [step, setStep] = useState(1);

  // Step 1
  const [linkedAccountId, setLinkedAccountId] = useState<string | null>(null);
  const [manualMode, setManualMode]           = useState(false);
  const [search, setSearch]                   = useState("");

  // Step 2
  const [name, setName]               = useState("");
  const [nameLocked, setNameLocked]   = useState(true);
  const [niche, setNiche]             = useState("beauty");
  const [faceCount, setFaceCount]     = useState(0);
  const [age, setAge]                 = useState("");
  const [gender, setGender]           = useState("");
  const [personality, setPersonality] = useState("");
  const [occupation, setOccupation]   = useState("");
  const [contentTopics, setContentTopics]     = useState<string[]>([]);
  const [sampleWriting, setSampleWriting]     = useState("");
  const [forbiddenTopics, setForbiddenTopics] = useState("");

  // Step 3
  const [fanAgeGroups, setFanAgeGroups]     = useState<string[]>([]);
  const [fanGender, setFanGender]           = useState("");
  const [fanSpending, setFanSpending]       = useState("");
  const [fanPainPoints, setFanPainPoints]   = useState("");
  const [fanInterests, setFanInterests]     = useState<string[]>([]);

  // Step 4
  const [refKOLs, setRefKOLs] = useState<{ label: string; url: string }[]>([]);
  const [refUrl, setRefUrl]   = useState("");
  const [brandColors, setBrandColors] = useState<string[]>([]);

  const linkedAccount = SOCIAL_ACCOUNTS.find((a) => a.id === linkedAccountId);
  const alreadyLinked = new Set(linkedProfiles.map((p) => p.linkedAccountId).filter(Boolean));

  const selectAccount = (id: string) => {
    setLinkedAccountId(id);
    const acc = SOCIAL_ACCOUNTS.find((a) => a.id === id);
    if (acc) { setName(acc.fbName); setNameLocked(true); }
    setManualMode(false);
  };

  const filteredAccounts = SOCIAL_ACCOUNTS.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.fbName.toLowerCase().includes(q) || a.uid.includes(q);
  });

  const personalityChips = personality.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  const togglePersonality = (t: string) => {
    if (personalityChips.includes(t)) {
      setPersonality(personalityChips.filter((x) => x !== t).join(", "));
    } else if (personalityChips.length < 5) {
      setPersonality([...personalityChips, t].join(", "));
    }
  };

  const step1Valid = linkedAccountId !== null || (manualMode && name.trim().length > 0);
  const step2Valid = name.trim().length > 0;
  const canNext    = step === 1 ? step1Valid : step === 2 ? step2Valid : true;

  const nichePersonalitySuggestions = PERSONALITY_SUGGESTIONS[niche] ?? PERSONALITY_SUGGESTIONS.other;
  const nicheTopicSuggestions       = TOPIC_SUGGESTIONS[niche]       ?? TOPIC_SUGGESTIONS.other;
  const nicheInterestSuggestions    = INTEREST_SUGGESTIONS[niche]    ?? INTEREST_SUGGESTIONS.other;

  const handleCreate = () => {
    const nicheOpt  = NICHE_QUICK.find((o) => o.v === niche);
    const finalName = name.trim();
    const initials  = finalName.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "KL";
    const id        = "p" + Date.now();
    const color     = linkedAccount?.avatarColor ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const newProfile: KOLProfile = {
      id, name: finalName,
      niche: niche as KOLProfile["niche"],
      nicheLabel: nicheOpt?.l ?? niche,
      avatarColor: color, initials,
      followers: linkedAccount ? String(linkedAccount.followers) : "0",
      quotaUsed: 0, quotaTotal: 200, status: "active",
      linkedAccountId: linkedAccountId ?? undefined,
      age, gender, occupation,
      faceCount: faceCount || undefined,
    };

    const newBrand: KOLBrand = {
      profileId: id, tagline: "", bio: "",
      targetAudience: fanPainPoints,
      brandColors: brandColors.length > 0 ? brandColors : [color],
      writingTones: personalityChips,
      writingStyle: sampleWriting,
      vocabularyUse: [],
      vocabularyAvoid: forbiddenTopics.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      emojiUsage: "moderate",
      contentPillars: contentTopics.slice(0, 4).map((t, i) => ({
        name: t, description: "", pct: ([40, 30, 20, 10] as number[])[i] ?? 10,
      })),
      defaultHashtags: contentTopics,
      ctaTemplates: [],
      visualStyle: "",
      brandPersonality: personalityChips,
      postingFrequency: "1 bài/ngày",
      bestPostingTimes: [],
      sourceLinks: refKOLs.map((k, i) => ({
        id: "ref_" + i, type: "facebook_profile" as SourceLinkType,
        label: k.label, url: k.url, active: true,
      })),
      fanAgeGroups, fanGender, fanSpending, fanInterests,
    };

    onAdd(newProfile, newBrand);
  };

  const meta = STEP_META[step - 1];
  const summaryColor = linkedAccount?.avatarColor ?? AVATAR_COLORS[0];
  const summaryInitials = (name || "KL").split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl w-[860px] max-h-[92vh] shadow-2xl overflow-hidden flex flex-col"
        style={{ border: "1px solid var(--vt-gray-100)" }}>

        {/* ── Header ── */}
        <div className="px-7 pt-5 pb-0 shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                  style={{ background: "var(--vt-navy)" }}>{step}</div>
                <h2 className="text-[17px] font-bold" style={{ color: "var(--vt-navy)" }}>{meta.title}</h2>
                <Badge label={meta.badge} color={meta.badgeColor} bg={meta.badgeBg} />
              </div>
              <p className="text-[12px] ml-8.5 leading-relaxed" style={{ color: "var(--vt-gray-500)" }}>{meta.desc}</p>
            </div>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 ml-4 shrink-0"
              style={{ color: "var(--vt-gray-500)" }} onClick={onClose}>
              <X size={15} />
            </button>
          </div>

          {/* Clickable step pills */}
          <div className="flex gap-1.5 mb-4 mt-3 overflow-x-auto">
            {STEP_META.map((s, i) => (
              <button key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all"
                style={{
                  background: i + 1 === step ? "var(--vt-navy)" : i + 1 < step ? "rgba(44,90,160,0.1)" : "var(--vt-bg)",
                  color: i + 1 === step ? "white" : i + 1 < step ? "var(--vt-blue)" : "var(--vt-gray-400)",
                  cursor: i + 1 < step ? "pointer" : "default",
                }}
                onClick={() => { if (i + 1 < step) setStep(i + 1); }}>
                {i + 1 < step && <Check size={10} />}
                {i + 1}. {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-7 pb-3 overflow-y-auto flex-1 min-h-0">

          {/* ══ Step 1: Chọn nick ══ */}
          {step === 1 && (
            <div className="space-y-3">

              {/* How it works callout */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl"
                style={{ background: "rgba(44,90,160,0.04)", border: "1px solid rgba(44,90,160,0.1)" }}>
                {([
                  { icon: "🪪", title: "Nick FB = danh tính thật", text: "Tên, ảnh đại diện, friends list — từ nick thật 100%" },
                  { icon: "🤖", title: "KOL ảo = AI trên nick đó", text: "Bài đăng, giọng văn, persona — do AI tạo ra" },
                  { icon: "🔗", title: "1 nick → 1 KOL tại 1 lúc", text: "Nick đã gắn KOL vẫn ở Quản lý nick FB bình thường" },
                ] as const).map(({ icon, title, text }) => (
                  <div key={title} className="flex items-start gap-2">
                    <span className="text-[18px] leading-none shrink-0">{icon}</span>
                    <div>
                      <div className="text-[11.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>{title}</div>
                      <div className="text-[10.5px] leading-snug mt-0.5" style={{ color: "var(--vt-gray-500)" }}>{text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--vt-gray-500)" }} />
                  <input className="vt-input pl-9 text-[13px]"
                    placeholder="Tìm nick theo UID hoặc họ tên..."
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <a href="/accounts" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold border-2 hover:bg-blue-50 transition-colors no-underline"
                  style={{ borderColor: "var(--vt-blue)", color: "var(--vt-blue)" }}>
                  <ExternalLink size={13} /> Mở kho nick
                </a>
              </div>

              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--vt-gray-100)" }}>
                <div className="max-h-[270px] overflow-y-auto">
                  {filteredAccounts.length === 0 && (
                    <div className="py-10 text-center text-[13px]" style={{ color: "var(--vt-gray-500)" }}>
                      Không tìm thấy nick phù hợp
                    </div>
                  )}
                  {filteredAccounts.map((acc) => {
                    const statusMeta = ACCOUNT_STATUS_META[acc.status];
                    const isSelected = linkedAccountId === acc.id;
                    const usedBy     = linkedProfiles.find((p) => p.linkedAccountId === acc.id);
                    const disabled   = !!usedBy;
                    const initials   = acc.fbName.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("");
                    const health     = acc.healthScore;
                    return (
                      <label key={acc.id}
                        className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition-colors"
                        style={{
                          borderColor: "var(--vt-gray-100)",
                          background: isSelected ? "rgba(44,90,160,0.05)" : undefined,
                          opacity: disabled ? 0.5 : 1,
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}>
                        <input type="radio" name="acc" className="w-4 h-4 accent-blue-700 shrink-0"
                          checked={isSelected} disabled={disabled}
                          onChange={() => selectAccount(acc.id)} />
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                          style={{ background: acc.avatarColor }}>{initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{acc.fbName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>UID {acc.uid}</span>
                            <span style={{ color: "var(--vt-gray-300)" }}>·</span>
                            <span className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
                              {acc.followers >= 1000 ? `${(acc.followers / 1000).toFixed(1)}K` : acc.followers} followers
                            </span>
                            <span style={{ color: "var(--vt-gray-300)" }}>·</span>
                            <span className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
                              {acc.friends.toLocaleString()} bạn bè
                            </span>
                          </div>
                        </div>
                        {/* Health bar */}
                        <div className="w-20 shrink-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9.5px]" style={{ color: "var(--vt-gray-500)" }}>Sức khoẻ</span>
                            <span className="text-[9.5px] font-bold"
                              style={{ color: health >= 70 ? "#16a34a" : health >= 40 ? "#d97706" : "#dc2626" }}>
                              {health}%
                            </span>
                          </div>
                          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                            <div className="h-full rounded-full transition-all"
                              style={{
                                width: `${health}%`,
                                background: health >= 70 ? "#16a34a" : health >= 40 ? "#d97706" : "#dc2626",
                              }} />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: statusMeta.bg, color: statusMeta.color }}>
                            {statusMeta.label}
                          </span>
                          {usedBy && (
                            <span className="text-[10px] font-medium" style={{ color: "#d97706" }}>→ {usedBy.name}</span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <div className="px-4 py-2.5 flex items-center gap-2 border-t text-[11.5px]"
                  style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)", color: "var(--vt-gray-500)" }}>
                  <span>{filteredAccounts.length}/{SOCIAL_ACCOUNTS.length} nick · {SOCIAL_ACCOUNTS.filter(a => !alreadyLinked.has(a.id)).length} sẵn dùng</span>
                  <button className="ml-auto hover:underline font-medium" style={{ color: "var(--vt-blue)" }}
                    onClick={() => { setManualMode(true); setLinkedAccountId(null); setNameLocked(false); }}>
                    + Thêm thủ công (chưa có nick)
                  </button>
                </div>
              </div>

              {manualMode && !linkedAccountId && (
                <div className="p-4 rounded-xl border-2 space-y-2"
                  style={{ borderColor: "#d97706", background: "rgba(245,166,35,0.04)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] font-semibold" style={{ color: "#b45309" }}>⚠ Chế độ thủ công</span>
                    <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>KOL chưa gắn nick FB — sync tự động và một số tính năng bị tắt</span>
                  </div>
                  <input className="vt-input text-[13px]" placeholder="Nhập tên KOL ảo..."
                    value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                  <p className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
                    Có thể gắn nick FB sau bất kỳ lúc nào trong phần chỉnh sửa KOL.
                  </p>
                </div>
              )}

              {linkedAccountId && linkedAccount && (
                <div className="p-3 rounded-xl flex items-center gap-3"
                  style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: linkedAccount.avatarColor }}>
                    {linkedAccount.fbName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{linkedAccount.fbName}</div>
                    <div className="text-[11px]" style={{ color: "#16a34a" }}>
                      Nick đã chọn · Tên KOL sẽ tự điền từ nick này → bước tiếp theo
                    </div>
                  </div>
                  <Check size={16} className="shrink-0" style={{ color: "#16a34a" }} />
                </div>
              )}
            </div>
          )}

          {/* ══ Step 2: Phong cách KOL ══ */}
          {step === 2 && (
            <div className="grid grid-cols-5 gap-5">

              {/* Left: niche + photos */}
              <div className="col-span-2 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "var(--vt-gray-500)" }}>Niche / template nhanh</p>
                  <p className="text-[10.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                    Chọn niche để AI gợi ý sẵn tính cách, chủ đề và pain points phù hợp.
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {NICHE_QUICK.map(({ v, l, icon: Icon }) => {
                      const active = niche === v;
                      return (
                        <button key={v}
                          className="flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-[10.5px] font-medium transition-colors"
                          style={{
                            borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                            background: active ? "rgba(44,90,160,0.06)" : "white",
                            color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                          }}
                          onClick={() => setNiche(v)}>
                          <Icon size={18} />
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Face photos */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--vt-gray-500)" }}>Bộ ảnh khuôn mặt KOL</p>
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: faceCount >= 5 ? "rgba(22,163,74,0.1)" : faceCount >= 3 ? "rgba(217,119,6,0.1)" : "rgba(156,163,175,0.15)",
                        color: faceCount >= 5 ? "#16a34a" : faceCount >= 3 ? "#d97706" : "var(--vt-gray-500)",
                      }}>
                      {faceCount >= 10 ? "Đầy đủ ✓" : faceCount >= 5 ? "Tốt ✓" : faceCount >= 3 ? "Tạm ổn" : "Chưa đủ"}
                    </span>
                  </div>
                  <p className="text-[10.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                    Upload ảnh chân dung KOL ảo — AI học mặt để ghép vào ảnh bài đăng mới. Tối thiểu 3 ảnh.
                  </p>
                  <div className="rounded-xl border-2 border-dashed p-3 mb-2 transition-colors"
                    style={{
                      borderColor: faceCount > 0 ? "var(--vt-blue)" : "var(--vt-gray-100)",
                      background: faceCount > 0 ? "rgba(44,90,160,0.03)" : "var(--vt-bg)",
                    }}>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {Array.from({ length: 10 }, (_, i) => (
                        <button key={i}
                          className="aspect-square rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-105"
                          style={{
                            borderColor: i < faceCount ? "var(--vt-blue)" : "var(--vt-gray-100)",
                            background: i < faceCount ? "rgba(44,90,160,0.08)" : "white",
                            borderStyle: i < faceCount ? "solid" : "dashed",
                          }}
                          onClick={() => setFaceCount(i < faceCount ? i : Math.min(10, i + 1))}>
                          {i < faceCount
                            ? <><User size={14} style={{ color: "var(--vt-blue)" }} />
                              <span className="text-[8px] mt-0.5 font-semibold" style={{ color: "var(--vt-blue)" }}>#{i + 1}</span></>
                            : <><Camera size={10} style={{ color: "var(--vt-gray-400)" }} />
                              <span className="text-[8px] mt-0.5" style={{ color: "var(--vt-gray-400)" }}>#{i + 1}</span></>
                          }
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>Nhấn ô để thêm · Nhấn lại để xoá</p>
                      <button className="text-[10px] font-semibold px-2 py-1 rounded-md"
                        style={{ color: "var(--vt-blue)", background: "rgba(44,90,160,0.08)" }}
                        onClick={() => setFaceCount(10)}>
                        + Tải hàng loạt
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg p-2.5" style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>Chất lượng nhận diện AI</span>
                      <span className="text-[10px] font-semibold"
                        style={{ color: faceCount >= 5 ? "#16a34a" : faceCount >= 3 ? "#d97706" : "var(--vt-gray-400)" }}>
                        {faceCount === 0 ? "—" : faceCount >= 8 ? "≥99.5%" : faceCount >= 5 ? "≥99%" : faceCount >= 3 ? "≥95%" : "~80%"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, faceCount * 10)}%`,
                          background: faceCount >= 5 ? "var(--vt-gradient-sun)" : faceCount >= 3 ? "#d97706" : "var(--vt-gray-300)",
                        }} />
                    </div>
                    <p className="text-[9.5px] mt-1.5 leading-snug" style={{ color: "var(--vt-gray-500)" }}>
                      {faceCount === 0 ? "Upload ảnh chân dung KOL ảo. AI học mặt từ đây."
                        : faceCount < 3 ? `${faceCount}/10 · Cần tối thiểu 3 ảnh để AI nhận diện.`
                        : faceCount < 5 ? `${faceCount}/10 · Thêm ${5 - faceCount} nữa để đạt ≥99%.`
                        : `${faceCount}/10 · ${faceCount < 10 ? `Thêm ${10 - faceCount} nữa để tối ưu.` : "AI đã học đủ mặt ✓"}`
                      }
                    </p>
                  </div>
                </div>

                {/* Brand colors */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>
                      Màu nhận diện thương hiệu
                    </p>
                    <span className="text-[10px]" style={{ color: "var(--vt-gray-400)" }}>{brandColors.length}/6</span>
                  </div>
                  <p className="text-[10.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                    AI dùng màu này tạo ảnh &amp; banner nhất quán theo thương hiệu.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {BRAND_COLOR_PRESETS.map((c) => {
                      const active = brandColors.includes(c);
                      return (
                        <button key={c}
                          className="w-7 h-7 rounded-full transition-all hover:scale-110"
                          style={{
                            background: c,
                            outline: active ? `3px solid ${c}` : "none",
                            outlineOffset: "2px",
                            border: "2px solid white",
                            boxShadow: active ? "0 0 0 1px var(--vt-navy)" : "0 1px 3px rgba(0,0,0,0.2)",
                          }}
                          onClick={() => {
                            const next = active ? brandColors.filter((x) => x !== c) : brandColors.length < 6 ? [...brandColors, c] : brandColors;
                            setBrandColors(next);
                          }}
                          title={c}
                        />
                      );
                    })}
                    <label className="w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                      style={{ borderColor: "var(--vt-gray-300)", background: "white" }}
                      title="Màu tuỳ chỉnh">
                      <input type="color" className="sr-only"
                        onChange={(e) => {
                          const c = e.target.value;
                          if (!brandColors.includes(c) && brandColors.length < 6) setBrandColors([...brandColors, c]);
                        }} />
                      <Plus size={10} style={{ color: "var(--vt-gray-400)" }} />
                    </label>
                  </div>
                  {brandColors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {brandColors.map((c) => (
                        <div key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
                          style={{ background: c + "22", border: `1.5px solid ${c}` }}>
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                          {c}
                          <button onClick={() => setBrandColors(brandColors.filter((x) => x !== c))}
                            className="ml-0.5 opacity-50 hover:opacity-100">
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: form */}
              <div className="col-span-3 space-y-3">
                {/* Badge legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10.5px] p-3 rounded-xl"
                  style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                  <span className="col-span-2 font-semibold mb-0.5" style={{ color: "var(--vt-gray-600)" }}>Ý nghĩa badge:</span>
                  <span className="flex items-center gap-1.5">
                    <FieldBadge label="🔒 KHOÁ TỪ NICK" color="#d97706" bg="rgba(217,119,6,0.1)" />
                    <span style={{ color: "var(--vt-gray-500)" }}>Lấy từ nick, không sửa được</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
                    <span style={{ color: "var(--vt-gray-500)" }}>Không hiện FB, chỉ AI biết</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FieldBadge label="AI TRAINING" color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
                    <span style={{ color: "var(--vt-gray-500)" }}>AI học từ đây để tạo nội dung</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FieldBadge label="AI GUARDRAIL" color="#dc2626" bg="rgba(220,38,38,0.08)" />
                    <span style={{ color: "var(--vt-gray-500)" }}>AI tuyệt đối không đề cập</span>
                  </span>
                </div>

                {/* Name */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>TÊN KOL</span>
                    {nameLocked && linkedAccount && <FieldBadge label="🔒 KHOÁ TỪ NICK" color="#d97706" bg="rgba(217,119,6,0.1)" />}
                  </div>
                  <input className="vt-input text-[13px]" value={name}
                    disabled={nameLocked && !!linkedAccount}
                    style={nameLocked && linkedAccount ? { background: "rgba(245,166,35,0.04)" } : {}}
                    onChange={(e) => setName(e.target.value)} />
                  {nameLocked && linkedAccount && (
                    <button className="mt-1 text-[11.5px] hover:underline"
                      style={{ color: "var(--vt-blue)" }}
                      onClick={() => { setLinkedAccountId(null); setNameLocked(false); setManualMode(true); }}>
                      ↩ Bỏ liên kết nick để sửa tên
                    </button>
                  )}
                </div>

                {/* Age + gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>TUỔI · GIỚI TÍNH</span>
                      <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
                    </div>
                    <div className="flex gap-2">
                      <input type="number" min={16} max={65} className="vt-input text-[13px] text-center w-16 shrink-0"
                        placeholder="26" value={age} onChange={(e) => setAge(e.target.value)} />
                      <select className="vt-input text-[13px] flex-1" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Giới tính</option>
                        <option value="female">Nữ</option>
                        <option value="male">Nam</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>Tuổi & giới tính của nhân vật KOL ảo</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>NGHỀ NGHIỆP</span>
                      <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
                    </div>
                    <input className="vt-input text-[13px]" placeholder="Beauty blogger · KOC mỹ phẩm"
                      value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                    <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>AI dùng để xây backstory nhân vật</p>
                  </div>
                </div>

                {/* Personality */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>TÍNH CÁCH (CHỌN 3–5)</span>
                    <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
                    <FieldBadge label="AI TRAINING" color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {nichePersonalitySuggestions.map((t) => {
                      const active = personalityChips.includes(t);
                      return (
                        <button key={t}
                          className="px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-colors"
                          style={{
                            borderColor: active ? "#7c3aed" : "var(--vt-gray-100)",
                            background: active ? "rgba(124,58,237,0.08)" : "white",
                            color: active ? "#7c3aed" : "var(--vt-gray-500)",
                          }}
                          onClick={() => togglePersonality(t)}>
                          {active ? "✓ " : ""}{t}
                        </button>
                      );
                    })}
                  </div>
                  <input className="vt-input text-[13px]"
                    placeholder="Hoặc nhập tự do, cách nhau bằng dấu phẩy..."
                    value={personality} onChange={(e) => setPersonality(e.target.value)} />
                  <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>
                    AI dùng để chọn tone & cách diễn đạt · Chọn từ gợi ý hoặc nhập tự do · {personalityChips.length}/5 đã chọn
                  </p>
                </div>

                {/* Content topics */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>CHỦ ĐỀ HAY VIẾT</span>
                    <FieldBadge label="CHỈ PERSONA" color="#7c3aed" bg="rgba(124,58,237,0.08)" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {nicheTopicSuggestions.map((t) => {
                      const active = contentTopics.includes(t);
                      return (
                        <button key={t}
                          className="px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-colors"
                          style={{
                            borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                            background: active ? "rgba(44,90,160,0.08)" : "white",
                            color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                          }}
                          onClick={() => setContentTopics((p) => active ? p.filter((x) => x !== t) : [...p, t])}>
                          {active ? "✓ " : "#"}{t}
                        </button>
                      );
                    })}
                  </div>
                  <ChipInput value={contentTopics} onChange={setContentTopics}
                    placeholder="Thêm chủ đề khác..." color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
                  <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>
                    AI xoay quanh các chủ đề này khi đề xuất ý tưởng bài đăng
                  </p>
                </div>

                {/* Sample writing */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>VĂN PHONG MẪU</span>
                    <FieldBadge label="AI TRAINING" color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
                  </div>
                  <textarea className="vt-input vt-textarea text-[13px]" rows={3}
                    placeholder={`Paste 1–3 đoạn hội thoại / caption đại diện giọng KOL.\nAI học cách dùng từ, độ dài câu, emoji, hook — càng nhiều mẫu → càng đúng chất.`}
                    value={sampleWriting} onChange={(e) => setSampleWriting(e.target.value)} />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>
                      Trường quan trọng nhất — AI học văn phong chủ yếu từ đây
                    </p>
                    <span className="text-[10px] font-semibold"
                      style={{ color: sampleWriting.length >= 200 ? "#16a34a" : sampleWriting.length >= 50 ? "#d97706" : "var(--vt-gray-400)" }}>
                      {sampleWriting.length} ký tự {sampleWriting.length >= 200 ? "✓ Tốt" : sampleWriting.length >= 50 ? "· Nên thêm" : "· Cần điền"}
                    </span>
                  </div>
                </div>

                {/* Forbidden */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>CHỦ ĐỀ CẤM</span>
                    <FieldBadge label="AI GUARDRAIL" color="#dc2626" bg="rgba(220,38,38,0.08)" />
                  </div>
                  <input className="vt-input text-[13px]" placeholder="chính trị, rượu bia, y tế, đối thủ cạnh tranh..."
                    value={forbiddenTopics} onChange={(e) => setForbiddenTopics(e.target.value)} />
                  <p className="text-[10px] mt-1" style={{ color: "var(--vt-gray-500)" }}>
                    AI sẽ không bao giờ đề cập dù được yêu cầu · Ngăn cách bằng dấu phẩy
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══ Step 3: Mục tiêu fans ══ */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Why callout */}
              <div className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "rgba(217,119,6,0.05)", border: "1px solid rgba(217,119,6,0.15)" }}>
                <Target size={16} className="mt-0.5 shrink-0" style={{ color: "#d97706" }} />
                <div>
                  <p className="text-[12px] font-semibold mb-0.5" style={{ color: "#b45309" }}>Tại sao cần thông tin này?</p>
                  <p className="text-[11.5px] leading-relaxed" style={{ color: "#92400e" }}>
                    Thông tin này <strong>không hiển thị trên Facebook</strong> — chỉ AI biết. AI dùng để viết đúng tệp:
                    Gen Z cần slang & emoji, 35–44 cần tone uy tín; người chi tiêu cao cần "đầu tư xứng đáng" thay vì "giá rẻ".
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Age groups */}
                  <div>
                    <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>
                      Độ tuổi fans chính
                      <span className="font-normal text-[11.5px] ml-1.5" style={{ color: "var(--vt-gray-500)" }}>(chọn nhiều)</span>
                    </p>
                    <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                      Gen Z (18–24): emoji, slang · Millennial (25–34): thực dụng · 35+: uy tín & chi tiết
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AGE_GROUPS.map(({ v, l }) => {
                        const active = fanAgeGroups.includes(v);
                        return (
                          <button key={v}
                            className="px-3 py-1.5 rounded-full text-[12px] font-medium border-2 transition-colors"
                            style={{
                              borderColor: active ? "var(--vt-navy)" : "var(--vt-gray-100)",
                              background: active ? "var(--vt-navy)" : "white",
                              color: active ? "white" : "var(--vt-gray-500)",
                            }}
                            onClick={() => setFanAgeGroups((p) => active ? p.filter((x) => x !== v) : [...p, v])}>
                            {l}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>Giới tính fans chính</p>
                    <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                      Ảnh hưởng đến xưng hô, ví dụ so sánh và độ dài bài viết
                    </p>
                    <div className="flex gap-2">
                      {([["female", "Nữ chính"], ["male", "Nam chính"], ["both", "Cả 2"]] as [string, string][]).map(([v, l]) => {
                        const active = fanGender === v;
                        return (
                          <button key={v}
                            className="flex-1 py-2 rounded-xl text-[12.5px] font-semibold border-2 transition-colors"
                            style={{
                              borderColor: active ? "var(--vt-navy)" : "var(--vt-gray-100)",
                              background: active ? "var(--vt-navy)" : "white",
                              color: active ? "white" : "var(--vt-gray-500)",
                            }}
                            onClick={() => setFanGender(v)}>{l}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spending */}
                  <div>
                    <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>Mức chi tiêu của fans</p>
                    <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                      AI chọn wording: "giá hợp lý" vs "đầu tư xứng đáng" vs "hàng top tier"
                    </p>
                    <select className="vt-input text-[13px]" value={fanSpending} onChange={(e) => setFanSpending(e.target.value)}>
                      <option value="">Chọn mức chi tiêu...</option>
                      {SPENDING_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Pain points */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[12.5px] font-semibold" style={{ color: "var(--vt-gray-900)" }}>Pain points & mong muốn của fans</p>
                      <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                        style={{ color: "#d97706", background: "rgba(217,119,6,0.08)" }}
                        onClick={() => setFanPainPoints(PAIN_SUGGESTIONS[niche] ?? "")}>
                        Gợi ý theo niche ↗
                      </button>
                    </div>
                    <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                      Cốt lõi — AI đưa pain này vào hook đầu bài để fans dừng cuộn lại đọc
                    </p>
                    <textarea className="vt-input vt-textarea text-[13px]" rows={5}
                      placeholder="Mô tả vấn đề và mong muốn fans đang gặp. Ví dụ: da dầu mụn ẩn, ngại retinol mạnh, sợ kích ứng. Mong da mịn mà không tốn nhiều time skincare..."
                      value={fanPainPoints} onChange={(e) => setFanPainPoints(e.target.value)} />
                    {fanPainPoints.length > 20 && (
                      <p className="text-[10.5px] mt-1" style={{ color: "#16a34a" }}>
                        ✓ AI sẽ dùng thông tin này làm hook mở đầu bài viết
                      </p>
                    )}
                  </div>

                  {/* Interests */}
                  <div>
                    <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>Sở thích & quan tâm của fans</p>
                    <p className="text-[11px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
                      AI dùng để chọn ví dụ so sánh và cultural reference phù hợp
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {nicheInterestSuggestions.map((t) => {
                        const active = fanInterests.includes(t);
                        return (
                          <button key={t}
                            className="px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-colors"
                            style={{
                              borderColor: active ? "#7c3aed" : "var(--vt-gray-100)",
                              background: active ? "rgba(124,58,237,0.08)" : "white",
                              color: active ? "#7c3aed" : "var(--vt-gray-500)",
                            }}
                            onClick={() => setFanInterests((p) => active ? p.filter((x) => x !== t) : [...p, t])}>
                            {active ? "✓ " : ""}{t}
                          </button>
                        );
                      })}
                    </div>
                    <ChipInput value={fanInterests} onChange={setFanInterests}
                      placeholder="Thêm sở thích khác..." color="#7c3aed" bg="rgba(124,58,237,0.08)" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ Step 4: Reference KOLs ══ */}
          {step === 4 && (
            <div className="grid grid-cols-2 gap-5">

              {/* Left: add refs */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}>
                  <Sparkles size={14} className="mt-0.5 shrink-0" style={{ color: "#6366f1" }} />
                  <div>
                    <p className="text-[12px] font-semibold mb-0.5" style={{ color: "#4f46e5" }}>AI học từ KOL thật như thế nào?</p>
                    <p className="text-[11.5px] leading-relaxed" style={{ color: "#4338ca" }}>
                      AI thu thập bài public → phân tích cấu trúc câu, cách đặt hook, dùng emoji, kết CTA →
                      bổ sung vào văn phong đã học bước 2. Thêm <strong>1–3 link</strong> là đủ.
                    </p>
                  </div>
                </div>

                {refKOLs.map((k, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{ borderColor: "var(--vt-gray-100)" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {k.label.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{k.label}</div>
                      <div className="font-mono text-[10.5px] truncate" style={{ color: "var(--vt-gray-500)" }}>{k.url}</div>
                    </div>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                      onClick={() => setRefKOLs((p) => p.filter((_, j) => j !== i))}>
                      <X size={13} style={{ color: "#dc2626" }} />
                    </button>
                  </div>
                ))}

                <div className="p-4 rounded-xl border space-y-2" style={{ borderColor: "var(--vt-gray-100)" }}>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-wide"
                    style={{ color: "var(--vt-gray-500)" }}>Link Facebook Profile / Page</label>
                  <div className="flex gap-2">
                    <input className="vt-input text-[13px] font-mono flex-1" placeholder="https://facebook.com/..."
                      value={refUrl} onChange={(e) => setRefUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && refUrl.trim()) {
                          const slug = refUrl.trim().replace(/\/$/, "").split("/").pop() ?? refUrl.trim();
                          setRefKOLs((p) => [...p, { label: slug, url: refUrl.trim() }]);
                          setRefUrl("");
                        }
                      }} />
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold border-2 transition-colors shrink-0"
                      style={{
                        borderColor: refUrl.trim() ? "var(--vt-blue)" : "var(--vt-gray-100)",
                        color: refUrl.trim() ? "var(--vt-blue)" : "var(--vt-gray-400)",
                        background: refUrl.trim() ? "rgba(44,90,160,0.06)" : "white",
                      }}
                      disabled={!refUrl.trim()}
                      onClick={() => {
                        if (!refUrl.trim()) return;
                        const slug = refUrl.trim().replace(/\/$/, "").split("/").pop() ?? refUrl.trim();
                        setRefKOLs((p) => [...p, { label: slug, url: refUrl.trim() }]);
                        setRefUrl("");
                      }}>
                      <Plus size={13} /> Thêm
                    </button>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--vt-gray-500)" }}>
                    Profile / page công khai · Nhấn Enter hoặc nút Thêm
                  </p>
                </div>

                {refKOLs.length === 0 && (
                  <p className="text-[11.5px] text-center py-1" style={{ color: "var(--vt-gray-400)" }}>
                    Bước này tuỳ chọn — có thể bỏ qua và thêm sau trong phần Nguồn tham khảo
                  </p>
                )}
              </div>

              {/* Right: summary */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--vt-gray-500)" }}>
                  Tổng kết — KOL sắp được tạo
                </p>
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--vt-gray-100)" }}>
                  <div className="p-4 flex items-center gap-3" style={{ background: "var(--vt-navy)" }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0"
                      style={{ background: summaryColor }}>
                      {summaryInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-white truncate">{name || "Chưa đặt tên"}</div>
                      <div className="text-[11px] opacity-70 text-white">
                        {NICHE_QUICK.find((n) => n.v === niche)?.l ?? niche}
                        {occupation ? ` · ${occupation}` : ""}
                      </div>
                    </div>
                    {linkedAccount && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                        FB linked
                      </span>
                    )}
                  </div>
                  {([
                    { label: "Nick FB",       value: linkedAccount ? linkedAccount.fbName : manualMode ? "Thủ công" : "Chưa gắn" },
                    { label: "Tính cách",     value: personalityChips.length > 0 ? personalityChips.join(", ") : "Chưa chọn" },
                    { label: "Chủ đề",        value: contentTopics.length > 0 ? contentTopics.join(", ") : "Chưa chọn" },
                    { label: "Fans mục tiêu", value: [...fanAgeGroups, fanGender].filter(Boolean).join(" · ") || "Chưa chọn" },
                    { label: "Mức chi tiêu",  value: fanSpending || "Chưa chọn" },
                    { label: "Ảnh mặt",       value: faceCount > 0 ? `${faceCount} ảnh` : "Chưa upload" },
                    { label: "Văn phong mẫu", value: sampleWriting.length > 0 ? `${sampleWriting.length} ký tự` : "Chưa có" },
                    { label: "KOL tham khảo", value: refKOLs.length > 0 ? refKOLs.map((k) => k.label).join(", ") : "Không có" },
                  ] as { label: string; value: string }[]).map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-2 px-4 py-2 border-b text-[12px]"
                      style={{ borderColor: "var(--vt-gray-100)" }}>
                      <span className="w-28 shrink-0 font-medium" style={{ color: "var(--vt-gray-500)" }}>{label}</span>
                      <span className="flex-1 font-semibold leading-snug" style={{ color: value.startsWith("Chưa") || value === "Không có" ? "var(--vt-gray-400)" : "var(--vt-navy)" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className="px-4 py-3" style={{ background: "var(--vt-bg)" }}>
                    <p className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
                      Sau khi tạo, chỉnh sửa toàn bộ trong tab <strong>Phong cách viết</strong> của KOL này.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-7 py-4 border-t shrink-0"
          style={{ borderColor: "var(--vt-gray-100)" }}>
          <button className="vt-btn-secondary"
            onClick={step === 1 ? onClose : () => setStep((s) => s - 1)}>
            {step === 1 ? "Huỷ" : "← Quay lại"}
          </button>
          <div className="flex items-center gap-3">
            {step >= 3 && step < TOTAL && (
              <button className="text-[12.5px] font-semibold hover:underline"
                style={{ color: "var(--vt-gray-400)" }}
                onClick={() => setStep((s) => s + 1)}>
                Bỏ qua →
              </button>
            )}
            {step < TOTAL
              ? <button className="vt-btn-primary"
                  disabled={!canNext} style={{ opacity: canNext ? 1 : 0.45 }}
                  onClick={() => setStep((s) => s + 1)}>
                  Tiếp theo →
                </button>
              : <button className="vt-btn-primary" onClick={handleCreate}>
                  <Check size={14} /> Tạo KOL
                </button>
            }
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function KOLPage() {
  const [profiles, setProfiles]     = useState<KOLProfile[]>(PROFILES);
  const [brands, setBrands]         = useState<KOLBrand[]>(KOL_BRANDS);
  const [activeProfileId, setActiveProfileId] = useState("p1");
  const [activeTab, setActiveTab]   = useState<Tab>("persona");
  const [editing, setEditing]       = useState(false);
  const [draft, setDraft]           = useState<KOLBrand | null>(null);
  const [profileDraft, setProfileDraft] = useState<KOLProfile | null>(null);
  const [showAdd, setShowAdd]       = useState(false);

  const profile = profiles.find((p) => p.id === activeProfileId)!;
  const brand   = brands.find((b) => b.profileId === activeProfileId);

  const startEdit = useCallback(() => {
    if (!brand) return;
    setDraft(JSON.parse(JSON.stringify(brand)));
    setProfileDraft(JSON.parse(JSON.stringify(profile)));
    setEditing(true);
  }, [brand, profile]);

  const saveEdit = useCallback(() => {
    if (!draft) return;
    setBrands((prev) => prev.map((b) => b.profileId === draft.profileId ? draft : b));
    if (profileDraft) setProfiles((prev) => prev.map((p) => p.id === profileDraft.id ? profileDraft : p));
    setEditing(false);
    setDraft(null);
    setProfileDraft(null);
  }, [draft, profileDraft]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setDraft(null);
    setProfileDraft(null);
  }, []);

  const handleSourcesChange = useCallback((updated: KOLBrand) => {
    setBrands((prev) => prev.map((b) => b.profileId === updated.profileId ? updated : b));
  }, []);

  const addProfile = useCallback((newProfile: KOLProfile, newBrand: KOLBrand) => {
    setProfiles((prev) => [...prev, newProfile]);
    setBrands((prev) => [...prev, newBrand]);
    setActiveProfileId(newProfile.id);
    setActiveTab("persona");
    setShowAdd(false);
  }, []);

  const switchProfile = (id: string) => {
    if (editing) cancelEdit();
    setActiveProfileId(id);
    setActiveTab("persona");
  };

  const activeBrand = editing && draft ? draft : brand;
  const activeProfileData = editing && profileDraft ? profileDraft : profile;

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-5">

        {/* ── Left: Profile list ── */}
        <div className="col-span-3">
          <div className="vt-card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "var(--vt-gray-100)" }}>
              <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>
                Profile KOL
              </span>
              <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={() => setShowAdd(true)}>
                <Plus size={14} style={{ color: "var(--vt-blue)" }} />
              </button>
            </div>

            <ul className="py-1.5">
              {profiles.map((p) => {
                const b = brands.find((kb) => kb.profileId === p.id);
                const isActive = p.id === activeProfileId;
                return (
                  <li key={p.id}>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left hover:bg-gray-50"
                      style={isActive ? { background: "rgba(44,90,160,0.06)" } : {}}
                      onClick={() => switchProfile(p.id)}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                        style={{ background: p.avatarColor }}>{p.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate"
                          style={{ color: isActive ? "var(--vt-blue)" : "var(--vt-navy)" }}>{p.name}</div>
                        <div className="text-[11px] truncate" style={{ color: "var(--vt-gray-500)" }}>
                          {b?.tagline ?? p.nicheLabel}
                        </div>
                      </div>
                      {isActive && <ChevronRight size={13} style={{ color: "var(--vt-blue)" }} />}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="px-4 py-3 border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
              <button
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12.5px] font-semibold border-2 border-dashed hover:bg-gray-50"
                style={{ borderColor: "var(--vt-gray-100)", color: "var(--vt-gray-500)" }}
                onClick={() => setShowAdd(true)}
              >
                <Plus size={13} /> Thêm profile KOL
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Detail ── */}
        <div className="col-span-9">
          {/* Profile header */}
          <div className="vt-card p-5 mb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[16px] font-bold text-white shrink-0"
              style={{ background: profile.avatarColor }}>{profile.initials}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-bold" style={{ color: "var(--vt-navy)" }}>{profile.name}</h2>
              <p className="text-[13px]" style={{ color: "var(--vt-gray-500)" }}>
                {activeBrand?.tagline ?? <span className="italic">Chưa có thông tin thương hiệu</span>}
              </p>
            </div>
            {editing ? (
              <div className="flex items-center gap-2">
                <button className="vt-btn-secondary" onClick={cancelEdit}>
                  <X size={13} /> Huỷ
                </button>
                <button className="vt-btn-primary" onClick={saveEdit}>
                  <Save size={13} /> Lưu
                </button>
              </div>
            ) : (
              <button className="vt-btn-secondary" onClick={startEdit} disabled={!brand}>
                <Edit3 size={13} /> Chỉnh sửa
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl vt-card w-fit mb-4 overflow-x-auto">
            {TAB_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-semibold transition-colors whitespace-nowrap"
                  style={active ? { background: "var(--vt-navy)", color: "white" } : { color: "var(--vt-gray-500)" }}>
                  <Icon size={13} />{label}
                </button>
              );
            })}
          </div>

          {!activeBrand ? (
            <div className="vt-card p-12 text-center">
              <User size={36} className="mx-auto mb-3" style={{ color: "var(--vt-gray-500)" }} />
              <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--vt-navy)" }}>Chưa có thông tin KOL Brand</div>
              <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
                Thiết lập phong cách viết và hình ảnh thương hiệu để AI tạo bài đúng giọng.
              </p>
              <button className="vt-btn-primary mx-auto"><Plus size={14} /> Thiết lập ngay</button>
            </div>
          ) : (
            <>
              {/* Unified tab rendering */}
              {activeTab === "persona" && (
                <PersonaTab
                  profile={activeProfileData}
                  brand={activeBrand}
                  editing={editing}
                  onProfileChange={setProfileDraft}
                  onBrandChange={setDraft}
                />
              )}
              {activeTab === "fans" && (
                <FansTab
                  brand={activeBrand}
                  niche={activeProfileData.niche}
                  editing={editing}
                  onBrandChange={setDraft}
                />
              )}
              {activeTab === "refs" && (
                <RefsTab brand={activeBrand} onChange={handleSourcesChange} />
              )}
            </>
          )}
        </div>
      </div>

      {showAdd && <AddKOLModal onAdd={addProfile} onClose={() => setShowAdd(false)} linkedProfiles={profiles} />}
    </div>
  );
}
