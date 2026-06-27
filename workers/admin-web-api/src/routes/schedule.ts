import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../types/env.js";

const schedule = new Hono<{ Bindings: Env }>();

schedule.get("/", async (c) => {
  const rows = await c.env.WEB_ADMIN_DB.prepare(
    `SELECT schedule_id, site_id, cron_expression, environment, enabled, created_at, updated_at
     FROM deploy_schedules ORDER BY updated_at DESC`,
  ).all();
  return c.json({ items: rows.results ?? [] });
});

schedule.post("/", zValidator("json", z.object({
  siteId: z.string(),
  cronExpression: z.string(),
  environment: z.enum(["staging", "production"]).default("staging"),
})), async (c) => {
  const body = c.req.valid("json");
  const timestamp = new Date().toISOString();
  const scheduleId = crypto.randomUUID();

  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO deploy_schedules (schedule_id, site_id, cron_expression, environment, enabled, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?)`,
  )
    .bind(scheduleId, body.siteId, body.cronExpression, body.environment, timestamp, timestamp)
    .run();

  return c.json({ ok: true, scheduleId });
});

schedule.post("/:scheduleId/promote", async (c) => {
  const scheduleId = c.req.param("scheduleId");
  const row = await c.env.WEB_ADMIN_DB.prepare(
    `SELECT site_id, environment FROM deploy_schedules WHERE schedule_id = ?`,
  )
    .bind(scheduleId)
    .first<{ site_id: string; environment: string }>();

  if (!row) return c.json({ error: "Schedule not found" }, 404);
  if (row.environment !== "staging") {
    return c.json({ error: "Only staging schedules can be promoted" }, 400);
  }

  const timestamp = new Date().toISOString();
  await c.env.WEB_ADMIN_DB.prepare(
    `UPDATE deploy_schedules SET environment = 'production', updated_at = ? WHERE schedule_id = ?`,
  )
    .bind(timestamp, scheduleId)
    .run();

  return c.json({ ok: true, scheduleId, promotedTo: "production" });
});

export { schedule };
