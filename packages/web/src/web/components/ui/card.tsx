import { cn } from "../../lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ className, children, style }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f", ...style }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-5 py-4", className)} style={{ borderBottom: "1px solid #1f1f1f" }}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  change?: { value: string; positive: boolean };
  accent?: boolean;
}

export function KPICard({ title, value, subtitle, icon, color, change, accent }: KPICardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={
        accent
          ? { backgroundColor: "#ffe500", border: "1px solid #ffe500" }
          : { backgroundColor: "#111111", border: "1px solid #1f1f1f" }
      }
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent ? "#0a0a0a" : "#737373" }}>
            {title}
          </p>
          <p className="text-3xl font-black mt-1" style={{ color: accent ? "#0a0a0a" : "#ffffff" }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: accent ? "#0a0a0a88" : "#737373" }}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={accent ? { backgroundColor: "rgba(0,0,0,0.1)" } : { backgroundColor: "#1a1a1a" }}
          >
            {icon}
          </div>
        )}
      </div>
      {change && (
        <p
          className="text-xs font-medium"
          style={{ color: accent ? "#0a0a0a" : change.positive ? "#4ade80" : "#f87171" }}
        >
          {change.positive ? "↑" : "↓"} {change.value}
        </p>
      )}
    </div>
  );
}
