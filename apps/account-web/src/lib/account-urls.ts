export const ACCOUNT_ORIGIN = "https://account.newsfork.com";
export const APIBAY_PORTAL_ORIGIN = "https://api.newsfork.com";

export const ACCOUNT_SIGNIN_URL = `${ACCOUNT_ORIGIN}/login`;
export const ACCOUNT_SIGNUP_URL = `${ACCOUNT_ORIGIN}/signup`;

export const DOCS_LEGAL_BASE = "https://docs.newsfork.com/legal";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildContinueUrl(flow: "login" | "signup" | "forgot", params: URLSearchParams): string {
  const url = new URL("/api/auth/continue", ACCOUNT_ORIGIN);
  url.searchParams.set("flow", flow);
  for (const [key, value] of params.entries()) {
    if (key !== "flow") url.searchParams.set(key, value);
  }
  return url.pathname + url.search;
}

export function buildGoogleAuthUrl(flow: "login" | "signup", params: URLSearchParams): string {
  const url = new URL("/api/auth/google", ACCOUNT_ORIGIN);
  url.searchParams.set("flow", flow);
  const plan = params.get("plan");
  if (plan) url.searchParams.set("plan", plan);
  const returnUrl = params.get("return_url");
  if (returnUrl) url.searchParams.set("return_url", returnUrl);
  return url.pathname + url.search;
}
