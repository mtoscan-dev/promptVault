#!/bin/bash

# --- CONFIGURACIÓN DE COLORES ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
AMBER='\033[0;33m'
NC='\033[0m'

echo -e "${CYAN}🏔️  INICIANDO ROTACIÓN DE SECRETOS: ${PATAGONIA_NODE_ID}${NC}"

# 1. GENERAR NUEVOS HASHES
# Usamos OpenSSL para máxima seguridad criptográfica
NEW_DB_PASSWORD=$(openssl rand -hex 24)
NEW_APP_SECRET=$(openssl rand -hex 32)

echo -e "${AMBER}🎲 Generando nuevas claves maestras...${NC}"

# 2. ACTUALIZAR ARCHIVO .ENV
# Creamos un backup preventivo antes de modificar
cp .env .env.bak

# Reemplazamos las variables viejas por las nuevas
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=\"$NEW_DB_PASSWORD\"/" .env
sed -i "s/^APP_SECRET=.*/APP_SECRET=\"$NEW_APP_SECRET\"/" .env

echo -e "${GREEN}✅ Archivo .env actualizado y respaldado (.env.bak)${NC}"

# 3. APLICAR CAMBIOS EN DOCKER
# Solo reiniciamos los servicios que dependen de estas claves para no saturar los 8GB de RAM
echo -e "${AMBER}🔄 Aplicando cambios a la infraestructura...${NC}"
docker compose up -d --no-deps db app

echo -e "\n${GREEN}===================================================="
echo -e "🔐 SECRETOS ROTADOS Y NODO ASEGURADO"
echo -e "====================================================${NC}"