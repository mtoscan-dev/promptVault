# --- STAGE 1: Cimientos (Dependencias) ---
  FROM node:20-alpine AS deps
  RUN apk add --no-cache libc6-compat
  WORKDIR /app
  
  # Instalar pnpm de forma soberana
  RUN corepack enable && corepack prepare pnpm@latest --activate
  
  # Copiar archivos de manifiesto
  COPY pnpm-lock.yaml package.json ./
  # Instalación limpia para producción
  RUN pnpm install --frozen-lockfile
  
  # --- STAGE 2: La Forja (Construcción) ---
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  
  # Desactivar telemetría de Next.js (Privacidad absoluta)
  ENV NEXT_TELEMETRY_DISABLED 1
  
  # Construir el búnker en modo standalone
  RUN corepack enable && corepack prepare pnpm@latest --activate
  RUN pnpm build
  
  # --- STAGE 3: Operación (Runtime Minimalista) ---
  FROM node:20-alpine AS runner
  WORKDIR /app
  
  ENV NODE_ENV production
  ENV NEXT_TELEMETRY_DISABLED 1
  
  # Crear usuario de sistema no-root por seguridad
  RUN addgroup --system --gid 1001 nodejs
  RUN adduser --system --uid 1001 nextjs
  
  # Copiar solo lo esencial del output standalone
  COPY --from=builder /app/public ./public
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
  
  USER nextjs
  
  EXPOSE 3000
  ENV PORT 3000
  # El host debe ser 0.0.0.0 para que Docker lo mapee correctamente
  ENV HOSTNAME "0.0.0.0"
  
  CMD ["node", "server.js"]