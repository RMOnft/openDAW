#!/usr/bin/env bash
# Build API documentation for all libraries using TypeDoc
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

packages=(runtime dsp dom midi box box-forge jsx fusion std)
for pkg in "${packages[@]}"; do
  echo "Generating docs for $pkg"
  npx typedoc --options "packages/lib/$pkg/typedoc.json"
done
