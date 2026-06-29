"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ContentHero } from "@/components/ui/ContentHero";
import {
  EXERCISE_CATEGORIES,
  EXERCISE_CATEGORY_LABELS,
  EXERCISE_INTENSITY_LABELS,
} from "@/lib/exercise-categories";
import { cn } from "@/lib/utils";
import type { Exercise, ExerciseCategory } from "@/types";

function categoryGradient(category: ExerciseCategory): string {
  switch (category) {
    case "cardio":
      return "bg-gradient-to-br from-water to-sage-darker";
    case "souplesse":
      return "bg-gradient-to-br from-sage to-sage-darker";
    case "renforcement":
      return "bg-gradient-to-br from-clay to-clay-deep";
    case "mobilite":
      return "bg-gradient-to-br from-sage-pale to-water";
    default:
      return "bg-gradient-to-br from-sage to-sage-darker";
  }
}

function categoryBadgeClass(category: ExerciseCategory): string {
  switch (category) {
    case "cardio":
      return "bg-water-mist text-water";
    case "souplesse":
      return "bg-sage-mist text-sage-deep";
    case "renforcement":
      return "bg-clay-pale text-clay-deep";
    case "mobilite":
      return "bg-bone-deep text-ink-mid";
    default:
      return "bg-bone-deep text-ink-mid";
  }
}

interface ExerciseFiltersProps {
  value: "all" | ExerciseCategory;
  onChange: (v: "all" | ExerciseCategory) => void;
}

export function ExerciseFilters({ value, onChange }: ExerciseFiltersProps) {
  const pills: Array<{ id: "all" | ExerciseCategory; label: string }> = [
    { id: "all", label: "Tous" },
    ...EXERCISE_CATEGORIES.map((c) => ({
      id: c,
      label: EXERCISE_CATEGORY_LABELS[c],
    })),
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
      {pills.map((pill) => (
        <button
          key={pill.id}
          type="button"
          onClick={() => onChange(pill.id)}
          className={cn(
            "shrink-0 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider",
            value === pill.id ? "filter-pill-active" : "filter-pill-inactive"
          )}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link href={`/exercices/${exercise.id}`} className="block">
      <article className="card-v2 mx-4 mb-2.5 overflow-hidden">
        <div className="relative">
          <ContentHero
            imageUrl={exercise.image_url}
            emoji={exercise.emoji}
            gradientClass={categoryGradient(exercise.category)}
          />
          <span
            className="absolute left-2.5 top-2.5 flex items-center gap-1.5 bg-paper/95 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-wider text-ink"
            style={{ borderRadius: 2 }}
          >
            <span className="h-[5px] w-[5px] rounded-full bg-water" />
            {EXERCISE_CATEGORY_LABELS[exercise.category]}
          </span>
        </div>
        <div className="p-3.5">
          <h3 className="font-serif text-[17px] font-medium leading-tight text-ink">
            {exercise.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[11px] text-ink-mid">
            {exercise.description}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span
              className="bg-bone-deep px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-mid"
              style={{ borderRadius: 2 }}
            >
              {exercise.duration_min} min
            </span>
            <span
              className="bg-bone-deep px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-mid"
              style={{ borderRadius: 2 }}
            >
              {EXERCISE_INTENSITY_LABELS[exercise.intensity]}
            </span>
            {exercise.tags?.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="bg-bone-deep px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-mid"
                style={{ borderRadius: 2 }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}

interface ExerciseListProps {
  exercises: Exercise[];
}

export function ExerciseList({ exercises }: ExerciseListProps) {
  const [filter, setFilter] = useState<"all" | ExerciseCategory>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = exercises;
    if (filter !== "all") {
      list = list.filter((e) => e.category === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q)) ||
          EXERCISE_CATEGORY_LABELS[e.category].toLowerCase().includes(q)
      );
    }
    return list;
  }, [exercises, filter, search]);

  return (
    <>
      <div className="px-4 pb-2 pt-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">
          {exercises.length} exercices · compatible méthode HYDRIC
        </p>
      </div>
      <div className="card-v2 mx-4 mb-2.5 flex items-center gap-2.5 px-3 py-2">
        <span className="text-sm text-sage-deep">⌕</span>
        <input
          type="search"
          placeholder="Rechercher un exercice…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-ink-soft"
        />
      </div>
      <ExerciseFilters value={filter} onChange={setFilter} />
      <div className="pb-4">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-soft">
            Aucun exercice trouvé
          </p>
        ) : (
          filtered.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))
        )}
      </div>
    </>
  );
}

export function ExerciseDetailView({ exercise }: { exercise: Exercise }) {
  return (
    <div className="pb-24">
      <ContentHero
        size="detail"
        imageUrl={exercise.image_url}
        emoji={exercise.emoji}
        gradientClass={categoryGradient(exercise.category)}
      />
      <div className="px-5 py-5">
        <h1 className="font-serif text-2xl font-medium text-ink">
          {exercise.title}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-mid">
          {exercise.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={cn(
              "px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider",
              categoryBadgeClass(exercise.category)
            )}
            style={{ borderRadius: 2 }}
          >
            {EXERCISE_CATEGORY_LABELS[exercise.category]}
          </span>
          <span
            className="bg-bone-deep px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-mid"
            style={{ borderRadius: 2 }}
          >
            {exercise.duration_min} min
          </span>
          <span
            className="bg-bone-deep px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-mid"
            style={{ borderRadius: 2 }}
          >
            Intensité {EXERCISE_INTENSITY_LABELS[exercise.intensity].toLowerCase()}
          </span>
        </div>

        {exercise.tags && exercise.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {exercise.tags.map((tag) => (
              <span
                key={tag}
                className="border border-rule px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-soft"
                style={{ borderRadius: 2 }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {exercise.steps.length > 0 && (
          <section className="mt-6">
            <h2 className="eyebrow-line mb-2.5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-soft">
              Déroulement
            </h2>
            <ol className="space-y-3">
              {exercise.steps.map((step) => (
                <li key={step.step} className="flex gap-3 text-sm">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center bg-water-mist font-mono text-xs font-semibold text-water"
                    style={{ borderRadius: 2 }}
                  >
                    {step.step}
                  </span>
                  <span className="leading-relaxed text-ink-mid">{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
