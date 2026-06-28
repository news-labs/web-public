---
title: API overview
description: Base URLs, authentication, and main API areas for the Newsfork Seeds platform.
sidebar:
  order: 0
---

**Who should read this** — Use this page for **base paths** and **authentication** before calling any REST API. Product-only users can start from [Getting Started](/getting-started/) or [Guides](/v1/guides/).

## Overview

Newsfork exposes REST APIs for health checks, research discovery, seed contracts, dataset management, and queue-based batch processing. All APIs run on Cloudflare Workers with R2, D1, KV, and Queues bindings.

## Base URLs

Your deployment provides base URLs for:

- **Health** — Process and readiness checks (`/health`).
- **Research & Seeds** — URL discovery and seed contracts (`/api/v1/research`, `/api/v1/seeds`).
- **Data management** — R2 datasets and metadata sync (`/api/v1/datasets`, `/api/v1/metadata`).
- **Infrastructure** — Queue batch jobs (`/api/v1/queues`).

Do not hard-code production URLs in client-side code without your security team's approval.

## Authentication

Most API calls require a valid **API key** or session token. Send credentials in the `Authorization` header (or as your integration guide specifies). See [Manual Setup](/manual-setup/) for local credentials.

## Main API areas

| Area | Purpose | Documentation |
| --- | --- | --- |
| **Health, Research & Seeds** | Core engine interfaces | [Seeds API](/v1/api/seeds-api/) |
| **Data management** | Datasets and metadata | [Data Management API](/v1/api/data-management-api/) |
| **Infrastructure** | Queue batch processing | [Infrastructure API](/v1/api/infrastructure-api/) |
| **Reference** | Categories and output schema | [Category Reference](/v1/api/category-reference/), [Output JSON Scheme](/v1/api/output-json-scheme/) |

## Next steps

- [Getting Started](/getting-started/) — Roles and integration order.
- [Seeds, Research & Health API](/v1/api/seeds-api/) — Core endpoints.
- [Guides](/v1/guides/) — Architecture and operations.
