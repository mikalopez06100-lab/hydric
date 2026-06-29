import { z } from "zod";

const IngredientSchema = z.object({
  name: z.string().min(1),
  qty: z.string(),
  unit: z.string(),
});

const StepSchema = z.object({
  step: z.number().int().positive(),
  text: z.string().min(1),
});

export const RecipeAdminSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  day_type: z.enum(["hydric", "food"]),
  meal_type: z.enum(["breakfast", "lunch", "dinner"]).nullable().optional(),
  duration_min: z.number().int().min(1).max(600).nullable().optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(IngredientSchema).optional(),
  steps: z.array(StepSchema).optional(),
  plan_required: z.enum(["starter", "essential", "premium"]).default("starter"),
  published: z.boolean().default(true),
});

export const RecipeAdminPatchSchema = RecipeAdminSchema.partial();

export const ExerciseAdminSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  category: z.enum(["cardio", "souplesse", "renforcement", "mobilite"]),
  intensity: z.enum(["douce", "moderee"]).default("douce"),
  duration_min: z.number().int().min(1).max(300),
  tags: z.array(z.string()).optional(),
  steps: z.array(StepSchema).min(1),
  emoji: z.string().max(8).optional(),
  published: z.boolean().default(true),
});

export const ExerciseAdminPatchSchema = ExerciseAdminSchema.partial();
