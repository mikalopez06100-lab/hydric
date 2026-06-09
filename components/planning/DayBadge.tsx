import { cn } from "@/lib/utils";
import type { DayType } from "@/types";

interface DayBadgeProps {
  type: DayType;
  dayNumber?: number;
  className?: string;
}

export function DayBadge({ type, dayNumber, className }: DayBadgeProps) {
  const isHydric = type === "hydric";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider",
        isHydric
          ? "border-sage/35 bg-sage/15 text-sage"
          : "border-clay/35 bg-clay/15 text-clay",
        className
      )}
      style={{ borderRadius: 2 }}
    >
      <span
        className={cn(
          "h-[5px] w-[5px] rounded-full",
          isHydric ? "bg-sage" : "bg-clay"
        )}
      />
      {isHydric ? "Hydrique" : "Alimentaire"}
      {dayNumber !== undefined && ` · J${dayNumber}`}
    </span>
  );
}
