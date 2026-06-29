export type DayType = "hydric" | "food";

export type MealType = "breakfast" | "lunch" | "dinner";

export type PlanTier = "starter" | "essential" | "premium";

export type WaterType = "water" | "tea" | "broth" | "juice" | "other";

export interface Profile {
  id: string;
  prenom: string;
  email: string;
  plan: PlanTier;
  stripe_status: string;
  start_date: string;
  avatar_url?: string;
  weight_goal_kg?: number;
  water_goal_ml: number;
  notifications: boolean;
  notification_start_hour: number;
  notification_end_hour: number;
  notification_interval_hours: number;
}

export interface WaterLog {
  id: string;
  user_id: string;
  logged_at: string;
  amount_ml: number;
  type: WaterType;
}

export interface DayLog {
  id: string;
  user_id: string;
  day_date: string;
  day_type: DayType;
  completed: boolean;
  note?: string;
}

export type WeightSource =
  | "manual"
  | "withings"
  | "fitbit"
  | "garmin"
  | "bluetooth";

export interface WeightLog {
  id: string;
  user_id: string;
  logged_at: string;
  weight_kg: number;
  source?: WeightSource;
  external_id?: string;
  measured_at?: string;
}

export interface RecipeIngredient {
  name: string;
  qty: string;
  unit: string;
}

export interface RecipeStep {
  step: number;
  text: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  day_type: DayType;
  meal_type?: MealType;
  duration_min?: number;
  tags?: string[];
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
  image_url?: string;
  plan_required: PlanTier;
  published: boolean;
  emoji?: string;
}

export type ExerciseCategory =
  | "cardio"
  | "souplesse"
  | "renforcement"
  | "mobilite";

export type ExerciseIntensity = "douce" | "moderee";

export interface ExerciseStep {
  step: number;
  text: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  intensity: ExerciseIntensity;
  duration_min: number;
  tags?: string[];
  steps: ExerciseStep[];
  emoji: string;
  image_url?: string;
  published: boolean;
}
