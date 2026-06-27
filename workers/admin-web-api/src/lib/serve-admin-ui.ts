import type { Context } from "hono";
import type { Env } from "../types/env.js";

export const ADMIN_UI_PATH = "/cp";

function assetPathFromRequest(pathname: string): string {
  let path = pathname;
  if (path === ADMIN_UI_PATH) return "/index.html";
  if (path.startsWith(`${ADMIN_UI_PATH}/`)) {
    path = path.slice(ADMIN_UI_PATH.length) || "/";
  }
  const isSpaRoute = path === "/" || (!path.includes(".") && !path.endsWith(".html"));
  return isSpaRoute ? "/index.html" : path;
}

function serveAdminAsset(c: Context<{ Bindings: Env }>) {
  const url = new URL(c.req.url);
  url.pathname = assetPathFromRequest(url.pathname);
  return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
}

export function mountAdminUiRoutes(app: { get: (path: string, handler: (c: Context<{ Bindings: Env }>) => Response | Promise<Response>) => void }) {
  app.get(ADMIN_UI_PATH, (c) => c.redirect(`${ADMIN_UI_PATH}/`, 302));
  app.get(`${ADMIN_UI_PATH}/`, serveAdminAsset);
  app.get(`${ADMIN_UI_PATH}/*`, serveAdminAsset);

  app.get("/", (c) => c.text("Not Found", 404));
}
