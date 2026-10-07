#!/bin/bash

# --- BÚNKER PROMPTVAULT: PROTOCOLO DE INICIALIZACIÓN ---
echo "🏔️  Iniciando despliegue de estructura en la Patagonia..."

# 1. Crear Estructura de Directorios Críticos (Relativo a src/)
echo "📁 Creando directorios del sistema..."
mkdir -p src/components/ui
mkdir -p src/components/forge
mkdir -p src/components/terminal
mkdir -p src/components/governance
mkdir -p "src/app/[locale]/(sectors)/vault"
mkdir -p "src/app/[locale]/(sectors)/logic"
mkdir -p "src/app/[locale]/(sectors)/persona"
mkdir -p "src/app/[locale]/(sectors)/governance"
mkdir -p src/app/[locale]/forge
mkdir -p src/app/[locale]/activity
mkdir -p src/app/[locale]/analytics
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/db
mkdir -p init-db
mkdir -p public/icons

# 2. Crear Stubs de Componentes (Archivos Base)
echo "📄 Generando stubs de UI para Antigravity..."

# UI Components
touch src/components/ui/SkillCard.tsx
touch src/components/ui/PersonaCard.tsx
touch src/components/ui/ResultLogCard.tsx

# Sector Specific
touch src/components/governance/GovExplorer.tsx
touch src/components/forge/CompilerLab.tsx
touch src/components/forge/LiveBlueprint.tsx
touch src/components/terminal/QuickTerminal.tsx

# Hooks & Libs
touch src/lib/compiler.ts

# 3. Verificación de Dependencias Esenciales
echo "🔍 Verificando herramientas de soberanía..."

if command -v pnpm &> /dev/null; then
    echo "✅ pnpm detectado: Gestión de paquetes optimizada."
else
    echo "⚠️  pnpm no detectado. Se recomienda instalar para ahorrar RAM."
fi

if [ -f "pnpm-lock.yaml" ]; then
    echo "✅ Lockfile detectado."
else
    echo "📝 Generando lockfile inicial..."
    pnpm install
fi

# 4. Finalización
echo "------------------------------------------------"
echo "✅ ESTRUCTURA DESPLEGADA CON ÉXITO"
echo "📍 Ubicación: General Roca, Río Negro"
echo "🚀 El búnker está listo para que Antigravity tome el control."
echo "------------------------------------------------"