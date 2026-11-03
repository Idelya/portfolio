#!/usr/bin/env bash
# Runs the Playwright tests on the host while the browsers run in the official Playwright
# container. Needed on hosts Playwright no longer supports (e.g. Ubuntu 20.04); CI runs natively.
# Extra arguments are passed to `playwright test`.
set -euo pipefail

version="$(node -p 'require("@playwright/test/package.json").version')"
ws_port=3200
container="portfolio-playwright-${ws_port}"

docker run --detach --rm --init --network host --name "$container" \
  "mcr.microsoft.com/playwright:v${version}-noble" \
  /bin/sh -c "npx -y playwright@${version} run-server --port ${ws_port} --host 127.0.0.1" >/dev/null
trap 'docker stop "$container" >/dev/null 2>&1 || true' EXIT

ready=false
for _ in $(seq 1 60); do
  if (exec 3<>"/dev/tcp/127.0.0.1/${ws_port}") 2>/dev/null; then ready=true; break; fi
  sleep 1
done
if [ "$ready" != true ]; then
  echo "e2e: Playwright browser server did not start on port ${ws_port} within 60 s." >&2
  docker logs "$container" >&2 || true
  exit 1
fi

# --network host: the containerised browser reaches the app on the host's localhost.
PW_TEST_CONNECT_WS_ENDPOINT="ws://127.0.0.1:${ws_port}/" npx playwright test "$@"
