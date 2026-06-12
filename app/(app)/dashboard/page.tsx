"use client";

import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { TopBar } from "@/components/layout/TopBar";
import { DayHeroBanner } from "@/components/dashboard/DayHeroBanner";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ActionCards } from "@/components/dashboard/ActionCards";
import { HealthTrendsChart } from "@/components/profil/HealthTrendsChart";
import { SuggestedRecipeCard } from "@/components/tracker/WaterTracker";
import { getDayNumber, getDayType } from "@/lib/day-calculator";
import { useRecipes } from "@/hooks/useRecipes";
import { useUserStore } from "@/store/useUserStore";
import { useStatsStore } from "@/store/useStatsStore";
import { useWaterStore } from "@/store/useWaterStore";

export default function DashboardPage() {
  const { profile } = useUserStore();
  const { total_ml, goal_ml } = useWaterStore();
  const { recipes } = useRecipes();
  const stats = useStatsStore((s) => s.stats);

  if (!profile) return null;

  const dayType = getDayType(profile.start_date);
  const dayNumber = getDayNumber(profile.start_date);
  const suggested = recipes.find((r) => r.day_type === dayType);

  return (
    <>
      <TopBar showLogo />
      <DayHeroBanner
        prenom={profile.prenom}
        dayType={dayType}
        dayNumber={dayNumber}
        waterTotal={total_ml}
        waterGoal={goal_ml}
      />
      <HealthTrendsChart
        weightGoalKg={profile.weight_goal_kg}
        waterGoalMl={profile.water_goal_ml}
      />
      <QuickStats
        weightLost={stats.weightLost}
        activeDays={stats.activeDays || dayNumber}
        completionPct={stats.completionPct}
      />
      <ActionCards waterTotal={total_ml} waterGoal={goal_ml} />
      {suggested && (
        <>
          <SectionEyebrow>Recette du jour</SectionEyebrow>
          <SuggestedRecipeCard
            id={suggested.id}
            title={suggested.title}
            subtitle={`${suggested.duration_min ?? "—"} min · Suggestion HYDRIC`}
            emoji={suggested.emoji ?? "🍽"}
          />
        </>
      )}
    </>
  );
}
