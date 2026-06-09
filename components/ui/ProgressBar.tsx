import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  trackClassName?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  trackClassName,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        "h-[3px] overflow-hidden bg-bone-deep",
        trackClassName,
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-sage transition-all duration-500",
          barClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
