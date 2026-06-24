"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Chart = dynamic(
  () =>
    import("@/components/profil/HealthTrendsChart").then(
      (m) => m.HealthTrendsChart
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-4 mb-4 flex h-64 items-center justify-center border border-rule bg-paper"
        style={{ borderRadius: 2 }}
      >
        <p className="font-mono text-[10px] text-ink-soft">
          Chargement du graphique…
        </p>
      </div>
    ),
  }
);

export function HealthTrendsChartLazy(
  props: ComponentProps<typeof Chart>
) {
  return <Chart {...props} />;
}
