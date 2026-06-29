"use client";

import { useEffect, useState } from "react";
import { fetchExercises } from "@/lib/exercises";
import type { Exercise } from "@/types";

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchExercises()
      .then((data) => {
        if (!cancelled) setExercises(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { exercises, loading, error: null };
}
