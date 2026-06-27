---
title: Test and Deployment Guide
description: the testing and deployment content has been consolidated into a deployment
  procedure document.
sidebar:
  order: 3
translatedFromHash: 296122e18509cf33a724e00d21ef1a814ae3c8a8d9cac3d631b053b60bb81d26
---

The test command sequence, deployment method, and server verification procedure are consolidated in the **[Deployment Procedure](./deployment.md)** document.

- **Local Test Sequence**: TypeScript validation → Unit tests → Integration validation → Local server testing
- **Deployment Method**: Wrangler CLI or GitHub Actions (main push / workflow_dispatch)
- **Post-deployment Verification**: Health, Readiness, Liveness, API Endpoints
- **Troubleshooting**: Vitest compatibility, Queue/D1/KV absence, Health/API failure response

Refer to [Deployment Procedure](./deployment.md) for detailed information on the above items.
