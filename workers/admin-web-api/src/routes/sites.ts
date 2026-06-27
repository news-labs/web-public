import { Hono } from "hono";
import { SITES } from "../types/env.js";
import type { Env } from "../types/env.js";

const sites = new Hono<{ Bindings: Env }>();

sites.get("/", (c) => c.json({ sites: SITES }));

sites.get("/:siteId", (c) => {
  const site = SITES.find((s) => s.id === c.req.param("siteId"));
  if (!site) return c.json({ error: "Site not found" }, 404);
  return c.json(site);
});

export { sites };
