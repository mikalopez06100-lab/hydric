import type { SupabaseClient } from "@supabase/supabase-js";
import exercisesFallback from "@/data/hydric_exercises.json";
import { createClient } from "@/lib/supabase/client";
import type { Exercise, ExerciseCategory, ExerciseIntensity } from "@/types";

type ExerciseRow = {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  intensity: ExerciseIntensity;
  duration_min: number;
  tags: string[] | null;
  steps: Exercise["steps"];
  emoji: string | null;
  image_url: string | null;
  published: boolean;
};

function mapExerciseRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    intensity: row.intensity,
    duration_min: row.duration_min,
    tags: row.tags ?? undefined,
    steps: row.steps ?? [],
    emoji: row.emoji ?? "🏃",
    image_url: row.image_url ?? undefined,
    published: row.published,
  };
}

function fallbackExercises(): Exercise[] {
  return (exercisesFallback as Exercise[]).filter((e) => e.published);
}

export async function fetchExercises(
  supabase?: SupabaseClient
): Promise<Exercise[]> {
  const client = supabase ?? createClient();
  const { data, error } = await client
    .from("exercises")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return fallbackExercises();
  }

  return data.map((row) => mapExerciseRow(row as ExerciseRow));
}

export async function fetchExerciseById(
  id: string,
  supabase?: SupabaseClient
): Promise<Exercise | null> {
  const client = supabase ?? createClient();
  const { data, error } = await client
    .from("exercises")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return fallbackExercises().find((e) => e.id === id) ?? null;
  }

  return mapExerciseRow(data as ExerciseRow);
}

/** @deprecated Utiliser fetchExercises() */
export function getExercises(): Exercise[] {
  return fallbackExercises();
}

/** @deprecated Utiliser fetchExerciseById() */
export function getExerciseById(id: string): Exercise | null {
  return fallbackExercises().find((e) => e.id === id) ?? null;
}
