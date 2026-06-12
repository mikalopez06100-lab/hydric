import { NextResponse } from "next/server";
import { z } from "zod";
import { getDevAuthPassword } from "@/lib/auth";
import { isDevOpenAccess } from "@/lib/dev";
import { createAdminClient } from "@/lib/supabase/admin";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
});

export async function POST(req: Request) {
  if (!isDevOpenAccess()) {
    return NextResponse.json({ error: "Non disponible" }, { status: 403 });
  }

  const { email, password: bodyPassword } = BodySchema.parse(await req.json());
  const password = bodyPassword ?? getDevAuthPassword();
  const normalized = email.trim().toLowerCase();
  const admin = createAdminClient();

  const { error: createError } = await admin.auth.admin.createUser({
    email: normalized,
    password,
    email_confirm: true,
  });

  let userId: string | undefined;

  if (createError) {
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .ilike("email", normalized)
      .maybeSingle();

    if (profile?.id) {
      userId = profile.id;
      await admin.auth.admin.updateUserById(profile.id, {
        password,
        email_confirm: true,
      });
    } else {
      const { data: listed } = await admin.auth.admin.listUsers();
      const existing = listed?.users?.find(
        (u) => u.email?.toLowerCase() === normalized
      );
      if (existing) {
        userId = existing.id;
        await admin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
        });
      } else if (
        !createError.message.toLowerCase().includes("already") &&
        !createError.message.toLowerCase().includes("registered")
      ) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
    }
  } else {
    const { data: listed } = await admin.auth.admin.listUsers();
    userId = listed?.users?.find((u) => u.email?.toLowerCase() === normalized)
      ?.id;
  }

  if (userId) {
    await admin.from("profiles").upsert(
      {
        id: userId,
        email: normalized,
        stripe_status: "active",
        plan: "essential",
      },
      { onConflict: "id" }
    );
  }

  return NextResponse.json({ ok: true });
}
