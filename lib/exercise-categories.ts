import type { ExerciseCategory } from "@/types";

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  "cardio",
  "souplesse",
  "renforcement",
  "mobilite",
];

export const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  cardio: "Cardio",
  souplesse: "Souplesse",
  renforcement: "Renforcement",
  mobilite: "Mobilité",
};

export const EXERCISE_CATEGORY_EMOJI: Record<ExerciseCategory, string> = {
  cardio: "💧",
  souplesse: "🌿",
  renforcement: "🔥",
  mobilite: "✨",
};

export const EXERCISE_INTENSITY_LABELS = {
  douce: "Douce",
  moderee: "Modérée",
} as const;
