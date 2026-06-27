---
title: Cursor Rules Newsfork Overview
description: NewsFork Cursor Rules Core Summary (CONTRACT-FIRST Architecture)
sidebar:
  order: 4
translatedFromHash: 7ee9b6ff52fac3e4fd6e8ce8b79e4506c07ede1c6649079d53b9a77d0e70f2c6
---

## Overview Newsfork follows a **CONTRACT-FIRST architecture**. - **JSON + Zod** is the Single Source of Truth (SSOT). - **GitHub** is the SSOT preserving policy and scope history.
- **Runtime (Hono + Cloudflare Workers)** only _executes_ contracts; it does not interpret or supplement them.

> If runtime logic becomes complex, it is not a code problem but a **contract design flaw**.

## Core Philosophy (Non-Negotiable) 

- A Seed is **not data. It is a Contract**. 
- JSON defines **Intent**; code executes it. 
- Git history is the **record of policy and scope changes**.
- **Deterministic > Clever**
- **Explicit > Implicit**

⚠️ **If ambiguity arises, don't generate code; ask questions.**

## Official Tech Stack (DO NOT DEVIATE)

### Infrastructure (Cloudflare-native)

- Cloudflare Workers, D1, R2, KV, Queues, Logpush
- Wrangler (Local & Deploy)

### Application Stack

- TypeScript (ES2022+), Hono, Zod, Drizzle ORM

### Tooling

- GitHub (SSOT), GitHub Actions (CI/CD)

### Absolutely Forbidden

- Express / Fastify / Nest
- ORMs other than Drizzle
- Validation without Zod
- Stateful servers
- Infrastructure primitives other than Cloudflare

## Key Rules Summary

| Domain | Key Rule |
|------|----------|
| **Contract & Schema** | All external inputs validated by Zod, Schema = law, Major Version for Breaking Changes |
| **JSON** | Prohibit runtime state/timestamps, array-based·flat structure |
| **Runtime** | Stateless, Idempotent, Deterministic |
| **Database** | D1 = Store execution state only, prohibit unverified JSON storage |
| **Error Handling** | Fail Fast, Fail Loud, Fail With Context |
| **Code Generation** | Boring, Explicit, Testable, Type-safe |
| **Performance** | Linear algorithms, Append-only state |

## Final Rule

> Contracts should be boring. Runtimes should be thin. **Boring systems survive. Clever systems break.**

## Related Documents

- [Cursor Rules Standard](./cursor-rules-standard.md) — Rules upgrade guide
- `.cursor/rules/` — Actual rules file (project root)
