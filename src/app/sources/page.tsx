"use client";

import { useState } from "react";
import {
  Sparkles, Type, Image as ImageIcon, Images, Video, RefreshCcw, Check, Clock,
  Upload, FileText, Lightbulb, Save, X, Edit3, Tags, Wand2,
  Search, Hash, Eye, Trash2, Copy, Plus, BookOpen, Calendar,
  Table2, Film, AlignLeft, ScanLine, ListChecks, Layers,
  AlertCircle, ChevronDown, MoreHorizontal,
} from "lucide-react";
import { AIScoreBadge } from "@/components/shared/ai-score-badge";
import {
  SAMPLE_VARIANTS, CRAWLED_SOURCES, REWRITE_TEMPLATES, PROFILES, CONTENT_LIBRARY, type PostVariant,
} from "@/lib/mock-data";

type Tab = "library" | "ai" | "manual" | "queue" | "crawl" | "rewrite";
type AIMode = "desc" | "keywords" | "excel" | "image" | "video";

const TABS: { v: Tab; l: string; icon: typeof Sparkles }[] = [
  { v: "library",  l: "Kho nội dung",   icon: BookOpen   },
  { v: "ai",       l: "AI viết bài",    icon: Sparkles   },
  { v: "manual",   l: "Thêm thủ công",  icon: Edit3      },
  { v: "queue",    l: "Hàng chờ tạo",   icon: ListChecks },
  { v: "crawl",    l: "Quét bài viết",  icon: ScanLine   },
  { v: "rewrite",  l: "AI viết lại",    icon: Wand2      },
];

const MOCK_LIBRARY = CONTENT_LIBRARY;

const MOCK_QUEUE = [
  { id: "q1", type: "text",     mode: "Từ mô tả",   prompt: "Review son môi lì màu đỏ đô mùa thu",   status: "running", progress: 60, created: "10 phút trước" },
  { id: "q2", type: "carousel", mode: "Từ từ khoá", prompt: "skincare, retinol, anti-aging, serum",   status: "pending", progress: 0,  created: "25 phút trước" },
  { id: "q3", type: "image",    mode: "Tạo ảnh",    prompt: "KOL trẻ trung cầm son đỏ, phong nền sáng", status: "pending", progress: 0,  created: "30 phút trước" },
  { id: "q4", type: "text",     mode: "Từ Excel",   prompt: "Batch 12 bài từ file keywords_may.xlsx", status: "done",    progress: 100, created: "1 giờ trước" },
  { id: "q5", type: "video",    mode: "Tạo video",  prompt: "Script unboxing bộ dưỡng da summer 2025", status: "failed",  progress: 30, created: "2 giờ trước" },
];

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  ready:   { label: "Sẵn sàng", color: "#16a34a", bg: "rgba(22,163,74,0.1)"   },
  used:    { label: "Đã dùng",  color: "#6B7280", bg: "#E5E7EB"                },
  draft:   { label: "Nháp",     color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  running: { label: "Đang tạo", color: "#2C5AA0", bg: "rgba(44,90,160,0.12)"  },
  pending: { label: "Chờ",      color: "#9ca3af", bg: "#F3F4F6"               },
  done:    { label: "Xong",     color: "#16a34a", bg: "rgba(22,163,74,0.1)"   },
  failed:  { label: "Lỗi",      color: "#dc2626", bg: "rgba(220,38,38,0.1)"   },
};

const TYPE_META: Record<string, { label: string; color: string; icon: typeof Type }> = {
  text:     { label: "Text",     color: "#2C5AA0", icon: AlignLeft },
  image:    { label: "Ảnh",      color: "#8B5CF6", icon: ImageIcon },
  carousel: { label: "Carousel", color: "#0891B2", icon: Images    },
  video:    { label: "Video",    color: "#dc2626", icon: Film      },
};

export default function SourcesPage() {
  const [tab, setTab] = useState<Tab>("library");

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex items-center gap-1 mb-5 p-1 rounded-xl vt-card w-fit overflow-x-auto">
        {TABS.map(({ v, l, icon: Icon }) => {
          const active = tab === v;
          return (
            <button key={v} onClick={() => setTab(v)}
              className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
              style={active ? { background: "var(--vt-navy)", color: "white" } : { color: "var(--vt-gray-500)" }}>
              <Icon size={13} />{l}
            </button>
          );
        })}
      </div>

      {tab === "library"  && <LibraryTab />}
      {tab === "ai"       && <AITab />}
      {tab === "manual"   && <ManualTab />}
      {tab === "queue"    && <QueueTab />}
      {tab === "crawl"    && <CrawlTab />}
      {tab === "rewrite"  && <RewriteTab />}
    </div>
  );
}

// ─── Kho nội dung ─────────────────────────────────────────────────────────────

