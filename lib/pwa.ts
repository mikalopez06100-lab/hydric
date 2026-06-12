export const PWA_DISMISS_KEY = "hydric-pwa-dismissed";
export const PWA_DISMISS_DAYS = 14;

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

export function wasDismissedRecently(): boolean {
  if (typeof localStorage === "undefined") return false;
  const raw = localStorage.getItem(PWA_DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  const elapsed = Date.now() - dismissedAt;
  return elapsed < PWA_DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function dismissInstallPrompt(): void {
  localStorage.setItem(PWA_DISMISS_KEY, String(Date.now()));
}
