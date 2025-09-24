#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="$ROOT/dist"
ARCHIVE="$DIST/offline-dashboard.tar.gz"

rm -rf "$DIST"
mkdir -p "$DIST"

FILES=(
  index.html
  assets
  src
  README.md
  docs/data-contract.md
)

tar -czf "$ARCHIVE" -C "$ROOT" "${FILES[@]}"

echo "Offline bundle created at $ARCHIVE"
