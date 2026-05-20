"use client";

import { useState } from "react";
import {
  CalendarRange, Calendar, History, Wand2, GripVertical, Plus,
  AlertTriangle, MoreHorizontal, ChevronLeft, ChevronRight
} from "lucide-react";
import { AIScoreBadge } from "@/components/shared/ai-score-badge";
import { PostStatusBadge } from "@/components/shared/post-status-badge";
import { POSTS, POST_STATUS_META, type PostStatus } from "@/lib/mock-data";

type View = "week" | "month" | "history";

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const TIME_SLOTS = ["08:00", "10:00", "14:00", "19:00", "20:00"];

// Map day index (0=mon) to posts
function buildWeek() {
  const grid: Record<string, typeof POSTS[number] | null> = {};
  const slots = [
    { day: 0, time: "08:30", postId: "ps6" },
    { day: 0, time: "10:00", postId: "ps1" },
    { day: 0, time: "14:00", postId: "ps5" },
    { day: 0, time: "20:00", postId: "ps2" },
    { day: 1, time: "10:00", postId: "ps7" },
    { day: 1, time: "19:00", postId: "ps4" },
    { day: 2, time: "19:00", postId: "ps8" },
    { day: 3, time: "10:00", postId: "ps3" },
    { day: 5, time: "20:00", postId: "ps9" },
  ];
  slots.forEach((s) => {
    const post = POSTS.find((p) => p.id === s.postId);
    if (post) grid[`${s.day}_${s.time}`] = post;
  });
  return grid;
}

const WEEK_GRID = buildWeek();

