#!/bin/bash
# SessionStart hook: instala dependencias en sesiones de Claude Code on the web.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# pnpm install (no --frozen-lockfile) para aprovechar la cache del contenedor
pnpm install --prefer-offline
