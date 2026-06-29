import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDevOpenAccess } from "@/lib/dev";
import { createClient } from "@/lib/supabase/server";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/** Phase dev : les comptes créés via mot de passe peuvent gérer le CMS. */
export function shouldGrantAdminOnLogin(email?: string | null): boolean {
  if (isAdminEmail(email)) return true;
  return isDevOpenAccess();
}

export async function syncAdminRole(
  userId: string,
  email?: string | null
): Promise<void> {
  if (!shouldGrantAdminOnLogin(email)) return;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({ is_admin: true })
    .eq("id", userId);
}

export async function isUserAdmin(
  userId: string,
  email?: string | null
): Promise<boolean> {
  if (isAdminEmail(email)) {
    await syncAdminRole(userId, email);
    return true;
  }

  if (isDevOpenAccess()) {
    await syncAdminRole(userId, email);
    return true;
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[admin] lecture is_admin:", error.message);
    return false;
  }

  return data?.is_admin === true;
}

export async function requireAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const ok = await isUserAdmin(user.id, user.email);
  if (!ok) return null;

  return user;
}

export function adminForbidden() {
  return Response.json({ error: "Accès réservé aux administrateurs" }, {
    status: 403,
  });
}

export function adminUnauthorized() {
  return Response.json({ error: "Non connecté" }, { status: 401 });
}
