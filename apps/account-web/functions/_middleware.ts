import { gateDashboardRequest } from "./lib/dashboard-gate";

/**
 * Runs ahead of static assets and Pages Functions.
 * Unauthenticated `/` and `/dashboard/*` redirect to `/login/` (session cookie gate).
 */
export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> {
  const gated = gateDashboardRequest(context.request);
  if (gated) return gated;
  return context.next();
}
