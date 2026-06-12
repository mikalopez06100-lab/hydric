import { createHmac, randomBytes } from "crypto";
import type { ScaleProvider } from "./types";

function secret() {
  return (
    process.env.SCALE_OAUTH_STATE_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "hydric-dev-state"
  );
}

export function createOAuthState(userId: string, provider: ScaleProvider) {
  const nonce = randomBytes(16).toString("hex");
  const payload = `${userId}:${provider}:${nonce}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function parseOAuthState(
  state: string
): { userId: string; provider: ScaleProvider } | null {
  try {
    const raw = Buffer.from(state, "base64url").toString("utf8");
    const parts = raw.split(":");
    if (parts.length < 4) return null;

    const sig = parts.pop()!;
    const nonce = parts.pop()!;
    const provider = parts.pop()! as ScaleProvider;
    const userId = parts.join(":");

    const payload = `${userId}:${provider}:${nonce}`;
    const expected = createHmac("sha256", secret()).update(payload).digest("hex");
    if (sig !== expected) return null;

    return { userId, provider };
  } catch {
    return null;
  }
}
