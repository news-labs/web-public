---
title: raw/prod step-by-step input/output dataset
description: input-Output, storage location, and data format for each stage of raw
  and prod. Includes robots.txt-sitemap-domain_metadata.
sidebar:
  order: 12
translatedFromHash: 857682326bd9edea0312dea7d52bde92e20fcee175e6379d068102adad2c605d
---

# Raw / Prod Stage-by-Stage Input·Output Datasets

**Document Version**: 1.0  
**Purpose**: Define the **input**·**output** datasets·deliverables, storage locations, and data formats for each stage of raw and prod. **Finalization·Implementation Criteria.**

---

## 1. Overview

This document outlines **what comes in (Input)**, **what goes out (Output)**, and **where and in what format it is stored** for each stage, based on the 2-stage prefix model (**raw** / **prod**).

---

## 2. raw stage (Stage 1)

### 2.1 raw — Input (Input)

| Item | Description |
|------|------|
| **Source** | **Original research data** generated locally or from external pipelines. Uploaded to R2 via `dev/upload-to-r2`. |
| **Storage Location** | Under the **raw/** prefix. Example: `raw/country={cc}/category={cat}/date=YYYY-MM-DD/` |
| **File Name** | `raw_0001.json` , `raw_0002.json` , … (sequential numbering), recommended `raw_metadata.json` per partition |
| **Data Format** | **JSON**. Schema: **EnhancedResearchDataset** (Zod standard) |
| **Role** | Pipeline's **sole source input**. Immutable (overwriting prohibited). |

### 2.2 raw — Output

raw **Does not modify the file itself**. The pipeline only **creates and records** the following in the raw stage.

| Item | Content |
|------|------|
| **Checkpoint** | **File**: `raw/.../raw_NNNN.json.success` (same partition, within raw prefix). **Format**: Empty object or empty text. **Meaning**: Processing of this raw file completed. |
| **Downstream Input** | Reads one raw file to extract a **domain list**, then sends messages to **DOMAIN_QUEUE** (one message per domain). This message becomes **Input for the prod stage**. |

---

## 3. prod stage (Stage 2)

### 3.1 prod — Input (Input)

| Item | Content |
|------|------|
| **Source** | **DOMAIN_QUEUE** message. **One message per domain** extracted from raw files by the Seed Queue Consumer. |
| **Delivery Format** | Queue message body (JSON). Schema: **DomainQueueMessage**. |
| **Field Summary** | `domain_id` , `domain_url` , `registrable_domain` , `authority` , `partition_info` (country, category, date), `source_file_path` (optional). |

### 3.2 prod — Output (Output)·Storage Location

| Output | Download/Generation Method | Storage Location (prod/) | Data Format | |--------|--------------------|--------------------------------|-------------|
| **robots.txt** | HTTP GET `https://{registrable_domain}/robots.txt` | `prod/country={cc}/category={cat}/date=YYYY-MM-DD/{sanitized_domain}/robots.txt` | **Plain text** (as-is) |
| **sitemap.xml** | Download after extracting Sitemap URL from robots.txt or attempting default URL | `prod/.../{sanitized_domain}/sitemap.xml` | **XML** (As is) |
| **domain_metadata.json** | Summary metadata of robots·sitemap fetch results | `prod/.../{sanitized_domain}/domain_metadata.json` | **JSON**. Schema: **DomainMetadata** (Zod). |
| **domain_metadata.json.success** | Indicates processing of the domain is complete | `prod/.../{domain}/domain_metadata.json.success` | Empty text. |

---

## 4. Summary Table

| Step | Input | Output (Stored Data) | Notes |
|------|-------|------------------|------|
| **raw** | Uploaded **raw_NNNN.json** (EnhancedResearchDataset). Location: `raw/.../`. | `raw/.../raw_NNNN.json.success` (Checkpoint). + Domain list passed to queue (prod Input). | Raw file is immutable. |
| **prod** | **DOMAIN_QUEUE** message (DomainQueueMessage). | `prod/.../{domain}/robots.txt` , `sitemap.xml` , `domain_metadata.json` , `.success`. | robots·sitemap downloaded from external URLs and stored in prod. |

---

## 5. Data Format·Schema Reference

| Data | Schema/Format | Reference (Codebase) |
|--------|-------------|-------------------|
| raw file | EnhancedResearchDataset (JSON) | `src/schemas/research.ts` |
| Seed Queue message | SeedQueueMessage | `src/schemas/seed-engine.ts` |
| Domain Queue message | DomainQueueMessage | `src/schemas/seed-engine.ts` |
| domain_metadata.json | DomainMetadata | `src/schemas/seed-engine.ts` |
| robots.txt | Plain text (original) | — |
| sitemap.xml | XML (Original) | — |
|