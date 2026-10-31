/**
 * apibay-labs developer portal URL builder (server-side / Pages Functions).
 * See docs/apibay-integration.md.
 */

const DEFAULT_ORIGIN = "https://api.newsfork.com";

export interface ApibayPortalConfig {
  portalOrigin: string;
  signupPath: string;
  loginPath: string;
  forgotPasswordPath: string;
  googleOauthPath: string;
  logoutPath: string;
  accountOrigin: string;
  /** Extra return_url hosts (comma-separated), from Pages env ACCOUNT_RETURN_URL_HOSTS. */
  extraReturnHosts: string[];
}

export function getApibayPortalConfig(env?: Record<string, string | undefined>): ApibayPortalConfig {
  const portalOrigin = (env?.APIBAY_PORTAL_ORIGIN ?? DEFAULT_ORIGIN).replace(/\/$/, "");
  const extraReturnHosts = (env?.ACCOUNT_RETURN_URL_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return {
    portalOrigin,
    signupPath: env?.APIBAY_SIGNUP_PATH ?? "/signup",
    loginPath: env?.APIBAY_LOGIN_PATH ?? "/login",
    forgotPasswordPath: env?.APIBAY_FORGOT_PASSWORD_PATH ?? "/forgot-password",
    googleOauthPath: env?.APIBAY_GOOGLE_OAUTH_PATH ?? "/oauth/google",
    logoutPath: env?.APIBAY_LOGOUT_PATH ?? "/logout",
    accountOrigin: (env?.ACCOUNT_PORTAL_ORIGIN ?? "https://account.newsfork.com").replace(/\/$/, ""),
    extraReturnHosts,
  };
}

/** Always-allowed newsfork portal hosts. */
const CORE_RETURN_HOSTS = new Set([
  "account.newsfork.com",
  "api.newsfork.com",
  "www.newsfork.com",
]);

/** Hub brand apex hosts (push auth callback). Subdomains of these are also allowed. */
const BRAND_RETURN_APEX = ["koryy.com", "tokyy.com"] as const;

function isBrandReturnHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return BRAND_RETURN_APEX.some((apex) => host === apex || host.endsWith(`.${apex}`));
}

function isAllowedReturnHost(hostname: string, extra: string[]): boolean {
  const host = hostname.toLowerCase();
  if (CORE_RETURN_HOSTS.has(host)) return true;
  if (extra.includes(host)) return true;
  if (isBrandReturnHost(host)) return true;
  return false;
}

/**
 * Brand apex callbacks must land on `/auth/callback` (push visitor link).
 * Account / apibay hosts may use any https path.
 */
function isAllowedReturnPath(url: URL): boolean {
  if (isBrandReturnHost(url.hostname)) {
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return path === "/auth/callback";
  }
  return true;
}

export function sanitizeReturnUrl(
  raw: string | null,
  accountOrigin: string,
  extraHosts: string[] = [],
): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (!isAllowedReturnHost(url.hostname, extraHosts)) return null;
    if (!isAllowedReturnPath(url)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Sanitize brand `next` target for hub-callback relay. */
export function sanitizeHubNextUrl(raw: string | null, extraHosts: string[] = []): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (!isBrandReturnHost(url.hostname) && !extraHosts.includes(url.hostname.toLowerCase())) {
      return null;
    }
    if (!isAllowedReturnPath(url)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export type AuthFlow = "login" | "signup" | "forgot";

export function resolveApibayPath(flow: AuthFlow, config: ApibayPortalConfig): string {
  switch (flow) {
    case "signup":
      return config.signupPath;
    case "forgot":
      return config.forgotPasswordPath;
    default:
      return config.loginPath;
  }
}

export function buildApibayPortalUrl(
  flow: AuthFlow,
  config: ApibayPortalConfig,
  incomingQuery: URLSearchParams,
): string {
  const path = resolveApibayPath(flow, config);
  const url = new URL(path.startsWith("/") ? path : `/${path}`, config.portalOrigin);

  const passthrough = ["plan", "email", "region", "billing", "trace_id", "from_trial"];
  for (const key of passthrough) {
    const value = incomingQuery.get(key);
    if (value) url.searchParams.set(key, value);
  }

  const returnUrl = sanitizeReturnUrl(
    incomingQuery.get("return_url"),
    config.accountOrigin,
    config.extraReturnHosts,
  );
  if (returnUrl) {
    url.searchParams.set("return_url", returnUrl);
  }

  url.searchParams.set("account_origin", config.accountOrigin);

  return url.toString();
}

export function buildApibayGoogleOauthUrl(
  flow: AuthFlow,
  config: ApibayPortalConfig,
  incomingQuery: URLSearchParams,
): string {
  const url = new URL(
    config.googleOauthPath.startsWith("/") ? config.googleOauthPath : `/${config.googleOauthPath}`,
    config.portalOrigin,
  );
  url.searchParams.set("flow", flow);

  const returnUrl = sanitizeReturnUrl(
    incomingQuery.get("return_url"),
    config.accountOrigin,
    config.extraReturnHosts,
  );
  if (returnUrl) {
    url.searchParams.set("return_url", returnUrl);
  } else {
    url.searchParams.set("return_url", config.portalOrigin);
  }

  url.searchParams.set("account_origin", config.accountOrigin);

  const plan = incomingQuery.get("plan");
  if (plan) url.searchParams.set("plan", plan);

  return url.toString();
}
