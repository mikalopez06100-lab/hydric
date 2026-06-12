import { NextResponse } from "next/server";
import { upsertConnection } from "@/lib/scales/connections";
import { parseOAuthState } from "@/lib/scales/oauth-state";
import { getScaleAdapter, isScaleProvider } from "@/lib/scales/registry";
import { importMeasurements } from "@/lib/scales/sync";
import { getAppUrl } from "@/lib/supabase/config";

export async function GET(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;
  const appUrl = getAppUrl();
  const profilUrl = new URL("/profil", appUrl);
  profilUrl.searchParams.set("section", "poids");

  if (!isScaleProvider(provider)) {
    profilUrl.searchParams.set("scale_error", "unknown");
    return NextResponse.redirect(profilUrl);
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError || !code || !state) {
    profilUrl.searchParams.set("scale_error", oauthError ?? "cancelled");
    return NextResponse.redirect(profilUrl);
  }

  const parsed = parseOAuthState(state);
  if (!parsed || parsed.provider !== provider) {
    profilUrl.searchParams.set("scale_error", "invalid_state");
    return NextResponse.redirect(profilUrl);
  }

  try {
    const adapter = getScaleAdapter(provider);
    const redirectUri = `${appUrl}/api/scales/${provider}/callback`;
    const tokens = await adapter.exchangeCode(code, redirectUri);
    await upsertConnection(parsed.userId, provider, tokens);
    await importMeasurements(parsed.userId, provider);
    profilUrl.searchParams.set("scale_connected", provider);
  } catch (err) {
    const message = err instanceof Error ? err.message : "oauth_failed";
    profilUrl.searchParams.set("scale_error", message);
  }

  return NextResponse.redirect(profilUrl);
}
