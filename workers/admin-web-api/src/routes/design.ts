import { Hono } from "hono";
import type { Env } from "../types/env.js";

const design = new Hono<{ Bindings: Env }>();

design.get("/tokens", (c) =>
  c.json({
    tokens: {
      accent: "#0ea5e9",
      accentDark: "#0284c7",
      font: "Inter, system-ui, sans-serif",
      radius: "0.5rem",
    },
    preview: "vouus-style neutral + sky accent",
  }),
);

export { design };