export default function SchedulePage() {
  const [view, setView] = useState<View>("week");

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1 p-1 rounded-xl vt-card">
          {[
            { v: "week", l: "Tuần", icon: CalendarRange },
            { v: "month", l: "Tháng", icon: Calendar },
            { v: "history", l: "Lịch sử", icon: History },
          ].map((t) => {
            const Icon = t.icon;
            const active = view === t.v;
            return (
              <button
                key={t.v}
                onClick={() => setView(t.v as View)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2"
                style={
                  active
                    ? { background: "var(--vt-navy)", color: "white" }
                    : { color: "var(--vt-gray-500)" }
                }
              >
                <Icon size={14} />
                {t.l}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <button className="vt-btn-ghost !px-2"><ChevronLeft size={14} /></button>
            <span className="text-[13px] font-bold px-3" style={{ color: "var(--vt-navy)" }}>
              {view === "week" ? "18 - 24 / 05 / 2026" : view === "month" ? "Tháng 05 / 2026" : "Tháng 5"}
            </span>
            <button className="vt-btn-ghost !px-2"><ChevronRight size={14} /></button>
          </div>
          <button className="vt-btn-secondary">
            <Wand2 size={13} /> Auto-fill
          </button>
          <button className="vt-btn-primary">
            <Plus size={14} /> Bulk lịch
          </button>
        </div>
      </div>

      {view === "week" && <WeekView />}
      {view === "month" && <MonthView />}
      {view === "history" && <HistoryView />}
    </div>
  );
}

function WeekView() {
  return (
    <div className="vt-card overflow-hidden">
      {/* day header */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
        <div></div>
        {DAYS.map((d, i) => (
          <div key={d} className="px-3 py-3 text-center">
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--vt-gray-500)" }}>{d}</div>
            <div className={`text-[18px] font-bold mt-0.5 ${i === 1 ? "text-orange-500" : ""}`}
              style={{ color: i === 1 ? "var(--vt-orange)" : "var(--vt-navy)" }}>
              {18 + i}
            </div>
          </div>
        ))}
      </div>

      {/* slots */}
      {TIME_SLOTS.map((time) => (
        <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] border-b min-h-[110px]"
          style={{ borderColor: "var(--vt-gray-100)" }}>
          <div className="px-3 py-2 text-[11.5px] font-semibold border-r flex items-start pt-3"
            style={{ color: "var(--vt-gray-500)", borderColor: "var(--vt-gray-100)" }}>
            {time}
          </div>
          {DAYS.map((_, dayIdx) => {
            const key = `${dayIdx}_${time}`;
            const post = WEEK_GRID[key];
            const isEmpty = !post;
            // Day 4 (Thứ 6) has no posts → warning state
            const dayIsEmpty = !TIME_SLOTS.some((t) => WEEK_GRID[`${dayIdx}_${t}`]);
            const showWarn = isEmpty && dayIsEmpty && time === "10:00";

            return (
              <div
                key={dayIdx}
                className="border-r p-2 relative"
                style={{
                  borderColor: "var(--vt-gray-100)",
                  background: dayIsEmpty ? "rgba(245,166,35,0.04)" : "white",
                }}
              >
                {post ? (
                  <SlotCard post={post} />
                ) : (
                  showWarn ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-3">
                      <AlertTriangle size={16} style={{ color: "var(--vt-orange)" }} />
                      <div className="text-[10.5px] font-semibold mt-1.5" style={{ color: "var(--vt-orange)" }}>
                        Ngày chưa có bài
                      </div>
                      <button className="text-[10px] mt-1 underline" style={{ color: "var(--vt-blue)" }}>
                        + Thêm bài
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SlotCard({ post }: { post: typeof POSTS[number] }) {
  return (
    <div className="border rounded-md p-2 hover:shadow-md transition-shadow cursor-grab bg-white"
      style={{ borderColor: "var(--vt-gray-100)" }}>
      <div className="flex items-start gap-1.5">
        <GripVertical size={12} className="mt-0.5 shrink-0 opacity-50" style={{ color: "var(--vt-gray-500)" }} />
        <div className="flex-1 min-w-0">
          <div className="text-[11.5px] font-bold leading-tight line-clamp-2 mb-1" style={{ color: "var(--vt-navy)" }}>
            {post.title}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <AIScoreBadge score={post.aiScore} size="sm" />
            <PostStatusBadge status={post.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthView() {
  // 5 weeks × 7 days
  const days = Array.from({ length: 35 }, (_, i) => i - 3); // first row starts at -3 to mimic month offset
  return (
    <div className="vt-card overflow-hidden">
      <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--vt-gray-100)" }}>
        {DAYS.map((d) => (
          <div key={d} className="px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--vt-gray-500)" }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const dayNum = d + 1;
          const isOff = d < 0 || d > 30;
          const isToday = dayNum === 20;
          const postCount = [3, 2, 0, 4, 1, 3, 0][i % 7];
          const statuses: PostStatus[] = ["scheduled", "posted", "reminded", "draft"];

          return (
            <div
              key={i}
              className="aspect-square border-b border-r p-2 relative"
              style={{
                borderColor: "var(--vt-gray-100)",
                background: isOff ? "var(--vt-bg)" : isToday ? "rgba(245,166,35,0.08)" : "white",
              }}
            >
              <div className={`text-[13px] font-bold ${isToday ? "" : isOff ? "opacity-30" : ""}`}
                style={{ color: isToday ? "var(--vt-orange)" : "var(--vt-navy)" }}>
                {((dayNum - 1) % 31) + 1}
              </div>
              {!isOff && postCount > 0 && (
                <>
                  <div className="flex gap-0.5 mt-1.5">
                    {Array.from({ length: Math.min(postCount, 4) }).map((_, sx) => (
                      <div key={sx} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: POST_STATUS_META[statuses[sx % statuses.length]].color }} />
                    ))}
                  </div>
                  <div className="absolute bottom-1.5 left-2 text-[10px] font-semibold" style={{ color: "var(--vt-gray-500)" }}>
                    {postCount} bài
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryView() {
  const historyPosts = POSTS.filter((p) => p.status === "posted" || p.status === "archived");
  return (
    <div className="vt-card">
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--vt-gray-100)" }}>
        <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
          Lịch sử đăng bài ({historyPosts.length})
        </h3>
        <div className="flex items-center gap-2">
          <select className="vt-input text-[12px] !w-auto !py-1">
            <option>Tất cả profile</option>
            <option>Linh Nguyễn</option>
            <option>Hùng MKT</option>
          </select>
          <select className="vt-input text-[12px] !w-auto !py-1">
            <option>30 ngày</option>
            <option>7 ngày</option>
            <option>3 tháng</option>
          </select>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-[var(--vt-bg)]">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--vt-gray-500)" }}>
            <th className="px-5 py-3">Bài đăng</th>
            <th className="px-5 py-3">Profile</th>
            <th className="px-5 py-3">Định dạng</th>
            <th className="px-5 py-3">AI Score</th>
            <th className="px-5 py-3">Trạng thái</th>
            <th className="px-5 py-3">Thời gian</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {[...historyPosts, ...POSTS.slice(0, 4)].map((p) => (
            <tr key={p.id + Math.random()} className="border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
              <td className="px-5 py-3">
                <div className="text-[13px] font-semibold line-clamp-1" style={{ color: "var(--vt-navy)" }}>{p.title}</div>
                <div className="text-[11px] line-clamp-1" style={{ color: "var(--vt-gray-500)" }}>{p.content}</div>
              </td>
              <td className="px-5 py-3 text-[12.5px]" style={{ color: "var(--vt-gray-900)" }}>
                {p.profileId === "p1" ? "Linh Nguyễn" : p.profileId === "p2" ? "Hùng MKT" : "Mai Chi"}
              </td>
              <td className="px-5 py-3 text-[12.5px] capitalize" style={{ color: "var(--vt-gray-500)" }}>{p.format}</td>
              <td className="px-5 py-3"><AIScoreBadge score={p.aiScore} size="sm" /></td>
              <td className="px-5 py-3"><PostStatusBadge status={p.status} /></td>
              <td className="px-5 py-3 text-[12.5px]" style={{ color: "var(--vt-gray-500)" }}>
                {p.scheduledAt.replace("T", " ").slice(0, 16)}
              </td>
              <td className="px-5 py-3">
                <button className="vt-btn-ghost !p-1.5"><MoreHorizontal size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
