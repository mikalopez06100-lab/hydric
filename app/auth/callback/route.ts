import { createClient } from "@/lib/supabase/server";
import { syncAdminRole } from "@/lib/admin";
import { isProfileOnboarded } from "@/lib/profile";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await syncAdminRole(user.id, user.email);

        if (next?.startsWith("/")) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        const row = await supabase
          .from("profiles")
          .select("prenom")
          .eq("id", user.id)
          .maybeSingle();

        const destination = isProfileOnboarded(
          row.data as { prenom: string | null } | null
        )
          ? "/dashboard"
          : "/onboarding";

        return NextResponse.redirect(`${origin}${destination}`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
