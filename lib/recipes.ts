import type { SupabaseClient } from "@supabase/supabase-js";
import type { Recipe } from "@/types";
import { createClient } from "@/lib/supabase/client";

type RecipeRow = {
  id: string;
  title: string;
  description: string | null;
  day_type: "hydric" | "food";
  meal_type: "breakfast" | "lunch" | "dinner" | null;
  duration_min: number | null;
  tags: string[] | null;
  ingredients: Recipe["ingredients"];
  steps: Recipe["steps"];
  image_url: string | null;
  plan_required: Recipe["plan_required"];
  published: boolean;
};

function normalizeIngredients(
  raw: RecipeRow["ingredients"]
): Recipe["ingredients"] {
  if (!raw?.length) return undefined;
  return raw.map((ing) => ({
    name: ing.name,
    qty: String(ing.qty ?? ""),
    unit: ing.unit ?? "",
  }));
}

import { MEAL_EMOJI } from "@/lib/meal-type";

const HYDRIC_EMOJI = ["💧", "🫖", "🥣", "🍵"];

function recipeEmoji(row: RecipeRow): string {
  if (row.day_type === "hydric") {
    const tagStr = (row.tags ?? []).join(" ").toLowerCase();
    if (tagStr.includes("tisane") || tagStr.includes("infusé")) return "🫖";
    if (tagStr.includes("jus")) return "🧃";
    if (tagStr.includes("soupe") || tagStr.includes("velouté")) return "🥣";
    return HYDRIC_EMOJI[Math.abs(hashTitle(row.title)) % HYDRIC_EMOJI.length];
  }
  if (row.meal_type) return MEAL_EMOJI[row.meal_type];
  return "🥗";
}

function hashTitle(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) h += title.charCodeAt(i);
  return h;
}

function mapRecipeRow(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    day_type: row.day_type,
    meal_type: row.meal_type ?? undefined,
    duration_min: row.duration_min ?? undefined,
    tags: row.tags ?? undefined,
    ingredients: normalizeIngredients(row.ingredients),
    steps: row.steps ?? undefined,
    image_url: row.image_url ?? undefined,
    plan_required: row.plan_required,
    published: row.published,
    emoji: recipeEmoji(row),
  };
}

export async function fetchRecipes(
  supabase?: SupabaseClient
): Promise<Recipe[]> {
  const client = supabase ?? createClient();
  const { data, error } = await client
    .from("recipes")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapRecipeRow(row as RecipeRow));
}

export async function fetchRecipeById(
  id: string,
  supabase?: SupabaseClient
): Promise<Recipe | null> {
  const client = supabase ?? createClient();
  const { data, error } = await client
    .from("recipes")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRecipeRow(data as RecipeRow);
}
