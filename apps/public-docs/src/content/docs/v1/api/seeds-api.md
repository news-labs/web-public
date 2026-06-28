---
title: Seeds, Research & Health API
description: Engine core interfaces — Health, Research, and Seeds integration.
sidebar:
  order: 1
translatedFromHash: c4b955de6253a183432152b1778096eeb7443798911d0a155054dfe3041cf25a
---

**Who should read this** — Integrators calling the Newsfork engine core. Start from [API overview](/v1/api/) for base URLs and authentication.

## Overview

Engine core interfaces cover health checks, research (URL discovery), and seeds (contracts and orchestration). Health verifies system status; Research defines where to look; Seeds define how to retrieve content.

## Health API

System status verification endpoints.

**Base path:** `/health`

- **GET /health** — Basic health check. Returns `status`, `timestamp`, `version`.
- **GET /health/ready** — Readiness. Whether ready to receive traffic.
- **GET /health/live** — Liveness. Process survival status.

The root **GET /** returns a list of API names, versions, and endpoints in JSON format.

## Research API

The Research Engine handles **"where to look"**.

**Base path:** `/api/v1/research`

- **GET /api/v1/research** — Research list (`country`, `category`, `date`, `limit`, `offset` query).
- **GET /api/v1/research/index** — Research index (table of contents).
- **GET /api/v1/research/:country/:category/:date** — Specific Research details.
- **POST /api/v1/research** — Create new Research (`ResearchCreateRequest`).

## Seeds API

The Seed Engine defines **"how to retrieve"**.

**Base path:** `/api/v1/seeds`

- **GET /api/v1/seeds** — Seed list (`country`, `status`, `source_type`, `limit`, `offset` query).
- **GET /api/v1/seeds/:seedId** — Retrieve a specific Seed.
- **POST /api/v1/seeds** — Create a new Seed (draft).
- **PATCH /api/v1/seeds/:seedId** — Modify Seed.
- **POST /api/v1/seeds/promote** — Promote Draft → active.
- **POST /api/v1/seeds/orchestrate** — Trigger Seed orchestration (R2 raw list → SEED_QUEUE). Request body: `country`, `category`, `date`, `force` (optional).

## Authentication

Send API credentials in the `Authorization` header. See [API overview](/v1/api/#authentication) and [API Quickstart](/api-quickstart/).

## Next steps

- [Data Management API](/v1/api/data-management-api/) — Datasets and metadata.
- [Infrastructure API](/v1/api/infrastructure-api/) — Queue batch jobs.
- [Research guide](/v1/guides/research/) — URL discovery workflow.

## Notes

- Implementation: `src/routes/health.ts`, `src/routes/research.ts`, `src/routes/seeds.ts`, `src/routes/seed-orchestrator.ts`
