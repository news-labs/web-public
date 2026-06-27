# Marketing web — infra checklist

After deploying CSS/layout fixes, verify in Cloudflare Dashboard:

1. **www.newsfork.com** → Pages project `nl-marketing-web` (Custom domains → Active)
2. Remove `www.newsfork.com` from legacy `nf-web-public` if still attached
3. Remove overlapping `nl-marketing-web` **Worker** routes (Pages and Worker must not share the domain)
4. **newsfork.com (apex)** — if 522 persists, point apex DNS to Pages or enable redirect at DNS/registrar per [public-marketing-domain-policy.md](https://github.com/news-labs/labs-core/blob/main/policies/public-marketing-domain-policy.md)

Build artifact `apps/marketing-web/out/` is gitignored; deploy via `.github/workflows/deploy-www.yml` only.
