"use client";

import { PlanningView } from "@/components/planning/PlanningView";
import { ProfileLoading } from "@/components/providers/ProfileLoading";
import { useRecipes } from "@/hooks/useRecipes";
import { useWaterStore } from "@/store/useWaterStore";

export default function PlanningPage() {
  const { recipes } = useRecipes();
  const { total_ml, goal_ml } = useWaterStore();

  return (
    <ProfileLoading>
      {(profile) => (
        <PlanningView
          startDate={profile.start_date}
          recipes={recipes}
          waterTotal={total_ml}
          waterGoal={goal_ml}
        />
      )}
    </ProfileLoading>
  );
}
