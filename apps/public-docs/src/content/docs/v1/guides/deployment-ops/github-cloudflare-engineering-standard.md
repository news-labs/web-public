---
title: GitHub and Cloudflare Engineering Standard
description: GitHub-Cloudflare integration workflows and SRE standards
sidebar:
  order: 5
translatedFromHash: 469a602dbb829335296110e6bd84281fe60c87b30d8657d978a164969f83de97
---

## GitOps Integrated Workflow

1. **Branch Strategy:** main (production), develop/staging (integration testing), feature/* (feature development)
2. **Automated Deployment:** GitHub push → Cloudflare Pages integration or build/preview URL generation via GitHub Actions
3. **Mandatory Code Review:** Main branch merges require peer approval (Approve)

## Cloudflare SRE Standards

### Local Simulation: Wrangler Dev

- `wrangler dev --remote`: Local execution + connection to actual Cloudflare resources (KV, D1, etc.) for 100% edge runtime replication

### Real-time logs: Wrangler Tail

- `wrangler tail`: Monitor production environment requests, status codes, console.log, and exceptions via real-time streaming

### Staged rollout and rollback

- Adhere to error budget, validate in staging before promoting to production

## Related Documents

- [GitHub Actions and Worker Debugging](./github-actions-worker-debugging/) — CI debugging strategy
- [Environment Setup](./environment-setup/) — wrangler·environment variables
