import Image from "next/image";
import logoImage from "@/assets/brand/logo-hydric.png";
import { cn } from "@/lib/utils";

/** Chemin public (manifest, notifications, favicon). */
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
  const w = Math.round((logoImage.width / logoImage.height) * h);

  return (
    <Image
      src={logoImage}
      alt="HYDRIC"
      width={w}
      height={h}
      priority={priority}
      className={cn("block w-auto object-contain", className)}
      style={{ height: h, width: "auto" }}
    />
  );
}
