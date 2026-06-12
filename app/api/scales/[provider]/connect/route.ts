import { NextResponse } from "next/server";
import { createOAuthState } from "@/lib/scales/oauth-state";
import { getScaleAdapter, isScaleProvider } from "@/lib/scales/registry";
import { getAppUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;
  if (!isScaleProvider(provider)) {
    return NextResponse.json({ error: "Provider inconnu" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adapter = getScaleAdapter(provider);
  if (!adapter.isConfigured()) {
    return NextResponse.json(
      {
        error: `${adapter.meta.name} n'est pas encore configuré côté serveur.`,
        code: "not_configured",
      },
      { status: 503 }
    );
  }

  const state = createOAuthState(user.id, provider);
  const redirectUri = `${getAppUrl()}/api/scales/${provider}/callback`;
  const url = adapter.getAuthorizeUrl(state, redirectUri);

  return NextResponse.json({ url });
}
