"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles, Calendar, CalendarRange, ArrowLeft, Edit3,
  RefreshCcw, Check, X
} from "lucide-react";
import Link from "next/link";
import { AIScoreBadge } from "@/components/shared/ai-score-badge";
import { useProfile } from "@/components/shared/profile-context";
import { SAMPLE_VARIANTS, KEYBOARD_SHORTCUTS } from "@/lib/mock-data";

const BATCH_SIZE = 12;

// Generate 12 mock variants from sample
function buildBatch() {
  const out = [];
  const topics = [
    "Review serum Vitamin C giảm thâm",
    "Top 3 son lì tầm giá 200K",
    "Mẹo dưỡng tóc khô xơ",
    "Mặt nạ tự làm tại nhà",
    "Skincare routine cho da dầu mụn",
    "Top kem chống nắng cho da hỗn hợp",
    "Tips chọn nước hoa cho ngày dài",
    "Make-up nhẹ nhàng đi học",
    "Cách dưỡng môi căng mọng",
    "Review dầu gội phục hồi tóc",
    "5 mẹo trang điểm dưới 5 phút",
    "Routine tóc óng mượt mùa hè",
  ];
  for (let i = 0; i < BATCH_SIZE; i++) {
    const base = SAMPLE_VARIANTS[i % SAMPLE_VARIANTS.length];
    out.push({
      id: `b${i}`,
      topic: topics[i],
      content: base.content,
      aiScore: [12, 18, 22, 24, 28, 32, 35, 42, 48, 55, 62, 70][i],
      charCount: base.charCount + i * 7,
    });
  }
  return out;
}

const BATCH = buildBatch();

export default function BatchPage() {
  const { activeProfile } = useProfile();
  const [count, setCount] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set(BATCH.slice(0, 8).map(b => b.id)));
  const [focusIdx, setFocusIdx] = useState(0);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore if typing
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        return;
      }
      const k = e.key.toLowerCase();
      if (k === "j") {
        e.preventDefault();
        setFocusIdx((i) => Math.min(BATCH.length - 1, i + 1));
      } else if (k === "k") {
        e.preventDefault();
        setFocusIdx((i) => Math.max(0, i - 1));
      } else if (k === "a") {
        e.preventDefault();
        toggle(BATCH[focusIdx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusIdx, toggle]);

  return (
    <div className="max-w-[1280px] mx-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/posts" className="vt-btn-ghost">
            <ArrowLeft size={14} /> Quay lại
          </Link>
          <div>
            <h2 className="text-[17px] font-bold" style={{ color: "var(--vt-navy)" }}>
              Duyệt batch {BATCH.length} bài
            </h2>
            <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
              KOL: <strong>{activeProfile.name}</strong> · {activeProfile.nicheLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>Số lượng:</label>
          <select
            className="vt-input text-[13px] !w-auto"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            <option value={10}>10 bài</option>
            <option value={20}>20 bài</option>
            <option value={30}>30 bài</option>
          </select>
          <button className="vt-btn-primary">
            <Sparkles size={14} /> Sinh batch mới
          </button>
        </div>
      </div>

      {/* keyboard shortcut legend */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg mb-4"
        style={{ background: "rgba(30,58,95,0.04)" }}>
        <span className="text-[12px] font-semibold" style={{ color: "var(--vt-navy)" }}>Phím tắt:</span>
        {KEYBOARD_SHORTCUTS.map((sc) => (
          <span key={sc.key} className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
            <kbd className="px-1.5 py-0.5 rounded border bg-white text-[11px] font-mono font-bold"
              style={{ color: "var(--vt-navy)", borderColor: "var(--vt-gray-100)" }}>
              {sc.key}
            </kbd>
            <span>{sc.label}</span>
          </span>
        ))}
      </div>

      {/* batch grid */}
      <div className="grid grid-cols-3 gap-3">
        {BATCH.map((post, idx) => {
          const isSelected = selected.has(post.id);
          const isFocused = idx === focusIdx;
          return (
            <div
              key={post.id}
              className="vt-card p-3.5 relative transition-all cursor-pointer"
              style={{
                border: `2px solid ${
                  isFocused ? "var(--vt-orange)" :
                  isSelected ? "var(--vt-blue)" : "var(--vt-gray-100)"
                }`,
                boxShadow: isFocused ? "0 0 0 3px rgba(245,166,35,0.18)" : undefined,
              }}
              onClick={() => setFocusIdx(idx)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggle(post.id); }}
                className="absolute top-3 right-3 w-5 h-5 rounded-md flex items-center justify-center transition-all"
                style={{
                  background: isSelected ? "var(--vt-blue)" : "white",
                  border: `2px solid ${isSelected ? "var(--vt-blue)" : "var(--vt-gray-100)"}`,
                }}
              >
                {isSelected && <Check size={12} className="text-white" />}
              </button>

              <div className="text-[12.5px] font-bold mb-1 pr-7 line-clamp-1" style={{ color: "var(--vt-navy)" }}>
                {post.topic}
              </div>

              <div className="text-[11.5px] mb-2 line-clamp-3 leading-relaxed"
                style={{ color: "var(--vt-gray-500)" }}>
                {post.content}
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
                <AIScoreBadge score={post.aiScore} size="sm" />
                <span className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>{post.charCount} ký tự</span>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <button className="vt-btn-ghost text-[11px] !py-1 !px-2" onClick={(e) => e.stopPropagation()}>
                  <Edit3 size={10} /> Sửa
                </button>
                <button className="vt-btn-ghost text-[11px] !py-1 !px-2" onClick={(e) => e.stopPropagation()}>
                  <RefreshCcw size={10} /> Sinh lại
                </button>
                <button className="vt-btn-ghost text-[11px] !py-1 !px-2" onClick={(e) => e.stopPropagation()}>
                  <X size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* bottom action bar */}
      <div
        className="fixed bottom-0 right-0 left-[240px] border-t bg-white px-7 py-4 flex items-center justify-between z-20"
        style={{ borderColor: "var(--vt-gray-100)", boxShadow: "0 -4px 12px rgba(30, 58, 95, 0.06)" }}
      >
        <div className="flex items-center gap-3">
          <span className="vt-pill" style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
            <Check size={11} /> {selected.size} bài đã chọn
          </span>
          <span className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
            (trong tổng {BATCH.length} bài)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="vt-btn-secondary">
            <Calendar size={14} /> Đặt lịch thủ công
          </button>
          <button className="vt-btn-primary">
            <CalendarRange size={14} /> Auto-fill 7 ngày
          </button>
        </div>
      </div>
    </div>
  );
}
