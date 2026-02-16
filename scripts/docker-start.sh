#!/bin/bash
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🏔️  RESTARTING VAULT BUNKER...${NC}"

# 0. Cargar variables de entorno (para obtener DATABASE_URL_EXTERNAL)
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 0.5. Check Host Ollama Status (Host Mode)
echo "🔍 Checking Host Ollama status..."
if ! curl -s --head  --request GET http://host.docker.internal:11434/ | grep "200 OK" > /dev/null && ! curl -s --head  --request GET http://localhost:11434/ | grep "200 OK" > /dev/null; then
  echo -e "${AMBER}⚠️  HOST OLLAMA NOT DETECTED!${NC}"
  echo "   Please ensure Ollama is running on your Mac."
  echo "   Download: https://ollama.com"
  # Optional: Exit or continue with warning
  # exit 1
else
  echo -e "${GREEN}✅ Host Ollama detected.${NC}"
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

