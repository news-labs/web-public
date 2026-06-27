---
title: Technology Stack Definition and Developer Guide
description: enterprise media platform technology stack and developer contracts
sidebar:
  order: 8
translatedFromHash: c744adce8851eca042f05968521853f178b2e920ffea35952272aafcd5c9a841
---

## Purpose

Defines a **single, authoritative standard** for enterprise-grade media platforms.

- Final technology stack (Runtime, API, AI, Admin)
- Local development standards and developer contracts
- CI/CD and GitOps-based automation
- E2E automation (Playwright)
- Payments, messaging, and ad management
- AI semantic search infrastructure
- Real-time incident response and observability strategy

## Architecture Vision

We aim to build an **enterprise media platform** integrating **AI, payments, advertising, automation, and observability**.

### Core Objectives

- 🌍 **Global response within 100ms** (Edge)
- 🔐 **API Gateway-based Security and Policy First**
- 🤖 **AI Semantic Search and Personalized Recommendations**
- 🚀 **Real-time Fault Detection and Response**
- 👥 **Multi-team Scalable Standard Development Experience**

### Design Philosophy

- **Contract First:** The API is the contract
- **Local First:** Validate locally before reaching the server
- **Gateway Aware:** Validate at the same entry point (Zuplo) as the actual user
- **Observability by Design:** Failures are immediately exposed, no hiding allowed

## Final Technology Stack

| Domain | Technology | Role |
|--------|------------|------|
| Runtime | Cloudflare Workers | Global edge execution |
| API Framework | Hono + Zod | Contract-first, type-safe API |
| Database | Cloudflare D1 + Drizzle | News and metadata storage |
| Cache / KV | Cloudflare KV | Session, Token, Cache |
| API Gateway | Zuplo (GitOps) | Authentication, Rate Limiting, Policies |
| CI/CD | GitHub Actions | Testing, Deployment, Policy Synchronization |
| Local Dev | Wrangler | Local Edge Simulation |
| Unit Testing | Vitest | Local·CI Standard |
| E2E Testing | Playwright | User Perspective Validation |
| Monitoring | Sentry | Real-time Fault Response |
| AI Search | Cloudflare Vectorize | Semantic News Search |
| Payments | Stripe | Subscription·Payment |
| Messaging | Twilio | SMS·Notifications |
| Editor | Cursor | AI Pair Programming |

## Developer Philosophy

1. **Code that fails locally must not be deployed to the server**
2. **The server is an execution environment, not a development environment**
3. **Testing is a mandatory gateway, not an option**
4. **Enforce development environments with rules; documentation alone is insufficient**

> _"CI is not the source of trust, but the second line of defense."_

## End-to-End Flow

 ```
Local Development (Cursor)
   ↓
Local Unit & Contract Testing (Vitest)
   ↓
Local Edge Simulation (Wrangler)
   ↓
Git Commit / Push (GitHub)
   ↓
CI Continuous Testing (Vitest)
   ↓
Automated Deployment (Cloudflare Workers)
   ↓
Gateway Synchronization (Zuplo)
   ↓
End-to-End Verification (Playwright)
   ↓
Runtime Monitoring & Incident Response (Sentry)
``` 

**Core Rule:** Always validate locally before deploying to the server.
