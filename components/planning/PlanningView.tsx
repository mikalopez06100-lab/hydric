"use client";

import { useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DayType, Recipe } from "@/types";
import { getWeekPlan } from "@/lib/day-calculator";
import { MEAL_LABELS } from "@/lib/meal-type";
import { getSuggestedRecipesForDay } from "@/lib/planning-suggestions";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SuggestedRecipeCard } from "@/components/tracker/WaterTracker";

interface WeekStripProps {
  startDate: string;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export function WeekStrip({ startDate, selectedDate, onSelect }: WeekStripProps) {
  const days = getWeekPlan(startDate, 7);

  return (
    <div className="flex gap-1 overflow-x-auto px-4 pb-3">
      {days.map(({ date, type }) => {
        const isToday = isSameDay(date, new Date());
        const isSelected = isSameDay(date, selectedDate);
        const isHydric = type === "hydric";
        const isSaturday = date.getDay() === 6;

        return (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onSelect(date)}
            className={cn(
              "flex min-w-[42px] flex-1 flex-col items-center gap-1 border px-0.5 py-2 transition-colors",
              isToday && "border-ink bg-ink text-bone",
              !isToday && isHydric && "border-sage-pale bg-sage-mist",
              !isToday && !isHydric && !isSaturday && "border-clay/15 bg-clay-pale",
              !isToday && isSaturday && "border-rule bg-paper",
              isSelected && !isToday && "ring-1 ring-sage-deep"
            )}
            style={{ borderRadius: 2 }}
          >
            <span
              className={cn(
                "font-mono text-[9px] font-medium uppercase tracking-wider",
                isToday ? "text-bone/55" : "text-ink-soft"
              )}
            >
              {format(date, "EEE", { locale: fr })}
            </span>
            <span
              className={cn(
                "font-serif text-[17px] font-medium leading-none",
                isToday && "text-bone",
                !isToday && isHydric && "text-sage-deep",
                !isToday && !isHydric && !isSaturday && "text-clay-deep",
                !isToday && isSaturday && "text-ink-soft"
              )}
            >
              {format(date, "d")}
            </span>
            <span
              className={cn(
                "h-1 w-1 rounded-full",
                isToday && "bg-sage",
                !isToday && isHydric && "bg-sage-deep",
                !isToday && !isHydric && !isSaturday && "bg-clay-deep",
                !isToday && isSaturday && "bg-transparent"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

interface DayDetailCardProps {
  date: Date;
  type: DayType;
  recipes: Recipe[];
  waterTotal: number;
  waterGoal: number;
}

export function DayDetailCard({
  date,
  type,
  recipes,
  waterTotal,
  waterGoal,
}: DayDetailCardProps) {
  const isHydric = type === "hydric";
  const isToday = isSameDay(date, new Date());
  const dayRecipes = recipes.filter((r) => r.day_type === type);
  const suggested = useMemo(
    () => getSuggestedRecipesForDay(recipes, date, type),
    [recipes, date, type]
  );
  const dateStr = format(date, "EEEE d", { locale: fr });

  return (
    <>
      <div className="relative mx-4 mb-3 overflow-hidden bg-ink p-4 text-bone" style={{ borderRadius: 2 }}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-[140px] w-[140px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,157,135,0.2) 0%, transparent 65%)",
          }}
        />
        <p className="eyebrow-line relative mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-sage before:bg-sage">
          {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
          {isToday && " · aujourd'hui"}
        </p>
        <h3 className="relative font-serif text-xl font-normal leading-tight text-bone">
          Jour <em className="italic text-sage">{isHydric ? "hydrique" : "alimentaire"}</em>.
        </h3>
        <p className="relative mt-2 text-xs leading-relaxed text-bone/65">
          {isHydric
            ? "Eau, tisanes, bouillons clairs, jus dilués. Ton corps se réinitialise."
            : "Repas équilibrés et légers. Retrouve le plaisir de manger sainement."}
        </p>
        <div className="relative mt-3 flex gap-1.5">
          {isHydric && isToday && (
            <div className="flex-1 border border-bone/10 bg-bone/[0.06] p-2.5" style={{ borderRadius: 2 }}>
              <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-sage">
                Eau
              </div>
              <div className="font-serif text-xl font-medium text-bone">
                {(waterTotal / 1000).toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}
                <span className="text-xs opacity-55"> / {waterGoal / 1000} L</span>
              </div>
            </div>
          )}
          <div className="flex-1 border border-bone/10 bg-bone/[0.06] p-2.5" style={{ borderRadius: 2 }}>
            <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-sage">
              Recettes
            </div>
            <div className="font-serif text-xl font-medium text-bone">
              {dayRecipes.length}
              <span className="text-xs opacity-55"> dispo</span>
            </div>
          </div>
        </div>
      </div>

      {suggested.length > 0 && (
        <>
          <SectionEyebrow>Suggéré pour ce jour</SectionEyebrow>
          {suggested.map((r) => (
            <SuggestedRecipeCard
              key={r.id}
              id={r.id}
              title={r.title}
              subtitle={
                !isHydric && r.meal_type
                  ? `${MEAL_LABELS[r.meal_type]} · ${r.duration_min ?? "—"} min`
                  : `${r.duration_min ?? "—"} min · ${isHydric ? "Hydrique" : "Alimentaire"}`
              }
              emoji={r.emoji ?? "🍽"}
            />
          ))}
        </>
      )}
    </>
  );
}

interface PlanningViewProps {
  startDate: string;
  recipes: Recipe[];
  waterTotal: number;
  waterGoal: number;
}

export function PlanningView({
  startDate,
  recipes,
  waterTotal,
  waterGoal,
}: PlanningViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const days = getWeekPlan(startDate, 7);
  const selected = days.find((d) => isSameDay(d.date, selectedDate)) ?? days[0];
  const weekStart = days[0]?.date;
  const weekEnd = days[6]?.date;

  return (
    <>
      <p className="eyebrow-line flex items-center gap-2 px-4 pb-2 pt-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
        {weekStart && weekEnd && (
          <>
            Semaine · {format(weekStart, "dd", { locale: fr })} →{" "}
            {format(weekEnd, "dd MMM", { locale: fr })}
          </>
        )}
      </p>
      <WeekStrip
        startDate={startDate}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />
      <div className="flex gap-3.5 px-4 pb-3.5">
        {[
          { color: "bg-sage-deep", label: "Hydrique" },
          { color: "bg-clay-deep", label: "Alimentaire" },
          { color: "bg-ink-soft", label: "Pause" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-mid"
          >
            <span className={cn("h-2 w-2", item.color)} style={{ borderRadius: 0 }} />
            {item.label}
          </div>
        ))}
      </div>
      <DayDetailCard
        date={selected.date}
        type={selected.type}
        recipes={recipes}
        waterTotal={waterTotal}
        waterGoal={waterGoal}
      />
    </>
  );
}
