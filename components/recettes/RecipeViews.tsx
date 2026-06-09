"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DayType, PlanTier, Recipe } from "@/types";
import { PLAN_GATES, getPlanLabel } from "@/lib/plan-gates";

interface RecipeFiltersProps {
  value: "all" | DayType;
  onChange: (v: "all" | DayType) => void;
}

export function RecipeFilters({ value, onChange }: RecipeFiltersProps) {
  const pills: Array<{ id: "all" | DayType; label: string }> = [
    { id: "all", label: "Toutes" },
    { id: "hydric", label: "Hydrique" },
    { id: "food", label: "Alimentaire" },
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto px-4 pb-3">
      {pills.map((pill) => (
        <button
          key={pill.id}
          type="button"
          onClick={() => onChange(pill.id)}
          className={cn(
            "shrink-0 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider",
            value === pill.id ? "filter-pill-active" : "filter-pill-inactive"
          )}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  userPlan: PlanTier;
  locked?: boolean;
}

export function RecipeCard({ recipe, userPlan, locked }: RecipeCardProps) {
  const isHydric = recipe.day_type === "hydric";
  const planOrder = { starter: 0, essential: 1, premium: 2 };
  const isLocked =
    locked ?? planOrder[recipe.plan_required] > planOrder[userPlan];

  const content = (
    <article className="card-v2 mx-4 mb-2.5 overflow-hidden">
      <div
        className={cn(
          "relative flex h-[116px] items-center justify-center text-4xl text-bone/70",
          isHydric
            ? "bg-gradient-to-br from-sage to-sage-darker"
            : "bg-gradient-to-br from-clay to-clay-deep"
        )}
      >
        {recipe.emoji ?? "🍽"}
        <span
          className="absolute left-2.5 top-2.5 flex items-center gap-1.5 bg-paper/95 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-wider text-ink"
          style={{ borderRadius: 2 }}
        >
          <span
            className={cn(
              "h-[5px] w-[5px] rounded-full",
              isHydric ? "bg-sage-deep" : "bg-clay-deep"
            )}
          />
          {isHydric ? "Hydrique" : "Alimentaire"}
        </span>
        {isLocked && (
          <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center bg-ink/40">
            <Lock className="h-3.5 w-3.5 text-bone" />
          </span>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-serif text-[17px] font-medium leading-tight text-ink">
          {recipe.title}
        </h3>
        <p className="mt-1 text-[11px] text-ink-mid">{recipe.description}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {recipe.duration_min && (
            <span className="bg-bone-deep px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-mid" style={{ borderRadius: 2 }}>
              {recipe.duration_min} min
            </span>
          )}
          {recipe.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-bone-deep px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-mid"
              style={{ borderRadius: 2 }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  if (isLocked) {
    return <div className="opacity-75">{content}</div>;
  }

  return (
    <Link href={`/recettes/${recipe.id}`} className="block">
      {content}
    </Link>
  );
}

interface RecipeListProps {
  recipes: Recipe[];
  userPlan: PlanTier;
}

export function RecipeList({ recipes, userPlan }: RecipeListProps) {
  const [filter, setFilter] = useState<"all" | DayType>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = recipes;
    if (filter !== "all") list = list.filter((r) => r.day_type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    const limit = PLAN_GATES[userPlan].recipes_limit;
    return list.slice(0, limit === Infinity ? undefined : limit);
  }, [recipes, filter, search, userPlan]);

  return (
    <>
      <div className="card-v2 mx-4 mb-2.5 flex items-center gap-2.5 px-3 py-2">
        <span className="text-sm text-sage-deep">⌕</span>
        <input
          type="search"
          placeholder="Rechercher une recette…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-ink-soft"
        />
      </div>
      <RecipeFilters value={filter} onChange={setFilter} />
      <div className="pb-4">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-soft">
            Aucune recette trouvée
          </p>
        ) : (
          filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} userPlan={userPlan} />
          ))
        )}
      </div>
    </>
  );
}

export function RecipeDetailView({ recipe }: { recipe: Recipe }) {
  const isHydric = recipe.day_type === "hydric";

  return (
    <div className="pb-24">
      <div
        className={cn(
          "relative flex h-40 items-center justify-center text-6xl text-bone/70",
          isHydric
            ? "bg-gradient-to-br from-sage to-sage-darker"
            : "bg-gradient-to-br from-clay to-clay-deep"
        )}
      >
        {recipe.emoji ?? "🍽"}
      </div>
      <div className="px-5 py-5">
        <h1 className="font-serif text-2xl font-medium text-ink">{recipe.title}</h1>
        <p className="mt-1 text-sm text-ink-mid">{recipe.description}</p>
        <div className="mt-4 flex gap-2">
          <span
            className={cn(
              "px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider",
              isHydric
                ? "bg-sage-mist text-sage-deep"
                : "bg-clay-pale text-clay-deep"
            )}
            style={{ borderRadius: 2 }}
          >
            {isHydric ? "Hydrique" : "Alimentaire"}
          </span>
          {recipe.duration_min && (
            <span className="bg-bone-deep px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-mid" style={{ borderRadius: 2 }}>
              {recipe.duration_min} min
            </span>
          )}
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="mt-6">
            <h2 className="eyebrow-line mb-2.5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-soft">
              Ingrédients
            </h2>
            <ul>
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className="flex items-center gap-2 border-b border-rule py-2 text-sm"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  {ing.qty} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <section className="mt-6">
            <h2 className="eyebrow-line mb-2.5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-soft">
              Étapes
            </h2>
            <ol className="space-y-3">
              {recipe.steps.map((step) => (
                <li key={step.step} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-sage-mist font-mono text-xs font-semibold text-sage-deep" style={{ borderRadius: 2 }}>
                    {step.step}
                  </span>
                  <span className="leading-relaxed text-ink-mid">{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <button
          type="button"
          className="btn-clay mt-6 flex w-full items-center justify-center gap-2 py-3.5"
        >
          <Star className="h-4 w-4" />
          Ajouter aux favoris
        </button>
      </div>
    </div>
  );
}

export function RecipePlanBadge({ plan }: { plan: PlanTier }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
      {getPlanLabel(plan)}
    </span>
  );
}
