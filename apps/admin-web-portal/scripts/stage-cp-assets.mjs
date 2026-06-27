#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const cpDir = join(dist, "cp");

mkdirSync(cpDir, { recursive: true });
cpSync(join(dist, "index.html"), join(cpDir, "index.html"));

const assetsDir = join(dist, "assets");
if (existsSync(assetsDir)) {
  cpSync(assetsDir, join(cpDir, "assets"), { recursive: true });
}

console.log("✅ Staged admin SPA under dist/cp/");
