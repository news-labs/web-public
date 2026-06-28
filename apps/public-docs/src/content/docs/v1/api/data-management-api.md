---
title: Data Management API
description: Datasets and Metadata API — data processing interface.
sidebar:
  order: 2
translatedFromHash: afbbb190aeabc702081ce9bb3297c8db692686e2551cf83b83032b77a74fcad5
---

**Who should read this** — Operators and integrators working with R2 raw datasets and metadata snapshots. See [API overview](/v1/api/) for authentication.

## Overview

R2 Raw Dataset and Metadata Snapshot/Synchronization API for pipeline data management and GitHub SSOT sync.

## Datasets API

**Base path:** `/api/v1/datasets`

- **GET /api/v1/datasets** — List datasets (`country`, `category` query).
- **GET /api/v1/datasets/stats** — Dataset statistics.
- **GET /api/v1/datasets/:country/:category/:date** — List chunks for a specific date partition.
- **GET /api/v1/datasets/:country/:category/:date/:chunk** — Retrieve a specific chunk.
- **POST /api/v1/datasets** — Save a dataset (`EnhancedResearchDataset`).
- **DELETE /api/v1/datasets/:country/:category/:date/:chunk** — Delete chunk.

## Metadata API

**Base path:** `/api/v1/metadata`

- **GET /api/v1/metadata/snapshot** — Full snapshot metadata (for GitHub Actions synchronization).
- **POST /api/v1/metadata/sync** — Synchronize snapshot to GitHub.
- **GET /api/v1/metadata/by-country/:country** — Metadata by country.
- **GET /api/v1/metadata/tasks** — List/status of metadata tasks.

## Authentication

Send API credentials in the `Authorization` header. See [API overview](/v1/api/#authentication).

## Next steps

- [Infrastructure API](/v1/api/infrastructure-api/) — Queue batch processing.
- [R2 operations standard](/v1/guides/r2-operations-standard/) — Storage conventions.

## Notes

- Implementation: `src/routes/datasets.ts`, `src/routes/metadata.ts`
