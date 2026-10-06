#!/bin/bash
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🏔️  RESTARTING VAULT BUNKER...${NC}"

# 0. Cargar variables de entorno (para obtener DATABASE_URL_EXTERNAL)
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 0.5. Check freeLLMAPI Status
echo "🔍 Checking freeLLMAPI status..."
if curl -s --head --request GET http://127.0.0.1:3001/v1/models > /dev/null 2>&1; then
  echo -e "${GREEN}✅ freeLLMAPI detected at http://127.0.0.1:3001${NC}"
else
  echo -e "${AMBER}⚠️  freeLLMAPI not responding at http://127.0.0.1:3001${NC}"
  echo "   Ensure the freeLLMAPI container is running: docker ps | grep freellmapi"
  echo "   Start with: docker compose up -d freellmapi (or run freellmapi manually)"
fi

# 1. Levantar contenedores y limpiar huérfanos
docker compose down --remove-orphans
docker compose up -d --build

# 2. Esperar a que la DB esté lista
echo "⏳ WAITING FOR DB TO BE READY..."
until docker exec vault_db pg_isready -U ${DB_USER:-admin}; do
  sleep 2
done

# 3. Sincronizar esquema de Drizzle
echo "📦 SYNCING DB SCHEMA..."
# Usamos la URL externa porque este comando corre en el host (tu Mac), no en Docker
DATABASE_URL=$DATABASE_URL_EXTERNAL npx drizzle-kit push


# 4. Asegurar extensiones de IA (Soberanía Técnica)
echo "🧠 ACTIVATING VECTOR CAPABILITIES..."
docker exec -it vault_db psql -U ${DB_USER:-admin} -d ${DB_NAME:-promptvault_db} -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo -e "\n${GREEN}===================================================="
echo -e "✅ VAULT STARTED"
echo -e "====================================================${NC}"
echo -e "${CYAN}🌐 APP:${NC} http://localhost:3080"
echo -e "${CYAN}📊 DB STUDIO:${NC}         http://localhost:4984"
echo -e "${CYAN}🐘 POSTGRES ACC:${NC}   localhost:5433"
echo -e "${GREEN}====================================================${NC}"

