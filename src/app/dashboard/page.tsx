"use client";

import {
  Users, Edit3, Calendar, MessageSquare, Inbox,
  TrendingUp, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, Zap, BarChart2, Activity,
} from "lucide-react";
import Link from "next/link";
import {
  SOCIAL_ACCOUNTS, POSTS, COMMENTS, MESSAGE_THREADS, PROFILES,
  ACCOUNT_STATUS_META,
} from "@/lib/mock-data";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color, bg, href,
}: {
  label: string; value: string | number; sub?: string;
  icon: typeof Users; color: string; bg: string; href?: string;
}) {
  const inner = (
    <div className="vt-card p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg, color }}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[24px] font-bold leading-tight" style={{ color: "var(--vt-navy)" }}>
          {value}
        </div>
        <div className="text-[12.5px] font-medium mt-0.5" style={{ color: "var(--vt-gray-500)" }}>
          {label}
        </div>
        {sub && (
          <div className="text-[11.5px] mt-1" style={{ color }}>
            {sub}
          </div>
        )}
      </div>
      {href && <ArrowRight size={15} className="mt-1 shrink-0" style={{ color: "var(--vt-gray-500)" }} />}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // account stats
  const accLive        = SOCIAL_ACCOUNTS.filter((a) => a.status === "live").length;
  const accCheckpoint  = SOCIAL_ACCOUNTS.filter((a) => a.status === "checkpoint").length;
  const accDie         = SOCIAL_ACCOUNTS.filter((a) => a.status === "die").length;
  const accDisconnected= SOCIAL_ACCOUNTS.filter((a) => a.status === "disconnected").length;

  // post stats
  const postsScheduled = POSTS.filter((p) => p.status === "scheduled").length;
  const postsPosted    = POSTS.filter((p) => p.status === "posted").length;
  const postsDraft     = POSTS.filter((p) => p.status === "draft").length;

  // interaction stats
  const commentsUnanswered = COMMENTS.filter((c) => c.status === "unanswered").length;
  const messagesUnread     = MESSAGE_THREADS.filter((m) => m.unread).length;

  // upcoming posts (scheduled, sorted by time)
  const upcoming = [...POSTS]
    .filter((p) => p.status === "scheduled" || p.status === "reminded")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  // recent comments needing attention
  const pendingComments = COMMENTS.filter((c) => c.status === "unanswered").slice(0, 4);

  return (
    <div className="max-w-[1280px] mx-auto space-y-6">

      {/* ── Row 1: main KPI cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Tài khoản live" value={accLive}
          sub={accCheckpoint > 0 ? `${accCheckpoint} checkpoint · ${accDie} die` : "Tất cả ổn định"}
          icon={Users} color="#16a34a" bg="rgba(22,163,74,0.1)" href="/accounts"
        />
        <StatCard
          label="Bài đăng hôm nay" value={postsScheduled}
          sub={`${postsPosted} đã đăng · ${postsDraft} nháp`}
          icon={Edit3} color="var(--vt-blue)" bg="rgba(44,90,160,0.1)" href="/posts"
        />
        <StatCard
          label="Comment chờ trả lời" value={commentsUnanswered}
          sub="Cần xử lý sớm"
          icon={MessageSquare} color="#d97706" bg="rgba(217,119,6,0.1)" href="/comments"
        />
        <StatCard
          label="Tin nhắn chưa đọc" value={messagesUnread}
          sub="Inbox hợp nhất"
          icon={Inbox} color="#E1306C" bg="rgba(225,48,108,0.1)" href="/messages"
        />
      </div>

      {/* ── Row 2: accounts overview + upcoming posts ── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Accounts status breakdown */}
        <div className="col-span-4 vt-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
              Tình trạng tài khoản
            </h2>
            <Link href="/accounts" className="text-[12px] font-medium flex items-center gap-1"
              style={{ color: "var(--vt-blue)" }}>
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {([
              { status: "live",         count: accLive         },
              { status: "checkpoint",   count: accCheckpoint   },
              { status: "die",          count: accDie          },
              { status: "disconnected", count: accDisconnected },
            ] as const).map(({ status, count }) => {
              const m = ACCOUNT_STATUS_META[status];
              const pct = SOCIAL_ACCOUNTS.length > 0 ? (count / SOCIAL_ACCOUNTS.length) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="flex items-center gap-1.5 font-medium" style={{ color: m.color }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                      {m.label}
                    </span>
                    <span className="font-bold" style={{ color: "var(--vt-navy)" }}>{count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Profile breakdown */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
            <div className="text-[11.5px] font-semibold mb-3" style={{ color: "var(--vt-gray-500)" }}>
              TÀI KHOẢN THEO PROFILE
            </div>
            <div className="space-y-2">
              {PROFILES.map((p) => {
                const count = SOCIAL_ACCOUNTS.filter((a) => a.kolProfileId === p.id).length;
                return (
                  <div key={p.id} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white shrink-0"
                      style={{ background: p.avatarColor }}>{p.initials}</div>
                    <span className="text-[12.5px] flex-1" style={{ color: "var(--vt-navy)" }}>{p.name}</span>
                    <span className="text-[12px] font-bold" style={{ color: "var(--vt-gray-500)" }}>{count}</span>
                  </div>
                );
              })}
              {(() => {
                const unassigned = SOCIAL_ACCOUNTS.filter((a) => !a.kolProfileId).length;
                return unassigned > 0 ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white shrink-0"
                      style={{ background: "#6B7280" }}>?</div>
                    <span className="text-[12.5px] flex-1 italic" style={{ color: "var(--vt-gray-500)" }}>Chưa gán</span>
                    <span className="text-[12px] font-bold" style={{ color: "var(--vt-gray-500)" }}>{unassigned}</span>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>

        {/* Upcoming posts */}
        <div className="col-span-8 vt-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
              Bài đăng sắp tới
            </h2>
            <Link href="/schedule" className="text-[12px] font-medium flex items-center gap-1"
              style={{ color: "var(--vt-blue)" }}>
              Lịch đăng <ArrowRight size={12} />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-10">
              <Calendar size={32} className="mx-auto mb-2" style={{ color: "var(--vt-gray-500)" }} />
              <p className="text-[13px]" style={{ color: "var(--vt-gray-500)" }}>Không có bài nào được lên lịch</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map((post) => {
                const profile = PROFILES.find((p) => p.id === post.profileId);
                const isReminded = post.status === "reminded";
                return (
                  <div key={post.id}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-gray-50"
                    style={{ borderColor: "var(--vt-gray-100)" }}>
                    {/* Profile avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: profile?.avatarColor ?? "#6B7280" }}>
                      {profile?.initials ?? "?"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate" style={{ color: "var(--vt-navy)" }}>
                        {post.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                          {profile?.name}
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>·</span>
                        <span className="text-[11px] capitalize px-1.5 py-0.5 rounded text-[10.5px] font-medium"
                          style={{ background: "var(--vt-bg)", color: "var(--vt-gray-500)" }}>
                          {post.format}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[12px] font-semibold"
                        style={{ color: isReminded ? "#d97706" : "var(--vt-blue)" }}>
                        {isReminded
                          ? <AlertTriangle size={12} />
                          : <Clock size={12} />}
                        {fmtDate(post.scheduledAt)}
                      </div>
                      <div className="text-[10.5px] mt-0.5" style={{ color: "var(--vt-gray-500)" }}>
                        {isReminded ? "Đã nhắc" : "Đã lên lịch"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: comments + quick actions ── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Pending comments */}
        <div className="col-span-7 vt-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
              Comment cần xử lý
            </h2>
            <Link href="/comments" className="text-[12px] font-medium flex items-center gap-1"
              style={{ color: "var(--vt-blue)" }}>
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>

          {pendingComments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 size={28} className="mx-auto mb-2" style={{ color: "#16a34a" }} />
              <p className="text-[13px]" style={{ color: "var(--vt-gray-500)" }}>Không có comment nào cần xử lý</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingComments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ borderColor: "var(--vt-gray-100)" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: c.avatarColor }}>
                    {c.author.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>{c.author}</span>
                      <span className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>
                        {new Date(c.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[12.5px]" style={{ color: "var(--vt-gray-900)" }}>{c.content}</p>
                  </div>
                  <Link href="/comments"
                    className="shrink-0 px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition-colors hover:opacity-90"
                    style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
                    Trả lời
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="col-span-5 space-y-4">
          {/* Quick actions card */}
          <div className="vt-card p-5">
            <h2 className="text-[14px] font-bold mb-4" style={{ color: "var(--vt-navy)" }}>
              Thao tác nhanh
            </h2>
            <div className="space-y-2">
              {[
                { href: "/posts",    icon: Edit3,       label: "Tạo bài đăng mới",      color: "var(--vt-blue)",  bg: "rgba(44,90,160,0.1)"  },
                { href: "/sources",  icon: Zap,         label: "AI tạo nội dung",        color: "#7c3aed",        bg: "rgba(124,58,237,0.1)" },
                { href: "/schedule", icon: Calendar,    label: "Lên lịch đăng bài",      color: "#d97706",        bg: "rgba(217,119,6,0.1)"  },
                { href: "/accounts", icon: Users,       label: "Quản lý tài khoản",      color: "#16a34a",        bg: "rgba(22,163,74,0.1)"  },
                { href: "/messages", icon: Inbox,       label: "Xem tin nhắn chưa đọc",  color: "#E1306C",        bg: "rgba(225,48,108,0.1)" },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.href} href={a.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50 border"
                    style={{ borderColor: "var(--vt-gray-100)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: a.bg, color: a.color }}>
                      <Icon size={14} />
                    </div>
                    <span className="text-[13px] font-medium flex-1" style={{ color: "var(--vt-navy)" }}>
                      {a.label}
                    </span>
                    <ArrowRight size={13} style={{ color: "var(--vt-gray-500)" }} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mini activity summary */}
          <div className="vt-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} style={{ color: "var(--vt-blue)" }} />
              <span className="text-[13px] font-bold" style={{ color: "var(--vt-navy)" }}>Tóm tắt hôm nay</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Bài lên lịch",  value: postsScheduled, icon: Calendar,      color: "var(--vt-blue)"  },
                { label: "Đã đăng",        value: postsPosted,    icon: CheckCircle2,  color: "#16a34a"         },
                { label: "Comment chờ",    value: commentsUnanswered, icon: MessageSquare, color: "#d97706"     },
                { label: "Tin nhắn mới",   value: messagesUnread, icon: Inbox,         color: "#E1306C"         },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2 p-2.5 rounded-lg"
                    style={{ background: "var(--vt-bg)" }}>
                    <Icon size={13} style={{ color: s.color }} />
                    <div>
                      <div className="text-[15px] font-bold leading-tight" style={{ color: "var(--vt-navy)" }}>
                        {s.value}
                      </div>
                      <div className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
