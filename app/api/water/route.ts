import { NextResponse } from "next/server";
import { z } from "zod";
import { refreshTodayCompletion } from "@/lib/tracking";
import { createClient } from "@/lib/supabase/server";

const WaterSchema = z.object({
  amount_ml: z.number().min(25).max(2000),
  type: z
    .enum(["water", "tea", "broth", "juice", "other"])
    .default("water"),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = WaterSchema.parse(await req.json());
  const { data, error } = await supabase
    .from("water_logs")
    .insert({ user_id: user.id, ...body })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  await refreshTodayCompletion(supabase, user.id);
  return NextResponse.json(data, { status: 201 });
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  const date =
    new URL(req.url).searchParams.get("date") ??
    new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("water_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("logged_at", `${date}T00:00:00`)
    .lte("logged_at", `${date}T23:59:59`)
    .order("logged_at");

  const total = data?.reduce((sum, l) => sum + l.amount_ml, 0) ?? 0;
  return NextResponse.json({ logs: data ?? [], total_ml: total });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("water_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  await refreshTodayCompletion(supabase, user.id);
  return NextResponse.json({ ok: true });
}
