---
title: GitHub Actions and Worker Debugging
description: GitHub Actions + Cloudflare Workers debugging strategy
sidebar:
  order: 4
translatedFromHash: 290ce21a8a7c17e4bd438ed9dc2e024bdbd0b6b50b050e8019774d58e3e15cfc
---

## Why GitHub Actions is Hard to Debug | Reason | Explanation |-|
| Ephemeral VM | Server disappears after execution ends |
| No state | Cannot see files, DB, or environment like locally |
| Only logs exist | Only stdout/stderr remains |
| Non-determinism | API, network, timing differences |
| Step-level failure | Unclear which command failed |

## Essential Settings

### Step Debug Mode

 ```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
``` 

### Bash Strict Mode

 ```bash
set -euxo pipefail
``` 

Must be placed at the top of CI scripts.

## Shell First Structure

### ❌ Bad

 ```yaml
- run: pnpm test
- run: wrangler deploy
- run: python crawl.py
``` 

### ✅ Good

 ```yaml
- run: .github/scripts/ci.sh
``` 

→ **Running this locally is 100% identical to CI**

## tmate SSH (Debugging on Failure)

 ```yaml
- name: Setup tmate session
  uses: mxschmitt/action-tmate@v3
``` 

If CI fails, you can log in directly to the failed CI server via `ssh xxx@tmate.io`.

## Cloudflare + Workers Architecture

GitHub Actions should only handle **triggering**.

 ```
GitHub Action
   ↓
Call Ingress Worker
   ↓
Queue
   ↓
Consumer Workers
``` 

If CI directly handles crawling·AI·DB·deployment, it becomes a debugging nightmare.

## Recommended Flow

 ```
GitHub Push
   ↓
GitHub Action
   ↓
ci.sh (로컬과 동일)
   ↓
wrangler --dry-run
   ↓
wrangler deploy preview
   ↓
Queue trigger
   ↓
Cloudflare Workers
``` 

## Logpush for Evidence 

 Worker version·build info logging: 

 ```typescript
const VERSION = "2026-01-27T1028Z";
const BUILD = "git-<commit-hash>";

export default {
  fetch(req, env, ctx) {
    console.log("deploy", VERSION, BUILD);
    console.log("request", req.method, new URL(req.url).pathname);
  }
}
``` 

 → Cloudflare Logpush → R2 / Datadog / Logflare 
