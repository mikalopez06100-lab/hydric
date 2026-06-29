"use client";

import { QuickStats } from "@/components/dashboard/QuickStats";
import { HealthTrendsChartLazy } from "@/components/trends/HealthTrendsChartLazy";
import { useStatsStore } from "@/store/useStatsStore";
import { useProfile } from "@/components/providers/ProfileHydrator";
import { getDayNumber } from "@/lib/day-calculator";

export default function TendancesPage() {
  const profile = useProfile();
  const stats = useStatsStore((s) => s.stats);

  if (!profile) return null;

  const dayNumber = getDayNumber(profile.start_date);

  return (
    <>
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
