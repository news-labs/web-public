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
}

export function getApibayPortalConfig(env?: Record<string, string | undefined>): ApibayPortalConfig {
  const portalOrigin = (env?.APIBAY_PORTAL_ORIGIN ?? DEFAULT_ORIGIN).replace(/\/$/, "");
  return {
    portalOrigin,
    signupPath: env?.APIBAY_SIGNUP_PATH ?? "/signup",
    loginPath: env?.APIBAY_LOGIN_PATH ?? "/login",
    forgotPasswordPath: env?.APIBAY_FORGOT_PASSWORD_PATH ?? "/forgot-password",
    googleOauthPath: env?.APIBAY_GOOGLE_OAUTH_PATH ?? "/oauth/google",
    logoutPath: env?.APIBAY_LOGOUT_PATH ?? "/logout",
    accountOrigin: (env?.ACCOUNT_PORTAL_ORIGIN ?? "https://account.newsfork.com").replace(/\/$/, ""),
  };
}

const ALLOWED_RETURN_HOSTS = new Set([
  "account.newsfork.com",
  "api.newsfork.com",
  "www.newsfork.com",
]);

export function sanitizeReturnUrl(raw: string | null, accountOrigin: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_RETURN_HOSTS.has(url.hostname)) return null;
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

  const returnUrl = sanitizeReturnUrl(incomingQuery.get("return_url"), config.accountOrigin);
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

  const returnUrl = sanitizeReturnUrl(incomingQuery.get("return_url"), config.accountOrigin);
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
