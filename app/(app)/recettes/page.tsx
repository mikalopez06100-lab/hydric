"use client";

import { RecipeList, RecipePlanBadge } from "@/components/recettes/RecipeViews";
import { useRecipes } from "@/hooks/useRecipes";
import { useProfile } from "@/components/providers/ProfileHydrator";

export default function RecettesPage() {
  const profile = useProfile();
  const { recipes, loading } = useRecipes();

  if (!profile) return null;

  return (
    <>
      <div className="flex justify-end px-4 pb-1 pt-2">
        <RecipePlanBadge plan={profile.plan} />
      </div>
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
