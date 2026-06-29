"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  type ReactNode,
} from "react";
import type { Profile } from "@/types";
import { useUserStore } from "@/store/useUserStore";

const ProfileContext = createContext<Profile | null>(null);

/** Profil serveur (immédiat) + store Zustand (après mutations). */
export function useProfile(): Profile | null {
  const fromContext = useContext(ProfileContext);
  const fromStore = useUserStore((s) => s.profile);
  return fromStore ?? fromContext;
}

export function ProfileHydrator({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  const setProfile = useUserStore((s) => s.setProfile);

  useLayoutEffect(() => {
    setProfile(profile);
  }, [profile, setProfile]);

  return (
    <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>
  );
}
