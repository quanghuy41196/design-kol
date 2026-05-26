"use client";

import { useState, useCallback } from "react";
import {
  Plus, Eye, EyeOff, Copy, Trash2, Settings, AlertTriangle,
  Wifi, WifiOff, Loader2, Check, Link2, Link2Off, Shield, X,
} from "lucide-react";
import {
  SOCIAL_ACCOUNTS, PROFILES, KOL_BRANDS, ACCOUNT_STATUS_META,
  type AccountStatus, type SocialAccount,
} from "@/lib/mock-data";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function healthColor(score: number) {
  if (score >= 70) return "#16a34a";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}

// simulate TOTP: 6-digit code derived from secret + current 30s window
function mockTotp(secret: string) {
  const window = Math.floor(Date.now() / 30000);
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    hash = ((hash << 5) - hash + secret.charCodeAt(i) * (window + 1)) | 0;
  }
  return String(Math.abs(hash) % 1000000).padStart(6, "0");
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AccountStatus }) {
  const m = ACCOUNT_STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}
    >
      {status === "live"         && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {status === "checkpoint"   && <AlertTriangle size={9} />}
      {status === "die"          && <X size={9} />}
      {status === "disconnected" && <WifiOff size={9} />}
      {status === "connecting"   && <Loader2 size={9} className="animate-spin" />}
      {m.label}
    </span>
  );
}

function MaskedField({ value, mono = false }: { value: string; mono?: boolean }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <div className="flex items-center gap-1 group">
      <span
        className={`text-[12px] ${mono ? "font-mono" : ""} tracking-wide`}
        style={{ color: show ? "var(--vt-gray-900)" : "var(--vt-gray-500)" }}
      >
        {show ? value : "••••••••"}
      </span>
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100"
        onClick={() => setShow(!show)}
        title={show ? "Ẩn" : "Hiện"}
      >
        {show ? <EyeOff size={11} style={{ color: "var(--vt-gray-500)" }} /> : <Eye size={11} style={{ color: "var(--vt-gray-500)" }} />}
      </button>
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100"
        onClick={copy}
        title="Sao chép"
      >
        {copied ? <Check size={11} style={{ color: "#16a34a" }} /> : <Copy size={11} style={{ color: "var(--vt-gray-500)" }} />}
      </button>
    </div>
  );
}

function TotpCell({ secret, active }: { secret: string; active: boolean }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const code = mockTotp(secret);
  const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30);
  const pct = (secondsLeft / 30) * 100;

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!active) {
    return <span className="text-[12px] italic" style={{ color: "var(--vt-gray-500)" }}>—</span>;
  }

  return (
    <div className="flex items-center gap-1.5 group">
      <Shield size={12} style={{ color: "#2C5AA0" }} className="shrink-0" />
      <span className="font-mono text-[12.5px] font-semibold tracking-widest" style={{ color: show ? "var(--vt-navy)" : "var(--vt-gray-500)" }}>
        {show ? code.slice(0, 3) + " " + code.slice(3) : "••• •••"}
      </span>
      {show && (
        <span className="text-[10px] tabular-nums px-1 py-0.5 rounded"
          style={{ background: pct < 30 ? "rgba(220,38,38,0.1)" : "rgba(44,90,160,0.08)", color: pct < 30 ? "#dc2626" : "var(--vt-blue)" }}>
          {secondsLeft}s
        </span>
      )}
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff size={11} style={{ color: "var(--vt-gray-500)" }} /> : <Eye size={11} style={{ color: "var(--vt-gray-500)" }} />}
      </button>
      {show && (
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100" onClick={copy}>
          {copied ? <Check size={11} style={{ color: "#16a34a" }} /> : <Copy size={11} style={{ color: "var(--vt-gray-500)" }} />}
        </button>
      )}
    </div>
  );
}

