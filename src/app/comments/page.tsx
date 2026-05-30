"use client";

import { useState } from "react";
import {
  MessageSquare, Heart, HelpCircle, Send, BookOpen, X, Sparkles, Check,
  ExternalLink, FileText, Image, LayoutGrid, Video, AlignLeft,
} from "lucide-react";
import { COMMENTS, REPLY_TEMPLATES, POSTS, PROFILES, type Comment } from "@/lib/mock-data";

type FilterTab = "unanswered" | "answered" | "needs_review";

const FORMAT_META: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  text:     { label: "Text",     icon: AlignLeft,  color: "#2C5AA0" },
  image:    { label: "Ảnh",      icon: Image,      color: "#8B5CF6" },
  carousel: { label: "Carousel", icon: LayoutGrid, color: "#0891B2" },
  video:    { label: "Video",    icon: Video,      color: "#dc2626" },
};

export default function CommentsPage() {
  const [tab, setTab]             = useState<FilterTab>("unanswered");
  const [sort, setSort]           = useState<"newest" | "likes" | "questions">("newest");
  const [filterKol, setFilterKol] = useState("all");
  const [selectedId, setSelectedId] = useState<string>(COMMENTS[0].id);
  const [showTemplates, setShowTemplates] = useState(false);

  // Per-KOL counts (ignore tab filter so chips always show totals)
  const kolStats = PROFILES.map((p) => {
    const all        = COMMENTS.filter((c) => c.profileId === p.id);
    const unanswered = all.filter((c) => c.status === "unanswered").length;
    return { profile: p, total: all.length, unanswered };
  }).filter((k) => k.total > 0);

  const baseFiltered = COMMENTS.filter(
    (c) => c.status === tab && (filterKol === "all" || c.profileId === filterKol),
  );
  const filtered = (() => {
    if (sort === "likes")     return [...baseFiltered].sort((a, b) => b.likes - a.likes);
    if (sort === "questions") return [...baseFiltered].sort((a, b) => Number(b.hasQuestion) - Number(a.hasQuestion));
    return [...baseFiltered].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  })();

  const counts = {
    unanswered:  COMMENTS.filter((c) => c.status === "unanswered"  && (filterKol === "all" || c.profileId === filterKol)).length,
    answered:    COMMENTS.filter((c) => c.status === "answered"    && (filterKol === "all" || c.profileId === filterKol)).length,
    needs_review:COMMENTS.filter((c) => c.status === "needs_review"&& (filterKol === "all" || c.profileId === filterKol)).length,
  };

  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0];

  return (
    <div className="max-w-[1280px] mx-auto space-y-3">
      {/* KOL filter chips */}
      <div className="vt-card px-4 py-3 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold uppercase tracking-wide shrink-0"
          style={{ color: "var(--vt-gray-400)" }}>KOL</span>

        {/* All chip */}
        <button
          onClick={() => setFilterKol("all")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[12.5px] font-semibold transition-all"
          style={{
            borderColor: filterKol === "all" ? "var(--vt-blue)" : "var(--vt-gray-100)",
            background:  filterKol === "all" ? "rgba(44,90,160,0.07)" : "white",
            color:       filterKol === "all" ? "var(--vt-blue)" : "var(--vt-gray-500)",
          }}>
          Tất cả
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: filterKol === "all" ? "var(--vt-blue)" : "var(--vt-bg)",
              color:      filterKol === "all" ? "white" : "var(--vt-gray-500)",
            }}>
            {COMMENTS.length}
          </span>
        </button>

        {kolStats.map(({ profile, total, unanswered }) => {
          const active = filterKol === profile.id;
          return (
            <button key={profile.id}
              onClick={() => setFilterKol(active ? "all" : profile.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all"
              style={{
                borderColor: active ? profile.avatarColor : "var(--vt-gray-100)",
                background:  active ? `${profile.avatarColor}12` : "white",
              }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: profile.avatarColor }}>
                {profile.initials}
              </div>
              <span className="text-[12.5px] font-semibold"
                style={{ color: active ? profile.avatarColor : "var(--vt-gray-900)" }}>
                {profile.name}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--vt-bg)", color: "var(--vt-gray-500)" }}>
                  {total}
                </span>
                {unanswered > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(217,119,6,0.12)", color: "#d97706" }}>
                    {unanswered} chưa TL
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab bar + sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-xl vt-card">
          {([
            { v: "unanswered",  l: "Chưa trả lời", count: counts.unanswered   },
            { v: "answered",    l: "Đã trả lời",   count: counts.answered     },
            { v: "needs_review",l: "Cần duyệt",    count: counts.needs_review },
          ] as const).map((t) => {
            const active = tab === t.v;
            return (
              <button key={t.v} onClick={() => setTab(t.v)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2"
                style={active ? { background: "var(--vt-navy)", color: "white" } : { color: "var(--vt-gray-500)" }}>
                {t.l}
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "var(--vt-bg)",
                    color:      active ? "white" : "var(--vt-gray-500)",
                  }}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <select className="vt-input text-[12.5px] !w-auto" value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="newest">Mới nhất</option>
            <option value="likes">Nhiều like</option>
            <option value="questions">Có câu hỏi</option>
          </select>
          <button className="vt-btn-secondary" onClick={() => setShowTemplates(true)}>
            <BookOpen size={13} /> Xem templates
          </button>
        </div>
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-12 gap-4" style={{ height: "calc(100vh - 300px)" }}>
        {/* Comment list */}
        <div className="col-span-5 vt-card flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: "var(--vt-gray-100)" }}>
            <span className="text-[12.5px] font-bold" style={{ color: "var(--vt-navy)" }}>
              {filtered.length} comment
            </span>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="py-14 text-center">
                <MessageSquare size={28} className="mx-auto mb-2 opacity-20" />
                <p className="text-[13px]" style={{ color: "var(--vt-gray-400)" }}>Không có comment nào</p>
              </div>
            )}
            {filtered.map((c) => {
              const active   = c.id === (selected?.id);
              const post     = POSTS.find((p) => p.id === c.postId);
              const profile  = PROFILES.find((p) => p.id === c.profileId);
              const fmtMeta  = post ? FORMAT_META[post.format] : null;
              return (
                <button key={c.id} onClick={() => setSelectedId(c.id)}
                  className="w-full text-left px-4 py-3 border-b transition-colors flex items-start gap-3"
                  style={{
                    background:  active ? "rgba(44,90,160,0.06)" : "white",
                    borderColor: "var(--vt-gray-100)",
                    borderLeft:  active ? "3px solid var(--vt-blue)" : "3px solid transparent",
                  }}>
                  {/* Commenter avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: c.avatarColor }}>
                    {c.author.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Author + time */}
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[12.5px] font-bold truncate" style={{ color: "var(--vt-navy)" }}>
                        {c.author}
                      </span>
                      <span className="text-[10.5px] shrink-0 ml-2" style={{ color: "var(--vt-gray-500)" }}>
                        {c.timestamp.slice(11, 16)}
                      </span>
                    </div>

                    {/* KOL + post context */}
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      {profile && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: `${profile.avatarColor}18`, color: profile.avatarColor }}>
                          <span className="w-3 h-3 rounded-full inline-flex items-center justify-center text-white font-bold"
                            style={{ background: profile.avatarColor, fontSize: 7 }}>
                            {profile.initials[0]}
                          </span>
                          {profile.name}
                        </span>
                      )}
                      {post && fmtMeta && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded truncate max-w-[160px]"
                          style={{ background: `${fmtMeta.color}10`, color: fmtMeta.color }}>
                          <fmtMeta.icon size={9} />
                          {post.title}
                        </span>
                      )}
                    </div>

                    {/* Comment text */}
                    <p className="text-[12.5px] mb-1.5 line-clamp-2" style={{ color: "var(--vt-gray-900)" }}>
                      {c.content}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
                      <span className="flex items-center gap-0.5"><Heart size={10} /> {c.likes}</span>
                      {c.hasQuestion && (
                        <span className="vt-badge" style={{ background: "rgba(245,166,35,0.16)", color: "#b45309" }}>
                          <HelpCircle size={10} /> Có câu hỏi
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reply panel */}
        <div className="col-span-7 vt-card flex flex-col overflow-hidden">
          {selected
            ? <ReplyPanel comment={selected} onOpenTemplates={() => setShowTemplates(true)} />
            : (
              <div className="flex-1 flex items-center justify-center text-[13px]"
                style={{ color: "var(--vt-gray-500)" }}>
                Chọn một comment để trả lời
              </div>
            )}
        </div>
      </div>

      {showTemplates && <TemplatesSheet onClose={() => setShowTemplates(false)} />}
    </div>
  );
}

// ─── Reply Panel ──────────────────────────────────────────────────────────────

function ReplyPanel({ comment, onOpenTemplates }: { comment: Comment; onOpenTemplates: () => void }) {
  const [reply, setReply] = useState("");

  const post    = POSTS.find((p) => p.id === comment.postId);
  const profile = PROFILES.find((p) => p.id === comment.profileId);
  const fmtMeta = post ? FORMAT_META[post.format] : null;
  const FmtIcon = fmtMeta?.icon ?? FileText;

  const aiSuggestions = [
    { tone: "Gần gũi",       text: `Cảm ơn ${comment.author.split(" ").slice(-1)[0]} đã quan tâm 💕 Bạn inbox mình để được tư vấn chi tiết nhé!` },
    { tone: "Chuyên nghiệp", text: `Bạn ơi mình có gửi thông tin vào inbox rồi, bạn kiểm tra tin nhắn giúp mình nha 🙏` },
    { tone: "Vui vẻ",        text: `Câu hỏi hay quá! 🌟 Mình sẽ làm một bài riêng về chủ đề này. Follow để không bỏ lỡ nhé bạn ơi!` },
  ];

  return (
    <>
      {/* Post context card */}
      {post && profile && (
        <div className="px-5 py-3.5 border-b shrink-0"
          style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--vt-gray-400)" }}>
            Bài viết
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-white"
            style={{ borderColor: "var(--vt-gray-100)" }}>
            {/* KOL avatar */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: profile.avatarColor }}>
              {profile.initials}
            </div>

            <div className="flex-1 min-w-0">
              {/* KOL name + format + date */}
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                <span className="text-[12px] font-bold" style={{ color: profile.avatarColor }}>
                  {profile.name}
                </span>
                <span style={{ color: "var(--vt-gray-300)" }}>·</span>
                {fmtMeta && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: `${fmtMeta.color}12`, color: fmtMeta.color }}>
                    <FmtIcon size={10} /> {fmtMeta.label}
                  </span>
                )}
                <span style={{ color: "var(--vt-gray-300)" }}>·</span>
                <span className="text-[11px]" style={{ color: "var(--vt-gray-400)" }}>
                  {new Date(post.scheduledAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                </span>
              </div>
              {/* Post title */}
              <p className="text-[13px] font-semibold leading-snug truncate"
                style={{ color: "var(--vt-navy)" }}>
                {post.title}
              </p>
              {/* Post excerpt */}
              <p className="text-[11.5px] mt-0.5 line-clamp-1" style={{ color: "var(--vt-gray-500)" }}>
                {post.content}
              </p>
            </div>

            <a href="#" className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: "var(--vt-gray-400)" }}>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}

      {/* Comment */}
      <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--vt-gray-100)" }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
            style={{ background: comment.avatarColor }}>
            {comment.author.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>{comment.author}</span>
              <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                · {comment.timestamp.slice(11, 16)} hôm nay
              </span>
            </div>
            <p className="text-[14px] mb-2" style={{ color: "var(--vt-gray-900)" }}>{comment.content}</p>
            <div className="flex items-center gap-3 text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
              <span className="flex items-center gap-1"><Heart size={11} /> {comment.likes} like</span>
              {comment.hasQuestion && (
                <span className="vt-badge" style={{ background: "rgba(245,166,35,0.16)", color: "#b45309" }}>
                  <HelpCircle size={10} /> Có câu hỏi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI suggestions */}
      <div className="px-5 py-4 border-b flex-1 overflow-y-auto" style={{ borderColor: "var(--vt-gray-100)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: "var(--vt-orange)" }} />
          <span className="text-[12.5px] font-bold" style={{ color: "var(--vt-navy)" }}>AI gợi ý 3 reply</span>
          <span className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>· dựa trên context của comment</span>
        </div>
        <div className="space-y-2">
          {aiSuggestions.map((sug, idx) => (
            <div key={idx} className="border rounded-lg p-3"
              style={{ borderColor: "var(--vt-gray-100)", background: "var(--vt-bg)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="vt-badge" style={{ background: "white", color: "var(--vt-gray-500)" }}>
                  Gợi ý {idx + 1}
                </span>
                <span className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
                  Tone: {sug.tone}
                </span>
              </div>
              <p className="text-[13px] mb-2" style={{ color: "var(--vt-gray-900)" }}>{sug.text}</p>
              <button className="vt-btn-secondary text-[11.5px] !py-1.5" onClick={() => setReply(sug.text)}>
                <Check size={12} /> Chọn reply này
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reply box */}
      <div className="px-5 py-4 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-semibold" style={{ color: "var(--vt-navy)" }}>Reply của bạn</span>
          <button onClick={onOpenTemplates}
            className="ml-auto text-[11.5px] font-semibold flex items-center gap-1"
            style={{ color: "var(--vt-blue)" }}>
            <BookOpen size={12} /> Dùng template
          </button>
        </div>
        <textarea className="vt-input vt-textarea text-[13px]" placeholder="Viết reply..."
          value={reply} onChange={(e) => setReply(e.target.value)} rows={3} />
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{reply.length} ký tự</span>
          <div className="flex items-center gap-2">
            <button className="vt-btn-secondary">Lưu nháp</button>
            <button className="vt-btn-primary"><Send size={13} /> Gửi reply</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Templates Sheet ──────────────────────────────────────────────────────────

function TemplatesSheet({ onClose }: { onClose: () => void }) {
  const categories = ["thanks", "product", "inbox", "spam"] as const;
  const labels: Record<typeof categories[number], string> = {
    thanks: "Cảm ơn", product: "Thông tin sản phẩm", inbox: "Hẹn inbox", spam: "Chặn spam",
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[480px] bg-white shadow-xl flex flex-col">
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--vt-gray-100)" }}>
          <div>
            <h3 className="text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>
              Thư viện reply template
            </h3>
            <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>20 template được dùng nhiều nhất</p>
          </div>
          <button className="vt-btn-ghost !p-1.5" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {categories.map((cat) => {
            const tps = REPLY_TEMPLATES.filter((t) => t.category === cat);
            return (
              <div key={cat} className="border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
                <div className="px-5 py-3 sticky top-0 bg-white border-b"
                  style={{ borderColor: "var(--vt-gray-100)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold" style={{ color: "var(--vt-navy)" }}>{labels[cat]}</span>
                    <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{tps.length} templates</span>
                  </div>
                </div>
                <div className="px-5 py-2 space-y-2">
                  {tps.map((t) => (
                    <div key={t.id} className="border rounded-lg p-3" style={{ borderColor: "var(--vt-gray-100)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12.5px] font-bold" style={{ color: "var(--vt-navy)" }}>{t.title}</span>
                        <button className="text-[11.5px] font-semibold px-2 py-1 rounded"
                          style={{ background: "rgba(44,90,160,0.08)", color: "var(--vt-blue)" }}>
                          Dùng
                        </button>
                      </div>
                      <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t flex items-center justify-between"
          style={{ borderColor: "var(--vt-gray-100)" }}>
          <MessageSquare size={14} style={{ color: "var(--vt-gray-500)" }} />
          <button className="vt-btn-ghost text-[12px]">
            <span style={{ color: "var(--vt-blue)" }} className="font-semibold">+ Thêm template mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
