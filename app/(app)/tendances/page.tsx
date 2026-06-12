"use client";

import { TopBar } from "@/components/layout/TopBar";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { HealthTrendsChart } from "@/components/profil/HealthTrendsChart";
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
      <HealthTrendsChart
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
