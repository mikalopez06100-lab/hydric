"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";
import { useProfile } from "@/components/providers/ProfileHydrator";

export function ProfileLoading({
  children,
}: {
  children: (profile: Profile) => React.ReactNode;
}) {
  const profile = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile) return;
    const timer = window.setTimeout(() => {
      router.refresh();
    }, 800);
    return () => window.clearTimeout(timer);
  }, [profile, router]);

  if (!profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage border-t-transparent" />
      </div>
    );
  }

  return <>{children(profile)}</>;
}
