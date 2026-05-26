"use client";

import { useState, useCallback } from "react";
import {
  Edit3, Clock, Hash, Palette, Target, Mic2, BookOpen,
  Plus, Check, ChevronRight, Zap, User, X, Save, Link,
  Globe, Users, UserCircle, Trash2, ToggleLeft, ToggleRight,
  ExternalLink,
} from "lucide-react";
import {
  PROFILES, KOL_BRANDS,
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
  { id: "style",   label: "Phong cách viết",      icon: Edit3    },
  { id: "brand",   label: "Hình ảnh thương hiệu", icon: Palette  },
  { id: "content", label: "Nội dung",             icon: BookOpen },
  { id: "posting", label: "Lịch & CTA",           icon: Clock    },
  { id: "sources", label: "Nguồn tham khảo",      icon: Link     },
] as const;
type Tab = typeof TAB_ITEMS[number]["id"];

const NICHE_OPTIONS = [
  { v: "beauty",    l: "Beauty & Skincare", color: "#F5A623" },
  { v: "tech",      l: "Công nghệ",         color: "#2C5AA0" },
  { v: "mom",       l: "Mẹ & Bé",          color: "#3FB1B5" },
  { v: "lifestyle", l: "Lifestyle",         color: "#8B5CF6" },
  { v: "food",      l: "Ẩm thực",          color: "#EF4444" },
  { v: "fitness",   l: "Fitness",           color: "#10B981" },
  { v: "business",  l: "Kinh doanh",        color: "#F59E0B" },
  { v: "other",     l: "Khác",              color: "#6B7280" },
];

const AVATAR_COLORS = [
  "#F5A623", "#2C5AA0", "#3FB1B5", "#8B5CF6",
  "#EF4444", "#10B981", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6",
];

const STEP_LABELS = ["Thông tin cơ bản", "Phong cách viết", "Hình ảnh thương hiệu", "Nội dung & Lịch"];

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

// ─── View tabs ────────────────────────────────────────────────────────────────

function StyleView({ brand }: { brand: KOLBrand }) {
  return (
    <div className="space-y-4">
      <Section title="Giọng điệu" icon={Mic2}>
        <Field label="Tone viết">
          <div className="flex flex-wrap gap-2">
            {brand.writingTones.map((t) => <Pill key={t} text={t} color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />)}
          </div>
        </Field>
        <Field label="Mô tả phong cách">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--vt-gray-900)" }}>{brand.writingStyle}</p>
        </Field>
        <Field label="Dùng emoji">
          <Pill text={EMOJI_OPTIONS.find(e => e.v === brand.emojiUsage)?.l ?? ""} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
        </Field>
      </Section>
      <Section title="Từ ngữ" icon={BookOpen}>
        <Field label="Nên dùng">
          <div className="flex flex-wrap gap-1.5">{brand.vocabularyUse.map((w) => <Pill key={w} text={w} color="#16a34a" bg="rgba(22,163,74,0.1)" />)}</div>
        </Field>
        <Field label="Tránh dùng">
          <div className="flex flex-wrap gap-1.5">{brand.vocabularyAvoid.map((w) => <Pill key={w} text={w} color="#dc2626" bg="rgba(220,38,38,0.08)" />)}</div>
        </Field>
      </Section>
    </div>
  );
}

function BrandView({ brand }: { brand: KOLBrand }) {
  return (
    <div className="space-y-4">
      <Section title="Nhận diện thương hiệu" icon={Palette}>
        <Field label="Tagline">
          <p className="text-[15px] font-semibold" style={{ color: "var(--vt-navy)" }}>{brand.tagline}</p>
        </Field>
        <Field label="Bio">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--vt-gray-900)" }}>{brand.bio}</p>
        </Field>
        <Field label="Màu thương hiệu">
          <div className="flex items-center gap-2.5">
            {brand.brandColors.map((c) => (
              <div key={c} className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-xl border-2 border-white"
                  style={{ background: c, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                <span className="font-mono text-[10px]" style={{ color: "var(--vt-gray-500)" }}>{c}</span>
              </div>
            ))}
          </div>
        </Field>
        <Field label="Phong cách hình ảnh">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--vt-gray-900)" }}>{brand.visualStyle}</p>
        </Field>
        <Field label="Cá tính thương hiệu">
          <div className="flex flex-wrap gap-2">{brand.brandPersonality.map((t) => <Pill key={t} text={t} color="#7c3aed" bg="rgba(124,58,237,0.08)" />)}</div>
        </Field>
      </Section>
      <Section title="Đối tượng mục tiêu" icon={Target}>
        <Field label="Target audience">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--vt-gray-900)" }}>{brand.targetAudience}</p>
        </Field>
      </Section>
    </div>
  );
}

