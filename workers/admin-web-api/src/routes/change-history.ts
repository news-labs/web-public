/**
 * Unified change history — local events + CP audit log proxy.
 */

import { Hono } from "hono";
import type { Env } from "../types/env.js";
import { proxyToCp } from "../lib/cp-proxy.js";

const changeHistory = new Hono<{ Bindings: Env }>();

changeHistory.get("/", async (c) => {
  const brandId = c.req.query("brandId");
  const regionCode = c.req.query("regionCode");
  const eventType = c.req.query("eventType");
  const limit = Math.min(Number(c.req.query("limit") ?? "50"), 100);

  let sql = "SELECT * FROM change_history WHERE 1=1";
  const binds: unknown[] = [];
  if (brandId) {
    sql += " AND brand_id = ?";
    binds.push(brandId);
  }
  if (regionCode) {
    sql += " AND region_code = ?";
    binds.push(regionCode);
  }
  if (eventType) {
    sql += " AND event_type = ?";
    binds.push(eventType);
  }
  sql += " ORDER BY created_at DESC LIMIT ?";
  binds.push(limit);

  const { results: localEvents } = await c.env.WEB_ADMIN_DB.prepare(sql).bind(...binds).all();

  let auditEvents: unknown[] = [];
  try {
    const res = await proxyToCp(c.env, new Request("http://local/api/v1/audit?limit=20"), "/api/v1/audit?limit=20");
    if (res.ok) {
      const data = (await res.json()) as { items?: unknown[]; logs?: unknown[] };
      auditEvents = data.items ?? data.logs ?? [];
    }
  } catch {
    /* optional */
  }

  return c.json({
    items: localEvents ?? [],
    audit: auditEvents,
  });
});

export { changeHistory };
