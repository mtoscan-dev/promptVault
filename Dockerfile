# --- STAGE 1: Cimientos (Dependencias) ---
  FROM node:20-alpine AS deps
  RUN apk add --no-cache libc6-compat
  WORKDIR /app
  
  # Habilitar pnpm de forma soberana
  RUN corepack enable && corepack prepare pnpm@latest --activate
  
  # Copiar solo lo necesario para instalar
  COPY pnpm-lock.yaml package.json ./
  
  # EL TRUCO: Ignoramos scripts para que Next.js no busque la carpeta /src todavía
  RUN pnpm install --frozen-lockfile --ignore-scripts
  
  # --- STAGE 2: La Forja (Construcción) ---
  FROM node:20-alpine AS builder
  WORKDIR /app
  
  # Traemos las dependencias del stage anterior
  COPY --from=deps /app/node_modules ./node_modules
  
  # AHORA SÍ: Copiamos todo el código fuente (incluyendo tu carpeta /src)
  COPY . .
  
  # Desactivar telemetría para privacidad total en la Patagonia
  ENV NEXT_TELEMETRY_DISABLED 1
  
  # Construir el búnker en modo standalone
  RUN corepack enable && corepack prepare pnpm@latest --activate
  RUN pnpm build
  
  # --- STAGE 3: Operación (Runtime Minimalista) ---
  FROM node:20-alpine AS runner
  WORKDIR /app
  
  ENV NODE_ENV production
  ENV NEXT_TELEMETRY_DISABLED 1
  
  RUN addgroup --system --gid 1001 nodejs
  RUN adduser --system --uid 1001 nextjs
  
  # Copiar el output standalone
  # Nota: Next.js detectará automáticamente que usas /src y lo incluirá aquí
  COPY --from=builder /app/public ./public
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
  
  USER nextjs
  
  EXPOSE 3000
  ENV PORT 3000
  ENV HOSTNAME "0.0.0.0"
  
  CMD ["node", "server.js"]