import { cn } from "../../lib/utils";
import type { Status, Priority, Strength } from "../../lib/mock-data";

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  "Not Started":         { bg: "#1a1a1a", color: "#737373" },
  "In Progress":         { bg: "#1d3557", color: "#60a5fa" },
  "Waiting for Client":  { bg: "#2d2000", color: "#fbbf24" },
  "Waiting for Approval":{ bg: "#2a1a3e", color: "#c084fc" },
  "Submitted":           { bg: "#1a1f3e", color: "#818cf8" },
  "Published":           { bg: "#0f2d1f", color: "#34d399" },
  "Completed":           { bg: "#0d2b1a", color: "#4ade80" },
  "Rejected":            { bg: "#2d1515", color: "#f87171" },
  "On Hold":             { bg: "#2d1f0a", color: "#fb923c" },
};

const PRIORITY_STYLES: Record<Priority, { bg: string; color: string }> = {
  "Low":    { bg: "#1a1a1a", color: "#737373" },
  "Medium": { bg: "#2d2000", color: "#fbbf24" },
  "High":   { bg: "#2d0f0f", color: "#f87171" },
};

const STRENGTH_STYLES: Record<Strength, { bg: string; color: string }> = {
  "Weak":     { bg: "#2d0f0f", color: "#f87171" },
  "Moderate": { bg: "#2d2000", color: "#fbbf24" },
  "Strong":   { bg: "#0d2b1a", color: "#4ade80" },
};

function Chip({ bg, color, label, className }: { bg: string; color: string; label: string; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide", className)}
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "#1a1a1a", color: "#737373" };
  return <Chip bg={s.bg} color={s.color} label={status} className={className} />;
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const s = PRIORITY_STYLES[priority] ?? { bg: "#1a1a1a", color: "#737373" };
  return <Chip bg={s.bg} color={s.color} label={priority} className={className} />;
}

export function StrengthBadge({ strength, className }: { strength: Strength; className?: string }) {
  const s = STRENGTH_STYLES[strength] ?? { bg: "#1a1a1a", color: "#737373" };
  return <Chip bg={s.bg} color={s.color} label={strength} className={className} />;
}
