"use client";

import { create } from "zustand";
import type { WaterLog, WaterType } from "@/types";
import { DEMO_WATER_LOGS } from "@/lib/mock-data";

interface WaterState {
  logs: WaterLog[];
  goal_ml: number;
  total_ml: number;
  initLogs: (logs: WaterLog[], goal?: number) => void;
  addLog: (amount_ml: number, type?: WaterType) => WaterLog;
  removeLog: (id: string) => void;
  setGoal: (ml: number) => void;
}

function computeTotal(logs: WaterLog[]) {
  return logs.reduce((sum, l) => sum + l.amount_ml, 0);
}

export const useWaterStore = create<WaterState>((set, get) => ({
  logs: DEMO_WATER_LOGS,
  goal_ml: 2000,
  total_ml: computeTotal(DEMO_WATER_LOGS),

  initLogs: (logs, goal = 2000) =>
    set({ logs, goal_ml: goal, total_ml: computeTotal(logs) }),

  addLog: (amount_ml, type = "water") => {
    const log: WaterLog = {
      id: `w-${Date.now()}`,
      user_id: "demo-user",
      logged_at: new Date().toISOString(),
      amount_ml,
      type,
    };
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    set((state) => {
      const logs = [...state.logs, log];
      return { logs, total_ml: computeTotal(logs) };
    });
    return log;
  },

  removeLog: (id) =>
    set((state) => {
      const logs = state.logs.filter((l) => l.id !== id);
      return { logs, total_ml: computeTotal(logs) };
    }),

  setGoal: (ml) => set({ goal_ml: ml }),
}));
