/**
 * Control Plane API proxy — forwards diaspora and tenant routes to nl-api-cp.
 */

import { Hono } from "hono";
import type { Env } from "../types/env.js";
import { proxyToCp } from "../lib/cp-proxy.js";

const cpProxy = new Hono<{ Bindings: Env }>();

cpProxy.all("/diaspora/*", async (c) => {
  const suffix = c.req.path.replace(/^\/api\/v1\/diaspora/, "");
  return proxyToCp(c.env, c.req.raw, `/api/v1/diaspora${suffix}`);
});

cpProxy.all("/tenants/*", async (c) => {
  const suffix = c.req.path.replace(/^\/api\/v1\/tenants/, "");
  return proxyToCp(c.env, c.req.raw, `/api/v1/tenants${suffix}`);
});

cpProxy.get("/tenants", async (c) => proxyToCp(c.env, c.req.raw, "/api/v1/tenants"));

cpProxy.get("/audit", async (c) => {
  const url = new URL(c.req.url);
  return proxyToCp(c.env, c.req.raw, `/api/v1/audit${url.search}`);
});

export { cpProxy };
