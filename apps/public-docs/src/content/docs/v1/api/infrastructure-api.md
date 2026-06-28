---
title: Infrastructure API (Queues)
description: Queues API — asynchronous batch processing interface.
sidebar:
  order: 3
translatedFromHash: e198a6d4f825d56be74ec59107638f14baba45fefb5e35a2a9a3ac8fa8dc5c1e
---

**Who should read this** — Integrators triggering batch jobs and metadata sync via Cloudflare Queues. See [API overview](/v1/api/) for authentication.

## Overview

API for creating batch jobs and triggering metadata synchronization using Cloudflare Queues.

**Base path:** `/api/v1/queues`

## Endpoints

### POST /api/v1/queues/research

Research discovery (URL processing) batch creation.

**Request body:** `country`, `category`, `urls` (1–10000), `chunkSize` (optional, default 100).

### POST /api/v1/queues/liveness

Liveness (domain survival) check batch creation.

**Request body:** `country`, `domains` (1–10000), `chunkSize` (optional, default 50).

### POST /api/v1/queues/contract

Contract (Seed contract) creation batch.

**Request body:** `country`, `category`, `domainIds` (1–1000), `chunkSize` (optional, default 20).

### GET /api/v1/queues/batch/:batchId

Retrieve status (or result) of a specific batch ID.

### POST /api/v1/queues/trigger/metadata-sync

Metadata synchronization trigger.

## Authentication

Send API credentials in the `Authorization` header. See [API overview](/v1/api/#authentication).

## Next steps

- [Seeds, Research & Health API](/v1/api/seeds-api/) — Core engine endpoints.
- [Queues domain fanout guide](/v1/guides/system-architecture/queues-domain-fanout-and-worker-roles/) — Worker roles.

## Notes

- Implementation: `src/routes/queues.ts`. Queue bindings: RESEARCH_QUEUE, LIVENESS_QUEUE, CONTRACT_QUEUE, etc. (`wrangler.jsonc`).
