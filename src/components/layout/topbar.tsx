"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Plus, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/components/shared/profile-context";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/sources": { title: "Nguồn Nội Dung", subtitle: "Tạo, crawl và viết lại bài cho profile của bạn" },
  "/posts": { title: "Đăng Bài", subtitle: "Sinh và lên lịch bài đăng — chế độ nhắc (không tự đăng)" },
  "/posts/batch": { title: "Duyệt Batch", subtitle: "Sinh hàng loạt, duyệt nhanh, lên lịch 7 ngày" },
  "/schedule": { title: "Lịch Đăng", subtitle: "Theo dõi toàn bộ bài đã lên lịch theo tuần / tháng" },
  "/comments": { title: "Bình Luận", subtitle: "Trả lời comment với gợi ý AI và template" },
  "/messages": { title: "Tin Nhắn", subtitle: "Hộp thư hợp nhất — phân loại tự động" },
  "/bot": { title: "Bot Chat", subtitle: "Cấu hình kịch bản bot trả lời tự động" },
  "/notifications": { title: "Bot Thông Báo", subtitle: "Cài đặt Telegram / Lark để nhận báo cáo" },
};

export function Topbar() {
  const pathname = usePathname();
  const { activeProfile } = useProfile();
  const meta = TITLES[pathname] ?? TITLES["/sources"];

  return (
    <header
      className="fixed top-0 right-0 left-[240px] h-[68px] flex items-center justify-between px-7 z-20 border-b"
      style={{ background: "white", borderColor: "var(--vt-gray-100)" }}
    >
      <div>
        <h1 className="text-[18px] font-bold leading-tight" style={{ color: "var(--vt-navy)" }}>
          {meta.title}
        </h1>
        <div className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
          {meta.subtitle}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--vt-gray-500)" }} />
          <input
            type="text"
            placeholder="Tìm bài đăng, comment, tin nhắn..."
            className="vt-input pl-9 w-[280px] text-[13px]"
            style={{ background: "var(--vt-bg)" }}
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border"
            style={{ color: "var(--vt-gray-500)", borderColor: "var(--vt-gray-100)", background: "white" }}>⌘K</kbd>
        </div>

        <button className="vt-btn-ghost" title="Trợ giúp">
          <HelpCircle size={17} />
        </button>

        <button className="vt-btn-ghost relative" title="Thông báo">
          <Bell size={17} />
          <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--vt-red)" }} />
        </button>

        <div className="w-px h-7 mx-1" style={{ background: "var(--vt-gray-100)" }} />

        <Link href="/posts" className="vt-btn-primary">
          <Plus size={15} strokeWidth={2.4} />
          Tạo bài
        </Link>

        <div className="flex items-center gap-2 pl-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
            style={{ background: activeProfile.avatarColor }}
          >
            {activeProfile.initials}
          </div>
        </div>
      </div>
    </header>
  );
}
