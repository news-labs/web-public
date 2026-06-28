import { Hono } from "hono";
import type { Env } from "../types/env.js";
import { proxyAuthVerifyToCp } from "../lib/cp-auth-verify-proxy.js";

const auth = new Hono<{ Bindings: Env }>();

auth.get("/verify", (c) => proxyAuthVerifyToCp(c, "web"));

export { auth };