function ContentView({ brand }: { brand: KOLBrand }) {
  return (
    <div className="space-y-4">
      <Section title="Content Pillars" icon={BookOpen}>
        <Field label="Phân bổ nội dung">
          <div className="space-y-3">
            {brand.contentPillars.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{p.name}</span>
                    <span className="text-[11.5px] ml-2" style={{ color: "var(--vt-gray-500)" }}>{p.description}</span>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: "var(--vt-blue)" }}>{p.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: "var(--vt-gradient-sun)" }} />
                </div>
              </div>
            ))}
          </div>
        </Field>
      </Section>
      <Section title="Hashtag mặc định" icon={Hash}>
        <Field label="Dùng cho mọi bài">
          <div className="flex flex-wrap gap-2">
            {brand.defaultHashtags.map((h) => (
              <span key={h} className="font-mono text-[12.5px] px-2.5 py-1 rounded-lg font-medium"
                style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>{h}</span>
            ))}
          </div>
        </Field>
      </Section>
    </div>
  );
}

function PostingView({ brand }: { brand: KOLBrand }) {
  return (
    <div className="space-y-4">
      <Section title="Lịch đăng bài" icon={Clock}>
        <Field label="Tần suất">
          <Pill text={brand.postingFrequency} color="var(--vt-blue)" bg="rgba(44,90,160,0.08)" />
        </Field>
        <Field label="Khung giờ tốt nhất">
          <div className="flex flex-wrap gap-2">
            {brand.bestPostingTimes.map((t) => (
              <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(245,166,35,0.12)", color: "#b45309" }}>
                <Clock size={12} /><span className="text-[12.5px] font-semibold">{t}</span>
              </div>
            ))}
          </div>
        </Field>
      </Section>
      <Section title="CTA Templates" icon={Zap}>
        <Field label="Call-to-action mẫu">
          <div className="space-y-2">
            {brand.ctaTemplates.map((cta, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                  style={{ background: "var(--vt-blue)" }}>{i + 1}</span>
                <span className="text-[13px]" style={{ color: "var(--vt-gray-900)" }}>{cta}</span>
              </div>
            ))}
          </div>
        </Field>
      </Section>
    </div>
  );
}

// ─── Sources tab (always editable CRUD) ──────────────────────────────────────

