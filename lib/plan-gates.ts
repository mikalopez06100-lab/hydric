import type { PlanTier } from "@/types";

export const PLAN_GATES = {
  starter: {
    recipes_limit: 5,
    history_days: 0,
    planning_notes: false,
    favorites: false,
    weight_chart: false,
    export_pdf: false,
    one_to_one: false,
  },
  essential: {
    recipes_limit: Infinity,
    history_days: 30,
    planning_notes: true,
    favorites: true,
    weight_chart: true,
    export_pdf: false,
    one_to_one: false,
  },
  premium: {
    recipes_limit: Infinity,
    history_days: 90,
    planning_notes: true,
    favorites: true,
    weight_chart: true,
    export_pdf: true,
    one_to_one: true,
  },
} as const;

export type PlanFeature = keyof typeof PLAN_GATES.premium;

export function canAccess(plan: PlanTier, feature: PlanFeature): boolean {
  return !!PLAN_GATES[plan]?.[feature];
}

export function getPlanLabel(plan: PlanTier): string {
  const labels: Record<PlanTier, string> = {
    starter: "Starter",
    essential: "Essentiel",
    premium: "Premium",
  };
  return labels[plan];
}

export function getPlanPrice(plan: PlanTier): string {
  const prices: Record<PlanTier, string> = {
    starter: "6,90 €/mois",
    essential: "9,90 €/mois",
    premium: "15,90 €/mois",
  };
  return prices[plan];
}
