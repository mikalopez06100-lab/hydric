"use client";

import { useEffect } from "react";
import type { Profile } from "@/types";
import { useUserStore } from "@/store/useUserStore";

export function ProfileHydrator({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const setProfile = useUserStore((s) => s.setProfile);

  useEffect(() => {
    setProfile(profile);
  }, [profile, setProfile]);

  return <>{children}</>;
}
