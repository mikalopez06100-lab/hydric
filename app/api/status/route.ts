import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NextResponse } from "next/server";

export async function GET() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return NextResponse.json({
      supabase: false,
      message: "Variables NEXT_PUBLIC_SUPABASE_* manquantes",
    });
  }

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        supabase: false,
        mode: "error",
        message: error.message,
      });
    }

    return NextResponse.json({
      supabase: true,
      recipes: count ?? 0,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ supabase: false, mode: "error", message });
  }
}
