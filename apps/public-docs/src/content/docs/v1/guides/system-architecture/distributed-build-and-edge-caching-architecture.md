---
title: Distributed Build and Edge Caching Architecture
description: combined distributed build and edge caching architecture
sidebar:
  order: 4
translatedFromHash: 59e59c3c9252aa48e413b6a93b74103864815d1f2120986c8f9df6d07839a5df
---

The core of this project lies in balancing **"build performance"** and **"multi-tenancy management (10,000 domains)"**. If specific domain groups must be updated hourly, building the entire page at once is impossible. Therefore, an architecture combining **Distributed Build** and **Edge Caching** is the solution.

---

## Large-Scale News Generator Solution Comparison

| Comparison Item | **Astro (Recommended)** | **Hugo (Performance-Optimized)** | **Vite-based (Custom)** |
| :--- | :--- | :--- | :--- |
| **Build Speed** | Moderate (Node.js-based) | **Overwhelmingly Best (Go engine)** | Moderate |
| **Component Development** | **Best (Mixed React/Vue/Svelte)** | Difficult (Go Template) | Excellent (Custom Design) |
| **Multi-Domain Management** | Very Easy (Dynamic Routes) | Average (Complex Config) | Easy (Custom Implementation) |
| **2025 Trend** | **Currently Most Preferred** | Stable but declining market share | Library nature |
| **Reason for Recommendation** | Maximizes ad/widget performance with Islands Architecture | When build speed is critical | Custom build pipeline |

---

## Recommended Architecture (2025-2026)

We recommend the **Astro + Cloudflare Pages + Durable Objects** combination.

### 1. Framework: Astro (Hybrid Mode)

- News articles are 99% static content. Astro keeps JS close to zero while making only necessary parts interactive.
- **Build Strategy:** Avoid building all 200,000 pages at once; perform domain-grouped builds similar to **Incremental Static Regeneration (ISR)**.

### 2. Deployment & Domains: Cloudflare Pages & Custom Domains

- **Managing 10,000 Domains:** Connect tens of thousands of custom domains via Cloudflare for Platforms (Custom Hostnames), with automatic SSL issuance.
- **Hourly Updates:** Schedule domain group build scripts via Cron Triggers using the Wrangler CLI.

### 3. Data and Storage: Cloudflare R2 & D1

- **R2:** Stores generated static HTML and news images. No egress fees.
- **D1:** Ultra-fast edge queries for news metadata and domain-specific settings.

---

## Build Orchestration

1. **Build Queue:** Place hourly update target domain lists into Upstash QStash, etc., for sequential processing.
2. **Parallel Build Workers:** Perform **Parallel Build** in units of 1,000 domains using GitHub Actions or Cloudflare Workers. Can fully refresh 200,000 pages within about 10 minutes.
3. **Edge Optimization:** News articles rarely change once generated, so Cloudflare Cache Rules set long TTLs to minimize origin server load.
