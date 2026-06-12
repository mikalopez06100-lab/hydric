import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDevOpenAccess } from "@/lib/dev";
import type { PlanTier } from "@/types";

export const GRANT_COOKIE = "hydric_grant";

export function hasActiveAccess(stripeStatus: string | null | undefined): boolean {
  if (isDevOpenAccess()) return true;
  return stripeStatus === "active" || stripeStatus === "complimentary";
}

export async function redeemAccessCode(code: string): Promise<{
  ok: true;
  token: string;
  plan: PlanTier;
} | { ok: false; error: string }> {
  const admin = createAdminClient();
  const normalized = code.trim().toUpperCase();

  const { data: row, error } = await admin
    .from("access_codes")
    .select("*")
    .eq("code", normalized)
    .eq("active", true)
    .maybeSingle();

  if (error || !row) {
    return { ok: false, error: "Code invalide ou expiré." };
  }

  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return { ok: false, error: "Ce code a expiré." };
  }

  if (row.uses_count >= row.max_uses) {
    return { ok: false, error: "Ce code a atteint sa limite d'utilisation." };
  }

  const token =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now()}${Math.random().toString(36).slice(2)}`;

  const { data: grant, error: grantError } = await admin
    .from("access_grants")
    .insert({
      code_id: row.id,
      plan: row.plan,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("token, plan")
    .single();

  if (grantError || !grant) {
    return { ok: false, error: "Impossible de créer l'accès. Réessayez." };
  }

  return {
    ok: true,
    token: grant.token as string,
    plan: grant.plan as PlanTier,
  };
}

export async function applyGrantToUser(
  userId: string,
  token: string
): Promise<boolean> {
  const admin = createAdminClient();

  const { data: grant } = await admin
    .from("access_grants")
    .select("*")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!grant) return false;

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      plan: grant.plan,
      stripe_status: "complimentary",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (profileError) return false;

  await admin
    .from("access_grants")
    .update({ used_at: new Date().toISOString(), user_id: userId })
    .eq("id", grant.id);

  if (grant.code_id) {
    const { data: code } = await admin
      .from("access_codes")
      .select("uses_count")
      .eq("id", grant.code_id)
      .single();

    if (code) {
      await admin
        .from("access_codes")
        .update({ uses_count: (code.uses_count ?? 0) + 1 })
        .eq("id", grant.code_id);
    }
  }

  return true;
}

export async function fulfillStripePending(
  supabase: SupabaseClient,
  userId: string,
  email: string
): Promise<boolean> {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();

  const { data: pending } = await admin
    .from("stripe_pending")
    .select("*")
    .ilike("email", normalized)
    .is("fulfilled_user_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!pending) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      plan: pending.plan,
      stripe_customer_id: pending.stripe_customer_id,
      stripe_sub_id: pending.stripe_sub_id,
      stripe_status: pending.stripe_status ?? "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) return false;

  await admin
    .from("stripe_pending")
    .update({ fulfilled_user_id: userId })
    .eq("id", pending.id);

  return true;
}
