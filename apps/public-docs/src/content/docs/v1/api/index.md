---
title: API overview
description: Base URLs, authentication, and main API areas for the Newsfork Seeds platform.
sidebar:
  order: 0
---

**Who should read this** — Use this page for **base paths** and **authentication** before calling any REST API. Start from [Getting Started](/getting-started/) or [API Quickstart](/api-quickstart/) if you are new.

## Overview

Newsfork exposes a hosted REST API for health checks, research discovery, seed contracts, dataset management, and queue-based batch processing.

## Base URLs

Your account onboarding provides the base URL for your environment. Do not hard-code production URLs in client-side code without your security team's approval.

## Authentication

Most API calls require a valid **API key**. Send credentials in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
```

See [API Quickstart](/api-quickstart/) for examples.

## Main API areas

| Area | Purpose | Documentation |
| --- | --- | --- |
| **Health, Research & Seeds** | Core engine interfaces | [Seeds API](/v1/api/seeds-api/) |
| **Data management** | Datasets and metadata | [Data Management API](/v1/api/data-management-api/) |
| **Infrastructure** | Queue batch processing | [Infrastructure API](/v1/api/infrastructure-api/) |
| **Reference** | Categories and output schema | [Category Reference](/v1/api/category-reference/), [Output JSON Scheme](/v1/api/output-json-scheme/) |

## Next steps

- [API Quickstart](/api-quickstart/) — First request
- [Seeds, Research & Health API](/v1/api/seeds-api/) — Core endpoints
- [Guides](/v1/guides/) — Integration concepts
