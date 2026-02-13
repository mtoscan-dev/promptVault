#!/bin/bash

# --- COLOR CONFIGURATION ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
AMBER='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load environment variables
source .env

# --- CONFIGURATION ---
# Replace this path with your encrypted external drive mount point
BACKUP_DIR="./backups" 
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="promptvault_backup_${TIMESTAMP}.sql.gz"

echo -e "${CYAN}🏔️  STARTING DATA PRESERVATION PROTOCOL: ${PATAGONIA_NODE_ID}${NC}"

# 1. CREATE BACKUP DIRECTORY IF IT DOESN'T EXIST
mkdir -p "$BACKUP_DIR"

# 2. EXECUTE DOCKER PG_DUMP
echo -e "${AMBER}📦 Exporting database from 'vault_db' container...${NC}"

# We run pg_dump inside the container and compress it on the fly to save disk space
if docker exec "$DB_USER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "${BACKUP_DIR}/${BACKUP_NAME}"; then
    echo -e "${GREEN}✅ BACKUP COMPLETED SUCCESSFULLY${NC}"
    echo -e "Location: ${CYAN}${BACKUP_DIR}/${BACKUP_NAME}${NC}"
else
    echo -e "${RED}❌ ERROR: Database export failed.${NC}"
    exit 1
fi

# 3. CLEANUP (Optional: Keep only the last 7 days of backups)
echo -e "${AMBER}🧹 Rotating old backups (keeping last 7 days)...${NC}"
find "$BACKUP_DIR" -name "promptvault_backup_*.sql.gz" -mtime +7 -delete

echo -e "\n${GREEN}===================================================="
echo -e "🛡️  DATA SOVEREIGNTY SECURED"
echo -e "====================================================${NC}"