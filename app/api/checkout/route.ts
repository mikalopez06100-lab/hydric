import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppUrl } from "@/lib/supabase/config";
import { getStripe, getStripePriceId, isStripeConfigured } from "@/lib/stripe";
import type { PlanTier } from "@/types";

const BodySchema = z.object({
  plan: z.enum(["starter", "essential", "premium"]),
});

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe non configuré. Contactez le support." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe indisponible." }, { status: 503 });
  }

  const { plan } = BodySchema.parse(await req.json());
  const priceId = getStripePriceId(plan as PlanTier);

  if (!priceId) {
    return NextResponse.json(
      { error: `Tarif ${plan} non configuré.` },
      { status: 400 }
    );
  }

  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/#tarifs`,
    metadata: { plan },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
