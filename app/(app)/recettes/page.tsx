"use client";

import { TopBar } from "@/components/layout/TopBar";
import { RecipeList, RecipePlanBadge } from "@/components/recettes/RecipeViews";
import { useRecipes } from "@/hooks/useRecipes";
import { useUserStore } from "@/store/useUserStore";

export default function RecettesPage() {
  const { profile } = useUserStore();
  const { recipes, loading } = useRecipes();

  if (!profile) return null;

  return (
    <>
      <TopBar
        title="Recettes HYDRIC™"
        right={<RecipePlanBadge plan={profile.plan} />}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage border-t-transparent" />
        </div>
      ) : (
        <RecipeList recipes={recipes} userPlan={profile.plan} />
      )}
    </>
  );
}
