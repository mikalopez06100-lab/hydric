import Image, { type StaticImageData } from "next/image";
import heroHydration from "@/assets/landing/hero-hydration.jpg";
import editorialLight from "@/assets/landing/editorial-light.jpg";
import lifestyleGarden from "@/assets/landing/lifestyle-garden.jpg";

export const landingPhotos = {
  hero: heroHydration,
  light: editorialLight,
  garden: lifestyleGarden,
} as const;

export function LandingPhoto({
  src,
  alt,
  priority,
  className,
  sizes,
  fill,
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
}) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={className}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={src.width}
      height={src.height}
      priority={priority}
      className={className}
      sizes={sizes}
    />
  );
}
