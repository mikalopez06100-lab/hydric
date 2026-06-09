"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/types";
import { DEMO_PROFILE } from "@/lib/mock-data";

interface UserState {
  profile: Profile | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  setProfile: (profile: Profile) => void;
  loginDemo: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isAuthenticated: false,
      isDemo: false,
      setProfile: (profile) =>
        set({ profile, isAuthenticated: true, isDemo: false }),
      loginDemo: () =>
        set({
          profile: DEMO_PROFILE,
          isAuthenticated: true,
          isDemo: true,
        }),
      logout: () =>
        set({ profile: null, isAuthenticated: false, isDemo: false }),
    }),
    { name: "hydric-user" }
  )
);
