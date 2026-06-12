"use client";

import { create } from "zustand";
import type { WaterLog, WaterType } from "@/types";

interface WaterState {
  logs: WaterLog[];
  goal_ml: number;
  total_ml: number;
  loading: boolean;
  initialized: boolean;
  initLogs: (logs: WaterLog[], goal?: number) => void;
  addLog: (amount_ml: number, type?: WaterType) => Promise<WaterLog | null>;
  removeLog: (id: string) => Promise<void>;
  setGoal: (ml: number) => void;
}

function computeTotal(logs: WaterLog[]) {
  return logs.reduce((sum, l) => sum + l.amount_ml, 0);
}

export const useWaterStore = create<WaterState>((set, get) => ({
  logs: [],
  goal_ml: 2000,
  total_ml: 0,
  loading: false,
  initialized: false,

  initLogs: (logs, goal = 2000) =>
    set({
      logs,
      goal_ml: goal,
      total_ml: computeTotal(logs),
      initialized: true,
    }),

  addLog: async (amount_ml, type = "water") => {
    set({ loading: true });
    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_ml, type }),
      });

      if (!res.ok) return null;

      const log = (await res.json()) as WaterLog;

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10);
      }

      set((state) => {
        const logs = [...state.logs, log];
        return { logs, total_ml: computeTotal(logs), loading: false };
      });

      return log;
    } catch {
      set({ loading: false });
      return null;
    }
  },

  removeLog: async (id) => {
    const previous = get().logs;
    set((state) => {
      const logs = state.logs.filter((l) => l.id !== id);
      return { logs, total_ml: computeTotal(logs), loading: true };
    });

    try {
      const res = await fetch(`/api/water?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        set({ logs: previous, total_ml: computeTotal(previous), loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ logs: previous, total_ml: computeTotal(previous), loading: false });
    }
  },

  setGoal: (ml) => set({ goal_ml: ml }),
}));
