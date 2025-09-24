#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="$ROOT/dist"
ARCHIVE="$DIST/offline-dashboard.tar.gz"

if [ "${SKIP_PACKAGE_CHECKS:-0}" != "1" ]; then
  echo "Running verification checks before packaging..."
  npm run --silent check
fi

rm -rf "$DIST"
mkdir -p "$DIST"

FILES=(
  index.html
  assets
  docs
  src
  scripts
  README.md
  package.json
  package-lock.json
)

tar -czf "$ARCHIVE" -C "$ROOT" "${FILES[@]}"

echo "Offline bundle created at $ARCHIVE"
