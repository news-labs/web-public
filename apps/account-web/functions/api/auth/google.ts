import {
  buildApibayGoogleOauthUrl,
  getApibayPortalConfig,
  type AuthFlow,
} from "../../lib/apibay-portal";
import { redirectWithSecurityHeaders } from "../../lib/security-headers";

interface Env {
  APIBAY_PORTAL_ORIGIN?: string;
  APIBAY_GOOGLE_OAUTH_PATH?: string;
  ACCOUNT_PORTAL_ORIGIN?: string;
}

function parseFlow(raw: string | null): AuthFlow {
  if (raw === "signup") return "signup";
  return "login";
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const config = getApibayPortalConfig(context.env as Record<string, string | undefined>);
  const url = new URL(context.request.url);
  const flow = parseFlow(url.searchParams.get("flow"));
  const target = buildApibayGoogleOauthUrl(flow, config, url.searchParams);
  return redirectWithSecurityHeaders(target);
}
