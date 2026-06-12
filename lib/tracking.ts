import type { SupabaseClient } from "@supabase/supabase-js";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { getDayType } from "@/lib/day-calculator";

export type UserStats = {
  activeDays: number;
  completionPct: number;
  weightLost: number;
  avgWaterMl: number;
  completedDays: number;
};

export async function syncUserDayLogs(
  supabase: SupabaseClient,
  userId: string,
  startDate: string
): Promise<void> {
  const start = parseISO(startDate);
  const today = new Date();
  const totalDays = Math.max(0, differenceInCalendarDays(today, start) + 1);

  if (totalDays === 0) return;

  const rows = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      user_id: userId,
      day_date: format(date, "yyyy-MM-dd"),
      day_type: getDayType(startDate, date),
      completed: false,
    };
  });

  await supabase.from("day_logs").upsert(rows, {
    onConflict: "user_id,day_date",
    ignoreDuplicates: true,
  });

  await supabase.rpc("refresh_day_completion", {
    p_user_id: userId,
    p_day_date: format(today, "yyyy-MM-dd"),
  });
}

export async function refreshTodayCompletion(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const today = format(new Date(), "yyyy-MM-dd");
  await supabase.rpc("refresh_day_completion", {
    p_user_id: userId,
    p_day_date: today,
  });
}

export async function getUserStats(
  supabase: SupabaseClient,
  userId: string,
  startDate: string
): Promise<UserStats> {
  const today = format(new Date(), "yyyy-MM-dd");

  const [{ data: dayLogs }, { data: weightLogs }, { data: waterLogs }] =
    await Promise.all([
      supabase
        .from("day_logs")
        .select("completed")
        .eq("user_id", userId)
        .lte("day_date", today),
      supabase
        .from("weight_logs")
        .select("weight_kg, logged_at")
        .eq("user_id", userId)
        .order("measured_at", { ascending: true, nullsFirst: false })
        .order("logged_at", { ascending: true }),
      supabase
        .from("water_logs")
        .select("amount_ml, logged_at")
        .eq("user_id", userId)
        .gte("logged_at", `${startDate}T00:00:00`),
    ]);

  const logs = dayLogs ?? [];
  const completedDays = logs.filter((d) => d.completed).length;
  const activeDays = Math.max(
    0,
    differenceInCalendarDays(new Date(), parseISO(startDate)) + 1
  );
  const completionPct =
    logs.length > 0 ? Math.round((completedDays / logs.length) * 100) : 0;

  const weights = weightLogs ?? [];
  let weightLost = 0;
  if (weights.length >= 2) {
    const first = Number(weights[0].weight_kg);
    const last = Number(weights[weights.length - 1].weight_kg);
    weightLost = Math.max(0, Math.round((first - last) * 10) / 10);
  }

  const water = waterLogs ?? [];
  const hydricDays = Math.max(1, Math.ceil(activeDays / 2));
  const totalWater = water.reduce((s, l) => s + l.amount_ml, 0);
  const avgWaterMl = water.length > 0 ? Math.round(totalWater / hydricDays) : 0;

  return {
    activeDays,
    completionPct,
    weightLost,
    avgWaterMl,
    completedDays,
  };
}
