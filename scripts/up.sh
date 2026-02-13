#!/bin/bash

echo "🚀 Iniciando el Búnker PromptVault en la Patagonia..."

# 1. Levantar contenedores y limpiar huérfanos
docker compose up -d --remove-orphans

# 2. Esperar a que la DB esté lista
echo "⏳ Esperando a que PostgreSQL despierte..."
until docker exec vault_db pg_isready -U postgres; do
  sleep 2
done

# 3. Sincronizar esquema de Drizzle
echo "📦 Sincronizando esquema de base de datos..."
npx drizzle-kit push

# 4. Asegurar extensiones de IA (Soberanía Técnica)
echo "🧠 Activando capacidades vectoriales..."
docker exec -it vault_db psql -U postgres -d prompt_vault -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo "✅ Búnker operativo en http://localhost:3000"