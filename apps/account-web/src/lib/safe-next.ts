/**
 * Same-origin dashboard deep-link after OTP (`/login/?next=/dashboard/keys/`).
 * Keep in sync with `functions/lib/dashboard-gate.ts` sanitizeDashboardNext.
 */
export function sanitizeDashboardNext(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/dashboard")) return null;
  if (trimmed.includes("//") || trimmed.includes("\\") || trimmed.includes("@")) return null;
  try {
    const url = new URL(trimmed, "https://account.newsfork.com");
    if (url.origin !== "https://account.newsfork.com") return null;
    if (!url.pathname.startsWith("/dashboard")) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}
