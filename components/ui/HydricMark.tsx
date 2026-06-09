import { cn } from "@/lib/utils";

interface HydricMarkProps {
  size?: number;
  variant?: "filled" | "outline";
  className?: string;
}

export function HydricMark({
  size = 22,
  variant = "filled",
  className,
}: HydricMarkProps) {
  const fill = variant === "filled" ? "#8B9D87" : "none";
  const stroke = variant === "outline" ? "#F4F1EA" : "none";
  const glyph = "#F4F1EA";

  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle
        cx="64"
        cy="64"
        r={variant === "outline" ? 61 : 62}
        fill={fill}
        stroke={stroke}
        strokeWidth={variant === "outline" ? 2 : 0}
      />
      <g fill={glyph}>
        <rect x="34" y="30" width="14" height="68" rx="1" />
        <rect x="80" y="30" width="14" height="68" rx="1" />
        <rect x="28" y="28" width="26" height="5" />
        <rect x="28" y="95" width="26" height="5" />
        <rect x="74" y="28" width="26" height="5" />
        <rect x="74" y="95" width="26" height="5" />
        <rect x="48" y="58" width="32" height="8" />
      </g>
      <path
        d="M48 62 Q56 50 64 62 T80 62"
        stroke={glyph}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
