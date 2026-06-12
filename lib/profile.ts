import type { SupabaseClient } from "@supabase/supabase-js";
import { isDevOpenAccess } from "@/lib/dev";
import {
  DEFAULT_NOTIFICATION_END_HOUR,
  DEFAULT_NOTIFICATION_INTERVAL_HOURS,
  DEFAULT_NOTIFICATION_START_HOUR,
} from "@/lib/notifications";
import type { PlanTier, Profile } from "@/types";

export type ProfileRow = {
  id: string;
  prenom: string | null;
  email: string;
  plan: PlanTier;
  stripe_status: string | null;
  start_date: string | null;
  avatar_url: string | null;
  weight_goal_kg: number | null;
  water_goal_ml: number;
  notifications: boolean;
  notification_start_hour: number | null;
  notification_end_hour: number | null;
  notification_interval_hours: number | null;
};

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    prenom: row.prenom ?? "",
    email: row.email,
    plan: row.plan,
    stripe_status: row.stripe_status ?? "inactive",
    start_date: row.start_date ?? new Date().toISOString().split("T")[0],
    avatar_url: row.avatar_url ?? undefined,
    weight_goal_kg: row.weight_goal_kg ?? undefined,
    water_goal_ml: row.water_goal_ml,
    notifications: row.notifications ?? true,
    notification_start_hour:
      row.notification_start_hour ?? DEFAULT_NOTIFICATION_START_HOUR,
    notification_end_hour:
      row.notification_end_hour ?? DEFAULT_NOTIFICATION_END_HOUR,
    notification_interval_hours:
      row.notification_interval_hours ?? DEFAULT_NOTIFICATION_INTERVAL_HOURS,
  };
}

export function isProfileOnboarded(
  row: Pick<ProfileRow, "prenom"> | null | undefined
): boolean {
  return !!row?.prenom?.trim();
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapProfileRow(data as ProfileRow);
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<
    Pick<
      ProfileRow,
      | "prenom"
      | "avatar_url"
      | "weight_goal_kg"
      | "plan"
      | "start_date"
      | "water_goal_ml"
      | "notifications"
      | "notification_start_hour"
      | "notification_end_hour"
      | "notification_interval_hours"
    >
  >
): Promise<Profile | null> {
  const patch: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  if (isDevOpenAccess()) {
    patch.stripe_status = "active";
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();

  if (error || !data) return null;
  return mapProfileRow(data as ProfileRow);
}
