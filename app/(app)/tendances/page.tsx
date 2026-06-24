"use client";

import { TopBar } from "@/components/layout/TopBar";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { HealthTrendsChartLazy } from "@/components/trends/HealthTrendsChartLazy";
import { useStatsStore } from "@/store/useStatsStore";
import { useUserStore } from "@/store/useUserStore";
import { getDayNumber } from "@/lib/day-calculator";

export default function TendancesPage() {
  const { profile } = useUserStore();
  const stats = useStatsStore((s) => s.stats);

  if (!profile) return null;

  const dayNumber = getDayNumber(profile.start_date);

  return (
    <>
      <TopBar title="Tendances" />
      <HealthTrendsChartLazy
        weightGoalKg={profile.weight_goal_kg}
        waterGoalMl={profile.water_goal_ml}
      />
      <QuickStats
        weightLost={stats.weightLost}
        activeDays={stats.activeDays || dayNumber}
        completionPct={stats.completionPct}
      />
    </>
  );
}
