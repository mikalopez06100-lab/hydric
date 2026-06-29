import { Bell } from "lucide-react";
import { HydricMark } from "@/components/ui/HydricMark";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showLogo?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, showLogo = false, right, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between border-b border-rule bg-bone px-[18px] pb-3 pt-3.5",
        className
      )}
    >
      {showLogo ? (
        <div className="flex items-center">
          <HydricMark size={24} />
        </div>
      ) : (
        <div className="text-[13px] font-semibold tracking-wide text-ink">
          {title}
        </div>
      )}
      {right ?? (
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-7 w-7 items-center justify-center border border-rule bg-paper"
          style={{ borderRadius: 6 }}
        >
          <Bell className="h-3.5 w-3.5 text-ink-mid" />
        </button>
      )}
    </header>
  );
}
