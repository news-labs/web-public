#!/usr/bin/env bash
# Install Node 22 + pnpm without GitHub marketplace actions.
# Marketplace downloads (actions/setup-node, pnpm/action-setup) hit
# codeload.github.com and often 429 on the shared Contabo project-a IP.
set -euo pipefail

NODE_VERSION="${NODE_VERSION:-22.18.0}"
PNPM_VERSION="${PNPM_VERSION:-9.15.0}"

append_path() {
  local dir="$1"
  export PATH="${dir}:${PATH}"
  if [[ -n "${GITHUB_PATH:-}" ]]; then
    echo "$dir" >> "${GITHUB_PATH}"
  fi
}

node_major_ok() {
  command -v node >/dev/null 2>&1 && node -v | grep -q '^v22\.'
}

if ! node_major_ok; then
  tmp="${RUNNER_TEMP:-/tmp}/node-v${NODE_VERSION}-linux-x64"
  mkdir -p "${tmp}"
  echo "Downloading Node v${NODE_VERSION} from nodejs.org"
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    | tar -xJ -C "${tmp}" --strip-components=1
  append_path "${tmp}/bin"
fi

node -v
corepack enable
corepack prepare "pnpm@${PNPM_VERSION}" --activate
command -v pnpm
pnpm -v
