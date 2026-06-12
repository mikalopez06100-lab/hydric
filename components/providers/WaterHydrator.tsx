"use client";

import { useEffect } from "react";
import { useWaterStore } from "@/store/useWaterStore";
import type { WaterLog } from "@/types";

export function WaterHydrator({
  goalMl,
  children,
}: {
  goalMl: number;
  children: React.ReactNode;
}) {
  const initLogs = useWaterStore((s) => s.initLogs);
  const initialized = useWaterStore((s) => s.initialized);

  useEffect(() => {
    if (initialized) return;

    const date = new Date().toISOString().slice(0, 10);

    fetch(`/api/water?date=${date}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { logs?: WaterLog[] } | null) => {
        initLogs(data?.logs ?? [], goalMl);
      })
      .catch(() => {
        initLogs([], goalMl);
      });
  }, [goalMl, initLogs, initialized]);

  return <>{children}</>;
}
