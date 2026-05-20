"use client";

import { useState } from "react";
import {
  Bot, MessageSquare, HelpCircle, ShoppingCart, User, ArrowRight,
  Plus, Edit3, PlayCircle, Save, Clock, GitBranch, Layers, Sliders
} from "lucide-react";
import { BOT_SCENARIOS, type BotScenario } from "@/lib/mock-data";

const ICON_MAP: Record<string, typeof Bot> = {
  Bot, MessageSquare, HelpCircle, ShoppingCart, User, ArrowRight,
};

export default function BotPage() {
  const [selectedId, setSelectedId] = useState<string>(BOT_SCENARIOS[0].id);
  const [scenarios, setScenarios] = useState(BOT_SCENARIOS);

  const selected = scenarios.find((s) => s.id === selectedId);

  const toggleActive = (id: string) => {
    setScenarios((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-4">
        {/* scenario list */}
        <div className="col-span-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold" style={{ color: "var(--vt-navy)" }}>
              Kịch bản bot ({scenarios.length})
            </h3>
            <button className="vt-btn-primary text-[12px] !py-1.5">
              <Plus size={12} /> Mới
            </button>
          </div>

          <div className="space-y-2">
            {scenarios.map((s) => {
              const Icon = ICON_MAP[s.icon] ?? Bot;
              const active = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className="w-full text-left vt-card p-3.5 transition-all hover:shadow-md"
                  style={{
                    border: active ? "2px solid var(--vt-blue)" : "1px solid var(--vt-gray-100)",
                    background: active ? "rgba(44,90,160,0.04)" : "white",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: s.active ? "rgba(63,177,181,0.16)" : "var(--vt-bg)",
                        color: s.active ? "var(--vt-teal)" : "var(--vt-gray-500)"
                      }}
                    >
                      <Icon size={18} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[13.5px] font-bold" style={{ color: "var(--vt-navy)" }}>{s.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleActive(s.id); }}
                          className="relative w-9 h-5 rounded-full transition-colors shrink-0 ml-2"
                          style={{ background: s.active ? "var(--vt-teal)" : "var(--vt-gray-100)" }}
                        >
                          <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                            style={{ left: s.active ? "calc(100% - 18px)" : "2px" }} />
                        </button>
                      </div>
                      <p className="text-[11.5px] line-clamp-2" style={{ color: "var(--vt-gray-500)" }}>
                        {s.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* scenario detail */}
        <div className="col-span-8">
          {selected && <ScenarioDetail scenario={selected} />}
        </div>
      </div>
    </div>
  );
}

function ScenarioDetail({ scenario }: { scenario: BotScenario }) {
  const Icon = ICON_MAP[scenario.icon] ?? Bot;
  const [section, setSection] = useState<"flow" | "config">("flow");

  return (
    <>
      <div className="vt-card p-5 mb-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center"
            style={{ background: scenario.active ? "rgba(63,177,181,0.16)" : "var(--vt-bg)", color: scenario.active ? "var(--vt-teal)" : "var(--vt-gray-500)" }}>
            <Icon size={20} strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <h2 className="text-[16px] font-bold" style={{ color: "var(--vt-navy)" }}>{scenario.name}</h2>
            <p className="text-[12.5px]" style={{ color: "var(--vt-gray-500)" }}>{scenario.description}</p>
          </div>
          <button className="vt-btn-secondary">
            <PlayCircle size={13} /> Test bot
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-xl vt-card w-fit mb-3">
        <button
          onClick={() => setSection("flow")}
          className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold flex items-center gap-1.5"
          style={section === "flow"
            ? { background: "var(--vt-navy)", color: "white" }
            : { color: "var(--vt-gray-500)" }}
        >
          <GitBranch size={13} /> Flow
        </button>
        <button
          onClick={() => setSection("config")}
          className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold flex items-center gap-1.5"
          style={section === "config"
            ? { background: "var(--vt-navy)", color: "white" }
            : { color: "var(--vt-gray-500)" }}
        >
          <Sliders size={13} /> Cấu hình
        </button>
      </div>

      {section === "flow" ? <FlowSection scenario={scenario} /> : <ConfigSection />}
    </>
  );
}

function FlowSection({ scenario }: { scenario: BotScenario }) {
  return (
    <div className="vt-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13.5px] font-bold" style={{ color: "var(--vt-navy)" }}>
          Sơ đồ luồng ({scenario.steps.length} bước)
        </h3>
        <button className="vt-btn-secondary text-[12px]"><Plus size={12} /> Thêm bước</button>
      </div>

      <div className="space-y-3">
        {scenario.steps.map((step, idx) => {
          const colors = {
            trigger: { bg: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" },
            action: { bg: "rgba(63,177,181,0.16)", color: "var(--vt-teal)" },
            next: { bg: "rgba(245,166,35,0.16)", color: "#b45309" },
          };
          const c = colors[step.type];
          return (
            <div key={idx}>
              <div className="flex items-stretch gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold"
                    style={{ background: c.bg, color: c.color }}>
                    {idx + 1}
                  </div>
                  {idx < scenario.steps.length - 1 && (
                    <div className="flex-1 w-px my-1" style={{ background: "var(--vt-gray-100)" }} />
                  )}
                </div>
                <div className="flex-1 border rounded-lg p-3.5" style={{ borderColor: "var(--vt-gray-100)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="vt-badge" style={{ background: c.bg, color: c.color }}>{step.label}</span>
                      <span className="text-[13px] font-bold" style={{ color: "var(--vt-navy)" }}>
                        {step.type === "trigger" ? "Khi nào kích hoạt?" : step.type === "action" ? "Bot làm gì?" : "Tiếp theo"}
                      </span>
                    </div>
                    <button className="vt-btn-ghost !p-1.5"><Edit3 size={12} /></button>
                  </div>
                  <p className="text-[13px]" style={{ color: "var(--vt-gray-900)" }}>{step.detail}</p>
                </div>
              </div>
              {idx < scenario.steps.length - 1 && (
                <div className="flex justify-center my-1" style={{ marginLeft: 17 }}>
                  <ArrowRight size={14} className="rotate-90" style={{ color: "var(--vt-gray-500)" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConfigSection() {
  const [hours, setHours] = useState({ start: "08:00", end: "22:00" });
  const [maxTurns, setMaxTurns] = useState(3);
  const [freeForm, setFreeForm] = useState(true);
  const [threshold, setThreshold] = useState(70);

  return (
    <div className="vt-card p-5 space-y-5">
      <div>
        <label className="block text-[12.5px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>
          <Clock size={12} className="inline mr-1" /> Giờ hoạt động
        </label>
        <p className="text-[11.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
          Bot chỉ reply trong khoảng giờ này. Ngoài giờ → handoff
        </p>
        <div className="flex items-center gap-3">
          <input type="time" value={hours.start} onChange={(e) => setHours({ ...hours, start: e.target.value })}
            className="vt-input text-[13px] !w-auto" />
          <span className="text-[12px]" style={{ color: "var(--vt-gray-500)" }}>đến</span>
          <input type="time" value={hours.end} onChange={(e) => setHours({ ...hours, end: e.target.value })}
            className="vt-input text-[13px] !w-auto" />
        </div>
      </div>

      <div className="pt-5 border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
        <label className="block text-[12.5px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>
          <Layers size={12} className="inline mr-1" /> Max vòng hội thoại
        </label>
        <p className="text-[11.5px] mb-2" style={{ color: "var(--vt-gray-500)" }}>
          Sau N vòng mà chưa chốt → handoff sang người
        </p>
        <select value={maxTurns} onChange={(e) => setMaxTurns(Number(e.target.value))}
          className="vt-input text-[13px] !w-auto">
          <option value={2}>2 vòng</option>
          <option value={3}>3 vòng</option>
          <option value={5}>5 vòng</option>
          <option value={10}>10 vòng</option>
        </select>
      </div>

      <div className="pt-5 border-t flex items-start justify-between" style={{ borderColor: "var(--vt-gray-100)" }}>
        <div className="flex-1">
          <label className="block text-[12.5px] font-bold mb-1" style={{ color: "var(--vt-navy)" }}>
            <Bot size={12} className="inline mr-1" /> AI Free-form mode
          </label>
          <p className="text-[11.5px]" style={{ color: "var(--vt-gray-500)" }}>
            Cho phép bot trả lời tự do (LLM) khi không match keyword nào
          </p>
        </div>
        <button
          onClick={() => setFreeForm(!freeForm)}
          className="relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3"
          style={{ background: freeForm ? "var(--vt-teal)" : "var(--vt-gray-100)" }}
        >
          <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
            style={{ left: freeForm ? "calc(100% - 22px)" : "2px" }} />
        </button>
      </div>

      <div className="pt-5 border-t" style={{ borderColor: "var(--vt-gray-100)" }}>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[12.5px] font-bold" style={{ color: "var(--vt-navy)" }}>
            Confidence threshold
          </label>
          <span className="text-[14px] font-bold px-2 py-0.5 rounded"
            style={{ background: "rgba(44,90,160,0.1)", color: "var(--vt-blue)" }}>
            0.{threshold.toString().padStart(2, "0")}
          </span>
        </div>
        <p className="text-[11.5px] mb-3" style={{ color: "var(--vt-gray-500)" }}>
          Bot chỉ tự reply khi confidence ≥ ngưỡng này. Thấp hơn → handoff
        </p>
        <input
          type="range"
          min={50}
          max={95}
          step={5}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: "var(--vt-gray-100)", accentColor: "var(--vt-blue)" }}
        />
        <div className="flex justify-between mt-1 text-[10.5px]" style={{ color: "var(--vt-gray-500)" }}>
          <span>0.50 (rộng rãi)</span>
          <span>0.95 (chặt chẽ)</span>
        </div>
      </div>

      <div className="pt-5 border-t flex items-center justify-end gap-2" style={{ borderColor: "var(--vt-gray-100)" }}>
        <button className="vt-btn-secondary">Khôi phục mặc định</button>
        <button className="vt-btn-primary">
          <Save size={14} /> Lưu cấu hình
        </button>
      </div>
    </div>
  );
}
