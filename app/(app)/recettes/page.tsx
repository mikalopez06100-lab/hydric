"use client";

import { RecipeList, RecipePlanBadge } from "@/components/recettes/RecipeViews";
import { ProfileLoading } from "@/components/providers/ProfileLoading";
import { useRecipes } from "@/hooks/useRecipes";

export default function RecettesPage() {
  const { recipes, loading } = useRecipes();

  return (
    <ProfileLoading>
      {(profile) => (
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
      )}
    </ProfileLoading>
  );
}
