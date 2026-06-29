import { HydricLogo as Logo } from "@/components/brand/HydricLogo";
import { cn } from "@/lib/utils";

interface HydricMarkProps {
  size?: number;
  variant?: "filled" | "outline";
  className?: string;
}

/** Logo HYDRIC compact (header app, etc.) */
export function HydricMark({
  size = 22,
  className,
}: HydricMarkProps) {
  return <Logo height={Math.round(size * 1.75)} className={cn(className)} />;
}
