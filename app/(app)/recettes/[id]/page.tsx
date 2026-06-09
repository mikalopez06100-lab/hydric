"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RecipeDetailView } from "@/components/recettes/RecipeViews";
import { DEMO_RECIPES } from "@/lib/mock-data";

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const recipe = DEMO_RECIPES.find((r) => r.id === id);

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
