#!/usr/bin/env bash
# Scans the staged version of every added or modified file with secretlint (pre-commit hook).
# Staged content can differ from the working tree, so files are exported from the index first.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

files=()
while IFS= read -r -d '' file; do files+=("$file"); done \
  < <(git diff --cached --name-only --diff-filter=ACMR -z)
if [ ${#files[@]} -eq 0 ]; then exit 0; fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git checkout-index --prefix="$tmp/" -- "${files[@]}"

cd "$tmp"
"$repo_root/node_modules/.bin/secretlint" \
  --secretlintrc "$repo_root/.secretlintrc.json" \
  "${files[@]}"
