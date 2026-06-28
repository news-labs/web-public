import type { Env } from "../types/env.js";

export function oauthPublicOrigin(env: Env, requestUrl: string): string {
  return env.ADMIN_GATEWAY_URL?.replace(/\/$/, "") ?? new URL(requestUrl).origin;
}

export function gatewaySpaPath(env: Env, segment: "ops/web" | "ops/editor"): string {
  const base = env.ADMIN_GATEWAY_URL?.replace(/\/$/, "");
  if (base) return `${base}/${segment}/`;
  return `/${segment}/`;
}
