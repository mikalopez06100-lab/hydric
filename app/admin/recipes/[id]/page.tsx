"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RecipeAdminForm } from "@/components/admin/RecipeAdminForm";
import type { Recipe } from "@/types";

export default function AdminEditRecipePage() {
  const params = useParams();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch(`/api/admin/recipes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { recipe: Recipe } | null) => {
        if (data?.recipe) setRecipe(data.recipe);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-sm text-ink-soft">Chargement…</p>;
  }

  if (!recipe) {
    return <p className="text-sm text-clay-deep">Recette introuvable</p>;
  }

  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl text-ink">Modifier la recette</h1>
      <RecipeAdminForm recipe={recipe} />
    </div>
  );
}
