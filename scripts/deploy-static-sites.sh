#!/usr/bin/env bash
# Deploys the three assets-only Workers from a staging directory (see README "Build + deploy").
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID. Pass --dry-run to stop before deploying.
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?is not set}"
: "${CLOUDFLARE_ACCOUNT_ID:?is not set}"
root=${1:?usage: deploy-static-sites.sh <staging-dir> [--dry-run]}
mode=${2:-}
[[ -z $mode || $mode == --dry-run ]] || { echo "unknown option: $mode" >&2; exit 2; }
sites=(nl-site-newsfork-marketing nl-site-newsfork-account nl-site-newsfork-docs)

cd "$root"
# Account preflight: the token must be able to see the target account.
who=$(npx wrangler whoami)
grep -qF -- "$CLOUDFLARE_ACCOUNT_ID" <<<"$who" || {
  echo "token has no access to account $CLOUDFLARE_ACCOUNT_ID" >&2
  exit 1
}

# Check every site before deploying any of them.
for n in "${sites[@]}"; do
  (cd "out/$n" && npx wrangler deploy --dry-run)
done
[[ $mode == --dry-run ]] && exit 0

for n in "${sites[@]}"; do
  (cd "out/$n" && npx wrangler deploy)
done
