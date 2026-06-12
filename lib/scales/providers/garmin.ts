import type { ScaleProviderAdapter } from "@/lib/scales/types";

/** Stub Garmin — intégration Health API à venir */
export const garminAdapter: ScaleProviderAdapter = {
  meta: {
    id: "garmin",
    name: "Garmin",
    description: "Index S2 et écosystème Garmin Connect",
    logo: "🛰️",
  },

  isConfigured() {
    return !!(
      process.env.GARMIN_CLIENT_ID && process.env.GARMIN_CLIENT_SECRET
    );
  },

  getAuthorizeUrl() {
    throw new Error("Garmin non configuré");
  },

  async exchangeCode() {
    throw new Error("Garmin non configuré");
  },

  async refreshTokens() {
    throw new Error("Garmin non configuré");
  },

  async fetchMeasurements() {
    return [];
  },
};
