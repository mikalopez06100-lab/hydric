import { createAdminClient } from "@/lib/supabase/admin";
import type { OAuthTokens, ScaleConnectionPublic, ScaleProvider } from "./types";

type ConnectionRow = {
  id: string;
  user_id: string;
  provider: ScaleProvider;
  external_user_id: string | null;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  scopes: string[] | null;
  metadata: Record<string, unknown>;
  sync_enabled: boolean;
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
  created_at: string;
};

export function toPublicConnection(row: ConnectionRow): ScaleConnectionPublic {
  return {
    id: row.id,
    provider: row.provider,
    external_user_id: row.external_user_id,
    sync_enabled: row.sync_enabled,
    last_sync_at: row.last_sync_at,
    last_sync_status: row.last_sync_status,
    last_sync_error: row.last_sync_error,
    created_at: row.created_at,
  };
}

export async function listConnections(
  userId: string
): Promise<ScaleConnectionPublic[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("scale_connections")
    .select(
      "id, provider, external_user_id, sync_enabled, last_sync_at, last_sync_status, last_sync_error, created_at"
    )
    .eq("user_id", userId)
    .order("created_at");

  return (data ?? []) as ScaleConnectionPublic[];
}

export async function getConnection(
  userId: string,
  provider: ScaleProvider
): Promise<ConnectionRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("scale_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", provider)
    .maybeSingle();

  return (data as ConnectionRow | null) ?? null;
}

export async function upsertConnection(
  userId: string,
  provider: ScaleProvider,
  tokens: OAuthTokens
): Promise<void> {
  const admin = createAdminClient();
  await admin.from("scale_connections").upsert(
    {
      user_id: userId,
      provider,
      external_user_id: tokens.externalUserId ?? null,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken ?? null,
      token_expires_at: tokens.expiresAt?.toISOString() ?? null,
      scopes: tokens.scopes ?? null,
      sync_enabled: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,provider" }
  );
}

export async function updateConnectionTokens(
  connectionId: string,
  tokens: OAuthTokens
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("scale_connections")
    .update({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken ?? null,
      token_expires_at: tokens.expiresAt?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", connectionId);
}

export async function updateSyncStatus(
  connectionId: string,
  status: "ok" | "error",
  error?: string
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("scale_connections")
    .update({
      last_sync_at: new Date().toISOString(),
      last_sync_status: status,
      last_sync_error: error ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", connectionId);
}

export async function deleteConnection(
  userId: string,
  provider: ScaleProvider
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("scale_connections")
    .delete()
    .eq("user_id", userId)
    .eq("provider", provider);
}
