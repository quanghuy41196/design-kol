"use client";

import { useState } from "react";
import {
  Send, Sparkles, Bot, User, Hand, EyeOff, Ban, Search, Paperclip, Smile, MoreHorizontal, Check
} from "lucide-react";
import { MESSAGE_THREADS, MESSAGE_TYPE_META, type MessageThread } from "@/lib/mock-data";

type FilterTab = "unread" | "unanswered" | "handled" | "bot";
type Mode = "manual" | "ai" | "bot";

export default function MessagesPage() {
  const [tab, setTab] = useState<FilterTab>("unread");
  const [selectedId, setSelectedId] = useState<string>(MESSAGE_THREADS[0].id);
  const [mode, setMode] = useState<Mode>("ai");

  const filterFn = (t: MessageThread) => {
    if (tab === "unread") return t.unread && !t.botHandling;
    if (tab === "unanswered") return t.unread;
    if (tab === "handled") return !t.unread;
    if (tab === "bot") return t.botHandling;
    return true;
  };

  const filtered = MESSAGE_THREADS.filter(filterFn);
  const selected = MESSAGE_THREADS.find((t) => t.id === selectedId);

  const counts = {
    unread: MESSAGE_THREADS.filter((t) => t.unread && !t.botHandling).length,
    unanswered: MESSAGE_THREADS.filter((t) => t.unread).length,
    handled: MESSAGE_THREADS.filter((t) => !t.unread).length,
    bot: MESSAGE_THREADS.filter((t) => t.botHandling).length,
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 p-1 rounded-xl vt-card">
          {[
            { v: "unread", l: "Chưa đọc", count: counts.unread },
            { v: "unanswered", l: "Chưa trả lời", count: counts.unanswered },
            { v: "handled", l: "Đã xử lý", count: counts.handled },
            { v: "bot", l: "Bot đang handle", count: counts.bot },
          ].map((t) => {
            const active = tab === t.v;
            return (
              <button
                key={t.v}
                onClick={() => setTab(t.v as FilterTab)}
                className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-2"
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
      </div>

      <div className="grid grid-cols-12 gap-4" style={{ height: "calc(100vh - 200px)" }}>
        {/* thread list - 35% */}
        <div className="col-span-4 vt-card flex flex-col overflow-hidden">
          <div className="px-3 py-3 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--vt-gray-500)" }} />
              <input
                placeholder="Tìm tin nhắn..."
                className="vt-input pl-9 text-[12.5px]"
                style={{ background: "var(--vt-bg)" }}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-[13px]" style={{ color: "var(--vt-gray-500)" }}>
                Không có tin nhắn nào.
              </div>
            )}
            {filtered.map((t) => {
              const active = t.id === selectedId;
              const typeMeta = MESSAGE_TYPE_META[t.type];
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className="w-full text-left px-3 py-3 border-b transition-colors flex items-start gap-3"
                  style={{
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                    borderColor: "var(--vt-gray-100)",
                    borderLeft: active ? "3px solid var(--vt-blue)" : "3px solid transparent",
                  }}
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                      style={{ background: t.avatarColor }}
                    >
                      {t.sender.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
                    </div>
                    {t.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                        style={{ background: "var(--vt-red)" }} />
                    )}
                    {t.botHandling && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center border"
                        style={{ borderColor: "var(--vt-gray-100)" }}>
                        <Bot size={10} style={{ color: "var(--vt-teal)" }} />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[13px] truncate ${t.unread ? "font-bold" : "font-semibold"}`}
                        style={{ color: "var(--vt-navy)" }}>{t.sender}</span>
                      <span className="text-[10.5px] shrink-0 ml-2" style={{ color: "var(--vt-gray-500)" }}>
                        {t.timestamp.slice(11, 16)}
                      </span>
                    </div>
                    <p className={`text-[12px] line-clamp-1 mb-1.5 ${t.unread ? "font-semibold" : ""}`}
                      style={{ color: t.unread ? "var(--vt-gray-900)" : "var(--vt-gray-500)" }}>
                      {t.preview}
                    </p>
                    <span className="vt-badge" style={{ background: typeMeta.bg, color: typeMeta.color }}>
                      {typeMeta.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* conversation pane - 65% */}
        <div className="col-span-8 vt-card flex flex-col overflow-hidden">
          {selected ? (
            <ConversationPanel thread={selected} mode={mode} setMode={setMode} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-[13px]" style={{ color: "var(--vt-gray-500)" }}>
              Chọn một thread
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationPanel({ thread, mode, setMode }: { thread: MessageThread; mode: Mode; setMode: (m: Mode) => void }) {
  const [draft, setDraft] = useState("");
  const typeMeta = MESSAGE_TYPE_META[thread.type];

  return (
    <>
      <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
            style={{ background: thread.avatarColor }}
          >
            {thread.sender.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>{thread.sender}</span>
              <span className="vt-badge" style={{ background: typeMeta.bg, color: typeMeta.color }}>{typeMeta.label}</span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
              {thread.botHandling ? "Bot đang trả lời tự động" : "Đang chờ trả lời"} · IG @{thread.sender.toLowerCase().replace(/ /g, "_")}
            </div>
          </div>
        </div>
        <button className="vt-btn-ghost !p-1.5"><MoreHorizontal size={16} /></button>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ background: "var(--vt-bg)" }}>
        {thread.messages.map((m, i) => {
          const isMe = m.from === "me";
          const isBot = m.from === "bot";
          return (
            <div key={i} className={`flex ${isMe || isBot ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[70%]">
                {isBot && (
                  <div className="text-[10.5px] mb-1 flex items-center gap-1 justify-end" style={{ color: "var(--vt-teal)" }}>
                    <Bot size={11} /> <span className="font-semibold">Bot</span>
                  </div>
                )}
                <div
                  className="px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed"
                  style={
                    isMe
                      ? { background: "var(--vt-blue)", color: "white", borderBottomRightRadius: 4 }
                      : isBot
                      ? { background: "rgba(63,177,181,0.16)", color: "var(--vt-gray-900)", borderBottomRightRadius: 4 }
                      : { background: "white", color: "var(--vt-gray-900)", borderBottomLeftRadius: 4, border: "1px solid var(--vt-gray-100)" }
                  }
                >
                  {m.text}
                </div>
                <div className="text-[10px] mt-1 px-1" style={{ color: "var(--vt-gray-500)", textAlign: isMe || isBot ? "right" : "left" }}>
                  {m.time}
                  {isMe && <Check size={10} className="inline ml-0.5" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* spam actions */}
      {thread.type === "spam" && (
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)", background: "rgba(230,57,70,0.04)" }}>
          <div className="text-[12.5px] flex items-center gap-2">
            <Ban size={14} style={{ color: "var(--vt-red)" }} />
            <span style={{ color: "var(--vt-gray-900)" }}>Tin nhắn được phân loại là <strong>spam</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button className="vt-btn-secondary"><EyeOff size={12} /> Auto-hide</button>
            <button className="vt-btn-secondary" style={{ color: "var(--vt-red)", borderColor: "rgba(230,57,70,0.3)" }}>
              <Ban size={12} /> Block
            </button>
          </div>
        </div>
      )}

      {/* mode switcher */}
      <div className="border-t px-5 py-2.5" style={{ borderColor: "var(--vt-gray-100)", background: "white" }}>
        <div className="flex items-center gap-1 p-1 rounded-lg w-fit" style={{ background: "var(--vt-bg)" }}>
          {[
            { v: "manual", l: "Thủ công", icon: Hand },
            { v: "ai", l: "AI gợi ý", icon: Sparkles },
            { v: "bot", l: "Bot tự động", icon: Bot },
          ].map((m) => {
            const Icon = m.icon;
            const active = mode === m.v;
            return (
              <button
                key={m.v}
                onClick={() => setMode(m.v as Mode)}
                className="px-3 py-1.5 rounded-md text-[12px] font-semibold flex items-center gap-1.5"
                style={
                  active
                    ? { background: "white", color: "var(--vt-navy)", boxShadow: "var(--vt-shadow-sm)" }
                    : { color: "var(--vt-gray-500)" }
                }
              >
                <Icon size={12} />
                {m.l}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI suggestion (when mode = ai) */}
      {mode === "ai" && (
        <div className="px-5 py-3 border-t" style={{ borderColor: "var(--vt-gray-100)", background: "rgba(245,166,35,0.05)" }}>
          <div className="flex items-start gap-2.5">
            <Sparkles size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vt-orange)" }} />
            <div className="flex-1">
              <div className="text-[11.5px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>AI gợi ý reply</div>
              <p className="text-[13px] mb-2" style={{ color: "var(--vt-gray-900)" }}>
                Dạ chào bạn! Serum Vitamin C còn nha. Giá 320K, mua 2 hộp giảm 10% còn 576K ạ. Bạn cần em gửi link order không? 💕
              </p>
              <button
                onClick={() => setDraft("Dạ chào bạn! Serum Vitamin C còn nha. Giá 320K, mua 2 hộp giảm 10% còn 576K ạ. Bạn cần em gửi link order không? 💕")}
                className="text-[11.5px] font-semibold px-2.5 py-1 rounded"
                style={{ background: "white", color: "var(--vt-blue)" }}
              >
                <Check size={11} className="inline mr-1" /> Dùng gợi ý
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "bot" && (
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)", background: "rgba(63,177,181,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <Bot size={14} style={{ color: "var(--vt-teal)" }} />
            <div className="text-[12.5px]">
              <span className="font-bold" style={{ color: "var(--vt-navy)" }}>Bot đã được kích hoạt cho thread này.</span>
              <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>Confidence threshold: 0.7 · Tự handoff khi không chắc</div>
            </div>
          </div>
          <button className="vt-btn-secondary"><User size={12} /> Chuyển về thủ công</button>
        </div>
      )}

      {/* input */}
      <div className="border-t px-3 py-2.5 flex items-end gap-2" style={{ borderColor: "var(--vt-gray-100)" }}>
        <button className="vt-btn-ghost !p-2"><Paperclip size={15} /></button>
        <button className="vt-btn-ghost !p-2"><Smile size={15} /></button>
        <textarea
          placeholder={mode === "bot" ? "Bot đang reply tự động..." : "Nhập tin nhắn..."}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={1}
          className="vt-input text-[13px] py-2 resize-none !min-h-0"
          disabled={mode === "bot"}
        />
        <button className="vt-btn-primary" disabled={mode === "bot"}>
          <Send size={14} /> Gửi
        </button>
      </div>
    </>
  );
}
