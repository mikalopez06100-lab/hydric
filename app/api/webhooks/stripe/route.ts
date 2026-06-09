import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Stripe webhook — à configurer avec STRIPE_WEBHOOK_SECRET" },
    { status: 501 }
  );
}
