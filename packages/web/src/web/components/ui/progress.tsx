import { cn } from "../../lib/utils";

interface ProgressBarProps {
  value: number;
  size?: "sm" | "md";
  color?: "yellow" | "green" | "amber" | "blue" | "red";
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  yellow: "#ffe500",
  green: "#4ade80",
  amber: "#fbbf24",
  blue: "#60a5fa",
  red: "#f87171",
};

export function ProgressBar({ value, size = "md", color = "yellow", className }: ProgressBarProps) {
  const h = size === "sm" ? "h-1" : "h-1.5";
  const fill = COLOR_MAP[color] ?? "#ffe500";

  return (
    <div className={cn("w-full rounded-full overflow-hidden", h, className)} style={{ backgroundColor: "#1f1f1f" }}>
      <div
        className={cn("h-full rounded-full transition-all duration-500")}
        style={{ width: `${Math.min(value, 100)}%`, backgroundColor: fill }}
      />
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export function CircularProgress({ value, size = 64, strokeWidth = 6, label, color = "#ffe500" }: CircularProgressProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f1f1f" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color: "#ffffff" }}>{value}%</span>
        </div>
      </div>
      {label && <span className="text-[10px]" style={{ color: "#737373" }}>{label}</span>}
    </div>
  );
}
