"use client";

import { PlanningView } from "@/components/planning/PlanningView";
import { useRecipes } from "@/hooks/useRecipes";
import { useProfile } from "@/components/providers/ProfileHydrator";
import { useWaterStore } from "@/store/useWaterStore";

export default function PlanningPage() {
  const profile = useProfile();
  const { recipes } = useRecipes();
  const { total_ml, goal_ml } = useWaterStore();

  if (!profile) return null;

  return (
    <PlanningView
      startDate={profile.start_date}
      recipes={recipes}
      waterTotal={total_ml}
      waterGoal={goal_ml}
    />
  );
}
