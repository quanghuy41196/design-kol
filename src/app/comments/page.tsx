"use client";

import { useState } from "react";
import {
  MessageSquare, Heart, HelpCircle, Send, BookOpen, X, Sparkles, Check, ExternalLink
} from "lucide-react";
import { COMMENTS, REPLY_TEMPLATES, POSTS, type Comment } from "@/lib/mock-data";

type FilterTab = "unanswered" | "answered" | "needs_review";

export default function CommentsPage() {
  const [tab, setTab] = useState<FilterTab>("unanswered");
  const [sort, setSort] = useState<"newest" | "likes" | "questions">("newest");
  const [selectedId, setSelectedId] = useState<string>(COMMENTS[0].id);
  const [showTemplates, setShowTemplates] = useState(false);

  let filtered = COMMENTS.filter((c) => c.status === tab);
  if (sort === "likes") filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  else if (sort === "questions") filtered = [...filtered].sort((a, b) => Number(b.hasQuestion) - Number(a.hasQuestion));

  const selected = COMMENTS.find((c) => c.id === selectedId) ?? filtered[0];

  const counts = {
    unanswered: COMMENTS.filter((c) => c.status === "unanswered").length,
    answered: COMMENTS.filter((c) => c.status === "answered").length,
    needs_review: COMMENTS.filter((c) => c.status === "needs_review").length,
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 p-1 rounded-xl vt-card">
          {[
            { v: "unanswered", l: "Chưa trả lời", count: counts.unanswered },
            { v: "answered", l: "Đã trả lời", count: counts.answered },
            { v: "needs_review", l: "Cần duyệt", count: counts.needs_review },
          ].map((t) => {
            const active = tab === t.v;
            return (
              <button
                key={t.v}
                onClick={() => setTab(t.v as FilterTab)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2"
                style={
                  active
                    ? { background: "var(--vt-navy)", color: "white" }
                    : { color: "var(--vt-gray-500)" }
                }
              >
                {t.l}
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "var(--vt-bg)",
                    color: active ? "white" : "var(--vt-gray-500)"
                  }}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <select className="vt-input text-[12.5px] !w-auto" value={sort} onChange={(e) => setSort(e.target.value as "newest" | "likes" | "questions")}>
            <option value="newest">Mới nhất</option>
            <option value="likes">Nhiều like</option>
            <option value="questions">Có câu hỏi</option>
          </select>
          <button className="vt-btn-secondary" onClick={() => setShowTemplates(true)}>
            <BookOpen size={13} /> Xem templates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4" style={{ height: "calc(100vh - 220px)" }}>
        {/* Comment list - 40% */}
        <div className="col-span-5 vt-card flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)" }}>
            <span className="text-[12.5px] font-bold" style={{ color: "var(--vt-navy)" }}>
              {filtered.length} comment
            </span>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.map((c) => {
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="w-full text-left px-4 py-3 border-b transition-colors flex items-start gap-3"
                  style={{
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                    borderColor: "var(--vt-gray-100)",
                    borderLeft: active ? "3px solid var(--vt-blue)" : "3px solid transparent",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: c.avatarColor }}
                  >
                    {c.author.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[12.5px] font-bold truncate" style={{ color: "var(--vt-navy)" }}>{c.author}</span>
                      <span className="text-[10.5px] shrink-0 ml-2" style={{ color: "var(--vt-gray-500)" }}>
                        {c.timestamp.slice(11, 16)}
                      </span>
                    </div>
                    <p className="text-[12.5px] mb-1.5 line-clamp-2" style={{ color: "var(--vt-gray-900)" }}>{c.content}</p>
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

        {/* Reply panel - 60% */}
        <div className="col-span-7 vt-card flex flex-col overflow-hidden">
          {selected ? <ReplyPanel comment={selected} onOpenTemplates={() => setShowTemplates(true)} /> : (
            <div className="flex-1 flex items-center justify-center text-[13px]" style={{ color: "var(--vt-gray-500)" }}>
              Chọn một comment để trả lời
            </div>
          )}
        </div>
      </div>

      {showTemplates && <TemplatesSheet onClose={() => setShowTemplates(false)} />}
    </div>
  );
}

function ReplyPanel({ comment, onOpenTemplates }: { comment: Comment; onOpenTemplates: () => void }) {
  const [reply, setReply] = useState("");
  const post = POSTS.find((p) => p.id === comment.postId);

  const aiSuggestions = [
    `Cảm ơn ${comment.author.split(" ").slice(-1)[0]} đã quan tâm 💕 Em ấy đang sale 280K thôi nha, bạn order tại link bio nhé!`,
    `Bạn ơi mình có gửi link inbox cho bạn rồi đó, check tin nha 🥰`,
    `Sản phẩm có ở shop của mình bạn nha! Order trong 10' là được áp dụng FREESHIP 🎁`,
  ];

  return (
    <>
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
        {post && (
          <div className="text-[11.5px] mb-2 flex items-center gap-1.5" style={{ color: "var(--vt-gray-500)" }}>
            <span>Comment trên bài:</span>
            <span className="font-semibold" style={{ color: "var(--vt-navy)" }}>{post.title}</span>
            <ExternalLink size={11} />
          </div>
        )}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
            style={{ background: comment.avatarColor }}
          >
            {comment.author.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>{comment.author}</span>
              <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>· {comment.timestamp.slice(11, 16)} hôm nay</span>
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
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="vt-badge" style={{ background: "white", color: "var(--vt-gray-500)" }}>
                  Gợi ý {idx + 1}
                </span>
                <span className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
                  {idx === 0 ? "Tone: gần gũi" : idx === 1 ? "Tone: chuyên nghiệp" : "Tone: vui vẻ"}
                </span>
              </div>
              <p className="text-[13px] mb-2" style={{ color: "var(--vt-gray-900)" }}>{sug}</p>
              <button
                className="vt-btn-secondary text-[11.5px] !py-1.5"
                onClick={() => setReply(sug)}
              >
                <Check size={12} /> Chọn reply này
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-semibold" style={{ color: "var(--vt-navy)" }}>Reply của bạn</span>
          <button onClick={onOpenTemplates} className="ml-auto text-[11.5px] font-semibold flex items-center gap-1"
            style={{ color: "var(--vt-blue)" }}>
            <BookOpen size={12} /> Dùng template
          </button>
        </div>
        <textarea
          className="vt-input vt-textarea text-[13px]"
          placeholder="Viết reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{reply.length} ký tự</span>
          <div className="flex items-center gap-2">
            <button className="vt-btn-secondary">Lưu nháp</button>
            <button className="vt-btn-primary">
              <Send size={13} /> Gửi reply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TemplatesSheet({ onClose }: { onClose: () => void }) {
  const categories = ["thanks", "product", "inbox", "spam"] as const;
  const labels: Record<typeof categories[number], string> = {
    thanks: "Cảm ơn", product: "Thông tin sản phẩm", inbox: "Hẹn inbox", spam: "Chặn spam",
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[480px] bg-white shadow-xl flex flex-col">
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)" }}>
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
                <div className="px-5 py-3 sticky top-0 bg-white border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
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
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)" }}>
          <MessageSquare size={14} style={{ color: "var(--vt-gray-500)" }} />
          <button className="vt-btn-ghost text-[12px]"><span className="text-[var(--vt-blue)] font-semibold">+ Thêm template mới</span></button>
        </div>
      </div>
    </div>
  );
}
