---
title: R2 Operational Standards
description: R2 object list (S3 API), move-copy-delete (wrangler), raw/prod prefix
  definitions. migration and script implementation criteria.
sidebar:
  order: 10
translatedFromHash: 75128283cd363ed31b421df29b7d2847f911e47626710136ee45db1d48aecbb9
---

# R2 Operations Standard (Cloudflare R2 Operations Standard)

**Document Version**: 1.1  
**Purpose**: To define the **standard method** for listing objects in R2 buckets, moving/copying/deleting folders/files, and structuring prefixes.  
This document serves as the basis for migration and future R2-related script/Worker implementations.

---

## 1. API Usage Principles

| Purpose | API/Tool Used | Notes |
|------|------------------|------|
| **Object List Query** | **S3-compatible API** (ListObjectsV2) | Cloudflare REST API does not support listing objects within a bucket. |
| **Bulk Object Move/Copy/Delete (Same Bucket)** | **S3 CopyObject + DeleteObjects** (`@aws-sdk/client-s3`) | Server-side copy (does not pass through the body) + batch deletion. Use for migration or bulk moves. |___EN___| **Single Object Get/Put/Delete (Manual/Local)** | **wrangler r2 object** (CLI, `--remote`) | Used for downloading, uploading, or deleting a single object locally or via CI. |___EN___| **R2 Access within Worker** | R2 Binding (`env.R2_BUCKET.get/put/delete/list`) | Runtime is based on Binding. List is paginated in 1000-item units. |___EN______EN___- Scripts requiring **object lists** (e.g., skip-existing uploads, migrations) must query lists using the **S3-compatible API**.  
- For **bulk moves within the same bucket**, use **S3 CopyObject** (server-side copy) + **DeleteObjects** (batch deletion). Do not use repeated wrangler get/put/delete operations.  
- The Cloudflare account API token (`CLOUDFLARE_API_TOKEN`) alone cannot retrieve the **object list within a bucket**; use the **R2 API token** (Access Key ID + Secret Access Key).

---

## 2. Retrieve Object List (S3 Compatible API)

### 2.1 Prerequisites

