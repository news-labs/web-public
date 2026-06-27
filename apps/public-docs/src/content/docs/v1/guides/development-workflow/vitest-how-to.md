---
title: Vitest How To
description: Wrangler vs Vitest and their roles in the Cloudflare ecosystem
sidebar:
  order: 6
translatedFromHash: ec54555eda73c9cd8ca72a224a1a7058db8f715c3451fd7fa0730c65dd79bb54
---

Wrangler and Vitest are **complementary**. **Wrangler** can be seen as a "local playground/server," while **Vitest** is an "automated quality manager."

## Wrangler vs Vitest | Feature | Wrangler (dev/deploy) | Vitest (cloudflare-test) | |------|-----------------------| | Speed | Slow (Full worker reload) | Fast (Cloudflare-test) | | Main Purpose | Manual testing, preview, and deployment | Automated logic verification, preventing feature breakage |-|---------------------------|
| Primary Purpose | Manual testing, previewing, and deployment | Automated logic verification, preventing feature breakage |
| Speed | Slow (Full worker reload) | **Very fast** (Hundreds of tests in seconds) |
| Environment | Live/local runtime | Simulation (KV, D1, R2 mocking) |
| Scalability | Limited to dozens of manual scenarios | Optimized for edge cases and data combinations |
| AI Synergy | Verify UI/API views | **Verify AI logic correctness without running the app** |
| Feedback Loop | Manual | **Automated** (Save → Instant success/failure) |

## Recommended Sequence

### 1. 90% of development is done in Vitest (Inner Loop)

- `seed_engine` Verify exception cases with Vitest.
- Test scenarios like "What if the GitHub API returns a 500?" in **Vitest using mock responses** in just 1 second.

### 2. Final verification is done with Wrangler (Outer Loop)

- After all Vitest tests pass, final verification is done by connecting to **actual Cloudflare bindings** (KV, D1, R2) via `pnpm wrangler dev`.
- Confirms no configuration errors right before deployment.

## Cursor AI Integration

- **When using Vitest:** "Write test code for this feature" → Passing immediately confirms AI logic completeness.
- **When using only Wrangler:** Copy AI code, spin up servers, then manually verify each request via Postman/browser → Slow and prone to errors.

## Conclusion

- **Don't rely solely on Wrangler.** When modifying V1 logic while building V2, manual verification alone makes it easy to miss bugs.
- **Use Vitest as a 'safety net'.** Tests written once remain permanently, ensuring AI-generated code doesn't break existing functionality.
