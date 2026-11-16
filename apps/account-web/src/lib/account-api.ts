/** Browser client for the same-origin `/api/account/*` BFF (HttpOnly session cookie). */

export class AccountApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly retryAfter?: number,
  ) {
    super(code);
  }
}

async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/account/${path}`, {
    method: init.method ?? "GET",
    credentials: "same-origin",
    headers: init.body !== undefined ? { "content-type": "application/json" } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; retryAfter?: number };
  if (!res.ok) throw new AccountApiError(res.status, data.error ?? "request_failed", data.retryAfter);
  return data as T;
}

export interface Plan {
  id: "free" | "pro" | "enterprise";
  name: string;
  monthlyPriceUsd: number | null;
  monthlyUnits: number | null;
  rateLimitPerMinute: number | null;
  maxActiveKeys: number;
  features: Array<"core" | "semantic" | "mcp">;
}

export interface Overview {
  consumer: { id: string; email: string; name: string | null; company: string | null; plan: Plan["id"]; createdAt: string };
  plan: Plan;
  usage: {
    month: { used: number; limit: number | null; remaining: number | null; resetAt: string | null };
    rateLimitPerMinute: number | null;
  };
  keys: { active: number; max: number };
}

export interface ApiKeySummary {
  id: string;
  keyPrefix: string;
  label: string | null;
  status: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export interface DailyUsage {
  day: string;
  units: number;
  requests: number;
  rejected: number;
}

export const accountApi = {
  requestCode: (email: string) =>
    request<{ ok: true; expiresIn: number; debugCode?: string }>("otp", { method: "POST", body: { email } }),
  verify: (input: { email: string; code: string; name?: string; company?: string; returnUrl?: string }) =>
    request<{ created: boolean; next?: string | null }>("verify", { method: "POST", body: input }),
  logout: () => request<{ ok: true }>("logout", { method: "POST", body: {} }),
  me: () => request<Overview>("me"),
  usage: (days = 30) => request<{ days: DailyUsage[] }>(`usage?days=${days}`),
  keys: () => request<{ keys: ApiKeySummary[] }>("keys"),
  createKey: (label: string) =>
    request<{ key: ApiKeySummary; apiKey: string }>("keys", { method: "POST", body: { label } }),
  revokeKey: (id: string) => request<{ status: string }>(`keys/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "Enter a valid email address.",
  otp_cooldown: "A code was just sent. Please wait a minute before requesting another.",
  otp_rate_limited: "Too many codes requested. Try again in an hour.",
  otp_invalid: "That code is not correct. Check the latest email and try again.",
  otp_expired: "That code has expired. Request a new one.",
  otp_too_many_attempts: "Too many attempts. Request a new code.",
  invalid_code_format: "Enter the 6-digit code from the email.",
  account_suspended: "This account is suspended. Contact hello@newsfork.com.",
  email_not_configured: "Email delivery is temporarily unavailable. Please try again later.",
  key_limit_reached: "You have reached the active key limit for your plan. Revoke a key first.",
  forbidden_origin: "Request blocked. Reload the page and try again.",
};

export function describeError(err: unknown): string {
  if (err instanceof AccountApiError) return ERROR_MESSAGES[err.code] ?? `Something went wrong (${err.code}).`;
  return "Network error. Please try again.";
}
