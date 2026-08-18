#!/usr/bin/env bash
# Lints both generated OpenAPI specs with Redocly CLI. Fails (non-zero exit)
# if either spec has lint errors. Never depends on live-API access or any
# API keys -- this only checks the spec files are well-formed OpenAPI.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR/.."

for spec in openapi-3.0.yaml openapi-3.1.yaml; do
  path="$REPO_ROOT/$spec"
  if [[ ! -f "$path" ]]; then
    echo "skip: $spec not generated yet"
    continue
  fi
  echo "linting $spec..."
  npx --yes @redocly/cli lint "$path"
done
