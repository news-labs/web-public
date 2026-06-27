---
title: KV Deduplication Logic
description: KV-based URL duplicate checking system
sidebar:
  order: 5
translatedFromHash: c8dc8bfcc3409612059776915b489426a39a85d3d2baef6b1b93c415f18fba50
---

## Overview

The KV-based deduplication system is enabled via the **NEWSFORK_DEDUP** environment variable.

## Environment Variables

### Local Development

 ```bash
export NEWSFORK_DEDUP=true
export CF_ACCOUNT_ID="your-account-id"
export CF_KV_NAMESPACE_ID="your-namespace-id"
export CF_API_TOKEN="your-api-token"
``` 

### GitHub Secrets

 ```bash
gh secret set NEWSFORK_DEDUP --body "true"
gh secret set CF_ACCOUNT_ID --body "your-account-id"
gh secret set CF_KV_NAMESPACE_ID --body "your-namespace-id"
gh secret set CF_API_TOKEN --body "your-api-token"
``` 

## Deduplication Functions

 ```typescript
// URL 중복 여부 확인
isDuplicate(url: string, config: KVConfig): Promise<DeduplicationResult>

// 배치 중복 검사
batchDeduplication(urls: string[], config: KVConfig, batchSize: number): Promise<BatchDeduplicationResult>

// 중복 검사 통계
generateDeduplicationStats(results: DeduplicationResult[]): Record<string, any>
``` 

## Operation Flow

1. **Generate URL Hash**: Create KV key using SHA-1 hash
2. **KV Lookup**: Check if the key exists
3. **Duplicate Check**:
   - If exists → Duplicate (No processing)
   - If does not exist → New (Register in KV then process)
4. **TTL Setting**: Automatically delete after 30 days

## Activation Conditions

- Set the environment variable ``NEWSFORK_DEDUP=true``
- Set all Cloudflare KV environment variables

## Related Files

- `test/utils/kv-deduplication.ts` — KV connection and duplicate check logic
- `test/kv-deduplication.test.ts` — Test suite
