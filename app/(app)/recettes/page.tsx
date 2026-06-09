"use client";

import { TopBar } from "@/components/layout/TopBar";
import { RecipeList, RecipePlanBadge } from "@/components/recettes/RecipeViews";
import { DEMO_RECIPES } from "@/lib/mock-data";
import { useUserStore } from "@/store/useUserStore";

export default function RecettesPage() {
  const { profile } = useUserStore();
  if (!profile) return null;

  return (
    <>
      <TopBar
        title="Recettes HYDRIC™"
        right={<RecipePlanBadge plan={profile.plan} />}
      />
      <RecipeList recipes={DEMO_RECIPES} userPlan={profile.plan} />
    </>
  );
}
