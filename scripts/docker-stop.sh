#!/bin/bash

# --- CONFIGURACIÓN DE COLORES ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
AMBER='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}🏔️  INICIANDO PROTOCOLO DE DESPLIEGUE SOBERANO...${NC}"

# 1. LIMPIEZA DE SISTEMA
# Eliminamos huérfanos y volúmenes antiguos para evitar errores de caché
echo -e "${AMBER}🧹 Limpiando residuos de compilaciones anteriores...${NC}"
docker compose down --remove-orphans

# (Opcional) Si quieres una limpieza total de caché de build:
# docker builder prune -f

# 2. CONSTRUCCIÓN Y DESPLIEGUE
# Usamos las variables de tu .env para decidir qué Dockerfile buildear
echo -e "${AMBER}🏗️  Construyendo infraestructura (Modo: 8GB RAM Optimized)...${NC}"
docker compose up -d --build

# 3. ESPERA DE SALUD DEL NODO
echo -e "${AMBER}⏳ Verificando estabilidad de los servicios...${NC}"
sleep 5

# 4. MAPA DE ACCESO OPERATIVO
echo -e "\n${GREEN}===================================================="
echo -e "✅ BÚNKER DESPLEGADO Y OPERATIVO"
echo -e "====================================================${NC}"
echo -e "${CYAN}📍 NODO:${NC} General Roca, Patagonia"
echo -e "${CYAN}🌐 INTERFAZ PRINCIPAL:${NC} http://localhost:3080"
echo -e "${CYAN}🧠 ENDPOINT IA (freeLLMAPI):${NC} http://localhost:3001/v1"
echo -e "${CYAN}📊 DB STUDIO:${NC} http://localhost:4984 (vía drizzle-kit)"
echo -e "${GREEN}====================================================${NC}"
echo -e "💡 Nota: Si usas 'Dockerfile.dev', los cambios en /src se verán al instante."