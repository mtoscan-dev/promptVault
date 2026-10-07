#!/bin/bash
# db-debug-docker/verify.sh
# Quick verification that DB connection is working after `.env` fix

set -e

echo "🔧 Verifying DB connection for db-debug-docker..."

# Check container status
if ! docker ps | grep -qi vault; then
  echo "❌ DB container not running"
  exit 1
fi

# Check settings table exists and has data
if ! docker exec vault_db psql -U admin -d promptvault_db -c "SELECT 1 FROM settings WHERE id=1 LIMIT 1;" > /dev/null 2>&1; then
  echo "❌ Settings table missing or empty"
  exit 1
fi

# Verify .env has real password (not ***)
if grep -q 'DATABASE_URL="[^"]*:\*\*@' .env; then
  echo "⚠️  WARNING: .env still contains masked password (***). Next.js will fail to connect."
  echo "Run: sed -i 's|:\\*\\*@|:secret@|' .env"
  exit 1
fi

echo "✅ DB connection verified"
exit 0
