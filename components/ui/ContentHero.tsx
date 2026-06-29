import Image from "next/image";
import { cn } from "@/lib/utils";

export function ContentHero({
  imageUrl,
  emoji,
  gradientClass,
  size = "card",
}: {
  imageUrl?: string | null;
  emoji?: string;
  gradientClass: string;
  size?: "card" | "detail";
}) {
  const height = size === "detail" ? "h-40" : "h-[116px]";
  const textSize = size === "detail" ? "text-6xl" : "text-4xl";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden text-bone/80",
        height,
        !imageUrl && gradientClass
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <span className={textSize}>{emoji ?? "🍽"}</span>
      )}
    </div>
  );
}