function SourcesTab({ brand, onChange }: { brand: KOLBrand; onChange: (b: KOLBrand) => void }) {
  const [adding, setAdding] = useState(false);
  const [newLink, setNewLink] = useState<{ type: SourceLinkType; label: string; url: string }>({
    type: "facebook_profile", label: "", url: "",
  });

  const addLink = () => {
    if (!newLink.url || !newLink.label) return;
    const link: SourceLink = { id: "sl" + Date.now(), ...newLink, active: true };
    onChange({ ...brand, sourceLinks: [...brand.sourceLinks, link] });
    setNewLink({ type: "facebook_profile", label: "", url: "" });
    setAdding(false);
  };

  const removeLink = (id: string) =>
    onChange({ ...brand, sourceLinks: brand.sourceLinks.filter((l) => l.id !== id) });

  const toggleLink = (id: string) =>
    onChange({ ...brand, sourceLinks: brand.sourceLinks.map((l) => l.id === id ? { ...l, active: !l.active } : l) });

  return (
    <div className="space-y-4">
      <div className="vt-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
          <div>
            <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>Nguồn tham khảo</h3>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>
              Website hoặc profile Facebook AI sẽ lấy cảm hứng nội dung
            </p>
          </div>
          <button className="vt-btn-primary" onClick={() => setAdding(true)}>
            <Plus size={14} /> Thêm nguồn
          </button>
        </div>

        {/* Add form */}
        {adding && (
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--vt-gray-100)", background: "rgba(44,90,160,0.03)" }}>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>Loại</label>
                <select className="vt-input text-[12.5px]" value={newLink.type}
                  onChange={(e) => setNewLink((p) => ({ ...p, type: e.target.value as SourceLinkType }))}>
                  {(Object.keys(SOURCE_TYPE_META) as SourceLinkType[]).map((k) => (
                    <option key={k} value={k}>{SOURCE_TYPE_META[k].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>Tên hiển thị</label>
                <input className="vt-input text-[12.5px]" placeholder="VD: Blog cá nhân"
                  value={newLink.label} onChange={(e) => setNewLink((p) => ({ ...p, label: e.target.value }))} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>URL</label>
                <input className="vt-input text-[12.5px] font-mono" placeholder="https://..."
                  value={newLink.url} onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button className="vt-btn-secondary" onClick={() => setAdding(false)}>Huỷ</button>
              <button className="vt-btn-primary"
                disabled={!newLink.label || !newLink.url}
                style={{ opacity: (!newLink.label || !newLink.url) ? 0.5 : 1 }}
                onClick={addLink}>
                <Check size={13} /> Thêm
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {brand.sourceLinks.length === 0 && !adding ? (
          <div className="text-center py-12">
            <Link size={28} className="mx-auto mb-2" style={{ color: "var(--vt-gray-500)" }} />
            <p className="text-[13px] font-medium mb-1" style={{ color: "var(--vt-navy)" }}>Chưa có nguồn nào</p>
            <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>Thêm website hoặc profile Facebook để AI lấy cảm hứng</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wide border-b"
                style={{ color: "var(--vt-gray-500)", background: "var(--vt-bg)", borderColor: "var(--vt-gray-100)" }}>
                <th className="text-left px-5 py-2.5">Tên</th>
                <th className="text-left px-4 py-2.5">Loại</th>
                <th className="text-left px-4 py-2.5">URL</th>
                <th className="text-center px-4 py-2.5">Trạng thái</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {brand.sourceLinks.map((link, idx) => {
                const meta = SOURCE_TYPE_META[link.type];
                const Icon = meta.icon;
                return (
                  <tr key={link.id} className="hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: idx < brand.sourceLinks.length - 1 ? "1px solid var(--vt-gray-100)" : "none" }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: meta.bg, color: meta.color }}>
                          <Icon size={13} />
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: "var(--vt-navy)" }}>{link.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11.5px] truncate max-w-[200px]" style={{ color: "var(--vt-gray-500)" }}>
                          {link.url}
                        </span>
                        <a href={link.url} target="_blank" rel="noopener noreferrer"
                          className="p-0.5 rounded hover:bg-gray-100 transition-colors">
                          <ExternalLink size={11} style={{ color: "var(--vt-gray-500)" }} />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleLink(link.id)} title={link.active ? "Đang bật" : "Đang tắt"}>
                        {link.active
                          ? <ToggleRight size={22} style={{ color: "#16a34a" }} />
                          : <ToggleLeft size={22} style={{ color: "var(--vt-gray-500)" }} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                        onClick={() => removeLink(link.id)}>
                        <Trash2 size={13} style={{ color: "#dc2626" }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

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

// ─── Edit tab views ────────────────────────────────────────────────────────────

function StyleEdit({ draft, setDraft }: { draft: KOLBrand; setDraft: (b: KOLBrand) => void }) {
  return (
    <div className="space-y-4">
      <Section title="Giọng điệu" icon={Mic2}>
        <Field label="Tone viết (chọn nhiều)">
          <div className="flex flex-wrap gap-2 mb-2">
            {TONE_OPTIONS.map((t) => {
              const active = draft.writingTones.includes(t);
              return (
                <button key={t}
                  className="px-3 py-1.5 rounded-full text-[12px] font-medium border-2 transition-colors"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.08)" : "white",
                    color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                  }}
                  onClick={() => setDraft({
                    ...draft,
                    writingTones: active
                      ? draft.writingTones.filter((x) => x !== t)
                      : [...draft.writingTones, t],
                  })}>
                  {active && <Check size={10} className="inline mr-1" />}{t}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Mô tả phong cách">
          <textarea className="vt-input vt-textarea text-[13px]" rows={4}
            value={draft.writingStyle}
            onChange={(e) => setDraft({ ...draft, writingStyle: e.target.value })} />
        </Field>
        <Field label="Dùng emoji">
          <div className="flex gap-2">
            {EMOJI_OPTIONS.map(({ v, l }) => (
              <button key={v}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium border-2 transition-colors"
                style={{
                  borderColor: draft.emojiUsage === v ? "var(--vt-blue)" : "var(--vt-gray-100)",
                  background: draft.emojiUsage === v ? "rgba(44,90,160,0.08)" : "white",
                  color: draft.emojiUsage === v ? "var(--vt-blue)" : "var(--vt-gray-500)",
                }}
                onClick={() => setDraft({ ...draft, emojiUsage: v })}>{l}
              </button>
            ))}
          </div>
        </Field>
      </Section>
      <Section title="Từ ngữ" icon={BookOpen}>
        <Field label="Nên dùng">
          <ChipInput value={draft.vocabularyUse} color="#16a34a" bg="rgba(22,163,74,0.1)"
            placeholder="Thêm từ rồi Enter"
            onChange={(v) => setDraft({ ...draft, vocabularyUse: v })} />
        </Field>
        <Field label="Tránh dùng">
          <ChipInput value={draft.vocabularyAvoid} color="#dc2626" bg="rgba(220,38,38,0.08)"
            placeholder="Thêm từ rồi Enter"
            onChange={(v) => setDraft({ ...draft, vocabularyAvoid: v })} />
        </Field>
      </Section>
    </div>
  );
}

function BrandEdit({ draft, setDraft }: { draft: KOLBrand; setDraft: (b: KOLBrand) => void }) {
  return (
    <div className="space-y-4">
      <Section title="Nhận diện thương hiệu" icon={Palette}>
        <Field label="Tagline">
          <input className="vt-input text-[13px]" value={draft.tagline}
            onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
        </Field>
        <Field label="Bio">
          <textarea className="vt-input vt-textarea text-[13px]" rows={4} value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
        </Field>
        <Field label="Màu thương hiệu">
          <div className="flex flex-wrap items-center gap-3">
            {draft.brandColors.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <input type="color" value={c} className="w-9 h-9 rounded-xl cursor-pointer border-0 p-0"
                  onChange={(e) => {
                    const colors = [...draft.brandColors];
                    colors[i] = e.target.value;
                    setDraft({ ...draft, brandColors: colors });
                  }} />
                <span className="font-mono text-[10px]" style={{ color: "var(--vt-gray-500)" }}>{c}</span>
              </div>
            ))}
            <button className="w-9 h-9 rounded-xl border-2 border-dashed flex items-center justify-center hover:bg-gray-50"
              style={{ borderColor: "var(--vt-gray-100)" }}
              onClick={() => setDraft({ ...draft, brandColors: [...draft.brandColors, "#888888"] })}>
              <Plus size={14} style={{ color: "var(--vt-gray-500)" }} />
            </button>
          </div>
        </Field>
        <Field label="Phong cách hình ảnh">
          <textarea className="vt-input vt-textarea text-[13px]" rows={3} value={draft.visualStyle}
            onChange={(e) => setDraft({ ...draft, visualStyle: e.target.value })} />
        </Field>
        <Field label="Cá tính thương hiệu">
          <ChipInput value={draft.brandPersonality} color="#7c3aed" bg="rgba(124,58,237,0.08)"
            placeholder="Thêm tính cách rồi Enter"
            onChange={(v) => setDraft({ ...draft, brandPersonality: v })} />
        </Field>
      </Section>
      <Section title="Đối tượng mục tiêu" icon={Target}>
        <Field label="Target audience">
          <textarea className="vt-input vt-textarea text-[13px]" rows={3} value={draft.targetAudience}
            onChange={(e) => setDraft({ ...draft, targetAudience: e.target.value })} />
        </Field>
      </Section>
    </div>
  );
}

function ContentEdit({ draft, setDraft }: { draft: KOLBrand; setDraft: (b: KOLBrand) => void }) {
  return (
    <div className="space-y-4">
      <Section title="Content Pillars" icon={BookOpen}>
        <Field label="Phân bổ nội dung">
          <div className="space-y-3">
            {draft.contentPillars.map((p, i) => (
              <div key={i} className="p-3 rounded-xl border" style={{ borderColor: "var(--vt-gray-100)" }}>
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <input className="vt-input text-[12.5px] col-span-4" placeholder="Tên pillar"
                    value={p.name}
                    onChange={(e) => {
                      const cp = [...draft.contentPillars];
                      cp[i] = { ...cp[i], name: e.target.value };
                      setDraft({ ...draft, contentPillars: cp });
                    }} />
                  <input className="vt-input text-[12.5px] col-span-6" placeholder="Mô tả"
                    value={p.description}
                    onChange={(e) => {
                      const cp = [...draft.contentPillars];
                      cp[i] = { ...cp[i], description: e.target.value };
                      setDraft({ ...draft, contentPillars: cp });
                    }} />
                  <div className="col-span-2 flex items-center gap-1.5">
                    <input type="number" min={0} max={100} className="vt-input text-[12.5px] text-center w-full"
                      value={p.pct}
                      onChange={(e) => {
                        const cp = [...draft.contentPillars];
                        cp[i] = { ...cp[i], pct: Math.min(100, Math.max(0, +e.target.value)) };
                        setDraft({ ...draft, contentPillars: cp });
                      }} />
                    <span className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: "var(--vt-gradient-sun)" }} />
                </div>
                <button className="mt-2 text-[11.5px] text-red-500 hover:underline"
                  onClick={() => setDraft({ ...draft, contentPillars: draft.contentPillars.filter((_, j) => j !== i) })}>
                  Xoá pillar
                </button>
              </div>
            ))}
            <button className="vt-btn-secondary w-full justify-center"
              onClick={() => setDraft({ ...draft, contentPillars: [...draft.contentPillars, { name: "", description: "", pct: 0 }] })}>
              <Plus size={13} /> Thêm pillar
            </button>
          </div>
        </Field>
      </Section>
      <Section title="Hashtag mặc định" icon={Hash}>
        <Field label="Dùng cho mọi bài">
          <ChipInput value={draft.defaultHashtags} color="var(--vt-blue)" bg="rgba(44,90,160,0.08)"
            placeholder="#hashtag rồi Enter"
            onChange={(v) => setDraft({ ...draft, defaultHashtags: v })} />
        </Field>
      </Section>
    </div>
  );
}

function PostingEdit({ draft, setDraft }: { draft: KOLBrand; setDraft: (b: KOLBrand) => void }) {
  return (
    <div className="space-y-4">
      <Section title="Lịch đăng bài" icon={Clock}>
        <Field label="Tần suất">
          <input className="vt-input text-[13px]" value={draft.postingFrequency}
            onChange={(e) => setDraft({ ...draft, postingFrequency: e.target.value })} />
        </Field>
        <Field label="Khung giờ tốt nhất">
          <ChipInput value={draft.bestPostingTimes} color="#b45309" bg="rgba(245,166,35,0.12)"
            placeholder="VD: 07:00–09:00 rồi Enter"
            onChange={(v) => setDraft({ ...draft, bestPostingTimes: v })} />
        </Field>
      </Section>
      <Section title="CTA Templates" icon={Zap}>
        <Field label="Call-to-action mẫu">
          <div className="space-y-2">
            {draft.ctaTemplates.map((cta, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="vt-input text-[13px] flex-1" value={cta}
                  onChange={(e) => {
                    const t = [...draft.ctaTemplates];
                    t[i] = e.target.value;
                    setDraft({ ...draft, ctaTemplates: t });
                  }} />
                <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                  onClick={() => setDraft({ ...draft, ctaTemplates: draft.ctaTemplates.filter((_, j) => j !== i) })}>
                  <X size={13} style={{ color: "#dc2626" }} />
                </button>
              </div>
            ))}
            <button className="vt-btn-secondary w-full justify-center"
              onClick={() => setDraft({ ...draft, ctaTemplates: [...draft.ctaTemplates, ""] })}>
              <Plus size={13} /> Thêm CTA
            </button>
          </div>
        </Field>
      </Section>
    </div>
  );
}

// ─── Add KOL Modal ─────────────────────────────────────────────────────────────

function AddKOLModal({ onAdd, onClose }: {
  onAdd: (p: KOLProfile, b: KOLBrand) => void;
  onClose: () => void;
}) {
  const TOTAL = 4;
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName]               = useState("");
  const [niche, setNiche]             = useState("");
  const [nicheCustom, setNicheCustom] = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [tagline, setTagline]         = useState("");
  const [bio, setBio]                 = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  // Step 2
  const [tones, setTones]               = useState<string[]>([]);
  const [writingStyle, setWritingStyle] = useState("");
  const [emojiUsage, setEmojiUsage]     = useState<KOLBrand["emojiUsage"]>("moderate");
  const [vocabUse, setVocabUse]         = useState<string[]>([]);
  const [vocabAvoid, setVocabAvoid]     = useState<string[]>([]);

  // Step 3
  const [brandColors, setBrandColors]           = useState<string[]>(["#F5A623"]);
  const [visualStyle, setVisualStyle]           = useState("");
  const [brandPersonality, setBrandPersonality] = useState<string[]>([]);
  const [defaultHashtags, setDefaultHashtags]   = useState<string[]>([]);

  // Step 4
  const [pillars, setPillars] = useState([
    { name: "", description: "", pct: 40 },
    { name: "", description: "", pct: 30 },
  ]);
  const [postingFrequency, setPostingFrequency] = useState("1 bài/ngày");
  const [bestTimes, setBestTimes]               = useState<string[]>([]);
  const [ctaTemplates, setCtaTemplates]         = useState<string[]>([""]);

  const initials = name.trim().split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "KL";
  const step1Valid = name.trim().length > 0 && niche.length > 0 && (niche !== "other" || nicheCustom.trim().length > 0);
  const step2Valid = tones.length > 0;
  const canNext = step === 1 ? step1Valid : step === 2 ? step2Valid : true;

  const handleCreate = () => {
    const nicheOpt = NICHE_OPTIONS.find((o) => o.v === niche);
    const nicheLabel = niche === "other" ? nicheCustom.trim() : (nicheOpt?.l ?? niche);
    const id = "p" + Date.now();

    const newProfile: KOLProfile = {
      id,
      name: name.trim(),
      niche: niche as KOLProfile["niche"],
      nicheLabel,
      avatarColor,
      initials,
      followers: "0",
      quotaUsed: 0,
      quotaTotal: 200,
      status: "active",
    };

    const newBrand: KOLBrand = {
      profileId: id,
      tagline, bio, targetAudience,
      brandColors,
      writingTones: tones,
      writingStyle,
      vocabularyUse: vocabUse,
      vocabularyAvoid: vocabAvoid,
      emojiUsage,
      contentPillars: pillars.filter((p) => p.name.trim()),
      defaultHashtags,
      ctaTemplates: ctaTemplates.filter((c) => c.trim()),
      visualStyle,
      brandPersonality,
      postingFrequency,
      bestPostingTimes: bestTimes,
      sourceLinks: [],
    };

    onAdd(newProfile, newBrand);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="vt-card w-[600px] max-h-[88vh] shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--vt-gray-100)" }}>
          <div>
            <h3 className="text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>Thêm Profile KOL</h3>
            <p className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
              {STEP_LABELS[step - 1]} · Bước {step}/{TOTAL}
            </p>
          </div>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100"
            style={{ color: "var(--vt-gray-500)" }} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex px-6 pt-3 gap-1.5 shrink-0">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: i + 1 <= step ? "var(--vt-blue)" : "var(--vt-gray-100)" }} />
          ))}
        </div>

        {/* Scrollable body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">

          {/* ── Step 1: Basic info ── */}
          {step === 1 && (<>
            <div>
              <label className="block text-[11.5px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>Màu avatar</label>
              <div className="flex items-center gap-2 flex-wrap">
                {AVATAR_COLORS.map((c) => (
                  <button key={c}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      background: c,
                      outline: avatarColor === c ? `3px solid var(--vt-navy)` : "3px solid transparent",
                      outlineOffset: "2px",
                    }}
                    onClick={() => setAvatarColor(c)} />
                ))}
                <div className="ml-1 w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                  style={{ background: avatarColor }}>
                  {initials}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Tên KOL *</label>
              <input className="vt-input text-[13px]" placeholder="Vd: Linh Nguyễn Beauty"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>Lĩnh vực / Niche *</label>
              <div className="grid grid-cols-4 gap-2">
                {NICHE_OPTIONS.map((o) => (
                  <button key={o.v}
                    className="px-2 py-2.5 rounded-xl text-[12px] font-medium border-2 transition-colors text-center"
                    style={{
                      borderColor: niche === o.v ? o.color : "var(--vt-gray-100)",
                      background: niche === o.v ? o.color + "18" : "white",
                      color: niche === o.v ? o.color : "var(--vt-gray-500)",
                    }}
                    onClick={() => setNiche(o.v)}>
                    {o.l}
                  </button>
                ))}
              </div>
              {niche === "other" && (
                <input className="vt-input text-[13px] mt-2" placeholder="Nhập tên lĩnh vực..."
                  value={nicheCustom} onChange={(e) => setNicheCustom(e.target.value)} />
              )}
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Tagline</label>
              <input className="vt-input text-[13px]" placeholder="Câu slogan ngắn gọn"
                value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Bio / Giới thiệu</label>
              <textarea className="vt-input vt-textarea text-[13px]" rows={3}
                placeholder="Mô tả ngắn về KOL này..."
                value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Đối tượng mục tiêu</label>
              <input className="vt-input text-[13px]" placeholder="Vd: Nữ 18–34, quan tâm skincare, sống đô thị"
                value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
            </div>
          </>)}

          {/* ── Step 2: Writing style ── */}
          {step === 2 && (<>
            <div>
              <label className="block text-[11.5px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>
                Giọng điệu khi viết * <span className="font-normal" style={{ color: "var(--vt-gray-500)" }}>(chọn ít nhất 1)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((t) => {
                  const active = tones.includes(t);
                  return (
                    <button key={t}
                      className="px-3 py-1.5 rounded-full text-[12px] font-medium border-2 transition-colors"
                      style={{
                        borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                        background: active ? "rgba(44,90,160,0.08)" : "white",
                        color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                      }}
                      onClick={() => setTones((p) => active ? p.filter((x) => x !== t) : [...p, t])}>
                      {active && <Check size={10} className="inline mr-1" />}{t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Mô tả phong cách viết</label>
              <textarea className="vt-input vt-textarea text-[13px]" rows={3}
                placeholder="VD: Viết như nói chuyện bạn bè, câu ngắn, dễ đọc trên mobile..."
                value={writingStyle} onChange={(e) => setWritingStyle(e.target.value)} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>Dùng emoji</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map(({ v, l }) => (
                  <button key={v}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium border-2 transition-colors"
                    style={{
                      borderColor: emojiUsage === v ? "var(--vt-blue)" : "var(--vt-gray-100)",
                      background: emojiUsage === v ? "rgba(44,90,160,0.08)" : "white",
                      color: emojiUsage === v ? "var(--vt-blue)" : "var(--vt-gray-500)",
                    }}
                    onClick={() => setEmojiUsage(v)}>{l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Từ ngữ nên dùng</label>
              <ChipInput value={vocabUse} color="#16a34a" bg="rgba(22,163,74,0.1)"
                placeholder="Thêm từ rồi Enter" onChange={setVocabUse} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Từ ngữ tránh dùng</label>
              <ChipInput value={vocabAvoid} color="#dc2626" bg="rgba(220,38,38,0.08)"
                placeholder="Thêm từ rồi Enter" onChange={setVocabAvoid} />
            </div>
          </>)}

          {/* ── Step 3: Brand identity ── */}
          {step === 3 && (<>
            <div>
              <label className="block text-[11.5px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>Màu thương hiệu</label>
              <div className="flex flex-wrap items-center gap-3">
                {brandColors.map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <input type="color" value={c} className="w-9 h-9 rounded-xl cursor-pointer border-0 p-0"
                      onChange={(e) => {
                        const arr = [...brandColors];
                        arr[i] = e.target.value;
                        setBrandColors(arr);
                      }} />
                    <span className="font-mono text-[10px]" style={{ color: "var(--vt-gray-500)" }}>{c}</span>
                  </div>
                ))}
                {brandColors.length < 5 && (
                  <button className="w-9 h-9 rounded-xl border-2 border-dashed flex items-center justify-center hover:bg-gray-50"
                    style={{ borderColor: "var(--vt-gray-100)" }}
                    onClick={() => setBrandColors((p) => [...p, "#888888"])}>
                    <Plus size={14} style={{ color: "var(--vt-gray-500)" }} />
                  </button>
                )}
                {brandColors.length > 1 && (
                  <button className="text-[11px] text-red-500 hover:underline"
                    onClick={() => setBrandColors((p) => p.slice(0, -1))}>Xoá bớt</button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Phong cách hình ảnh</label>
              <textarea className="vt-input vt-textarea text-[13px]" rows={2}
                placeholder="VD: Tone màu ấm, ảnh sáng tự nhiên, flat-lay sản phẩm..."
                value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Cá tính thương hiệu</label>
              <ChipInput value={brandPersonality} color="#7c3aed" bg="rgba(124,58,237,0.08)"
                placeholder="VD: Đáng tin cậy, Gần gũi..." onChange={setBrandPersonality} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Hashtag mặc định</label>
              <ChipInput value={defaultHashtags} color="var(--vt-blue)" bg="rgba(44,90,160,0.08)"
                placeholder="#hashtag rồi Enter" onChange={setDefaultHashtags} />
            </div>
          </>)}

          {/* ── Step 4: Content & Schedule ── */}
          {step === 4 && (<>
            <div>
              <label className="block text-[11.5px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>Content Pillars</label>
              <div className="space-y-2">
                {pillars.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl border" style={{ borderColor: "var(--vt-gray-100)" }}>
                    <div className="grid grid-cols-12 gap-2 mb-1.5">
                      <input className="vt-input text-[12.5px] col-span-4" placeholder="Tên pillar"
                        value={p.name}
                        onChange={(e) => { const cp = [...pillars]; cp[i] = { ...cp[i], name: e.target.value }; setPillars(cp); }} />
                      <input className="vt-input text-[12.5px] col-span-6" placeholder="Mô tả"
                        value={p.description}
                        onChange={(e) => { const cp = [...pillars]; cp[i] = { ...cp[i], description: e.target.value }; setPillars(cp); }} />
                      <div className="col-span-2 flex items-center gap-1">
                        <input type="number" min={0} max={100} className="vt-input text-[12.5px] text-center w-full"
                          value={p.pct}
                          onChange={(e) => { const cp = [...pillars]; cp[i] = { ...cp[i], pct: Math.min(100, Math.max(0, +e.target.value)) }; setPillars(cp); }} />
                        <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                        <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: "var(--vt-gradient-sun)" }} />
                      </div>
                      <button className="text-[11px] text-red-500 hover:underline shrink-0"
                        onClick={() => setPillars(pillars.filter((_, j) => j !== i))}>Xoá</button>
                    </div>
                  </div>
                ))}
                {pillars.length < 5 && (
                  <button className="vt-btn-secondary w-full justify-center"
                    onClick={() => setPillars([...pillars, { name: "", description: "", pct: 0 }])}>
                    <Plus size={13} /> Thêm pillar
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Tần suất đăng bài</label>
              <input className="vt-input text-[13px]" placeholder="VD: 1–2 bài/ngày"
                value={postingFrequency} onChange={(e) => setPostingFrequency(e.target.value)} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Khung giờ đăng tốt nhất</label>
              <ChipInput value={bestTimes} color="#b45309" bg="rgba(245,166,35,0.12)"
                placeholder="VD: 07:00–09:00 rồi Enter" onChange={setBestTimes} />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>CTA Templates</label>
              <div className="space-y-2">
                {ctaTemplates.map((cta, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input className="vt-input text-[13px] flex-1" placeholder={`CTA ${i + 1}`}
                      value={cta}
                      onChange={(e) => { const t = [...ctaTemplates]; t[i] = e.target.value; setCtaTemplates(t); }} />
                    {ctaTemplates.length > 1 && (
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                        onClick={() => setCtaTemplates(ctaTemplates.filter((_, j) => j !== i))}>
                        <X size={13} style={{ color: "#dc2626" }} />
                      </button>
                    )}
                  </div>
                ))}
                <button className="vt-btn-secondary w-full justify-center"
                  onClick={() => setCtaTemplates([...ctaTemplates, ""])}>
                  <Plus size={13} /> Thêm CTA
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl flex items-start gap-2.5"
              style={{ background: "rgba(44,90,160,0.06)", border: "1px solid rgba(44,90,160,0.12)" }}>
              <Zap size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vt-blue)" }} />
              <p className="text-[11.5px]" style={{ color: "var(--vt-blue)" }}>
                Sau khi tạo, bổ sung thêm nguồn tham khảo và chỉnh sửa chi tiết trong trang Quản lý KOL.
              </p>
            </div>
          </>)}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t shrink-0"
          style={{ borderColor: "var(--vt-gray-100)" }}>
          <button className="vt-btn-secondary" onClick={step === 1 ? onClose : () => setStep((s) => s - 1)}>
            {step === 1 ? "Huỷ" : "← Quay lại"}
          </button>
          {step < TOTAL
            ? <button className="vt-btn-primary"
                disabled={!canNext}
                style={{ opacity: canNext ? 1 : 0.45 }}
                onClick={() => setStep((s) => s + 1)}>
                Tiếp theo →
              </button>
            : <button className="vt-btn-primary" onClick={handleCreate}>
                <Check size={14} /> Tạo Profile KOL
              </button>
          }
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
  const [activeTab, setActiveTab]   = useState<Tab>("style");
  const [editing, setEditing]       = useState(false);
  const [draft, setDraft]           = useState<KOLBrand | null>(null);
  const [showAdd, setShowAdd]       = useState(false);

  const profile = profiles.find((p) => p.id === activeProfileId)!;
  const brand   = brands.find((b) => b.profileId === activeProfileId);

  const startEdit = useCallback(() => {
    if (!brand) return;
    setDraft(JSON.parse(JSON.stringify(brand)));
    setEditing(true);
  }, [brand]);

  const saveEdit = useCallback(() => {
    if (!draft) return;
    setBrands((prev) => prev.map((b) => b.profileId === draft.profileId ? draft : b));
    setEditing(false);
    setDraft(null);
  }, [draft]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setDraft(null);
  }, []);

  const handleSourcesChange = useCallback((updated: KOLBrand) => {
    setBrands((prev) => prev.map((b) => b.profileId === updated.profileId ? updated : b));
  }, []);

  const addProfile = useCallback((newProfile: KOLProfile, newBrand: KOLBrand) => {
    setProfiles((prev) => [...prev, newProfile]);
    setBrands((prev) => [...prev, newBrand]);
    setActiveProfileId(newProfile.id);
    setActiveTab("style");
    setShowAdd(false);
  }, []);

  const switchProfile = (id: string) => {
    if (editing) cancelEdit();
    setActiveProfileId(id);
    setActiveTab("style");
  };

  const activeBrand = editing && draft ? draft : brand;

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
            <div className="flex items-center gap-2">
              {activeBrand?.brandColors.map((c) => (
                <div key={c} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
              ))}
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
                  {id === "sources" && brand && (
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: active ? "rgba(255,255,255,0.2)" : "rgba(44,90,160,0.1)", color: active ? "white" : "var(--vt-blue)" }}>
                      {brand.sourceLinks.filter(l => l.active).length}
                    </span>
                  )}
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
              {/* View mode */}
              {!editing && activeTab === "style"   && <StyleView   brand={activeBrand} />}
              {!editing && activeTab === "brand"   && <BrandView   brand={activeBrand} />}
              {!editing && activeTab === "content" && <ContentView brand={activeBrand} />}
              {!editing && activeTab === "posting" && <PostingView brand={activeBrand} />}
              {/* Sources always in manage mode */}
              {activeTab === "sources" && (
                <SourcesTab brand={activeBrand} onChange={handleSourcesChange} />
              )}

              {/* Edit mode */}
              {editing && draft && activeTab === "style"   && <StyleEdit   draft={draft} setDraft={setDraft} />}
              {editing && draft && activeTab === "brand"   && <BrandEdit   draft={draft} setDraft={setDraft} />}
              {editing && draft && activeTab === "content" && <ContentEdit draft={draft} setDraft={setDraft} />}
              {editing && draft && activeTab === "posting" && <PostingEdit draft={draft} setDraft={setDraft} />}
            </>
          )}
        </div>
      </div>

      {showAdd && <AddKOLModal onAdd={addProfile} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
