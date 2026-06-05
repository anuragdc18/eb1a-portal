import { cn } from "../../lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-12 h-12 text-sm",
  xl: "w-16 h-16 text-base",
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-bold shrink-0", SIZE_MAP[size], className)}
      style={{ backgroundColor: "#ffe500", color: "#0a0a0a" }}
    >
      {name?.slice(0, 2).toUpperCase() || "??"}
    </div>
  );
}
