#!/usr/bin/env bash
# Scans the staged version of every added, modified or type-changed file with secretlint (pre-commit hook).
# Staged content can differ from the working tree, so files are exported from the index first.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

secretlint="$repo_root/node_modules/.bin/secretlint"
if [ ! -x "$secretlint" ]; then
  # e.g. a fresh git worktree: dependencies are installed per checkout.
  echo "secret scan: secretlint not found. Run 'npm install' in $repo_root, then commit again." >&2
  exit 1
fi

files=()
while IFS= read -r -d '' file; do files+=("$file"); done \
  < <(git diff --cached --name-only --diff-filter=ACMRT -z)
if [ ${#files[@]} -eq 0 ]; then exit 0; fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git checkout-index --prefix="$tmp/" -- "${files[@]}"

cd "$tmp"
# --no-gitignore: a staged .gitignore lands in $tmp too and would hide force-added files (.env, keys).
# --no-glob: staged paths are literal; characters like ! or {a,b} must not be read as patterns.
"$secretlint" \
  --secretlintrc "$repo_root/.secretlintrc.json" \
  --no-gitignore \
  --no-glob \
  "${files[@]}"
