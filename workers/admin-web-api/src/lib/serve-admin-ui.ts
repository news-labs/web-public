import type { Context } from "hono";
import type { Env } from "../types/env.js";

export const ADMIN_UI_PATH = "/cp";

export function mountAdminUiRoutes(app: {
  get: (path: string, handler: (c: Context<{ Bindings: Env }>) => Response | Promise<Response>) => void;
}) {
  app.get("/", (c) => c.text("Not Found", 404));
  app.get(ADMIN_UI_PATH, (c) => c.redirect(`${ADMIN_UI_PATH}/`, 302));
  app.get(`${ADMIN_UI_PATH}/`, (c) => c.env.ASSETS.fetch(c.req.raw));
  app.get(`${ADMIN_UI_PATH}/*`, (c) => c.env.ASSETS.fetch(c.req.raw));
}
