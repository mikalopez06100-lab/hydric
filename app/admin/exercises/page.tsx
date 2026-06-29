"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EXERCISE_CATEGORY_LABELS } from "@/lib/exercise-categories";
import type { Exercise, ExerciseCategory } from "@/types";

type ExerciseRow = Exercise & { image_url?: string | null };

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/admin/exercises")
      .then((r) => (r.ok ? r.json() : { exercises: [] }))
      .then((data: { exercises: ExerciseRow[] }) =>
        setExercises(data.exercises ?? [])
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Exercices</h1>
        <Link
          href="/admin/exercises/new"
          className="btn-sage px-4 py-2 font-mono text-[10px] uppercase tracking-wider"
        >
          + Nouveau
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Chargement…</p>
      ) : (
        <ul className="divide-y divide-rule border border-rule bg-paper">
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <Link
                href={`/admin/exercises/${exercise.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-bone-deep"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {exercise.emoji} {exercise.title}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
                    {EXERCISE_CATEGORY_LABELS[exercise.category as ExerciseCategory]}
                    {exercise.image_url ? " · image" : ""}
                  </p>
                </div>
                <span
                  className={`font-mono text-[9px] uppercase ${
                    exercise.published ? "text-sage-deep" : "text-clay-deep"
                  }`}
                >
                  {exercise.published ? "Publié" : "Brouillon"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
