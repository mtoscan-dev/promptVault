#!/bin/bash

# --- COLOR CONFIGURATION ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
AMBER='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Usage: ./scripts/load-seed.sh ./backups/promptvault_backup_20240216_213502.sql.gz

INPUT_FILE="$1"

if [ -z "$INPUT_FILE" ]; then
  echo -e "${RED}❌ Error: No backup file specified.${NC}"
  echo -e "Usage: ./scripts/load-seed.sh <path-to-sql-gz>"
  exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
  echo -e "${RED}❌ Error: File not found: $INPUT_FILE${NC}"
  exit 1
fi

echo -e "${CYAN}🏔️  RESTORING DATA FROM BACKUP...${NC}"
echo -e "Source: ${AMBER}$INPUT_FILE${NC}"

# Confirm action
read -p "⚠️  This will OVERWRITE the current database 'vault_db'. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${AMBER}🚫 Restore cancelled.${NC}"
    exit 1
fi

# Restore process
# 1. Drop existing connections (to allow drop db) is tricky, usually we just drop schema public cascade or similar.
# For simplicity, we'll try to just pipe the SQL. If the dump was created with --clean, it will drop tables.
# Inspecting standard pg_dump: usually implies restoring over.
# Best practice for clean restore:
# gunzip -c file | docker exec -i vault_db psql -U admin -d promptvault_db

echo -e "${AMBER}⏳ Restoring... (this may take a moment)${NC}"

if gunzip -c "$INPUT_FILE" | docker exec -i vault_db psql -U "${DB_USER:-admin}" -d "${DB_NAME:-promptvault_db}"; then
    echo -e "${GREEN}✅ RESTORE COMPLETED SUCCESSFULLY${NC}"
else
    echo -e "${RED}❌ ERROR: Restore failed.${NC}"
    exit 1
fi
