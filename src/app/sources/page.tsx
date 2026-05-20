"use client";

import { useState } from "react";
import {
  Sparkles, Type, Image as ImageIcon, Images, Video, RefreshCcw, Check, Clock,
  Upload, FileText, Lightbulb, Save, ListChecks, X, Edit3, Tags, Wand2
} from "lucide-react";
import { AIScoreBadge } from "@/components/shared/ai-score-badge";
import {
  SAMPLE_VARIANTS, CRAWLED_SOURCES, REWRITE_TEMPLATES, type PostVariant
} from "@/lib/mock-data";

type Tab = "ai" | "manual" | "queue" | "rewrite";
type Format = "text" | "image" | "carousel" | "video";

const FORMAT_OPTIONS: { value: Format; label: string; icon: typeof Type }[] = [
  { value: "text", label: "Text", icon: Type },
  { value: "image", label: "Ảnh", icon: ImageIcon },
  { value: "carousel", label: "Carousel", icon: Images },
  { value: "video", label: "Video", icon: Video },
];

export default function SourcesPage() {
  const [tab, setTab] = useState<Tab>("ai");

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-5 p-1 rounded-xl vt-card w-fit">
        {[
          { v: "ai", l: "AI Tạo Bài", icon: Sparkles },
          { v: "manual", l: "Thêm Thủ Công", icon: Edit3 },
          { v: "queue", l: "Hàng Chờ Crawl", icon: ListChecks },
          { v: "rewrite", l: "AI Viết Lại", icon: Wand2 },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.v;
          return (
            <button
              key={t.v}
              onClick={() => setTab(t.v as Tab)}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2"
              style={
                active
                  ? { background: "var(--vt-navy)", color: "white" }
                  : { color: "var(--vt-gray-500)" }
              }
            >
              <Icon size={14} />
              {t.l}
            </button>
          );
        })}
      </div>

      {tab === "ai" && <AIGenerateTab />}
      {tab === "manual" && <ManualTab />}
      {tab === "queue" && <QueueTab />}
      {tab === "rewrite" && <RewriteTab />}
    </div>
  );
}

