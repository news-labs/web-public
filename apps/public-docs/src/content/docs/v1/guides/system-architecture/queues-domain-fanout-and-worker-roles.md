---
title: Queues Domain Distribution and Worker Roles
description: Seed/Domain Queue pipeline, 1 file → N domains distributed, Producer/Consumer
  role separation. firm design.
sidebar:
  order: 13
translatedFromHash: 10da9c9249c6ba6fc653068cc458bf5c1341fa9cb6e4cb8994cf76e155cfb871
---

# Queues Domain Distribution and Input/Output Worker Roles

**Document Version**: 1.0  
**Purpose**: Finalized design document outlining how domains extracted by the Seed Queue Consumer are processed at the Edge, detailing the **"1 Domain = 1 Worker"** distribution structure and the distinction between Input (Producer) and Output (Consumer) Workers.

---

## 1. Overview

- **1 file** → 1 SEED_QUEUE message → **1 Seed Consumer execution**.
- The Seed Consumer **extracts N domains (e.g., 200)** from that file and **sends N messages (200) to the DOMAIN_QUEUE**.
- **1 Domain** → 1 DOMAIN_QUEUE message → **1 Domain Consumer execution**.

Therefore, **"200 domains" are already split into 200 Queue messages, and each message is processed by a separate Domain Consumer Worker**.  
That is, the structure is designed and implemented as **"200 domains per file → 200 Workers each process 1 domain"**.

---

## 2. Current Pipeline Summary

### 2.1 Step-by-Step Flow

| Step | Trigger | Queue | Role | Message Unit |
|------|--------|-----|------|-------------|
| 1. Orchestration | HTTP `POST /seeds/orchestrate` | SEED_QUEUE (Producer) | R2 raw file list lookup → **1 message per file** transmission | **1 file** |
| 2. File Processing | SEED_QUEUE (Consumer) | DOMAIN_QUEUE (Producer) | Read·parse·extract domain from 1 raw file → Send **1 message per domain** | **1 file → N domains** |
| 3. Domain Processing | DOMAIN_QUEUE (Consumer) | — | Collect robots.txt·sitemap per domain·Save to R2 | **1 domain** |

---

## 3. What the Seed Queue Consumer Actually Does

### 3.1 It is NOT "processing 200 domains per Worker"

What the Seed Consumer does (1 file = 1 Worker run):

1. **Read 1 raw file from R2** (1 get)
2. **Parse JSON and validate schema** (in-memory processing)
3. **Extract domain list** (loop, in-memory)
4. **Call `DOMAIN_QUEUE.send(...)` per domain** (N times, e.g., 200 times)
5. **Record success at `{file_path}.success`** (put 1 time)

**No external HTTP requests (robots.txt, sitemap, etc.) per domain.**  
Such tasks are performed only by the **Domain Queue Consumer**.

### 3.2 Heavy Load Side

- **Seed Consumer**: 1 R2 read + JSON parsing + domain extraction + **N queue.send calls** (e.g., 200 times).
- **Domain Consumer**: **2 HTTP requests per domain (robots, sitemap)** + R2 write. **Already distributed as 1 domain = 1 Worker**.

---

## 4. Input / Output Worker Distinction

### 4.1 Cloudflare Queues Terminology

- **Producer (Input Side)**: The side that **sends** messages to the queue.
- **Consumer (Output Side)**: The side that **receives and processes** messages from the queue. The same Worker script can be both a Producer and Consumer for multiple queues.

### 4.2 Classification in the Current Project

| Classification | Queue | Input (Producer) | Output (Consumer) |
|------|-----|------------------|-------------------|
| **File-level task** | SEED_QUEUE | **Orchestrator** (HTTP `POST /seeds/orchestrate`) | **Seed Consumer** |
| **Domain-level task** | DOMAIN_QUEUE | **Seed Consumer** (`DOMAIN_QUEUE.send`ed N times during file processing) | **Domain Consumer** |

- **wrangler configuration**: `max_batch_size: 1` → One Consumer per file/per domain.

---

## 5. Summary and Conclusion

| Question | Conclusion |
|------|------|
| Does the Seed Consumer **process all 200 domains in a single Worker**? | **No.** The 200 domains become 200 messages in the DOMAIN_QUEUE, and **the Domain Consumer processes one domain at a time**. |
| Are the 200 domains **distributed across multiple Workers**? | **Yes.** They are already distributed as "one domain per Worker" via DOMAIN_QUEUE + `max_batch_size: 1` + Consumer concurrency. |
| Are **Input / Output Workers** distinguished? | **Yes.** SEED_QUEUE·DOMAIN_QUEUE each have distinct roles: Producer (Input) and Consumer (Output). |

- **Seed Consumer**: For each file, R2 read + parsing + domain extraction + **N calls to DOMAIN_QUEUE.send** (not 200 HTTP requests).
- **Domain Consumer**: For each domain: HTTP (robots/sitemap) + R2 storage → **Already distributed across N Workers**.
