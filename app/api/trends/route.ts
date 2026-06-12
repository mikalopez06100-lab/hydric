import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import {
  buildHydrationTrend,
  buildWeightTrend,
  type TrendPeriod,
} from "@/lib/trends";
import { subDays, subMonths, subWeeks } from "date-fns";

const QuerySchema = z.object({
  period: z.enum(["day", "week", "month"]).default("day"),
});

function rangeStart(period: TrendPeriod): Date {
  const end = new Date();
  if (period === "day") return subDays(end, 29);
  if (period === "week") return subWeeks(end, 11);
  return subMonths(end, 5);
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { period } = QuerySchema.parse({
    period: new URL(req.url).searchParams.get("period") ?? "day",
  });

  const from = rangeStart(period).toISOString();

  const [{ data: weightLogs }, { data: waterLogs }] = await Promise.all([
    supabase
      .from("weight_logs")
      .select("weight_kg, logged_at, measured_at")
      .eq("user_id", user.id)
      .gte("logged_at", from.slice(0, 10))
      .order("logged_at", { ascending: true }),
    supabase
      .from("water_logs")
      .select("amount_ml, logged_at")
      .eq("user_id", user.id)
      .gte("logged_at", from)
      .order("logged_at", { ascending: true }),
  ]);

  return NextResponse.json({
    period,
    weight: buildWeightTrend(weightLogs ?? [], period),
    hydration: buildHydrationTrend(waterLogs ?? [], period),
    goals: {
      weight_kg: profile.weight_goal_kg ?? null,
      water_ml: profile.water_goal_ml,
    },
  });
}
