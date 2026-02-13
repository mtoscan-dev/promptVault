#!/bin/bash

# --- COLOR CONFIGURATION ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
AMBER='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables to ensure we use the correct node context
source .env

echo -e "${CYAN}🏔️  INITIATING DATA RESURRECTION: ${PATAGONIA_NODE_ID}${NC}"

# 1. VERIFY ARGUMENT
if [ -z "$1" ]; then
    echo -e "${RED}❌ ERROR: No backup file provided.${NC}"
    echo -e "Usage: ./restore-bunker.sh path/to/backup_file.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

# 2. FILE EXISTENCE CHECK
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ ERROR: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# 3. SAFETY CONFIRMATION
echo -e "${RED}⚠️  WARNING: THIS WILL OVERWRITE ALL CURRENT DATA IN THE BUNKER.${NC}"
read -p "Are you sure you want to proceed? (y/N): " confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo -e "${AMBER}Operation aborted by user.${NC}"
    exit 0
fi

# 4. EXECUTE RESTORATION
echo -e "${AMBER}🔄 Injecting data into 'vault_db' container...${NC}"

# Streaming the decompressed data directly to avoid high disk I/O on 8GB RAM hardware
if gunzip < "$BACKUP_FILE" | docker exec -i vault_db psql -U "$DB_USER" "$DB_NAME"; then
    echo -e "\n${GREEN}===================================================="
    echo -e "✅ RESTORATION SUCCESSFUL"
    echo -e "====================================================${NC}"
    echo -e "The node is now synchronized with: ${CYAN}$BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ ERROR: Restoration failed. Check container logs.${NC}"
    exit 1
fi