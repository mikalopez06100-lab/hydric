import { cn } from "@/lib/utils";

export const HYDRIC_LOGO_PATH = "/brand/logo-hydric.png";

export function HydricLogo({
  height,
  size,
  className,
  priority,
}: {
  height?: number;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const h = height ?? size ?? 40;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={HYDRIC_LOGO_PATH}
      alt="HYDRIC"
      width={h}
      height={h}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("block w-auto object-contain", className)}
      style={{ height: h, width: "auto" }}
    />
  );
}
