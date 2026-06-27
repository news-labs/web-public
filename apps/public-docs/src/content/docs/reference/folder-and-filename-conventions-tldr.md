---
title: Folder and Filename Conventions TL;DR
description: folder-Filename Definition Summary (30-year architect's perspective)
sidebar:
  order: 1
translatedFromHash: 0884ef0dd77e5ccbae59d160f2cc5e0f55362e779cfd2809484a8686198b9f55
---

## TL;DR

> **"Unify folder rules for partitions, but file names must differ based on 'immutable snapshots vs contract objects'."**

- ✅ **Folder structure rules must be fully unified using the Research method**
- ❌ **File naming must not be unified based solely on dates**

## Folder Naming (Unified)

 ```
<root>/
└── country=<ISO2>/
    └── category=<logical_category>/
        └── content=<news|faq|policy|guide>/
            └── date=YYYY-MM-DD/
``` 

- GitHub / R2 / Future Data Lake (Uniform)
- **Mandatory** key=value partitioning

## File Naming (By Type)

| Data Type | File Naming Rule | Storage |
|------------|-------------|--------|
| Research Dataset | YYYY-MM-DD.json | GitHub |
| Seed Contract | v1.json, v2.json | GitHub |
| robots.txt | date=YYYY-MM-DD/robots.txt | R2 |
| sitemap.xml | date=YYYY-MM-DD/sitemap.xml | R2 |
| homepage.html | date=YYYY-MM-DD/homepage.html | R2 |
| Article HTML | ❌ Storage Prohibited | — |___EN______EN___## domain_id / seed_id standard___EN______EN___### domain_id___EN______EN___ ```
<authority>:<country>:<registered_domain>
``` ___EN______EN___- _Example_: `gov:sg:ica.gov.sg` , `ngo:intl:who.int` 

### seed_id

 ```
<domain_id>::<content_type>
``` 

- _Example_: `gov:sg:ica.gov.sg::news` 
- content_type: news, press_release, faq, guide, policy

### Core Principles

- IDs must be **short, meaningful, and immutable**
- Version / Date / URL must be **separated as attributes**
- ID ↔ Folder structure must always be **reversible**
