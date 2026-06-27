---
title: Infrastructure API (Queues)
description: Queues API - Asynchronous Batch Processing Interface
sidebar:
  order: 3
translatedFromHash: e198a6d4f825d56be74ec59107638f14baba45fefb5e35a2a9a3ac8fa8dc5c1e
---

API for creating batch jobs and triggering metadata synchronization using Cloudflare Queues. 

 *Base path:* `/api/v1/queues` 

 --- 

 ## POST /api/v1/queues/research 

 Research discovery (URL processing) batch creation. **Request body:** `country` , `category` , `urls` (1~10000), `chunkSize` (optional, default 100).

---

## POST /api/v1/queues/liveness

Liveness (domain survival) check batch creation. **Request body:** `country` , `domains` (1~10000), `chunkSize` (optional, default 50).

---

## POST /api/v1/queues/contract

Contract(Seed contract) creation batch. **Request body:** `country` , `category` , `domainIds` (1~1000), `chunkSize` (optional, default 20).

---

## GET /api/v1/queues/batch/:batchId

Retrieve status (or result) of a specific batch ID.

---

## POST /api/v1/queues/trigger/metadata-sync 

Metadata synchronization trigger. 

---

## Notes 

- Implementation: `src/routes/queues.ts`. Queue bindings: RESEARCH_QUEUE, LIVENESS_QUEUE, CONTRACT_QUEUE, etc. (`wrangler.jsonc`). 
