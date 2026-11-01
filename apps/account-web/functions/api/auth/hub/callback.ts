/**
 * Relay post-login identity to a brand `/auth/callback`.
 *
 * Flow:
 * 1. Brand sign-in sets return_url to this endpoint with `next=<brand>/auth/callback`
 * 2. apibay redirects here (account host is already allowlisted) with optional `user_id`
 * 3. We 302 to `next` copying `user_id` / `uid` / `userId`
 */
import { getApibayPortalConfig, sanitizeHubNextUrl } from "../../../lib/apibay-portal";
import { redirectWithSecurityHeaders } from "../../../lib/security-headers";

interface Env {
  APIBAY_PORTAL_ORIGIN?: string;
  ACCOUNT_PORTAL_ORIGIN?: string;
  ACCOUNT_RETURN_URL_HOSTS?: string;
}

function pickUserId(params: URLSearchParams): string | null {
  const id =
    params.get("user_id")?.trim() ||
    params.get("uid")?.trim() ||
    params.get("userId")?.trim() ||
    "";
  return id || null;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const config = getApibayPortalConfig(context.env as Record<string, string | undefined>);
  const url = new URL(context.request.url);
  const nextRaw = url.searchParams.get("next");
  const next = sanitizeHubNextUrl(nextRaw, config.extraReturnHosts);
  if (!next) {
    return new Response("Invalid next URL", { status: 400 });
  }

  const target = new URL(next);
  const userId = pickUserId(url.searchParams);
  if (userId) {
    target.searchParams.set("user_id", userId);
  }

  return redirectWithSecurityHeaders(target.toString());
}
