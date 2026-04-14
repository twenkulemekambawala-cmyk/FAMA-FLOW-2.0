import { cn } from "@/lib/utils";

interface MarginDialProps {
  margin: number;
  threshold?: number;
  target?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function MarginDial({ margin, threshold = 12, target = 25, size = "md", label }: MarginDialProps) {
  const sizeMap = { sm: 80, md: 120, lg: 160 };
  const dim = sizeMap[size];
  const strokeWidth = size === "sm" ? 6 : 8;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedMargin = Math.min(Math.max(margin, 0), 50);
  const progress = (clampedMargin / 50) * circumference;

  const color = margin >= target ? "hsl(var(--success))" : margin >= threshold ? "hsl(var(--warning))" : "hsl(var(--danger))";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth} />
          <circle
            cx={dim / 2} cy={dim / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display font-bold", size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-3xl")} style={{ color }}>
            {margin}%
          </span>
        </div>
      </div>
      {label && <span className="text-xs text-muted-foreground font-medium">{label}</span>}
    </div>
  );
}
