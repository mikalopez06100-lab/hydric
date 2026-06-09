import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GatingBannerProps {
  feature?: string;
  className?: string;
}

export function GatingBanner({
  feature = "cette fonctionnalité",
  className,
}: GatingBannerProps) {
  return (
    <div
      className={cn(
        "border border-clay/30 bg-clay-pale p-4 text-center",
        className
      )}
      style={{ borderRadius: 2 }}
    >
      <Lock className="mx-auto mb-2 h-5 w-5 text-clay-deep" />
      <p className="text-sm font-semibold text-ink">
        Débloquez {feature}
      </p>
      <p className="mt-1 text-xs text-ink-mid">
        Passez au plan Essentiel ou Premium pour y accéder.
      </p>
      <Link
        href="/profil"
        className="btn-clay mt-3 inline-block px-4 py-2.5"
      >
        Voir les plans
      </Link>
    </div>
  );
}
