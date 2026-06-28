---
title: Category Reference
description: API common categories and specifications reference.
sidebar:
  order: 4
translatedFromHash: 82b450df26bcb7446595ee2d349348b14206871a486634472ad7e18562be4d27
---

**Who should read this** — Authors defining Research and Seed contracts. Use with [Output JSON Scheme](/v1/api/output-json-scheme/) for pipeline output structure.

## Overview

Category indicates **the nature of the content (What it is)**. It is defined based on the essence of the information covered, not the source.

## Main Categories (Common to Research & Seed)

| Category | Meaning Definition | Content Included |
| :--- | :--- | :--- |
| **news** | Timely official/unofficial announcements | Policy announcements, notices, press releases |
| **policy** | Systems, laws, regulations themselves | Legal amendments, administrative guidelines |
| **guide** | Content for Explanation/Guidance | How-to, Procedure Guides |
| **faq** | Q&A Structured Information | FAQ, Help, Support |
| **data** | Numerical/Statistical/Raw Data | Statistics Korea, Reports |
| **research** | Academic/Research | Papers, White Papers |
| **announcement** | Simple Notices | Events, Schedules |
| **directory** | List-type Information | Agency Lists, Contacts |
| **opinion** | Commentary·Columns | Contributions, Analysis |
| **alert** | Emergency/Caution Information | Disaster, Warning |

At the Seed stage, determine `nature` as one or more of the above values.

## Government / Organization is not a Category

| Concept | Where to Place |
| :--- | :--- |
| **Government** | `source.type = "government"` |
| **Organization** | `source.type = "organization"` |
| **NGO / Intl Org** | `source.type = "ngo"` |
| **Company** | `source.type = "company"` |

## Medium (Content Format)

| Medium | Definition |
| :--- | :--- |
| **web** | General web page |
| **social** | SNS post |
| **video** | Video content |
| **audio** | Podcast |
| **document** | PDF, DOC |

## Research → Seed Role Separation

| Engine | Role |
| :--- | :--- |
| **Research Engine** | "Where to look" (URL discovery) |
| **Seed Engine** | "How to fetch" (contract creation) |
| **Scraper** | "Actual collection" (execution) |

## Next steps

- [Output JSON Scheme](/v1/api/output-json-scheme/) — Pipeline output structure.
- [Seeds guide](/v1/guides/seeds/) — Seed contract workflow.
