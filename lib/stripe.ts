import Stripe from "stripe";
import type { PlanTier } from "@/types";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

const PRICE_ENV: Record<PlanTier, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  essential: process.env.STRIPE_PRICE_ESSENTIAL,
  premium: process.env.STRIPE_PRICE_PREMIUM,
};

export function getStripePriceId(plan: PlanTier): string | null {
  return PRICE_ENV[plan] ?? null;
}

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    PRICE_ENV.starter &&
    PRICE_ENV.essential
  );
}
