import type { Context } from "hono";
import type { Env } from "../types/env.js";

const GATEWAY_BASE = "https://nl-api-cp.newsfork.workers.dev";

function gatewayRedirect(c: Context<{ Bindings: Env }>, path: string) {
  const base = c.env.ADMIN_GATEWAY_URL?.replace(/\/$/, "") ?? GATEWAY_BASE;
  return c.redirect(`${base}${path}`, 302);
}

/** Legacy nl-portal-web-admin — redirect SPA traffic to Admin Gateway. */
export function mountLegacyGatewayRedirects(app: {
  get: (path: string, handler: (c: Context<{ Bindings: Env }>) => Response | Promise<Response>) => void;
}) {
  app.get("/health", (c) =>
    c.json({
      status: "ok",
      service: "nl-portal-web-admin",
      env: c.env.ENVIRONMENT,
      deprecated: true,
      redirect_to: c.env.ADMIN_GATEWAY_URL ?? GATEWAY_BASE,
    }),
  );

  app.get("/", (c) => gatewayRedirect(c, "/ops/web/"));
  app.get("/cp", (c) => gatewayRedirect(c, "/ops/web/"));
  app.get("/cp/", (c) => gatewayRedirect(c, "/ops/web/"));
  app.get("/cp/*", (c) => {
    const rest = new URL(c.req.url).pathname.replace(/^\/cp/, "") || "/";
    return gatewayRedirect(c, `/ops/web${rest.startsWith("/") ? rest : `/${rest}`}`);
  });
  app.get("*", (c) => gatewayRedirect(c, "/ops/web/"));
}
