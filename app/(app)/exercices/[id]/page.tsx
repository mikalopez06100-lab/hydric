"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ExerciseDetailView } from "@/components/exercices/ExerciseViews";
import { fetchExerciseById } from "@/lib/exercises";
import type { Exercise } from "@/types";

export default function ExerciseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchExerciseById(id)
      .then(setExercise)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage border-t-transparent" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
        <p className="text-ink-mid">Exercice introuvable</p>
        <Link
          href="/exercices"
          className="mt-4 text-sm text-sage-deep underline"
        >
          Retour aux exercices
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="fixed left-1/2 top-8 z-20 max-w-phone -translate-x-1/2 px-4">
        <Link
          href="/exercices"
          className="flex h-8 w-8 items-center justify-center border border-rule bg-paper/90"
          style={{ borderRadius: 2 }}
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4 text-ink" />
        </Link>
      </div>
      <ExerciseDetailView exercise={exercise} />
    </>
  );
}
