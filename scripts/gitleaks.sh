#!/usr/bin/env bash
# Runs gitleaks with the given arguments against this repository. Uses a local gitleaks binary
# if installed, otherwise the pinned Docker image, so the hook and CI need no extra install.
set -euo pipefail

version="8.30.1"
repo_root="$(git rev-parse --show-toplevel)"
# gitleaks scans the current directory by default.
cd "$repo_root"

if command -v gitleaks >/dev/null 2>&1; then
  exec gitleaks "$@"
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "gitleaks: install gitleaks (https://github.com/gitleaks/gitleaks) or Docker to scan for secrets." >&2
  exit 1
fi

# Run as the current user so git inside the container does not reject the repo as dubious ownership.
exec docker run --rm --user "$(id -u):$(id -g)" -v "$repo_root:/repo" -w /repo \
  "ghcr.io/gitleaks/gitleaks:v${version}" "$@"
