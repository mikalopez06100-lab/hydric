export const WATER_TYPE_LABELS: Record<string, string> = {
  water: "Eau",
  tea: "Thé / tisane",
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
    return `${liters.toLocaleString("fr-FR", {
      minimumFractionDigits: liters % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })} L`;
  }
  return `${ml} ml`;
}
