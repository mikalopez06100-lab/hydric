import { isDevOpenAccess } from "@/lib/dev";

/** Magic link désactivé en phase dev (voir NEXT_PUBLIC_DISABLE_MAGIC_LINK). */
export function isMagicLinkEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_DISABLE_MAGIC_LINK === "true") return false;
  if (isDevOpenAccess()) return false;
  return true;
}

export function getDevAuthPassword(): string {
  return process.env.NEXT_PUBLIC_DEV_AUTH_PASSWORD ?? "hydric-dev";
}
