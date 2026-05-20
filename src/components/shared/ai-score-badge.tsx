import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react";

interface AIScoreBadgeProps {
  score: number; // 0-100 (% unsafe)
  size?: "sm" | "md";
}

export function AIScoreBadge({ score, size = "md" }: AIScoreBadgeProps) {
  let bg = "rgba(22,163,74,0.14)";
  let color = "#15803d";
  let Icon = ShieldCheck;
  let label = "An toàn";

  if (score > 50) {
    bg = "rgba(230,57,70,0.14)";
    color = "#dc2626";
    Icon = AlertOctagon;
    label = "Cần viết lại";
  } else if (score >= 30) {
    bg = "rgba(245,166,35,0.18)";
    color = "#b45309";
    Icon = AlertTriangle;
    label = "Cẩn thận";
  }

  const iconSize = size === "sm" ? 11 : 13;
  const padding = size === "sm" ? "2px 6px" : "3px 9px";
  const fontSize = size === "sm" ? "10.5px" : "12px";

  return (
    <span
      style={{ background: bg, color, padding, fontSize }}
      className="inline-flex items-center gap-1 rounded-md font-semibold whitespace-nowrap"
    >
      <Icon size={iconSize} strokeWidth={2.4} />
      <span>{label}</span>
      <span className="opacity-70 font-medium">· {score}%</span>
    </span>
  );
}
