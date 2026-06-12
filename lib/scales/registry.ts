import { fitbitAdapter } from "@/lib/scales/providers/fitbit";
import { garminAdapter } from "@/lib/scales/providers/garmin";
import { withingsAdapter } from "@/lib/scales/providers/withings";
import type { ScaleProvider, ScaleProviderAdapter } from "@/lib/scales/types";

const adapters: Record<ScaleProvider, ScaleProviderAdapter> = {
  withings: withingsAdapter,
  fitbit: fitbitAdapter,
  garmin: garminAdapter,
};

export function getScaleAdapter(provider: ScaleProvider): ScaleProviderAdapter {
  return adapters[provider];
}

export function listScaleProviders(): ScaleProviderAdapter[] {
  return Object.values(adapters);
}

export function isScaleProvider(value: string): value is ScaleProvider {
  return value in adapters;
}
