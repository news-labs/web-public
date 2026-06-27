---
title: KV Dedup Policy
description: Cloudflare KV-based Domain Deduplication Policy (Domain Registry)
sidebar:
  order: 8
translatedFromHash: 91196beea523b1c2cc18907407a50de919d5b56fab895edfd63c72457667a804
---

Policy Summary The domain hash in KV is not a deletion target but a "Registry."

- ❌ Not deleted
- ❌ TTL not used
- ✅ Status only changed (active | deprecated | blocked | archived)
- ✅ Operate like a Registry

## 2-Layer Identity Model

### ① Domain Registry ID (duplicate check basis)

 ```
domain_id = "{authority}:{country}:{registrable_domain}"
domain_hash = sha256(domain_id)
``` 

- **KV Key:** `domain:{domain_hash}` 
- **KV Value:** domain_id, first_seen, status, etc. **Permanently maintained.**

### ② Seed ID (Collection Unit)

 ```
seed_id = "{domain_id}::{content_type}"
``` 

- Only one domain per Seed. Multiple Seeds allowed (news, faq, guide, etc.).

## Issues when deleting KV

- Recurrence of duplicate Seed generation (same domain keeps appearing as a candidate)
- Inability to prove "when collection started" during legal/operational audits
- Repeated cost increases due to re-downloading robots/sitemap/homepage

## Recommended KV Value Structure

 ```json
{
  "domain_id": "gov:sg:ica.gov.sg",
  "registered_at": "2026-01-24T10:21:00Z",
  "last_seen_at": "2026-02-01T03:10:00Z",
  "status": "active",
  "seed_created": true,
  "seed_ids": ["gov:sg:ica.gov.sg::news"]
}
``` 

## State Transitions

| Situation | Action |
|------|------|
| Domain Closed | status = deprecated |
| Blocked by robots change | status = blocked |
| No longer collected | status = archived |

Keep the ID, change **only the action**.

## Related Documents

- [KV Dedup Logic](./kv-dedup-logic.md) — Implementation and Environment Variables
- [Folder and Filename Conventions](/ko/reference/folder-and-filename-conventions-tldr/) — domain_id / seed_id Rules
