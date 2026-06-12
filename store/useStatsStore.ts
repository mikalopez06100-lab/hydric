"use client";

import { create } from "zustand";
import type { UserStats } from "@/lib/tracking";

const EMPTY: UserStats = {
  activeDays: 0,
  completionPct: 0,
  weightLost: 0,
  avgWaterMl: 0,
  completedDays: 0,
};

interface StatsState {
  stats: UserStats;
  loading: boolean;
  initialized: boolean;
  setStats: (stats: UserStats) => void;
  sync: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: EMPTY,
  loading: true,
  initialized: false,

  setStats: (stats) => set({ stats, loading: false }),

  sync: async () => {
    if (get().initialized) return;
    try {
      const res = await fetch("/api/tracking/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) set({ stats: data.stats, loading: false, initialized: true });
      }
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  refresh: async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = (await res.json()) as UserStats;
        set({ stats: data, loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));
