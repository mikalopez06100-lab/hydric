"use client";

import { useEffect } from "react";
import { useStatsStore } from "@/store/useStatsStore";
import { useWaterStore } from "@/store/useWaterStore";

export function TrackingSync({ children }: { children: React.ReactNode }) {
  const sync = useStatsStore((s) => s.sync);
  const refresh = useStatsStore((s) => s.refresh);
  const initialized = useStatsStore((s) => s.initialized);
  const total_ml = useWaterStore((s) => s.total_ml);

  useEffect(() => {
    void sync();
  }, [sync]);

  useEffect(() => {
    if (initialized) void refresh();
  }, [total_ml, initialized, refresh]);

  return <>{children}</>;
}
