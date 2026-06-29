function normalizeHost(host: string): string {
  return host.split(":")[0].toLowerCase().replace(/^www\./, "");
}

function hostFromEnvUrl(url: string | undefined): string {
  if (!url?.trim()) return "";
  try {
    return normalizeHost(new URL(url).hostname);
  } catch {
    return "";
  }
}

export function getMarketingOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_MARKETING_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://localhost:3044";
  return raw.replace(/\/$/, "");
}

export function getAppOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3044";
  return raw.replace(/\/$/, "");
}

/** Vitrine et app sur des hôtes distincts (prod). */
export function isDomainSplit(): boolean {
  const marketing = hostFromEnvUrl(getMarketingOrigin());
  const app = hostFromEnvUrl(getAppOrigin());
  return !!(marketing && app && marketing !== app);
}

export function isMarketingHost(hostname: string): boolean {
  if (!isDomainSplit()) return false;
  return normalizeHost(hostname) === hostFromEnvUrl(getMarketingOrigin());
}

export function isAppHost(hostname: string): boolean {
  if (!isDomainSplit()) return true;
  return !isMarketingHost(hostname);
}

export function marketingUrl(path = "/"): string {
  const base = getMarketingOrigin();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function appUrl(path = "/"): string {
  const base = getAppOrigin();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Chemins servis uniquement sur le sous-domaine vitrine. */
export function isMarketingOnlyPath(pathname: string): boolean {
  return pathname === "/";
}
