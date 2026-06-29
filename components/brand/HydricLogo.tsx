import Image from "next/image";
import { cn } from "@/lib/utils";

export const HYDRIC_LOGO_PATH = "/brand/logo-hydric.png";

export function HydricLogo({
  height,
  size,
  className,
  priority,
}: {
  /** Hauteur affichée en px */
  height?: number;
  /** Alias rétrocompatible */
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const h = height ?? size ?? 40;

  return (
    <Image
      src={HYDRIC_LOGO_PATH}
      alt="HYDRIC"
      width={h}
      height={h}
      priority={priority}
      className={cn("w-auto object-contain", className)}
      style={{ height: h, width: "auto" }}
    />
  );
}
