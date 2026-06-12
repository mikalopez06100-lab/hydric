import { NextResponse } from "next/server";
import { z } from "zod";
import { syncAllConnections, importMeasurements } from "@/lib/scales/sync";
import { isScaleProvider } from "@/lib/scales/registry";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  provider: z.string().optional(),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = BodySchema.parse(await req.json().catch(() => ({})));

  if (body.provider) {
    if (!isScaleProvider(body.provider)) {
      return NextResponse.json({ error: "Provider inconnu" }, { status: 400 });
    }
    const result = await importMeasurements(user.id, body.provider);
    return NextResponse.json({ ok: true, result });
  }

  const results = await syncAllConnections(user.id);
  return NextResponse.json({ ok: true, results });
}