function AIGenerateTab() {
  const [format, setFormat] = useState<Format>("carousel");
  const [topic, setTopic] = useState("Review serum vitamin C dưỡng da khô mùa hanh");
  const [generated, setGenerated] = useState(true);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-5 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>
          Tạo bài bằng AI
        </h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
          AI sinh 3 biến thể trong ~20 giây. Bạn chọn hoặc sinh lại.
        </p>

        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
          Chủ đề bài viết
        </label>
        <textarea
          className="vt-input vt-textarea text-[13.5px]"
          placeholder="Nhập chủ đề bài viết..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
        />

        <div className="mt-4">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>
            Định dạng
          </label>
          <div className="grid grid-cols-4 gap-2">
            {FORMAT_OPTIONS.map((f) => {
              const Icon = f.icon;
              const active = format === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                    color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                  }}
                >
                  <Icon size={18} strokeWidth={2.2} />
                  <span className="text-[11.5px] font-semibold">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Tone giọng
          </label>
          <select className="vt-input text-[13px]">
            <option>Thân thiện, gần gũi</option>
            <option>Chuyên nghiệp, đáng tin</option>
            <option>Hài hước, trendy</option>
            <option>Truyền cảm hứng</option>
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button className="vt-btn-primary flex-1 justify-center" onClick={() => setGenerated(true)}>
            <Sparkles size={15} />
            Tạo 3 biến thể
          </button>
          <span className="vt-badge" style={{ background: "rgba(245,166,35,0.16)", color: "#b45309" }}>
            <Clock size={11} /> ~20 giây
          </span>
        </div>
      </div>

      <div className="col-span-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
            3 biến thể được sinh
          </h3>
          <button className="vt-btn-ghost text-[12.5px]">
            <RefreshCcw size={13} />
            Sinh lại tất cả
          </button>
        </div>

        <div className="space-y-3">
          {generated && SAMPLE_VARIANTS.map((v, idx) => (
            <VariantCard key={v.id} variant={v} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VariantCard({ variant, idx }: { variant: PostVariant; idx: number }) {
  return (
    <div className="vt-card p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center text-white"
            style={{ background: "var(--vt-blue)" }}
          >
            {idx + 1}
          </span>
          <span className="text-[12.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>
            Biến thể {idx + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AIScoreBadge score={variant.aiScore} size="sm" />
          <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
            {variant.charCount} ký tự
          </span>
        </div>
      </div>

      <div className="text-[13px] whitespace-pre-line leading-relaxed py-2 px-3 rounded-md"
        style={{ background: "var(--vt-bg)", color: "var(--vt-gray-900)" }}>
        {variant.content}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button className="vt-btn-primary flex-1 justify-center">
          <Check size={14} /> Chọn biến thể này
        </button>
        <button className="vt-btn-secondary">
          <RefreshCcw size={13} /> Sinh lại
        </button>
        <button className="vt-btn-ghost">
          <Edit3 size={13} /> Sửa
        </button>
      </div>
    </div>
  );
}

function ManualTab() {
  const [type, setType] = useState<"text" | "image" | "video">("text");

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>
          Thêm nội dung thủ công
        </h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
          Dán content có sẵn hoặc upload media — lưu vào thư viện để dùng sau.
        </p>

        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>
            Loại nội dung
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "text", l: "Văn bản", icon: FileText },
              { v: "image", l: "Ảnh", icon: ImageIcon },
              { v: "video", l: "Video", icon: Video },
            ].map((opt) => {
              const Icon = opt.icon;
              const active = type === opt.v;
              return (
                <button
                  key={opt.v}
                  onClick={() => setType(opt.v as "text" | "image" | "video")}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border-2"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                    color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                  }}
                >
                  <Icon size={16} />
                  <span className="text-[13px] font-semibold">{opt.l}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Nội dung bài viết
          </label>
          <textarea
            className="vt-input vt-textarea text-[13.5px]"
            placeholder="Dán content vào đây..."
            rows={6}
          />
        </div>

        {(type === "image" || type === "video") && (
          <div className="mb-4 border-2 border-dashed rounded-lg p-7 text-center"
            style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}>
            <Upload size={28} className="mx-auto mb-2" style={{ color: "var(--vt-gray-500)" }} />
            <div className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--vt-gray-900)" }}>
              Kéo thả {type === "image" ? "ảnh" : "video"} vào đây
            </div>
            <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
              hoặc <span style={{ color: "var(--vt-blue)" }}>chọn từ máy tính</span> · tối đa 50MB
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Tag
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="vt-badge" style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
              <Tags size={11} /> skincare
            </span>
            <span className="vt-badge" style={{ background: "rgba(245,166,35,0.16)", color: "#b45309" }}>
              <Tags size={11} /> review
            </span>
            <button className="text-[11.5px] px-2 py-1 border border-dashed rounded-md"
              style={{ borderColor: "var(--vt-gray-100)", color: "var(--vt-gray-500)" }}>
              + Thêm tag
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
          <button className="vt-btn-ghost">
            <Lightbulb size={14} /> AI gợi ý caption
          </button>
          <div className="flex items-center gap-2">
            <button className="vt-btn-secondary">Huỷ</button>
            <button className="vt-btn-primary">
              <Save size={14} /> Lưu vào thư viện
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-4 vt-card p-5">
        <h3 className="text-[14px] font-bold mb-2" style={{ color: "var(--vt-navy)" }}>
          Tip viết tốt
        </h3>
        <ul className="space-y-2.5 text-[12.5px]" style={{ color: "var(--vt-gray-500)" }}>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
              style={{ background: "var(--vt-blue)" }}>1</span>
            <span>Mở bài bằng câu gây tò mò hoặc lời chào thân thiết</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
              style={{ background: "var(--vt-blue)" }}>2</span>
            <span>Dùng số liệu cụ thể: &quot;3 tuần&quot;, &quot;giảm 40%&quot;</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
              style={{ background: "var(--vt-blue)" }}>3</span>
            <span>Chia đoạn ngắn, gạch đầu dòng dễ đọc trên mobile</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
              style={{ background: "var(--vt-blue)" }}>4</span>
            <span>Kết thúc bằng CTA: comment/inbox/save bài</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function QueueTab() {
  return (
    <div className="vt-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>
            5 nguồn đang theo dõi
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>
            Crawl tự động mỗi 2 giờ — bài mới sẽ xuất hiện ở đây
          </p>
        </div>
        <button className="vt-btn-primary">
          <RefreshCcw size={14} /> Crawl ngay
        </button>
      </div>

      <div className="space-y-2.5">
        {CRAWLED_SOURCES.map((src) => (
          <div key={src.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            style={{ borderColor: "var(--vt-gray-100)" }}>
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11.5px] font-bold text-white shrink-0"
                style={{ background: src.sourceAvatarColor }}
              >
                {src.sourceName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>
                    {src.sourceName}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                    · 2 giờ trước
                  </span>
                </div>
                <p className="text-[13px] mb-3" style={{ color: "var(--vt-gray-900)" }}>
                  {src.content}
                </p>
                {src.hasMedia && (
                  <div className="flex gap-2 mb-3">
                    <div className="w-16 h-16 rounded-md flex items-center justify-center"
                      style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                      <ImageIcon size={20} style={{ color: "var(--vt-gray-500)" }} />
                    </div>
                    <div className="w-16 h-16 rounded-md flex items-center justify-center"
                      style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                      <ImageIcon size={20} style={{ color: "var(--vt-gray-500)" }} />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button className="vt-btn-primary">
                    <Wand2 size={13} /> Viết lại
                  </button>
                  <button className="vt-btn-secondary">
                    <Check size={13} /> Dùng nguyên
                  </button>
                  <button className="vt-btn-ghost">
                    <X size={13} /> Bỏ qua
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewriteTab() {
  const [mode, setMode] = useState<"light" | "deep" | "caption">("light");

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-7 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>
          AI Viết Lại
        </h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
          Viết lại nội dung từ nguồn khác, giữ ý nhưng đổi giọng / cấu trúc.
        </p>

        <div className="flex items-center gap-1 p-1 rounded-lg mb-4 w-fit" style={{ background: "var(--vt-bg)" }}>
          {[
            { v: "light", l: "Nhẹ" },
            { v: "deep", l: "Sâu" },
            { v: "caption", l: "Caption từ media" },
          ].map((m) => {
            const active = mode === m.v;
            return (
              <button
                key={m.v}
                onClick={() => setMode(m.v as "light" | "deep" | "caption")}
                className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold transition-colors"
                style={
                  active
                    ? { background: "white", color: "var(--vt-navy)", boxShadow: "var(--vt-shadow-sm)" }
                    : { color: "var(--vt-gray-500)" }
                }
              >
                {m.l}
              </button>
            );
          })}
        </div>

        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
          Nội dung gốc
        </label>
        <textarea
          className="vt-input vt-textarea text-[13.5px] mb-4"
          rows={6}
          defaultValue="Routine skincare 6 bước cho da dầu mụn mùa hè. Bước cleansing nên dùng gì? Mình sẽ chia sẻ cho các bạn..."
        />

        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ background: "var(--vt-bg)" }}>
          <input type="checkbox" id="aff" defaultChecked className="w-4 h-4 accent-[var(--vt-blue)]" />
          <label htmlFor="aff" className="text-[13px] flex-1 cursor-pointer">
            <span className="font-semibold">Inject affiliate link</span>
            <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
              Tự động thêm link sản phẩm + UTM theo profile
            </div>
          </label>
        </div>

        <button className="vt-btn-primary w-full justify-center">
          <Wand2 size={14} /> Viết lại ngay
        </button>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[13px] font-bold" style={{ color: "var(--vt-navy)" }}>Output preview</h4>
            <AIScoreBadge score={22} size="sm" />
          </div>
          <div className="border rounded-md p-3 text-[13px] whitespace-pre-line leading-relaxed"
            style={{ background: "var(--vt-bg)", borderColor: "var(--vt-gray-100)" }}>
            Da dầu mụn vào hè là nỗi đau muôn thuở 😩 Mình từng tốn cả tháng để tìm routine ổn áp. Đây là 6 bước mình áp dụng hằng ngày:

            1. Cleansing 2 lần (oil + foam)
            2. Toner cấp nước, không cồn
            3. Serum BHA 2% mỗi tối
            4. Niacinamide 10% cấp ẩm + sáng da
            5. Kem dưỡng nhẹ gel
            6. Kem chống nắng SPF50+ ban ngày

            Cùng team da dầu thử nha! 💕
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="vt-btn-primary flex-1 justify-center"><Save size={14} /> Lưu thư viện</button>
            <button className="vt-btn-secondary"><RefreshCcw size={13} /> Sinh lại</button>
            <button className="vt-btn-ghost"><Edit3 size={13} /> Sửa</button>
          </div>
        </div>
      </div>

      <div className="col-span-5">
        <div className="vt-card p-4 mb-3">
          <h4 className="text-[13.5px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>
            Thư viện template ({REWRITE_TEMPLATES.length})
          </h4>
          <p className="text-[11.5px] mb-3" style={{ color: "var(--vt-gray-500)" }}>
            Cấu trúc viết được tối ưu cho engagement
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {REWRITE_TEMPLATES.map((tp) => (
            <div key={tp.id} className="vt-card p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
                  <FileText size={13} />
                </div>
                <div className="text-[12.5px] font-bold leading-tight" style={{ color: "var(--vt-navy)" }}>
                  {tp.name}
                </div>
              </div>
              <p className="text-[11.5px] mb-2 line-clamp-2" style={{ color: "var(--vt-gray-500)" }}>
                {tp.description}
              </p>
              <button className="text-[11.5px] font-semibold px-2 py-1 rounded w-full"
                style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>
                Áp dụng
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
