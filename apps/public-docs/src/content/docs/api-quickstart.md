---
title: API Quickstart
description: Get started with the Newsfork Seeds REST API using your API key.
sidebar:
  order: 2
---

Use this guide to make your first authenticated API call. For full endpoint details, see [v1 API](/v1/api/).

## Prerequisites

- A Newsfork account with an active subscription
- An API key from your account dashboard or onboarding email

Never share your full API key in support tickets, chat, or public repositories.

## Base URL

Your integration uses the base URL provided in your account onboarding materials. Contact [hello@newsfork.com](mailto:hello@newsfork.com) if you need your production or sandbox base URL.

## Authentication

Send your API key in the `Authorization` header:

```bash
curl -sS \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://YOUR_BASE_URL/health"
```

Replace `YOUR_API_KEY` and `YOUR_BASE_URL` with the values from your account.

## First requests

### Health check

```bash
curl -sS \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://YOUR_BASE_URL/health"
```

### List seeds

```bash
curl -sS \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://YOUR_BASE_URL/api/v1/seeds"
```

See [Seeds API](/v1/api/seeds-api/) for query parameters and response fields.

## Error handling

| HTTP status | Meaning |
| --- | --- |
| `401` | Missing or invalid API key |
| `403` | Key valid but not authorized for this resource |
| `429` | Rate limit exceeded — retry with backoff |
| `5xx` | Server error — retry with exponential backoff |

## Rate limits

Rate limits depend on your plan. See [Pricing](/company/pricing/) or contact sales for limits on your account.

## Next steps

- [Getting Started](/getting-started/) — Integration overview
- [Seeds API](/v1/api/seeds-api/) — Core endpoints
- [Seeds guide](/v1/guides/seeds/) — Seed contract concepts
- [FAQ](/resources/faq/) — Common questions
