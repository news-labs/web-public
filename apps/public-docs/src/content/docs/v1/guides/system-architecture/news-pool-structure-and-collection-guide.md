---
title: News Pool Structure and Collection Guide
description: guide to configuring News Pools and ingestion schemes
sidebar:
  order: 6
translatedFromHash: 91c0ca38324995fcb3f3189b0e7906815f45acfd55cd06f7947be04b13d9d786
---

The **NewsFork** model in the ASI era will be more than a simple news aggregator; it will become a **'global intelligent news hub'** connecting fragmented public information by country to AI and expatriates worldwide.

## 1. News Pool Structure: "Central Intelligent Data Lake"

For each channel (agent) to select articles from the news pool, the source data must be in a **'neutral structure'** independent of specific languages or formats.

### Unified Schema

- All news is converted and stored in a **JSON-based standard schema**
- Examples: `country_code` , `agency_name` , `original_lang` , `fact_tags` , `importance_score` 

### Hybrid Storage

- **Relational DB (D1/PostgreSQL):** Article metadata, subscription information
- **Vector DB (Pinecone/Milvus):** Stores the 'meaning' of news as vectors, similarity-based recommendations

### Multi-Agent Orchestration

- Central Orchestrator manages news pool
- Sub-channel agents select articles via 'intent-based routing'

## 2. Acquisition Strategy (Responsible Collection)

### Smart Crawling

- **Official APIs first:** Open data portals like data.europa.eu, data.gov, etc.
- **Web scraping:** Wrangler-based serverless scraper, operates during idle time slots

### Multilingual Pipeline (NMT)

- Immediate NMT translation to English/standard official language upon acquisition
- Localization optimization: Incorporating cultural nuances for expat channels

## 3. Step-by-Step Service Execution Model

| Step | Channel Type | How It Works | Business Model |
|------|-----------|-----------|---------------|
| Stage 1 | Expats Channel | Country-specific agents curate essential information for foreign residents | Channel-specific premium subscriptions or advertising |
| Stage 1 | Developer API | Direct access to news pool, Structured Fact Data Subscription | Zuplo + Stripe Usage-Based Billing |
| Phase 2 | Personalized Recommendations | Curates news matching interests using Vector DB + Activity Data | Hyper-Personalized Premium Membership |

## Recommended: "Intelligent Gateway Strategy"

Place **Zuplo** at the news pool's entry and exit points to control API usage, monitoring traffic and value whenever channel agents 'Fork' articles from the news pool.
