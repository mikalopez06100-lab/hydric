"use client";

import { QuickStats } from "@/components/dashboard/QuickStats";
import { HealthTrendsChartLazy } from "@/components/trends/HealthTrendsChartLazy";
import { ProfileLoading } from "@/components/providers/ProfileLoading";
import { useStatsStore } from "@/store/useStatsStore";
import { getDayNumber } from "@/lib/day-calculator";

export default function TendancesPage() {
  const stats = useStatsStore((s) => s.stats);

  return (
    <ProfileLoading>
      {(profile) => {
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
      }}
    </ProfileLoading>
  );
}
