import { NextResponse } from "next/server";
import { z } from "zod";
import { getProfile, updateProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

const PatchSchema = z.object({
  prenom: z.string().min(1).max(80).optional(),
  weight_goal_kg: z.number().min(30).max(300).nullable().optional(),
  water_goal_ml: z.number().min(500).max(5000).optional(),
  notifications: z.boolean().optional(),
  notification_start_hour: z.number().int().min(6).max(12).optional(),
  notification_end_hour: z.number().int().min(12).max(23).optional(),
  notification_interval_hours: z.number().int().min(1).max(6).optional(),
}).refine(
  (data) => {
    if (
      data.notification_start_hour != null &&
      data.notification_end_hour != null
    ) {
      return data.notification_start_hour < data.notification_end_hour;
    }
    return true;
  },
  { message: "L'heure de fin doit être après l'heure de début." }
);

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const { data: weightLogs } = await supabase
    .from("weight_logs")
    .select("weight_kg, logged_at, measured_at")
    .eq("user_id", user.id)
    .order("measured_at", { ascending: false, nullsFirst: false })
    .order("logged_at", { ascending: false })
    .limit(1);

  return NextResponse.json({
    profile,
    current_weight_kg: weightLogs?.[0]?.weight_kg ?? null,
  });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = PatchSchema.parse(await req.json());
  const profile = await updateProfile(supabase, user.id, body);

  if (!profile) {
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
