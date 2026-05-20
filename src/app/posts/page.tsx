"use client";

import { useState } from "react";
import {
  Info, Sparkles, Type, Image as ImageIcon, Images, Video,
  Send, Calendar, Edit3, RefreshCcw, Bell, BookOpen, ListChecks, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { AIScoreBadge } from "@/components/shared/ai-score-badge";
import { useProfile } from "@/components/shared/profile-context";
import { SAMPLE_VARIANTS, type PostVariant } from "@/lib/mock-data";

type Format = "text" | "image" | "carousel" | "video";
type Source = "ai" | "manual" | "queue";

const FORMAT_OPTIONS: { value: Format; label: string; icon: typeof Type }[] = [
  { value: "text", label: "Text", icon: Type },
  { value: "image", label: "Ảnh", icon: ImageIcon },
  { value: "carousel", label: "Carousel", icon: Images },
  { value: "video", label: "Video", icon: Video },
];

export default function PostsPage() {
  const { activeProfile, profiles, setActiveProfileId } = useProfile();
  const [source, setSource] = useState<Source>("ai");
  const [format, setFormat] = useState<Format>("carousel");
  const [topic, setTopic] = useState("Tips dưỡng da khô mùa hanh — 3 bước cấp ẩm cực rẻ");

  return (
    <div className="max-w-[1280px] mx-auto">
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-5 border"
        style={{
          background: "rgba(44,90,160,0.06)",
          borderColor: "rgba(44,90,160,0.18)",
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--vt-blue)" }}
        >
          <Bell size={17} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-bold" style={{ color: "var(--vt-navy)" }}>
            Chế độ nhắc — không tự đăng
          </div>
          <div className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
            Hệ thống sẽ thông báo qua Telegram khi đến giờ. Bạn đăng tay để giữ profile an toàn (chặn được rủi ro checkpoint).
          </div>
        </div>
        <Link href="/posts/batch" className="vt-btn-secondary">
          <ListChecks size={13} /> Duyệt batch <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4 vt-card p-5 h-fit">
          <h3 className="text-[15px] font-bold mb-4" style={{ color: "var(--vt-navy)" }}>
            Cấu hình bài đăng
          </h3>

          <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>
            Nguồn nội dung
          </label>
          <div className="space-y-2 mb-4">
            {[
              { v: "ai", l: "AI Generate", d: "Sinh 3 biến thể từ chủ đề" },
              { v: "manual", l: "Thủ công", d: "Dán nội dung có sẵn" },
              { v: "queue", l: "Từ hàng chờ", d: "Bài đã crawl về" },
            ].map((opt) => {
              const active = source === opt.v;
              return (
                <button
                  key={opt.v}
                  onClick={() => setSource(opt.v as Source)}
                  className="w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all flex items-center gap-3"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                  }}
                >
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                      background: active ? "var(--vt-blue)" : "white"
                    }}>
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: active ? "var(--vt-blue)" : "var(--vt-gray-900)" }}>
                      {opt.l}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>{opt.d}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--vt-gray-900)" }}>
            Định dạng
          </label>
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {FORMAT_OPTIONS.map((f) => {
              const Icon = f.icon;
              const active = format === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: active ? "var(--vt-blue)" : "var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.06)" : "white",
                    color: active ? "var(--vt-blue)" : "var(--vt-gray-500)",
                  }}
                >
                  <Icon size={16} />
                  <span className="text-[10.5px] font-semibold">{f.label}</span>
                </button>
              );
            })}
          </div>

          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Profile đăng
          </label>
          <select
            className="vt-input text-[13px] mb-4"
            value={activeProfile.id}
            onChange={(e) => setActiveProfileId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.nicheLabel}
              </option>
            ))}
          </select>

          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Chủ đề
          </label>
          <textarea
            className="vt-input vt-textarea text-[13px] mb-4"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
          />

          <button className="vt-btn-primary w-full justify-center">
            <Sparkles size={15} /> Sinh 3 biến thể
          </button>

          <button className="vt-btn-ghost w-full justify-center mt-2 text-[12.5px]">
            <BookOpen size={13} /> Mở thư viện template
          </button>
        </div>

        <div className="col-span-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
              Biến thể được sinh
            </h3>
            <button className="vt-btn-ghost text-[12.5px]">
              <RefreshCcw size={13} /> Sinh lại tất cả
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {SAMPLE_VARIANTS.map((v, idx) => (
              <VariantCard key={v.id} variant={v} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VariantCard({ variant, idx }: { variant: PostVariant; idx: number }) {
  return (
    <div className="vt-card p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold px-2 py-0.5 rounded text-white"
          style={{ background: "var(--vt-blue)" }}>
          Biến thể {idx + 1}
        </span>
        <AIScoreBadge score={variant.aiScore} size="sm" />
      </div>

      <div className="text-[12.5px] whitespace-pre-line leading-relaxed py-2 px-2.5 rounded-md flex-1 min-h-[200px] mb-3"
        style={{ background: "var(--vt-bg)", color: "var(--vt-gray-900)" }}>
        {variant.content}
      </div>

      <div className="text-[10.5px] mb-2.5 flex items-center justify-between" style={{ color: "var(--vt-gray-500)" }}>
        <span>{variant.charCount} ký tự</span>
        <span>~12 giây đọc</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button className="vt-btn-primary justify-center text-[11.5px] px-2">
          <Send size={11} /> Đăng ngay
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
