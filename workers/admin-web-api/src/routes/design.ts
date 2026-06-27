import { Hono } from "hono";
import type { Env } from "../types/env.js";

const design = new Hono<{ Bindings: Env }>();

const DEFAULT_TOKENS = {
  accent: "#0ea5e9",
  accentDark: "#0284c7",
  font: "Inter, system-ui, sans-serif",
  radius: "0.5rem",
  background: "#ffffff",
  foreground: "#0f172a",
};

design.get("/tokens", async (c) => {
  const scopeType = c.req.query("scopeType") ?? "brand";
  const scopeId = c.req.query("scopeId") ?? "default";
  const row = await c.env.WEB_ADMIN_DB.prepare(
    "SELECT tokens_json FROM design_tokens WHERE scope_type = ? AND scope_id = ?",
  )
    .bind(scopeType, scopeId)
    .first<{ tokens_json: string }>();

  const tokens = row?.tokens_json
    ? (JSON.parse(row.tokens_json) as Record<string, string>)
    : DEFAULT_TOKENS;

  return c.json({ tokens, preview: `${scopeType}/${scopeId}`, scope_type: scopeType, scope_id: scopeId });
});

design.put("/tokens", async (c) => {
  const body = (await c.req.json()) as {
    scope_type?: string;
    scope_id?: string;
    tokens: Record<string, string>;
  };
  const scopeType = body.scope_type ?? "brand";
  const scopeId = body.scope_id ?? "default";
  const tokenSetId = `${scopeType}_${scopeId}`;
  const ts = new Date().toISOString();

  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO design_tokens (token_set_id, scope_type, scope_id, tokens_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(scope_type, scope_id) DO UPDATE SET tokens_json = excluded.tokens_json, updated_at = excluded.updated_at`,
  )
    .bind(tokenSetId, scopeType, scopeId, JSON.stringify(body.tokens), ts, ts)
    .run();

  return c.json({ ok: true });
});

export { design };
