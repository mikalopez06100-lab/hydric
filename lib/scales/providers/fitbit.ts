import type { ScaleProviderAdapter } from "@/lib/scales/types";

/** Stub Fitbit — à activer avec FITBIT_CLIENT_ID / FITBIT_CLIENT_SECRET */
export const fitbitAdapter: ScaleProviderAdapter = {
  meta: {
    id: "fitbit",
    name: "Fitbit",
    description: "Balance Aria et appareils Fitbit",
    logo: "⌚",
  },

  isConfigured() {
    return !!(
      process.env.FITBIT_CLIENT_ID && process.env.FITBIT_CLIENT_SECRET
    );
  },

  getAuthorizeUrl() {
    throw new Error("Fitbit non configuré");
  },

  async exchangeCode() {
    throw new Error("Fitbit non configuré");
  },

  async refreshTokens() {
    throw new Error("Fitbit non configuré");
  },

  async fetchMeasurements() {
    return [];
  },
};
