import type { ScaleProvider } from "./types";

export type ProviderAvailability =
  | "live"
  | "ready"
  | "planned"
  | "manual_only";

export type ScaleBrand = {
  id: ScaleProvider | "other";
  name: string;
  models: string;
  logo: string;
  availability: ProviderAvailability;
  note: string;
};

/** Marques courantes — HYDRIC n'est pas lié à un seul fabricant. */
export const SCALE_BRAND_CATALOG: ScaleBrand[] = [
  {
    id: "withings",
    name: "Withings",
    models: "Body, Body+, Body Cardio, Body Scan…",
    logo: "⚖️",
    availability: "ready",
    note: "Connexion OAuth dès que les clés API sont activées.",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    models: "Aria, Aria 2, Aria Air",
    logo: "⌚",
    availability: "planned",
    note: "Adaptateur prévu — même architecture que Withings.",
  },
  {
    id: "garmin",
    name: "Garmin",
    models: "Index S2, Index™",
    logo: "🛰️",
    availability: "planned",
    note: "Adaptateur prévu via Garmin Health API.",
  },
  {
    id: "other",
    name: "Renpho, Eufy, Xiaomi…",
    models: "Balances connectées sans API ouverte",
    logo: "📱",
    availability: "manual_only",
    note: "Pas d'API publique — utilisez la saisie manuelle ci-dessous.",
  },
];

export const WEIGHT_SOURCE_LABELS: Record<string, string> = {
  manual: "Saisie",
  withings: "Withings",
  fitbit: "Fitbit",
  garmin: "Garmin",
  bluetooth: "Bluetooth",
};

export function availabilityLabel(a: ProviderAvailability): string {
  switch (a) {
    case "live":
      return "Connecté";
    case "ready":
      return "Disponible";
    case "planned":
      return "Bientôt";
    case "manual_only":
      return "Saisie manuelle";
  }
}
