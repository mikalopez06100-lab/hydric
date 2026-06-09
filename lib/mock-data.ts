import type { Profile, Recipe, WaterLog } from "@/types";

export const DEMO_PROFILE: Profile = {
  id: "demo-user",
  prenom: "Sophie",
  email: "sophie@example.com",
  plan: "essential",
  stripe_status: "active",
  start_date: "2026-05-28",
  weight_goal_kg: 62,
  water_goal_ml: 2000,
  notifications: true,
};

export const DEMO_WATER_LOGS: WaterLog[] = [
  {
    id: "w1",
    user_id: "demo-user",
    logged_at: new Date().toISOString().split("T")[0] + "T08:12:00",
    amount_ml: 250,
    type: "water",
  },
  {
    id: "w2",
    user_id: "demo-user",
    logged_at: new Date().toISOString().split("T")[0] + "T10:45:00",
    amount_ml: 300,
    type: "tea",
  },
  {
    id: "w3",
    user_id: "demo-user",
    logged_at: new Date().toISOString().split("T")[0] + "T12:30:00",
    amount_ml: 200,
    type: "broth",
  },
  {
    id: "w4",
    user_id: "demo-user",
    logged_at: new Date().toISOString().split("T")[0] + "T14:00:00",
    amount_ml: 500,
    type: "water",
  },
];

export const DEMO_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Bouillon détox aux légumes",
    description: "Léger et réconfortant pour vos jours hydriques",
    day_type: "hydric",
    duration_min: 40,
    tags: ["cure détox", "léger"],
    emoji: "🥣",
    plan_required: "starter",
    published: true,
    ingredients: [
      { name: "Carottes", qty: "2", unit: "" },
      { name: "Poireaux", qty: "1", unit: "" },
      { name: "Céleri", qty: "2", unit: "branches" },
      { name: "Eau", qty: "1,5", unit: "L" },
    ],
    steps: [
      { step: 1, text: "Laver et couper tous les légumes en morceaux." },
      { step: 2, text: "Porter l'eau à ébullition dans une grande casserole." },
      { step: 3, text: "Ajouter les légumes et laisser mijoter 30 min à feu doux." },
      { step: 4, text: "Filtrer et servir chaud, sans sel." },
    ],
  },
  {
    id: "r2",
    title: "Salade protéinée légère",
    description: "Salade complète pour un déjeuner équilibré",
    day_type: "food",
    duration_min: 15,
    tags: ["protéine", "équilibre"],
    emoji: "🥗",
    plan_required: "starter",
    published: true,
    ingredients: [
      { name: "Poulet grillé", qty: "100", unit: "g" },
      { name: "Mesclun", qty: "150", unit: "g" },
      { name: "Tomates cerises", qty: "100", unit: "g" },
      { name: "Huile d'olive", qty: "1", unit: "c. à soupe" },
    ],
    steps: [
      { step: 1, text: "Disposer le mesclun dans un saladier." },
      { step: 2, text: "Ajouter le poulet émincé et les tomates." },
      { step: 3, text: "Assaisonner avec l'huile d'olive et le jus de citron." },
    ],
  },
  {
    id: "r3",
    title: "Tisane gingembre-citron",
    description: "Boisson réchauffante pour les matins hydriques",
    day_type: "hydric",
    duration_min: 5,
    tags: ["tisane", "matin"],
    emoji: "🫖",
    plan_required: "starter",
    published: true,
    ingredients: [
      { name: "Gingembre frais", qty: "1", unit: "cm" },
      { name: "Citron", qty: "1/2", unit: "" },
      { name: "Eau chaude", qty: "250", unit: "ml" },
    ],
    steps: [
      { step: 1, text: "Râper le gingembre frais." },
      { step: 2, text: "Verser l'eau chaude sur le gingembre." },
      { step: 3, text: "Ajouter le jus de citron et laisser infuser 3 min." },
    ],
  },
  {
    id: "r4",
    title: "Bouillon détox du matin",
    description: "Start léger pour commencer la journée",
    day_type: "hydric",
    duration_min: 10,
    tags: ["matin", "léger"],
    emoji: "🥣",
    plan_required: "essential",
    published: true,
  },
  {
    id: "r5",
    title: "Velouté de courgettes",
    description: "Onctueux et léger en calories",
    day_type: "hydric",
    duration_min: 25,
    tags: ["velouté", "légumes"],
    emoji: "🍲",
    plan_required: "essential",
    published: true,
  },
  {
    id: "r6",
    title: "Bowl quinoa & légumes",
    description: "Repas complet pour jour alimentaire",
    day_type: "food",
    duration_min: 30,
    tags: ["quinoa", "végétarien"],
    emoji: "🍚",
    plan_required: "premium",
    published: true,
  },
];

export const WATER_TYPE_LABELS: Record<string, string> = {
  water: "Eau",
  tea: "Tisane",
  broth: "Bouillon",
  juice: "Jus",
  other: "Autre",
};

export const WATER_TYPE_EMOJI: Record<string, string> = {
  water: "💧",
  tea: "🫖",
  broth: "🥣",
  juice: "🧃",
  other: "💧",
};

export function formatLiters(ml: number): string {
  if (ml >= 1000) {
    const liters = ml / 1000;
    return `${liters.toLocaleString("fr-FR", { minimumFractionDigits: liters % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} L`;
  }
  return `${ml} ml`;
}
