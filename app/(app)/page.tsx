"use client";

import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { TopBar } from "@/components/layout/TopBar";
import { DayHeroBanner } from "@/components/dashboard/DayHeroBanner";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ActionCards } from "@/components/dashboard/ActionCards";
import { SuggestedRecipeCard } from "@/components/tracker/WaterTracker";
import { getDayNumber, getDayType } from "@/lib/day-calculator";
import { DEMO_RECIPES } from "@/lib/mock-data";
import { useUserStore } from "@/store/useUserStore";
import { useWaterStore } from "@/store/useWaterStore";

export default function DashboardPage() {
  const { profile } = useUserStore();
  const { total_ml, goal_ml } = useWaterStore();

  if (!profile) return null;

  const dayType = getDayType(profile.start_date);
  const dayNumber = getDayNumber(profile.start_date);
  const suggested = DEMO_RECIPES.find((r) => r.day_type === dayType);

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
      <QuickStats
        weightLost={1.8}
        activeDays={dayNumber}
        completionPct={85}
      />
      <ActionCards waterTotal={total_ml} waterGoal={goal_ml} />
      {suggested && (
        <>
          <SectionEyebrow>Recette du jour</SectionEyebrow>
          <SuggestedRecipeCard
            id={suggested.id}
            title={suggested.title}
            subtitle={`${suggested.duration_min} min · Suggestion HYDRIC`}
            emoji={suggested.emoji ?? "🍽"}
          />
        </>
      )}
    </>
  );
}
