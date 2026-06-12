"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TopBar } from "@/components/layout/TopBar";
import { PlanningView } from "@/components/planning/PlanningView";
import { useRecipes } from "@/hooks/useRecipes";
import { useUserStore } from "@/store/useUserStore";
import { useWaterStore } from "@/store/useWaterStore";

export default function PlanningPage() {
  const { profile } = useUserStore();
  const { recipes } = useRecipes();
  const { total_ml, goal_ml } = useWaterStore();

  if (!profile) return null;

  return (
    <>
      <TopBar
        title="Mon planning"
        right={
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {format(new Date(), "MMM yy", { locale: fr })}
          </span>
        }
      />
      <PlanningView
        startDate={profile.start_date}
        recipes={recipes}
        waterTotal={total_ml}
        waterGoal={goal_ml}
      />
    </>
  );
}