function KolProfileCell({
  kolProfileId, allProfiles, accountId,
  onChange,
}: {
  kolProfileId: string | null;
  allProfiles: typeof PROFILES;
  accountId: string;
  onChange: (accountId: string, profileId: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const profile = allProfiles.find((p) => p.id === kolProfileId);

  return (
    <div className="flex items-center gap-1.5 group">
      {profile ? (
        <>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
            style={{ background: profile.avatarColor }}>
            {profile.initials}
          </div>
          <span className="text-[12px] font-medium" style={{ color: "var(--vt-navy)" }}>{profile.name}</span>
        </>
      ) : (
        <span className="text-[12px] italic" style={{ color: "var(--vt-gray-500)" }}>Chưa gán</span>
      )}
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 ml-auto"
        onClick={() => setEditing(true)}
        title="Thay đổi profile"
      >
        <Settings size={11} style={{ color: "var(--vt-gray-500)" }} />
      </button>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="vt-card p-4 w-64 shadow-xl">
            <div className="text-[13px] font-bold mb-3" style={{ color: "var(--vt-navy)" }}>Gán Profile KOL</div>
            <div className="space-y-1.5">
              <button
                className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] hover:bg-gray-50 italic"
                style={{ color: "var(--vt-gray-500)" }}
                onClick={() => { onChange(accountId, null); setEditing(false); }}
              >
                Bỏ gán
              </button>
              {allProfiles.map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => { onChange(accountId, p.id); setEditing(false); }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white"
                    style={{ background: p.avatarColor }}>{p.initials}</div>
                  <div>
                    <div className="text-[12.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>{p.name}</div>
                    <div className="text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>{p.nicheLabel}</div>
                  </div>
                  {p.id === kolProfileId && <Check size={13} className="ml-auto" style={{ color: "var(--vt-orange)" }} />}
                </button>
              ))}
            </div>
            <button
              className="mt-3 w-full text-center text-[12px] py-1.5 rounded-lg hover:bg-gray-100"
              style={{ color: "var(--vt-gray-500)" }}
              onClick={() => setEditing(false)}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Account Modal ───────────────────────────────────────────────────────

function AddAccountModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (acc: Omit<SocialAccount, "id">) => void;
}) {
  const [form, setForm] = useState({
    uid: "", password: "", twoFaSecret: "", fbName: "", kolProfileId: "" as string | null,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.uid || !form.password || !form.fbName) return;
    onAdd({
      uid: form.uid, password: form.password,
      twoFaSecret: form.twoFaSecret, fbName: form.fbName,
      kolProfileId: form.kolProfileId || null,
      avatarColor: "#6B7280", status: "disconnected",
      connectedAt: null, lastActiveAt: null, lastPostedAt: null,
      friends: 0, followers: 0, postsCount: 0, healthScore: 0,
      dailyLimit: 5, usedToday: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="vt-card p-6 w-[420px] shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-bold" style={{ color: "var(--vt-navy)" }}>Thêm tài khoản Facebook</h3>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 text-[20px] leading-none"
            onClick={onClose}>&times;</button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-[11.5px] font-semibold mb-1" style={{ color: "var(--vt-gray-900)" }}>
              UID Facebook <span className="text-red-500">*</span>
            </label>
            <input className="vt-input font-mono text-[13px]" placeholder="100089234156712"
              value={form.uid} onChange={(e) => set("uid", e.target.value)} />
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold mb-1" style={{ color: "var(--vt-gray-900)" }}>
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input className="vt-input text-[13px]" type="password" placeholder="Nhập mật khẩu"
              value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold mb-1" style={{ color: "var(--vt-gray-900)" }}>
              Secret 2FA <span className="text-[10.5px] font-normal" style={{ color: "var(--vt-gray-500)" }}>(tuỳ chọn)</span>
            </label>
            <input className="vt-input font-mono text-[13px]" placeholder="JBSWY3DPEHPK3PXP"
              value={form.twoFaSecret} onChange={(e) => set("twoFaSecret", e.target.value.toUpperCase())} />
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold mb-1" style={{ color: "var(--vt-gray-900)" }}>
              Tên Facebook <span className="text-red-500">*</span>
            </label>
            <input className="vt-input text-[13px]" placeholder="Tên hiển thị trên Facebook"
              value={form.fbName} onChange={(e) => set("fbName", e.target.value)} />
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold mb-1.5" style={{ color: "var(--vt-gray-900)" }}>
              Profile KOL <span className="text-[10.5px] font-normal" style={{ color: "var(--vt-gray-500)" }}>(tuỳ chọn)</span>
            </label>
            <div className="space-y-1.5">
              {/* No profile option */}
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 transition-colors text-left"
                style={{
                  borderColor: !form.kolProfileId ? "var(--vt-blue)" : "var(--vt-gray-100)",
                  background: !form.kolProfileId ? "rgba(44,90,160,0.05)" : "white",
                }}
                onClick={() => set("kolProfileId", "")}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#E5E7EB", color: "#6B7280" }}>
                  <span className="text-[11px] font-bold">?</span>
                </div>
                <span className="text-[12.5px] italic" style={{ color: "var(--vt-gray-500)" }}>Chưa gán profile</span>
                {!form.kolProfileId && <Check size={13} className="ml-auto" style={{ color: "var(--vt-blue)" }} />}
              </button>

              {PROFILES.map((p) => {
                const brand = KOL_BRANDS.find((b) => b.profileId === p.id);
                const isSelected = form.kolProfileId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 transition-colors text-left"
                    style={{
                      borderColor: isSelected ? p.avatarColor : "var(--vt-gray-100)",
                      background: isSelected ? `${p.avatarColor}0d` : "white",
                    }}
                    onClick={() => set("kolProfileId", p.id)}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: p.avatarColor }}>{p.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold" style={{ color: "var(--vt-navy)" }}>{p.name}</div>
                      <div className="text-[11px] truncate" style={{ color: "var(--vt-gray-500)" }}>
                        {brand ? brand.writingTones.slice(0, 3).join(" · ") : p.nicheLabel}
                      </div>
                    </div>
                    {isSelected && <Check size={13} className="shrink-0" style={{ color: p.avatarColor }} />}
                  </button>
                );
              })}
            </div>

            {/* Preview KOL brand when selected */}
            {form.kolProfileId && (() => {
              const brand = KOL_BRANDS.find((b) => b.profileId === form.kolProfileId);
              if (!brand) return null;
              return (
                <div className="mt-2 p-3 rounded-xl" style={{ background: "rgba(44,90,160,0.06)" }}>
                  <p className="text-[11.5px] font-semibold mb-1" style={{ color: "var(--vt-blue)" }}>
                    Phong cách AI sẽ dùng:
                  </p>
                  <p className="text-[11.5px]" style={{ color: "var(--vt-gray-900)" }}>
                    {brand.writingStyle.slice(0, 100)}…
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button className="vt-btn-secondary" onClick={onClose}>Huỷ</button>
          <button
            className="vt-btn-primary"
            onClick={submit}
            disabled={!form.uid || !form.password || !form.fbName}
            style={{ opacity: (!form.uid || !form.password || !form.fbName) ? 0.5 : 1 }}
          >
            <Plus size={14} /> Thêm tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(SOCIAL_ACCOUNTS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [filterProfile, setFilterProfile] = useState("all");
  const [filterStatus, setFilterStatus] = useState<AccountStatus | "all">("all");
  const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());

  const filtered = accounts.filter((a) => {
    if (filterProfile !== "all" && a.kolProfileId !== filterProfile) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  });

  const allChecked = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const someChecked = selected.size > 0;

  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const connect = (ids: string[]) => {
    setConnectingIds((s) => new Set([...s, ...ids]));
    setTimeout(() => {
      setAccounts((prev) => prev.map((a) =>
        ids.includes(a.id)
          ? { ...a, status: "live", connectedAt: new Date().toISOString(), lastActiveAt: new Date().toISOString() }
          : a
      ));
      setConnectingIds((s) => { const n = new Set(s); ids.forEach((id) => n.delete(id)); return n; });
      setSelected(new Set());
    }, 1800);
  };

  const disconnect = (ids: string[]) => {
    setAccounts((prev) => prev.map((a) =>
      ids.includes(a.id) ? { ...a, status: "disconnected" } : a
    ));
    setSelected(new Set());
  };

  const remove = (ids: string[]) => {
    setAccounts((prev) => prev.filter((a) => !ids.includes(a.id)));
    setSelected((s) => { const n = new Set(s); ids.forEach((id) => n.delete(id)); return n; });
  };

  const updateKolProfile = (accountId: string, profileId: string | null) => {
    setAccounts((prev) => prev.map((a) => a.id === accountId ? { ...a, kolProfileId: profileId } : a));
  };

  const addAccount = (acc: Omit<SocialAccount, "id">) => {
    const id = "acc" + Date.now();
    setAccounts((prev) => [...prev, { ...acc, id }]);
  };

  const stats = {
    total: accounts.length,
    live: accounts.filter((a) => a.status === "live").length,
    checkpoint: accounts.filter((a) => a.status === "checkpoint").length,
    die: accounts.filter((a) => a.status === "die").length,
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng",       value: stats.total,      color: "var(--vt-navy)", bg: "rgba(44,90,160,0.07)" },
          { label: "Live",       value: stats.live,       color: "#16a34a",        bg: "rgba(22,163,74,0.1)"  },
          { label: "Checkpoint", value: stats.checkpoint, color: "#d97706",        bg: "rgba(217,119,6,0.1)"  },
          { label: "Die",        value: stats.die,        color: "#dc2626",        bg: "rgba(220,38,38,0.1)"  },
        ].map((s) => (
          <div key={s.label} className="vt-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] font-bold shrink-0"
              style={{ background: s.bg, color: s.color }}>{s.value}</div>
            <span className="text-[12.5px] font-medium" style={{ color: "var(--vt-gray-500)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {/* Bulk actions */}
          {someChecked && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border"
              style={{ borderColor: "var(--vt-blue)", background: "rgba(44,90,160,0.05)" }}>
              <span className="text-[12px] font-semibold mr-1" style={{ color: "var(--vt-blue)" }}>
                {selected.size} đã chọn
              </span>
              <button
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors hover:opacity-90"
                style={{ background: "#16a34a", color: "white" }}
                onClick={() => connect([...selected])}
              >
                <Wifi size={12} /> Kết nối
              </button>
              <button
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium"
                style={{ background: "rgba(107,114,128,0.12)", color: "var(--vt-gray-500)" }}
                onClick={() => disconnect([...selected])}
              >
                <WifiOff size={12} /> Ngắt
              </button>
              <button
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium hover:bg-red-50"
                style={{ color: "#dc2626" }}
                onClick={() => remove([...selected])}
              >
                <Trash2 size={12} /> Xóa
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => setSelected(new Set())}>
                <X size={13} style={{ color: "var(--vt-gray-500)" }} />
              </button>
            </div>
          )}

          <select className="vt-input text-[12.5px] py-1.5 w-auto" value={filterProfile}
            onChange={(e) => setFilterProfile(e.target.value)}>
            <option value="all">Tất cả profile</option>
            {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select className="vt-input text-[12.5px] py-1.5 w-auto" value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AccountStatus | "all")}>
            <option value="all">Tất cả trạng thái</option>
            {(Object.keys(ACCOUNT_STATUS_META) as AccountStatus[]).map((s) => (
              <option key={s} value={s}>{ACCOUNT_STATUS_META[s].label}</option>
            ))}
          </select>
        </div>

        <button className="vt-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Thêm tài khoản
        </button>
      </div>

      {/* Table */}
      <div className="vt-card overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b text-[11px] font-semibold uppercase tracking-wide"
              style={{ borderColor: "var(--vt-gray-100)", color: "var(--vt-gray-500)", background: "var(--vt-bg)" }}>
              <th className="px-4 py-3 w-8">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[var(--vt-blue)] cursor-pointer"
                  checked={allChecked} onChange={toggleAll} />
              </th>
              <th className="text-center px-2 py-3 w-10">STT</th>
              <th className="text-left px-3 py-3">UID</th>
              <th className="text-left px-3 py-3">Mật khẩu</th>
              <th className="text-left px-3 py-3">2FA</th>
              <th className="text-left px-3 py-3">Tên Facebook</th>
              <th className="text-left px-3 py-3">Profile KOL</th>
              <th className="text-center px-3 py-3">Bạn bè</th>
              <th className="text-center px-3 py-3">Followers</th>
              <th className="text-center px-3 py-3">Bài đăng</th>
              <th className="text-left px-3 py-3">Sức khoẻ</th>
              <th className="text-left px-3 py-3">Hoạt động cuối</th>
              <th className="text-left px-3 py-3">Trạng thái</th>
              <th className="text-center px-3 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={14} className="text-center py-16">
                  <div className="text-[36px] mb-3">📭</div>
                  <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--vt-navy)" }}>
                    Không có tài khoản nào
                  </div>
                  <p className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>
                    Thay đổi bộ lọc hoặc thêm tài khoản mới
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((acc, idx) => {
                const isSelected = selected.has(acc.id);
                const isConnecting = connectingIds.has(acc.id);
                const profile = PROFILES.find((p) => p.id === acc.kolProfileId);
                const displayStatus: AccountStatus = isConnecting ? "connecting" : acc.status;
                const canConnect = !isConnecting && acc.status !== "live";

                return (
                  <tr
                    key={acc.id}
                    className="transition-colors hover:bg-gray-50"
                    style={{
                      borderBottom: idx < filtered.length - 1 ? "1px solid var(--vt-gray-100)" : "none",
                      background: isSelected ? "rgba(44,90,160,0.04)" : undefined,
                    }}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input type="checkbox" className="w-3.5 h-3.5 accent-[var(--vt-blue)] cursor-pointer"
                        checked={isSelected} onChange={() => toggleOne(acc.id)} />
                    </td>

                    {/* STT */}
                    <td className="px-2 py-3 text-center">
                      <span className="text-[12px] font-semibold" style={{ color: "var(--vt-gray-500)" }}>
                        {idx + 1}
                      </span>
                    </td>

                    {/* UID */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 group">
                        <span className="font-mono text-[12px]" style={{ color: "var(--vt-gray-900)" }}>
                          {acc.uid}
                        </span>
                        <CopyBtn value={acc.uid} />
                      </div>
                    </td>

                    {/* Password */}
                    <td className="px-3 py-3">
                      <MaskedField value={acc.password} />
                    </td>

                    {/* 2FA */}
                    <td className="px-3 py-3">
                      <TotpCell secret={acc.twoFaSecret} active={!!acc.twoFaSecret && acc.status === "live"} />
                    </td>

                    {/* FB Name */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white shrink-0"
                          style={{ background: acc.avatarColor }}>
                          {acc.fbName.slice(0, 1)}
                        </div>
                        <span className="text-[12.5px] font-medium" style={{ color: "var(--vt-navy)" }}>
                          {acc.fbName}
                        </span>
                      </div>
                    </td>

                    {/* Profile KOL */}
                    <td className="px-3 py-3 min-w-[130px]">
                      <KolProfileCell
                        kolProfileId={acc.kolProfileId}
                        allProfiles={PROFILES}
                        accountId={acc.id}
                        onChange={updateKolProfile}
                      />
                    </td>

                    {/* Friends */}
                    <td className="px-3 py-3 text-center">
                      <span className="text-[12.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>
                        {acc.friends > 0 ? fmtNum(acc.friends) : "—"}
                      </span>
                    </td>

                    {/* Followers */}
                    <td className="px-3 py-3 text-center">
                      <span className="text-[12.5px] font-semibold" style={{ color: "var(--vt-navy)" }}>
                        {acc.followers > 0 ? fmtNum(acc.followers) : "—"}
                      </span>
                    </td>

                    {/* Posts */}
                    <td className="px-3 py-3 text-center">
                      <span className="text-[12.5px]" style={{ color: "var(--vt-gray-900)" }}>
                        {acc.postsCount > 0 ? acc.postsCount : "—"}
                      </span>
                    </td>

                    {/* Health */}
                    <td className="px-3 py-3">
                      {acc.healthScore > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--vt-gray-100)" }}>
                            <div className="h-full rounded-full" style={{
                              width: `${acc.healthScore}%`,
                              background: healthColor(acc.healthScore),
                            }} />
                          </div>
                          <span className="text-[11.5px] font-bold tabular-nums" style={{ color: healthColor(acc.healthScore) }}>
                            {acc.healthScore}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[12px] italic" style={{ color: "var(--vt-gray-500)" }}>—</span>
                      )}
                    </td>

                    {/* Last active */}
                    <td className="px-3 py-3">
                      <span className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
                        {fmtDate(acc.lastActiveAt)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <StatusBadge status={displayStatus} />
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        {/* Connect / Disconnect */}
                        {canConnect ? (
                          <button
                            title="Kết nối"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-90"
                            style={{ background: "rgba(22,163,74,0.12)", color: "#16a34a" }}
                            onClick={() => connect([acc.id])}
                          >
                            <Link2 size={13} />
                          </button>
                        ) : (
                          <button
                            title="Ngắt kết nối"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                            style={{ color: "var(--vt-gray-500)" }}
                            onClick={() => disconnect([acc.id])}
                            disabled={isConnecting}
                          >
                            {isConnecting
                              ? <Loader2 size={13} className="animate-spin" style={{ color: "var(--vt-blue)" }} />
                              : <Link2Off size={13} />}
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          title="Xoá"
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                          style={{ color: "#dc2626" }}
                          onClick={() => remove([acc.id])}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd && <AddAccountModal onClose={() => setShowAdd(false)} onAdd={addAccount} />}
    </div>
  );
}

// small inline copy button used for UID
function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100"
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
    >
      {copied
        ? <Check size={11} style={{ color: "#16a34a" }} />
        : <Copy size={11} style={{ color: "var(--vt-gray-500)" }} />}
    </button>
  );
}
