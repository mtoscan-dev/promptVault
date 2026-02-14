#!/bin/bash
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🏔️  RESTARTING VAULT BUNKER...${NC}"

# 1. Levantar contenedores y limpiar huérfanos
docker compose down --remove-orphans
docker compose up -d --build

# 2. Esperar a que la DB esté lista
echo "⏳ WAITING FOR DB TO BE READY..."
until docker exec vault_db pg_isready -U postgres; do
  sleep 2
done

# 3. Sincronizar esquema de Drizzle
echo "📦 SYNCING DB SCHEMA..."
npx drizzle-kit push

# 4. Asegurar extensiones de IA (Soberanía Técnica)
echo "🧠 ACTIVATING VECTOR CAPABILITIES..."
docker exec -it vault_db psql -U postgres -d prompt_vault -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo -e "\n${GREEN}===================================================="
echo -e "✅ VAULT STARTED"
echo -e "====================================================${NC}"
echo -e "${CYAN}🌐 APP:${NC} http://localhost:3080"
echo -e "${CYAN}📊 DB STUDIO:${NC}         http://localhost:4984"
echo -e "${CYAN}🐘 POSTGRES ACC:${NC}   localhost:5433"
echo -e "${GREEN}====================================================${NC}"

