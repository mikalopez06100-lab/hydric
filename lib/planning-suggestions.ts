import { format } from "date-fns";
import type { DayType, MealType, Recipe } from "@/types";
import { MEAL_TYPES } from "@/lib/meal-type";

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickRandom<T>(items: T[], seed: number): T | undefined {
  if (!items.length) return undefined;
  return items[seed % items.length];
}

/** Suggestions stables pour un jour donné (même tirage si on revient sur la date). */
export function getSuggestedRecipesForDay(
  recipes: Recipe[],
  date: Date,
  dayType: DayType
): Recipe[] {
  const dateKey = format(date, "yyyy-MM-dd");

  if (dayType === "food") {
    const byMeal = new Map<MealType, Recipe[]>(
      MEAL_TYPES.map((meal) => [meal, []])
    );

    for (const recipe of recipes) {
      if (recipe.day_type === "food" && recipe.meal_type) {
        byMeal.get(recipe.meal_type)!.push(recipe);
      }
    }

    return MEAL_TYPES.map((meal) =>
      pickRandom(byMeal.get(meal)!, hashSeed(`${dateKey}:${meal}`))
    ).filter((r): r is Recipe => r !== undefined);
  }

  const hydric = recipes.filter((r) => r.day_type === "hydric");
  return hydric.slice(0, 2);
}
