import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const WeightSchema = z.object({
  weight_kg: z.number().min(30).max(300),
  logged_at: z.string().date().optional(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(30);

  return NextResponse.json({ logs: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = WeightSchema.parse(await req.json());
  const logged_at = body.logged_at ?? new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("weight_logs")
    .upsert(
      {
        user_id: user.id,
        weight_kg: body.weight_kg,
        logged_at,
        measured_at: new Date().toISOString(),
        source: "manual",
        external_id: `manual-${logged_at}`,
      },
      { onConflict: "user_id,source,external_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
