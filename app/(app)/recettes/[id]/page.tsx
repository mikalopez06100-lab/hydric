"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { RecipeDetailView } from "@/components/recettes/RecipeViews";
import { fetchRecipeById } from "@/lib/recipes";
import type { Recipe } from "@/types";

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipeById(id)
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage border-t-transparent" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
        <p className="text-ink-mid">Recette introuvable</p>
        <Link href="/recettes" className="mt-4 text-sm text-sage-deep underline">
          Retour aux recettes
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="fixed left-1/2 top-8 z-20 max-w-phone -translate-x-1/2 px-4">
        <Link
          href="/recettes"
          className="flex h-8 w-8 items-center justify-center border border-rule bg-paper/90"
          style={{ borderRadius: 2 }}
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4 text-ink" />
        </Link>
      </div>
      <RecipeDetailView recipe={recipe} />
    </>
  );
}
