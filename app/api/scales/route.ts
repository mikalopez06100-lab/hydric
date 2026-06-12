import { NextResponse } from "next/server";
import { SCALE_BRAND_CATALOG } from "@/lib/scales/catalog";
import { listConnections } from "@/lib/scales/connections";
import { listScaleProviders } from "@/lib/scales/registry";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connections = await listConnections(user.id);
  const providers = listScaleProviders().map((adapter) => {
    const connected = connections.some((c) => c.provider === adapter.meta.id);
    const catalog = SCALE_BRAND_CATALOG.find((b) => b.id === adapter.meta.id);
    return {
      ...adapter.meta,
      configured: adapter.isConfigured(),
      connected,
      availability: connected
        ? ("live" as const)
        : adapter.isConfigured()
          ? ("ready" as const)
          : (catalog?.availability ?? "planned"),
      models: catalog?.models,
    };
  });

  return NextResponse.json({
    connections,
    providers,
    catalog: SCALE_BRAND_CATALOG,
    multiBrand: true,
  });
}
