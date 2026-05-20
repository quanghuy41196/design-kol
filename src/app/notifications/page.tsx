"use client";

import { useState } from "react";
import {
  Send, CheckCircle2, AlertCircle, Eye, EyeOff, Copy, Bell
} from "lucide-react";
import { NOTIFICATION_TOGGLES } from "@/lib/mock-data";
import { useProfile } from "@/components/shared/profile-context";

export default function NotificationsPage() {
  const { activeProfile } = useProfile();
  const [showToken, setShowToken] = useState(false);
  const [toggles, setToggles] = useState(NOTIFICATION_TOGGLES);
  const [telegramConnected] = useState(true);
  const [larkConnected] = useState(false);

  const flip = (key: string) =>
    setToggles((prev) => prev.map((t) => t.key === key ? { ...t, enabled: !t.enabled } : t));

  return (
    <div className="max-w-[1080px] mx-auto">
      <div className="mb-5">
        <h2 className="text-[17px] font-bold mb-0.5" style={{ color: "var(--vt-navy)" }}>
          Cấu hình Bot Thông Báo
        </h2>
        <p className="text-[12.5px]" style={{ color: "var(--vt-gray-500)" }}>
          Kết nối Telegram / Lark để nhận nhắc nhở khi đến giờ đăng, có comment cần xử lý, hoặc báo cáo định kỳ.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Telegram */}
        <div className="vt-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(44,90,160,0.1)" }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#2C5AA0">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.464.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>Telegram Bot</h3>
                <p className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>Nhận nhắc nhở tức thì</p>
              </div>
            </div>
            {telegramConnected ? (
              <span className="vt-badge" style={{ background: "rgba(22,163,74,0.14)", color: "#15803d" }}>
                <CheckCircle2 size={11} /> Đã kết nối
              </span>
            ) : (
              <span className="vt-badge" style={{ background: "rgba(230,57,70,0.12)", color: "var(--vt-red)" }}>
                <AlertCircle size={11} /> Chưa kết nối
              </span>
            )}
          </div>

          <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Bot Token
          </label>
          <div className="relative mb-3">
            <input
              type={showToken ? "text" : "password"}
              defaultValue="7891234567:AAFx-Ek_dummy_token_for_demo_purposes_only_xyz"
              className="vt-input pr-20 text-[12.5px] font-mono"
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="absolute right-9 top-1/2 -translate-y-1/2 p-1.5"
              style={{ color: "var(--vt-gray-500)" }}
            >
              {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5"
              style={{ color: "var(--vt-gray-500)" }}>
              <Copy size={14} />
            </button>
          </div>

          <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Chat ID
          </label>
          <input
            defaultValue="-1001234567890"
            className="vt-input text-[12.5px] font-mono mb-4"
          />

          <div className="flex items-center gap-2">
            <button className="vt-btn-primary flex-1 justify-center">
              <Send size={13} /> Gửi tin nhắn test
            </button>
            <button className="vt-btn-secondary">Lưu</button>
          </div>
        </div>

        {/* Lark */}
        <div className="vt-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(63,177,181,0.16)" }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#3FB1B5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>Lark Webhook</h3>
                <p className="text-[11px]" style={{ color: "var(--vt-gray-500)" }}>Gửi vào group Lark</p>
              </div>
            </div>
            {larkConnected ? (
              <span className="vt-badge" style={{ background: "rgba(22,163,74,0.14)", color: "#15803d" }}>
                <CheckCircle2 size={11} /> Đã kết nối
              </span>
            ) : (
              <span className="vt-badge" style={{ background: "rgba(230,57,70,0.12)", color: "var(--vt-red)" }}>
                <AlertCircle size={11} /> Chưa kết nối
              </span>
            )}
          </div>

          <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Webhook URL
          </label>
          <input
            placeholder="https://open.larksuite.com/open-apis/bot/v2/hook/..."
            className="vt-input text-[12.5px] font-mono mb-4"
          />

          <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
            Secret (tuỳ chọn)
          </label>
          <input
            placeholder="lark_secret_xxx"
            type="password"
            className="vt-input text-[12.5px] font-mono mb-4"
          />

          <div className="flex items-center gap-2">
            <button className="vt-btn-primary flex-1 justify-center">
              <Send size={13} /> Gửi tin nhắn test
            </button>
            <button className="vt-btn-secondary">Lưu</button>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="vt-card p-5 mb-5">
        <h3 className="text-[14px] font-bold mb-3 flex items-center gap-2" style={{ color: "var(--vt-navy)" }}>
          <Bell size={14} /> Thông báo cần nhận
        </h3>
        <div className="divide-y" style={{ borderColor: "var(--vt-gray-100)" }}>
          {toggles.map((t) => (
            <div key={t.key} className="flex items-center justify-between py-3"
              style={{ borderColor: "var(--vt-gray-100)" }}>
              <div className="flex-1">
                <div className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{t.title}</div>
                <div className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>{t.description}</div>
              </div>
              <button
                onClick={() => flip(t.key)}
                className="relative w-11 h-6 rounded-full transition-colors shrink-0 ml-4"
                style={{ background: t.enabled ? "var(--vt-blue)" : "var(--vt-gray-100)" }}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm"
                  style={{ left: t.enabled ? "calc(100% - 22px)" : "2px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Morning report preview */}
      <div className="vt-card p-5">
        <h3 className="text-[14px] font-bold mb-3" style={{ color: "var(--vt-navy)" }}>
          Preview báo cáo sáng
        </h3>
        <div className="rounded-lg p-4 font-mono text-[12.5px] leading-relaxed"
          style={{ background: "#0E1A2D", color: "#E5E7EB" }}>
          <div className="text-[13px] font-bold mb-2" style={{ color: "#F5A623" }}>
            🌟 {activeProfile.name.toUpperCase()} — Báo cáo sáng 20/05
          </div>
          <div className="opacity-50 mb-2">────────────────────────────</div>
          <div className="space-y-0.5">
            <div>📅 Hôm nay cần đăng: <span style={{ color: "#3FB1B5" }}>2 bài</span> (10:00 · 20:00)</div>
            <div>💬 Comment chưa trả lời: <span style={{ color: "#F5A623" }}>5</span></div>
            <div>✉️ Tin nhắn chưa xử lý: <span style={{ color: "#F5A623" }}>3</span></div>
            <div>📊 Tương tác hôm qua: <span style={{ color: "#3FB1B5" }}>1.2K reach</span> · 48 like · 12 comment</div>
            <div>⚡ Quota còn: <span style={{ color: "#3FB1B5" }}>{activeProfile.quotaTotal - activeProfile.quotaUsed}/{activeProfile.quotaTotal} bài</span></div>
          </div>
          <div className="opacity-50 mt-3 text-[11px]">— Hẹn gặp tối nay, chúc một ngày năng suất! 💕</div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3">
          <button className="vt-btn-secondary">Sửa template</button>
          <button className="vt-btn-primary">
            <Send size={13} /> Gửi thử ngay
          </button>
        </div>
      </div>
    </div>
  );
}
