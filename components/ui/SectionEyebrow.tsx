import { cn } from "@/lib/utils";

interface SectionEyebrowProps {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "div";
}

export function SectionEyebrow({
  children,
  className,
  as: Tag = "p",
}: SectionEyebrowProps) {
  return (
    <Tag
      className={cn(
        "eyebrow-line flex items-center gap-2 px-5 pb-2.5 pt-4 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft",
        className
      )}
    >
      {children}
    </Tag>
  );
}
