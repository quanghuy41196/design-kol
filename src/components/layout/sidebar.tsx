"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText, MessageSquare, Inbox, Bot, Bell,
  Sparkles, Users, LayoutDashboard, UserSquare2, Layers
} from "lucide-react";
import { useProfile } from "@/components/shared/profile-context";

interface NavItem {
  href: string;
  label: string;
  icon: typeof FileText;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Quản Lý Tài Khoản", icon: Users },
  { href: "/kol", label: "Quản Lý KOL", icon: UserSquare2 },
  { href: "/sources", label: "Nguồn Nội Dung", icon: FileText },
  { href: "/posting", label: "Quản Lý Đăng Bài", icon: Layers },
  { href: "/comments", label: "Bình Luận", icon: MessageSquare },
  { href: "/messages", label: "Tin Nhắn", icon: Inbox },
  { href: "/bot", label: "Bot Chat", icon: Bot },
  { href: "/notifications", label: "Bot Thông Báo", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeProfile } = useProfile();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col text-white z-30"
      style={{ background: "var(--vt-navy)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--vt-gradient-cta)" }}
        >
          <Sparkles size={18} strokeWidth={2.4} />
        </div>
        <div>
          <div className="font-bold text-base tracking-tight leading-tight">MKT KOL</div>
          <div className="text-[10px] opacity-60 tracking-wider uppercase">SaaS Management</div>
        </div>
      </div>


      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
<ul className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all relative"
                  style={
                    active
                      ? { background: "rgba(245,166,35,0.16)", color: "var(--vt-orange)" }
                      : { color: "rgba(255,255,255,0.78)" }
                  }
                >
                  {active && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r"
                      style={{ background: "var(--vt-orange)" }}
                    />
                  )}
                  <Icon size={17} strokeWidth={2.2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quota indicator */}
      <div className="px-4 pb-3">
        <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="opacity-70">Quota tháng</span>
            <span className="font-semibold">{activeProfile.quotaUsed}/{activeProfile.quotaTotal}</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(activeProfile.quotaUsed / activeProfile.quotaTotal) * 100}%`,
                background: "var(--vt-gradient-sun)"
              }}
            />
          </div>
        </div>
      </div>

      {/* User footer */}
      <div className="border-t border-white/10 px-4 py-3 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{ background: "var(--vt-orange)" }}>
          QH
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold truncate">Quang Huy</div>
          <div className="text-[10px] opacity-60">Premium plan</div>
        </div>
      </div>
    </aside>
  );
}
