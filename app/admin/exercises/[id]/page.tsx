"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExerciseAdminForm } from "@/components/admin/ExerciseAdminForm";
import type { Exercise } from "@/types";

export default function AdminEditExercisePage() {
  const params = useParams();
  const id = params.id as string;
  const [exercise, setExercise] = useState<
    (Exercise & { image_url?: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch(`/api/admin/exercises/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { exercise: Exercise & { image_url?: string } } | null) => {
        if (data?.exercise) setExercise(data.exercise);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-sm text-ink-soft">Chargement…</p>;
  }

  if (!exercise) {
    return <p className="text-sm text-clay-deep">Exercice introuvable</p>;
  }

  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl text-ink">Modifier l&apos;exercice</h1>
      <ExerciseAdminForm exercise={exercise} />
    </div>
  );
}
