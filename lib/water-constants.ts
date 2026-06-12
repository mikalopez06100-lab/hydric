import type { WaterType } from "@/types";

/** Volume estimé d'une gorgée (ml). */
export const GULP_ML = 25;

export const WATER_INCREMENT_ML = 250;

export const DRINK_VOLUMES_ML = [150, 200, 250] as const;

export const HYDRATION_DRINKS: Array<{
  type: WaterType;
  label: string;
  emoji: string;
}> = [
  { type: "tea", label: "Thé / tisane", emoji: "🫖" },
  { type: "broth", label: "Bouillon", emoji: "🥣" },
];
