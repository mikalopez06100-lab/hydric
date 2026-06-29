import { NextResponse } from "next/server";
import { adminForbidden, adminUnauthorized, requireAdminUser } from "@/lib/admin";
import { RecipeAdminSchema } from "@/lib/admin-schemas";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return adminUnauthorized();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipes: data ?? [] });
}

export async function POST(req: Request) {
  const user = await requireAdminUser();
  if (!user) return adminForbidden();

  const body = RecipeAdminSchema.parse(await req.json());
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("recipes")
    .insert({
      title: body.title,
      description: body.description ?? null,
      day_type: body.day_type,
      meal_type: body.meal_type ?? null,
      duration_min: body.duration_min ?? null,
      tags: body.tags ?? null,
      ingredients: body.ingredients ?? [],
      steps: body.steps ?? [],
      plan_required: body.plan_required,
      published: body.published,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipe: data }, { status: 201 });
}
