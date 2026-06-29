import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function isUserAdmin(
  userId: string,
  email?: string | null
): Promise<boolean> {
  if (email && adminEmails().includes(email.toLowerCase())) {
    return true;
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

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