- **Endpoint**: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` 
- **Authentication**: R2 API token (Access Key ID, Secret Access Key)
- **API**: AWS SDK `@aws-sdk/client-s3`'s ``ListObjectsV2`` (or equivalent S3-compatible client)
- **Pagination**: `MaxKeys: 1000` , `ContinuationToken` / `NextContinuationToken` to collect the full list

### 2.2 Environment Variables

| Variable | Required | Description |
|------|------|------|
| `R2_ACCESS_KEY_ID` | ✅ | Access Key ID of the R2 API token |
| `R2_SECRET_ACCESS_KEY` | ✅ | Secret Access Key of R2 API token |
| `R2_ACCOUNT_ID` or `CLOUDFLARE_ACCOUNT_ID` | Optional | For endpoint configuration. Uses project default if absent |
| `R2_BUCKET_NAME` | Optional | Target bucket name. Default example: `newsfork-datasets` |

### 2.3 Reference Implementation

- **List Objects**: `dev/upload-to-r2/scanner.ts` `loadR2FileList(bucketName)`
  - S3Client + ListObjectsV2, returns results as ``Set<string>`` (for O(1) lookup)

---

## 3. Object Move·Copy·Delete

### 3.1 Bulk Move·Copy·Delete (Same Bucket) — S3 API

When moving (copy then delete) or copying objects in bulk **within the same bucket** from local/CI:

- Use **S3-compatible API**: **CopyObject** (server-side copy) + **DeleteObjects** (batch deletion).
- **CopyObject**: `CopySource: bucket/키` , `Key: 새키` Copies only within R2. Object body does not pass through the client.
- **Parallel copying**: Execute N instances of CopyObject simultaneously (e.g., 20~50). Implementation example: `COPY_CONCURRENCY = 30`.
- **Batch Deletion**: DeleteObjects supports up to 1,000 keys/request. Only keys successfully copied are used for deletion.
- **CopySource Format**: `CopySource: ${bucket}/${encodeURIComponent(key)}` handles special character keys.

| Item | Recommended Value | Notes |
|------|---------|------|
| Copy concurrency | 30 | Consider R2 rate limit. Review retries/concurrency reduction upon 429 errors. |
| Delete batch size | 1,000 | S3 DeleteObjects upper limit. |

- **dry-run**: Outputs target keys only without copying/deleting. **Highly recommended to run dry-run before actual migration**.
- **--no-delete**: Performs CopyObject only, preserving originals.

### 3.2 Single get/put/delete (manual·local) — wrangler CLI

When **downloading·uploading·deleting** a single object (manual operation, small volume):

- Use the **wrangler r2 object** command, **`--remote`** Required.
- Object path format: `{bucket_name}/{key}` (e.g., `newsfork-datasets/raw/country=us/date=2026-01-26/raw_0001.json`).

| Operation | Command Example |
|------|------------|
| Download | `wrangler r2 object get "bucket/key" -f /local/path --remote` |
| Upload | `wrangler r2 object put "bucket/key" --file /local/path --remote` |
| Delete | `wrangler r2 object delete "bucket/key" --remote` |

- **Do not use for bulk migrations.** For bulk moves within the same bucket, use S3 CopyObject + DeleteObjects.

### 3.3 Reference Implementation

- **Migration Script**: `dev/migrate-r2-to-raw-prefix.ts` 
  - **List**: `loadR2FileList(bucket)` (S3 ListObjectsV2).
  - **Copy**: S3 **CopyObjectCommand** — Server-side copy of keys not in `raw/` or `prod/` to `raw/{key}`. Concurrency 30.
  - **Delete**: S3 **DeleteObjectsCommand** — Batch delete only successfully copied keys in 1,000-key batches.
  - **Option**: `--dry-run` (Outputs targets only), `--no-delete` (Copy only, original retained).

---

## 4. Prefix Structure (raw / prod)

Only the following two **top-level prefixes** are used within the bucket.

| Prefix | Meaning | Rule |
|--------|------|------|
| **raw/** | Original collected/uploaded data | **Immutable**. Overwriting prohibited. |
| **prod/** | Pipeline outputs (intermediate/final) | Can be created/updated. Do not write derived results to raw. |

- **raw** path format examples: `raw/country={cc}/category={cat}/date=YYYY-MM-DD/raw_0001.json` , `raw_metadata.json` 
- **prod** path format examples: `prod/country={cc}/.../domain_metadata.json` , `robots.txt` , `sitemap.xml` , `.success` etc.
- Objects previously located at the original root or under other prefixes like `datasets/` are **migrated** to `raw/` (or `prod/` depending on policy).

Refer to the [R2 raw/prod 2-stage model](/ko/v1/guides/system-architecture/r2-raw-prod-model) for detailed 2-stage model.

---

## 5. Migration/Move Workflow

1. **Set Environment Variables**: `R2_ACCESS_KEY_ID` , `R2_SECRET_ACCESS_KEY` , (Optional) `R2_BUCKET_NAME` , `R2_ACCOUNT_ID` 
2. **Execute Dry-run**: Verify migration targets and quantities via `pnpm migrate:r2:raw-prefix:dry-run` 
3. **Execute Actual Migration**: Review dry-run results  
   - `pnpm migrate:r2:raw-prefix` — Copy and delete original  
   - `pnpm migrate:r2:raw-prefix:no-delete` — Copy only, keep original
4. **Verification**: Confirm objects exist as expected under the `raw/` prefix via R2 dashboard or S3 API

---

## 6. Summary

| Item | Standard |
|------|------|
| **Object Listing** | S3-compatible API (ListObjectsV2), R2 API token, `@aws-sdk/client-s3` |
| **Bulk Object Move (Same Bucket)** | S3 CopyObject (server-side) + DeleteObjects (batch). Parallel copy (e.g., 30), delete 1,000 keys/request |
| **Single object get/put/delete (manual)** | wrangler r2 object ... --remote |
| **Prefix** | raw/ (immutable source), prod/ (output) |
| **Migration Script** | list=S3, copy=S3 CopyObject, delete=S3 DeleteObjects. Dry-run highly recommended |
| **Reference** | `dev/upload-to-r2/scanner.ts` (loadR2FileList), `dev/migrate-r2-to-raw-prefix.ts` |

This document defines the **standard approach** for R2 operations, to be applied alongside `.cursor/rules/data/r2-constraints.mdc` (chunk size, Bulk Listing, prohibited patterns within Workers, etc.).
