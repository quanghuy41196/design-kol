"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FileText, Edit3, Calendar, MessageSquare, Inbox, Bot, Bell,
  ChevronDown, Check, Sparkles
} from "lucide-react";
import { useProfile } from "@/components/shared/profile-context";

interface NavItem {
  href: string;
  label: string;
  icon: typeof FileText;
}

const NAV: NavItem[] = [
  { href: "/sources", label: "Nguồn Nội Dung", icon: FileText },
  { href: "/posts", label: "Đăng Bài", icon: Edit3 },
  { href: "/schedule", label: "Lịch Đăng", icon: Calendar },
  { href: "/comments", label: "Bình Luận", icon: MessageSquare },
  { href: "/messages", label: "Tin Nhắn", icon: Inbox },
  { href: "/bot", label: "Bot Chat", icon: Bot },
  { href: "/notifications", label: "Bot Thông Báo", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeProfile, profiles, setActiveProfileId } = useProfile();
  const [open, setOpen] = useState(false);

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

      {/* Profile switcher */}
      <div className="px-3 pb-3 relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
            style={{ background: activeProfile.avatarColor }}
          >
            {activeProfile.initials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[13px] font-semibold truncate">{activeProfile.name}</div>
            <div className="text-[10.5px] opacity-65">{activeProfile.nicheLabel}</div>
          </div>
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute left-3 right-3 mt-1 rounded-lg shadow-lg z-50 overflow-hidden"
            style={{ background: "var(--vt-navy-deep)" }}>
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActiveProfileId(p.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/10 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ background: p.avatarColor }}
                >
                  {p.initials}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[12.5px] font-semibold">{p.name}</div>
                  <div className="text-[10px] opacity-65">{p.nicheLabel} · {p.followers}</div>
                </div>
                {p.id === activeProfile.id && <Check size={14} className="text-[var(--vt-orange)]" />}
              </button>
            ))}
            <div className="border-t border-white/10 px-3 py-2 text-[11px] opacity-60 text-center">
              + Thêm profile mới
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider opacity-50 px-3 py-2 font-semibold">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href === "/posts" && pathname.startsWith("/posts"));
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
