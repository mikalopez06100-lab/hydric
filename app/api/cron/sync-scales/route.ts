import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncAllConnections } from "@/lib/scales/sync";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: connections } = await admin
    .from("scale_connections")
    .select("user_id")
    .eq("sync_enabled", true);

  const userIds = Array.from(
    new Set((connections ?? []).map((c) => c.user_id as string))
  );
  let synced = 0;
  let errors = 0;

  for (const userId of userIds) {
    try {
      await syncAllConnections(userId);
      synced++;
    } catch {
      errors++;
    }
  }

  return NextResponse.json({
    ok: true,
    users: userIds.length,
    synced,
    errors,
  });
}
