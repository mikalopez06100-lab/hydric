import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import type { PlanTier } from "@/types";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 501 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;
    const plan = (session.metadata?.plan ?? "essential") as PlanTier;

    if (email) {
      const { data: existing } = await admin
        .from("profiles")
        .select("id")
        .ilike("email", email.trim())
        .maybeSingle();

      if (existing?.id) {
        await admin
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: session.customer as string | null,
            stripe_sub_id: session.subscription as string | null,
            stripe_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await admin.from("stripe_pending").insert({
          email: email.trim().toLowerCase(),
          plan,
          stripe_customer_id: session.customer as string | null,
          stripe_sub_id: session.subscription as string | null,
          stripe_status: "active",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
