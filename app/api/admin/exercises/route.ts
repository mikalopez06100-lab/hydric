import { NextResponse } from "next/server";
import { adminForbidden, adminUnauthorized, requireAdminUser } from "@/lib/admin";
import { ExerciseAdminSchema } from "@/lib/admin-schemas";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return adminUnauthorized();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exercises: data ?? [] });
}

export async function POST(req: Request) {
  const user = await requireAdminUser();
  if (!user) return adminForbidden();

  const body = ExerciseAdminSchema.parse(await req.json());
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("exercises")
    .insert({
      title: body.title,
      description: body.description,
      category: body.category,
      intensity: body.intensity,
      duration_min: body.duration_min,
      tags: body.tags ?? null,
      steps: body.steps,
      emoji: body.emoji ?? null,
      published: body.published,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exercise: data }, { status: 201 });
}
