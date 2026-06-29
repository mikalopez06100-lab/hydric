"use client";

import { ExerciseList } from "@/components/exercices/ExerciseViews";
import { useExercises } from "@/hooks/useExercises";

export default function ExercicesPage() {
  const { exercises, loading } = useExercises();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage border-t-transparent" />
      </div>
    );
  }

  return <ExerciseList exercises={exercises} />;
}