function LibraryTab() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = MOCK_LIBRARY.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType   === "all" || item.type   === filterType;
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const counts = { total: MOCK_LIBRARY.length, ready: MOCK_LIBRARY.filter(i => i.status === "ready").length, used: MOCK_LIBRARY.filter(i => i.status === "used").length };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Tổng nội dung", value: counts.total, color: "var(--vt-navy)" },
          { label: "Sẵn sàng dùng", value: counts.ready, color: "#16a34a" },
          { label: "Đã đăng bài",   value: counts.used,  color: "#6B7280" },
          { label: "Điểm AI TB",    value: "85",         color: "var(--vt-orange)" },
        ].map((s) => (
          <div key={s.label} className="vt-card p-4">
            <div className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--vt-gray-500)" }} />
            <input className="vt-input pl-8 text-[12.5px] py-1.5 w-[200px]" placeholder="Tìm nội dung..."
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
          <select className="vt-input text-[12.5px] py-1.5 w-auto"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="ready">Sẵn sàng</option>
            <option value="draft">Nháp</option>
            <option value="used">Đã dùng</option>
          </select>
        </div>
        <button className="vt-btn-primary">
          <Plus size={14} /> Thêm nội dung
        </button>
      </div>

      {/* Table */}
      <div className="vt-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--vt-gray-100)", background: "var(--vt-bg)" }}>
              {["Nội dung", "Loại", "Trạng thái", "Tags", "Điểm AI", "Ngày", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--vt-gray-500)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => {
              const typeMeta   = TYPE_META[item.type]   ?? TYPE_META.text;
              const statusMeta = STATUS_META[item.status] ?? STATUS_META.draft;
              const TypeIcon   = typeMeta.icon;
              return (
                <tr key={item.id}
                  className="transition-colors hover:bg-[var(--vt-bg)] cursor-pointer"
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid var(--vt-gray-100)" : "none" }}>
                  <td className="px-4 py-3 max-w-[320px]">
                    <p className="font-medium truncate" style={{ color: "var(--vt-navy)" }}>{item.title}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: typeMeta.color + "15", color: typeMeta.color }}>
                      <TypeIcon size={10} />{typeMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: statusMeta.bg, color: statusMeta.color }}>
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t) => (
                        <span key={t} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]"
                          style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>
                          <Hash size={9} />{t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <AIScoreBadge score={item.score} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[12px]" style={{ color: "var(--vt-gray-400)" }}>
                    {item.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-0.5">
                      <button className="vt-btn-ghost p-1.5" title="Xem"><Eye size={13} /></button>
                      <button className="vt-btn-ghost p-1.5" title="Sao chép"><Copy size={13} /></button>
                      <button className="vt-btn-ghost p-1.5" title="Xoá" style={{ color: "#dc2626" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--vt-gray-400)" }}>
            <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-[13px]">Không tìm thấy nội dung nào</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI viết bài ──────────────────────────────────────────────────────────────

const AI_MODES: { v: AIMode; l: string; icon: typeof Sparkles; desc: string }[] = [
  { v: "desc",     l: "Từ mô tả",    icon: AlignLeft, desc: "Nhập mô tả → AI tạo 3 biến thể" },
  { v: "keywords", l: "Từ từ khoá",  icon: Hash,      desc: "Danh sách từ khoá → nhiều bài" },
  { v: "excel",    l: "Từ Excel",    icon: Table2,    desc: "Upload file .xlsx → batch tạo" },
  { v: "image",    l: "Tạo ảnh",     icon: ImageIcon, desc: "Prompt → ảnh KOL cho bài đăng" },
  { v: "video",    l: "Tạo video",   icon: Film,      desc: "Script → video ngắn TikTok/Reels" },
];

function AITab() {
  const [mode, setMode] = useState<AIMode>("desc");
  const [generated, setGenerated] = useState(true);

  return (
    <div>
      {/* Mode selector */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {AI_MODES.map(({ v, l, icon: Icon, desc }) => {
          const active = mode === v;
          return (
            <button key={v} onClick={() => setMode(v)}
              className="p-3 rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                background:  active ? "rgba(44,90,160,0.06)" : "white",
              }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={15} style={{ color: active ? "var(--vt-blue)" : "var(--vt-gray-400)" }} />
                <span className="text-[12px] font-bold" style={{ color: active ? "var(--vt-blue)" : "var(--vt-navy)" }}>{l}</span>
              </div>
              <p className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>{desc}</p>
            </button>
          );
        })}
      </div>

      {mode === "desc"     && <AIDescMode generated={generated} onGenerate={() => setGenerated(true)} />}
      {mode === "keywords" && <AIKeywordsMode />}
      {mode === "excel"    && <AIExcelMode />}
      {mode === "image"    && <AIImageMode />}
      {mode === "video"    && <AIVideoMode />}
    </div>
  );
}

function AIDescMode({ generated, onGenerate }: { generated: boolean; onGenerate: () => void }) {
  const [topic, setTopic]             = useState("Review serum vitamin C dưỡng da khô mùa hanh");
  const [contentType, setContentType] = useState<"text" | "text_image">("text");
  const [useKol, setUseKol]           = useState(false);
  const [kolId, setKolId]             = useState(PROFILES[0].id);

  const selectedKol = PROFILES.find((p) => p.id === kolId)!;

  return (
    <div>
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-5 border"
        style={{ background: "rgba(44,90,160,0.06)", borderColor: "rgba(44,90,160,0.18)" }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--vt-blue)" }}
        >
          <Sparkles size={17} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-bold" style={{ color: "var(--vt-navy)" }}>
            AI sinh 3 biến thể trong ~20 giây
          </div>
          <div className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
            Nhập mô tả, chọn loại nội dung và KOL — AI viết đúng giọng từng người.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4 vt-card p-5 h-fit">
          <h3 className="text-[15px] font-bold mb-4" style={{ color: "var(--vt-navy)" }}>
            Cấu hình sinh bài
          </h3>

          {/* Content type */}
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>
            Loại nội dung
          </label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { v: "text",       l: "Chỉ text",   icon: AlignLeft, desc: "Bài viết thuần văn bản"   },
              { v: "text_image", l: "Text + ảnh",  icon: ImageIcon, desc: "Văn bản kèm ảnh minh hoạ" },
            ].map(({ v, l, icon: Icon, desc }) => {
              const active = contentType === v;
              return (
                <button
                  key={v}
                  onClick={() => setContentType(v as "text" | "text_image")}
                  className="flex flex-col items-start gap-1 p-3 rounded-lg border-2 text-left transition-all"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background:  active ? "rgba(44,90,160,0.06)" : "white",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} style={{ color: active ? "var(--vt-blue)" : "var(--vt-gray-400)" }} />
                    <span className="text-[12.5px] font-bold" style={{ color: active ? "var(--vt-blue)" : "var(--vt-navy)" }}>
                      {l}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{desc}</span>
                </button>
              );
            })}
          </div>

          {/* Description */}
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Mô tả bài viết
          </label>
          <textarea
            className="vt-input vt-textarea text-[13px] mb-4"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder="Mô tả chủ đề, sản phẩm, thông điệp muốn truyền tải..."
          />

          {/* KOL toggle header */}
          <div
            className="flex items-center justify-between px-3 py-2.5 rounded-lg mb-2 cursor-pointer"
            style={{ background: useKol ? "rgba(44,90,160,0.06)" : "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}
            onClick={() => setUseKol(!useKol)}
          >
            <div>
              <div className="text-[12.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>
                Viết theo phong cách KOL
              </div>
              <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                AI bắt chước giọng văn của KOL được chọn
              </div>
            </div>
            <button
              className="relative w-9 h-5 rounded-full transition-colors shrink-0 ml-3"
              style={{ background: useKol ? "var(--vt-blue)" : "var(--vt-gray-100)" }}
              onClick={(e) => { e.stopPropagation(); setUseKol(!useKol); }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ left: useKol ? "calc(100% - 18px)" : "2px" }}
              />
            </button>
          </div>

          {/* KOL list — only when useKol is on */}
          {useKol && (
            <div className="space-y-1.5 mb-4 pl-0.5">
              {PROFILES.map((p) => {
                const active = kolId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setKolId(p.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 text-left transition-all"
                    style={{
                      borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                      background:  active ? "rgba(44,90,160,0.06)" : "white",
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: p.avatarColor }}
                    >
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold truncate"
                        style={{ color: active ? "var(--vt-blue)" : "var(--vt-navy)" }}>
                        {p.name}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                        {p.nicheLabel} · {p.followers}
                      </div>
                    </div>
                    {active && (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "var(--vt-blue)" }}>
                        <Check size={9} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tone — only when no KOL selected */}
          {!useKol && (
            <>
              <label className="block text-[12px] font-semibold mb-1.5 mt-3" style={{ color: "var(--vt-gray-900)" }}>
                Tone giọng
              </label>
              <select className="vt-input text-[13px] mb-4">
                <option>Thân thiện, gần gũi</option>
                <option>Chuyên nghiệp, đáng tin</option>
                <option>Hài hước, trendy</option>
                <option>Truyền cảm hứng</option>
              </select>
            </>
          )}

          {useKol && <div className="mb-4" />}

          <button className="vt-btn-primary w-full justify-center" onClick={onGenerate}>
            <Sparkles size={15} /> Sinh 3 biến thể
          </button>

          <button className="vt-btn-ghost w-full justify-center mt-2 text-[12.5px]">
            <BookOpen size={13} /> Mở thư viện template
          </button>
        </div>

        <div className="col-span-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
                Biến thể được sinh
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>
                {useKol
                  ? <>Giọng văn theo phong cách <span className="font-semibold" style={{ color: selectedKol.avatarColor }}>{selectedKol.name}</span></>
                  : "Giọng văn tự do theo tone đã chọn"
                }
                {contentType === "text_image" && " · Kèm ảnh minh hoạ"}
              </p>
            </div>
            <button className="vt-btn-ghost text-[12.5px]">
              <RefreshCcw size={13} /> Sinh lại tất cả
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {generated && SAMPLE_VARIANTS.map((v, idx) => (
              <VariantCard key={v.id} variant={v} idx={idx} withImage={contentType === "text_image"} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIKeywordsMode() {
  const [keywords, setKeywords] = useState("retinol, serum, dưỡng da, anti-aging, skincare");
  const [count, setCount] = useState("5");

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-5 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>Tạo từ danh sách từ khoá</h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
          Nhập từ khoá, AI tự sinh nhiều bài khác nhau — mỗi từ khoá thành 1 bài hoặc kết hợp.
        </p>

        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
          Danh sách từ khoá <span className="font-normal text-[11px]">(ngăn cách bằng dấu phẩy)</span>
        </label>
        <textarea className="vt-input vt-textarea text-[13.5px]" rows={5}
          value={keywords} onChange={(e) => setKeywords(e.target.value)}
          placeholder="retinol, serum vitamin C, toner pH thấp, kem chống nắng SPF50..." />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Số bài cần tạo</label>
            <select className="vt-input text-[13px]" value={count} onChange={(e) => setCount(e.target.value)}>
              {["3","5","10","20"].map(n => <option key={n}>{n} bài</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Định dạng</label>
            <select className="vt-input text-[13px]">
              <option>Text</option><option>Carousel</option><option>Hỗn hợp</option>
            </select>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}>
          <p className="text-[11.5px]" style={{ color: "#b45309" }}>
            <span className="font-semibold">Ước tính:</span> {count} bài × ~25 giây = ~{Math.round(parseInt(count || "5") * 25 / 60)} phút. Sẽ chuyển vào <strong>Hàng chờ tạo</strong>.
          </p>
        </div>

        <button className="vt-btn-primary w-full justify-center mt-4">
          <Sparkles size={15} /> Tạo {count} bài
        </button>
      </div>

      <div className="col-span-7 vt-card p-5">
        <h4 className="text-[13.5px] font-bold mb-3" style={{ color: "var(--vt-navy)" }}>Xem trước kế hoạch tạo</h4>
        <div className="space-y-2">
          {keywords.split(",").filter(Boolean).slice(0, 5).map((kw, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: "var(--vt-blue)" }}>{i + 1}</span>
              <span className="text-[12.5px] flex-1" style={{ color: "var(--vt-gray-900)" }}>
                Bài về: <strong>{kw.trim()}</strong>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: "#F3F4F6", color: "#6B7280" }}>Chờ tạo</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIExcelMode() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-6 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>Tạo từ file Excel</h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
          Upload file .xlsx có cột từ khoá/chủ đề — AI tạo hàng loạt bài theo từng dòng.
        </p>

        {!uploaded ? (
          <button className="w-full border-2 border-dashed rounded-xl p-10 text-center transition-colors hover:border-blue-300"
            style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}
            onClick={() => setUploaded(true)}>
            <Upload size={32} className="mx-auto mb-3" style={{ color: "var(--vt-gray-400)" }} />
            <p className="text-[13.5px] font-semibold mb-1" style={{ color: "var(--vt-gray-900)" }}>Kéo thả file Excel vào đây</p>
            <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>hoặc <span style={{ color: "var(--vt-blue)" }}>chọn từ máy tính</span> · .xlsx, .csv</p>
          </button>
        ) : (
          <div className="border rounded-xl p-4" style={{ borderColor: "var(--vt-gray-100)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>
                <Table2 size={20} />
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>keywords_may2025.xlsx</p>
                <p className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>12 dòng · 3 cột · 45KB</p>
              </div>
              <button className="ml-auto opacity-40 hover:opacity-80" onClick={() => setUploaded(false)}><X size={15} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold mb-2 px-2"
              style={{ color: "var(--vt-gray-500)" }}>
              <span>Từ khoá</span><span>Định dạng</span><span>Tone</span>
            </div>
            {["retinol anti-aging", "toner pH thấp da nhạy", "kem chống nắng SPF50"].map((kw, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 px-2 py-1.5 rounded text-[12px]"
                style={{ background: i % 2 === 0 ? "var(--vt-bg)" : "white" }}>
                <span style={{ color: "var(--vt-gray-900)" }}>{kw}</span>
                <span style={{ color: "var(--vt-gray-500)" }}>Carousel</span>
                <span style={{ color: "var(--vt-gray-500)" }}>Thân thiện</span>
              </div>
            ))}
            <p className="text-[11px] mt-2 px-2" style={{ color: "var(--vt-gray-400)" }}>+ 9 dòng khác</p>
          </div>
        )}

        {uploaded && (
          <button className="vt-btn-primary w-full justify-center mt-4">
            <Sparkles size={15} /> Tạo 12 bài từ file
          </button>
        )}
      </div>

      <div className="col-span-6 vt-card p-5">
        <h4 className="text-[13.5px] font-bold mb-2" style={{ color: "var(--vt-navy)" }}>Hướng dẫn cấu trúc file</h4>
        <p className="text-[12px] mb-3" style={{ color: "var(--vt-gray-500)" }}>File Excel cần có các cột sau (dòng đầu là tiêu đề):</p>
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--vt-gray-100)" }}>
          <div className="grid grid-cols-3 gap-0 text-[11.5px] font-bold px-3 py-2"
            style={{ background: "var(--vt-navy)", color: "white" }}>
            <span>keyword / topic</span><span>format</span><span>tone</span>
          </div>
          {[["Retinol cho da dầu", "text", "thân thiện"], ["Sunscreen SPF50", "carousel", "chuyên nghiệp"], ["Review mascara lâu trôi", "image", "trendy"]].map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-0 px-3 py-2 text-[11.5px] border-t"
              style={{ borderColor: "var(--vt-gray-100)", background: i % 2 === 0 ? "var(--vt-bg)" : "white", color: "var(--vt-gray-700)" }}>
              {row.map((cell, j) => <span key={j}>{cell}</span>)}
            </div>
          ))}
        </div>
        <button className="vt-btn-secondary w-full justify-center mt-3 text-[12.5px]">
          <Download size={13} /> Tải file mẫu (.xlsx)
        </button>
      </div>
    </div>
  );
}

function AIImageMode() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("lifestyle");
  const [generated, setGenerated] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-5 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>Tạo ảnh cho bài đăng</h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
          AI tạo ảnh KOL ảo theo phong cách thương hiệu — dùng bộ mặt đã upload.
        </p>

        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Mô tả ảnh (prompt)</label>
        <textarea className="vt-input vt-textarea text-[13.5px]" rows={4}
          value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="VD: KOL nữ trẻ cầm son đỏ, phông nền trắng sáng, ánh sáng tự nhiên, phong cách lifestyle..." />

        <div className="mt-4">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>Phong cách ảnh</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "lifestyle", l: "Lifestyle" },
              { v: "studio",    l: "Studio" },
              { v: "outdoor",   l: "Ngoại cảnh" },
              { v: "flat",      l: "Flat lay" },
              { v: "editorial", l: "Editorial" },
              { v: "candid",    l: "Candid" },
            ].map(({ v, l }) => {
              const active = style === v;
              return (
                <button key={v} onClick={() => setStyle(v)}
                  className="py-2 rounded-lg border-2 text-[11.5px] font-semibold transition-all"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                    color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                  }}>{l}</button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Số ảnh</label>
            <select className="vt-input text-[13px]"><option>4 ảnh</option><option>2 ảnh</option><option>1 ảnh</option></select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Tỉ lệ</label>
            <select className="vt-input text-[13px]"><option>1:1 (Square)</option><option>4:5 (Portrait)</option><option>16:9 (Wide)</option></select>
          </div>
        </div>

        <button className="vt-btn-primary w-full justify-center mt-4" onClick={() => setGenerated(true)}>
          <ImageIcon size={15} /> Tạo ảnh ngay
        </button>
      </div>

      <div className="col-span-7 vt-card p-5">
        <h4 className="text-[13.5px] font-bold mb-3" style={{ color: "var(--vt-navy)" }}>Kết quả</h4>
        {generated ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)", border: "1px solid var(--vt-gray-100)" }}>
                  <div className="text-center">
                    <ImageIcon size={28} style={{ color: "var(--vt-blue)", opacity: 0.4 }} className="mx-auto mb-1" />
                    <span className="text-[11px]" style={{ color: "var(--vt-gray-400)" }}>Ảnh {i}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <button className="w-6 h-6 rounded bg-white/90 flex items-center justify-center shadow-sm"><Eye size={11} /></button>
                    <button className="w-6 h-6 rounded bg-white/90 flex items-center justify-center shadow-sm"><Save size={11} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="vt-btn-primary flex-1 justify-center"><Check size={14} /> Lưu vào kho</button>
              <button className="vt-btn-secondary"><RefreshCcw size={13} /> Sinh lại</button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 rounded-xl"
            style={{ background: "var(--vt-bg)", border: "2px dashed var(--vt-gray-100)" }}>
            <ImageIcon size={36} className="mb-3" style={{ color: "var(--vt-gray-300)" }} />
            <p className="text-[13px]" style={{ color: "var(--vt-gray-400)" }}>Ảnh sẽ hiện ở đây sau khi tạo</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AIVideoMode() {
  const [script, setScript] = useState("");

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-5 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>Tạo video ngắn</h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>
          AI tạo video 15-60 giây từ script — phù hợp Reels, TikTok, Shorts.
        </p>

        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Script / Kịch bản</label>
        <textarea className="vt-input vt-textarea text-[13.5px]" rows={5}
          value={script} onChange={(e) => setScript(e.target.value)}
          placeholder="Viết kịch bản hoặc để AI tự tạo từ chủ đề...&#10;VD: KOL review son lì 3ce, nhấn mạnh độ bám màu và giá tầm trung." />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Thời lượng</label>
            <select className="vt-input text-[13px]"><option>15 giây</option><option>30 giây</option><option>60 giây</option></select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Nền âm thanh</label>
            <select className="vt-input text-[13px]"><option>Tự động</option><option>Trending TikTok</option><option>Không nhạc</option></select>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg flex items-start gap-2"
          style={{ background: "rgba(44,90,160,0.06)", border: "1px solid rgba(44,90,160,0.15)" }}>
          <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: "var(--vt-blue)" }} />
          <p className="text-[11.5px]" style={{ color: "var(--vt-blue)" }}>
            Video dùng bộ mặt KOL đã upload. Cần tối thiểu 5 ảnh để đạt chất lượng tốt.
          </p>
        </div>

        <button className="vt-btn-primary w-full justify-center mt-4">
          <Film size={15} /> Tạo video · ~2 phút
        </button>
      </div>

      <div className="col-span-7 vt-card p-5">
        <h4 className="text-[13.5px] font-bold mb-3" style={{ color: "var(--vt-navy)" }}>Preview video</h4>
        <div className="flex items-center justify-center rounded-xl mb-3" style={{ background: "#0f172a", height: 280 }}>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <Film size={24} style={{ color: "rgba(255,255,255,0.4)" }} />
            </div>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>Video chưa được tạo</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Thêm subtitle", icon: AlignLeft },
            { l: "Đổi nhạc nền", icon: Hash },
            { l: "Xuất HD", icon: Save },
          ].map(({ l, icon: Icon }) => (
            <button key={l} className="vt-btn-secondary justify-center text-[12px]">
              <Icon size={13} />{l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VariantCard({ variant, idx, withImage = false }: { variant: PostVariant; idx: number; withImage?: boolean }) {
  return (
    <div className="vt-card p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold px-2 py-0.5 rounded text-white"
          style={{ background: "var(--vt-blue)" }}>
          Biến thể {idx + 1}
        </span>
        <AIScoreBadge score={variant.aiScore} size="sm" />
      </div>

      {withImage && (
        <div
          className="rounded-md mb-2.5 flex items-center justify-center"
          style={{ height: 90, background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)", border: "1px solid var(--vt-gray-100)" }}
        >
          <div className="text-center">
            <ImageIcon size={20} className="mx-auto mb-0.5" style={{ color: "var(--vt-blue)", opacity: 0.35 }} />
            <span className="text-[10px]" style={{ color: "var(--vt-gray-400)" }}>Ảnh AI sinh</span>
          </div>
        </div>
      )}

      <div
        className="text-[12.5px] whitespace-pre-line leading-relaxed py-2 px-2.5 rounded-md flex-1 min-h-[160px] mb-3"
        style={{ background: "var(--vt-bg)", color: "var(--vt-gray-900)" }}
      >
        {variant.content}
      </div>

      <div className="text-[10.5px] mb-2.5 flex items-center justify-between"
        style={{ color: "var(--vt-gray-500)" }}>
        <span>{variant.charCount} ký tự</span>
        <span>~12 giây đọc</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button className="vt-btn-primary justify-center text-[11.5px] px-2">
          <Check size={11} /> Chọn bài này
        </button>
        <button className="vt-btn-secondary justify-center text-[11.5px] px-2">
          <Calendar size={11} /> Lên lịch
        </button>
        <button className="vt-btn-ghost justify-center text-[11.5px] px-2">
          <Edit3 size={11} /> Sửa thêm
        </button>
        <button className="vt-btn-ghost justify-center text-[11.5px] px-2">
          <RefreshCcw size={11} /> Sinh lại
        </button>
      </div>
    </div>
  );
}

// ─── Thêm thủ công ────────────────────────────────────────────────────────────

function ManualTab() {
  const [type, setType] = useState<"text" | "image" | "video">("text");

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>Thêm nội dung thủ công</h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>Dán content có sẵn hoặc upload media — lưu vào kho để dùng sau.</p>

        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>Loại nội dung</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ v: "text", l: "Văn bản", icon: FileText }, { v: "image", l: "Ảnh", icon: ImageIcon }, { v: "video", l: "Video", icon: Video }].map(({ v, l, icon: Icon }) => {
              const active = type === v;
              return (
                <button key={v} onClick={() => setType(v as "text" | "image" | "video")}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border-2"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                    color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                  }}>
                  <Icon size={16} /><span className="text-[13px] font-semibold">{l}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Nội dung bài viết</label>
          <textarea className="vt-input vt-textarea text-[13.5px]" placeholder="Dán content vào đây..." rows={6} />
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
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Tag</label>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="vt-badge" style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}><Tags size={11} /> skincare</span>
            <span className="vt-badge" style={{ background: "rgba(245,166,35,0.16)", color: "#b45309" }}><Tags size={11} /> review</span>
            <button className="text-[11.5px] px-2 py-1 border border-dashed rounded-md"
              style={{ borderColor: "var(--vt-gray-100)", color: "var(--vt-gray-500)" }}>+ Thêm tag</button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
          <button className="vt-btn-ghost"><Lightbulb size={14} /> AI gợi ý caption</button>
          <div className="flex items-center gap-2">
            <button className="vt-btn-secondary">Huỷ</button>
            <button className="vt-btn-primary"><Save size={14} /> Lưu vào kho</button>
          </div>
        </div>
      </div>

      <div className="col-span-4 vt-card p-5">
        <h3 className="text-[14px] font-bold mb-2" style={{ color: "var(--vt-navy)" }}>Tip viết tốt</h3>
        <ul className="space-y-2.5 text-[12.5px]" style={{ color: "var(--vt-gray-500)" }}>
          {["Mở bài bằng câu gây tò mò hoặc lời chào thân thiết", 'Dùng số liệu cụ thể: "3 tuần", "giảm 40%"', "Chia đoạn ngắn, gạch đầu dòng dễ đọc trên mobile", "Kết thúc bằng CTA: comment/inbox/save bài"].map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
                style={{ background: "var(--vt-blue)" }}>{i + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Hàng chờ tạo ─────────────────────────────────────────────────────────────

function QueueTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>Hàng chờ tạo nội dung</h3>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>AI đang xử lý tuần tự — theo dõi tiến độ từng tác vụ</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="vt-badge" style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
            <Clock size={11} /> 2 đang chạy
          </span>
          <button className="vt-btn-secondary"><RefreshCcw size={13} /> Làm mới</button>
        </div>
      </div>

      <div className="space-y-2.5">
        {MOCK_QUEUE.map((job) => {
          const statusMeta = STATUS_META[job.status] ?? STATUS_META.pending;
          const typeMeta   = TYPE_META[job.type]     ?? TYPE_META.text;
          const TypeIcon   = typeMeta.icon;
          return (
            <div key={job.id} className="vt-card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: typeMeta.color + "15", color: typeMeta.color }}>
                <TypeIcon size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>{job.mode}</span>
                  <span className="text-[10.5px]" style={{ color: "var(--vt-gray-400)" }}>{job.created}</span>
                </div>
                <p className="text-[13px] truncate mb-2" style={{ color: "var(--vt-gray-900)" }}>{job.prompt}</p>
                {(job.status === "running" || job.status === "done") && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${job.progress}%`,
                          background: job.status === "done" ? "#16a34a" : "var(--vt-gradient-sun)",
                        }} />
                    </div>
                    <span className="text-[10.5px] font-semibold shrink-0"
                      style={{ color: job.status === "done" ? "#16a34a" : "var(--vt-orange)" }}>{job.progress}%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: statusMeta.bg, color: statusMeta.color }}>{statusMeta.label}</span>
                {job.status === "done" && <button className="vt-btn-primary py-1.5"><Eye size={13} /> Xem</button>}
                {job.status === "failed" && <button className="vt-btn-secondary py-1.5"><RefreshCcw size={13} /> Thử lại</button>}
                {(job.status === "pending" || job.status === "running") &&
                  <button className="vt-btn-ghost p-1.5" style={{ color: "#dc2626" }}><X size={14} /></button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quét bài viết ─────────────────────────────────────────────────────────────

function CrawlTab() {
  return (
    <div className="vt-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>5 nguồn đang theo dõi</h3>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>Quét tự động mỗi 2 giờ — bài mới sẽ xuất hiện ở đây để dùng hoặc viết lại</p>
        </div>
        <button className="vt-btn-primary"><RefreshCcw size={14} /> Quét ngay</button>
      </div>

      <div className="space-y-2.5">
        {CRAWLED_SOURCES.map((src) => (
          <div key={src.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            style={{ borderColor: "var(--vt-gray-100)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11.5px] font-bold text-white shrink-0"
                style={{ background: src.sourceAvatarColor }}>
                {src.sourceName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{src.sourceName}</span>
                  <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>· 2 giờ trước</span>
                </div>
                <p className="text-[13px] mb-3" style={{ color: "var(--vt-gray-900)" }}>{src.content}</p>
                {src.hasMedia && (
                  <div className="flex gap-2 mb-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="w-16 h-16 rounded-md flex items-center justify-center"
                        style={{ background: "var(--vt-bg)", border: "1px solid var(--vt-gray-100)" }}>
                        <ImageIcon size={20} style={{ color: "var(--vt-gray-500)" }} />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button className="vt-btn-primary"><Wand2 size={13} /> Viết lại</button>
                  <button className="vt-btn-secondary"><Check size={13} /> Dùng nguyên</button>
                  <button className="vt-btn-ghost"><X size={13} /> Bỏ qua</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI viết lại ──────────────────────────────────────────────────────────────

function RewriteTab() {
  const [mode, setMode] = useState<"light" | "deep" | "caption">("light");

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-7 vt-card p-5">
        <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>AI Viết Lại</h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--vt-gray-500)" }}>Viết lại từ nguồn khác — giữ ý, đổi giọng &amp; cấu trúc theo phong cách KOL.</p>

        <div className="flex items-center gap-1 p-1 rounded-lg mb-4 w-fit" style={{ background: "var(--vt-bg)" }}>
          {[{ v: "light", l: "Viết lại nhẹ" }, { v: "deep", l: "Viết lại sâu" }, { v: "caption", l: "Caption từ media" }].map((m) => {
            const active = mode === m.v;
            return (
              <button key={m.v} onClick={() => setMode(m.v as "light" | "deep" | "caption")}
                className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold transition-colors"
                style={active ? { background: "white", color: "var(--vt-navy)", boxShadow: "var(--vt-shadow-sm)" } : { color: "var(--vt-gray-500)" }}>
                {m.l}
              </button>
            );
          })}
        </div>

        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>Nội dung gốc</label>
        <textarea className="vt-input vt-textarea text-[13.5px] mb-4" rows={6}
          defaultValue="Routine skincare 6 bước cho da dầu mụn mùa hè. Bước cleansing nên dùng gì? Mình sẽ chia sẻ cho các bạn..." />

        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ background: "var(--vt-bg)" }}>
          <input type="checkbox" id="aff" defaultChecked className="w-4 h-4 accent-[var(--vt-blue)]" />
          <label htmlFor="aff" className="text-[13px] flex-1 cursor-pointer">
            <span className="font-semibold">Inject affiliate link</span>
            <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>Tự động thêm link sản phẩm + UTM theo profile</div>
          </label>
        </div>

        <button className="vt-btn-primary w-full justify-center"><Wand2 size={14} /> Viết lại ngay</button>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[13px] font-bold" style={{ color: "var(--vt-navy)" }}>Output preview</h4>
            <AIScoreBadge score={22} size="sm" />
          </div>
          <div className="border rounded-md p-3 text-[13px] whitespace-pre-line leading-relaxed"
            style={{ background: "var(--vt-bg)", borderColor: "var(--vt-gray-100)" }}>
            {`Da dầu mụn vào hè là nỗi đau muôn thuở 😩 Mình từng tốn cả tháng để tìm routine ổn áp. Đây là 6 bước mình áp dụng hằng ngày:

1. Cleansing 2 lần (oil + foam)
2. Toner cấp nước, không cồn
3. Serum BHA 2% mỗi tối
4. Niacinamide 10% cấp ẩm + sáng da
5. Kem dưỡng nhẹ gel
6. Kem chống nắng SPF50+ ban ngày

Cùng team da dầu thử nha! 💕`}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="vt-btn-primary flex-1 justify-center"><Save size={14} /> Lưu kho</button>
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
          <p className="text-[11.5px] mb-3" style={{ color: "var(--vt-gray-500)" }}>Cấu trúc viết tối ưu cho engagement</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {REWRITE_TEMPLATES.map((tp) => (
            <div key={tp.id} className="vt-card p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
                  <FileText size={13} />
                </div>
                <div className="text-[12.5px] font-bold leading-tight" style={{ color: "var(--vt-navy)" }}>{tp.name}</div>
              </div>
              <p className="text-[11.5px] mb-2 line-clamp-2" style={{ color: "var(--vt-gray-500)" }}>{tp.description}</p>
              <button className="text-[11.5px] font-semibold px-2 py-1 rounded w-full"
                style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>Áp dụng</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// placeholder import for AIExcelMode
function Download(props: { size: number }) {
  return <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
