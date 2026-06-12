import { subDays } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getConnection,
  updateConnectionTokens,
  updateSyncStatus,
} from "@/lib/scales/connections";
import { getScaleAdapter } from "@/lib/scales/registry";
import type { OAuthTokens, ScaleProvider } from "@/lib/scales/types";

async function ensureFreshTokens(
  connection: NonNullable<Awaited<ReturnType<typeof getConnection>>>,
  adapter: ReturnType<typeof getScaleAdapter>
): Promise<OAuthTokens> {
  const expiresAt = connection.token_expires_at
    ? new Date(connection.token_expires_at)
    : null;
  const needsRefresh =
    expiresAt && expiresAt.getTime() < Date.now() + 5 * 60 * 1000;

  if (!needsRefresh || !connection.refresh_token) {
    return {
      accessToken: connection.access_token,
      refreshToken: connection.refresh_token ?? undefined,
      expiresAt: expiresAt ?? undefined,
      externalUserId: connection.external_user_id ?? undefined,
    };
  }

  const refreshed = await adapter.refreshTokens(connection.refresh_token);
  await updateConnectionTokens(connection.id, refreshed);
  return refreshed;
}

export async function importMeasurements(
  userId: string,
  provider: ScaleProvider,
  daysBack = 90
): Promise<{ imported: number; skipped: number }> {
  const adapter = getScaleAdapter(provider);
  const connection = await getConnection(userId, provider);

  if (!connection || !connection.sync_enabled) {
    return { imported: 0, skipped: 0 };
  }

  try {
    const tokens = await ensureFreshTokens(connection, adapter);
    const since = subDays(new Date(), daysBack);
    const measurements = await adapter.fetchMeasurements(tokens, since);
    const admin = createAdminClient();

    let imported = 0;
    let skipped = 0;

    for (const m of measurements) {
      const logged_at = m.measuredAt.toISOString().split("T")[0];
      const { error } = await admin.from("weight_logs").upsert(
        {
          user_id: userId,
          weight_kg: m.weightKg,
          logged_at,
          measured_at: m.measuredAt.toISOString(),
          source: provider,
          external_id: m.externalId,
        },
        { onConflict: "user_id,source,external_id", ignoreDuplicates: false }
      );

      if (error) {
        if (error.code === "23505") skipped++;
        else throw error;
      } else {
        imported++;
      }
    }

    await updateSyncStatus(connection.id, "ok");
    return { imported, skipped };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync échouée";
    await updateSyncStatus(connection.id, "error", message);
    throw err;
  }
}

export async function syncAllConnections(
  userId: string
): Promise<Record<ScaleProvider, { imported: number; skipped: number } | null>> {
  const results: Partial<
    Record<ScaleProvider, { imported: number; skipped: number } | null>
  > = {};

  for (const provider of ["withings", "fitbit", "garmin"] as ScaleProvider[]) {
    const connection = await getConnection(userId, provider);
    if (!connection) continue;
    try {
      results[provider] = await importMeasurements(userId, provider);
    } catch {
      results[provider] = null;
    }
  }

  return results as Record<
    ScaleProvider,
    { imported: number; skipped: number } | null
  >;
}
