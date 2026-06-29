import { NextResponse } from "next/server";
import { adminForbidden, adminUnauthorized, requireAdminUser } from "@/lib/admin";
import { RecipeAdminPatchSchema } from "@/lib/admin-schemas";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteParams = { params: { id: string } };

export async function GET(_req: Request, { params }: RouteParams) {
  const user = await requireAdminUser();
  if (!user) return adminUnauthorized();

  const { id } = params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Recette introuvable" }, { status: 404 });
  }

  return NextResponse.json({ recipe: data });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const user = await requireAdminUser();
  if (!user) return adminForbidden();

  const { id } = params;
  const body = RecipeAdminPatchSchema.parse(await req.json());
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("recipes")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipe: data });
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const user = await requireAdminUser();
  if (!user) return adminForbidden();

  const { id } = params;
  const admin = createAdminClient();
  const { error } = await admin.from("recipes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
