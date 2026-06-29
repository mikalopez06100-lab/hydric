"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RecipeRow = {
  id: string;
  title: string;
  day_type: string;
  published: boolean;
  image_url?: string | null;
};

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/admin/recipes")
      .then((r) => (r.ok ? r.json() : { recipes: [] }))
      .then((data: { recipes: RecipeRow[] }) => setRecipes(data.recipes ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Recettes</h1>
        <Link
          href="/admin/recipes/new"
          className="btn-sage px-4 py-2 font-mono text-[10px] uppercase tracking-wider"
        >
          + Nouvelle
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Chargement…</p>
      ) : (
        <ul className="divide-y divide-rule border border-rule bg-paper">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link
                href={`/admin/recipes/${recipe.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-bone-deep"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{recipe.title}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
                    {recipe.day_type}
                    {recipe.image_url ? " · image" : ""}
                  </p>
                </div>
                <span
                  className={`font-mono text-[9px] uppercase ${
                    recipe.published ? "text-sage-deep" : "text-clay-deep"
                  }`}
                >
                  {recipe.published ? "Publiée" : "Brouillon"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
