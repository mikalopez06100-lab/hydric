"use client";

import { create } from "zustand";
import type { Profile } from "@/types";

interface UserState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  logout: () => set({ profile: null }),
}));
