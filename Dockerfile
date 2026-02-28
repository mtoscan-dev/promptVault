# --- STAGE 1: Cimientos (Dependencias) ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Habilitar pnpm con versión fija para builds reproducibles
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

# Copiar solo lo necesario para instalar
COPY pnpm-lock.yaml package.json ./

# Ignoramos scripts para que Next.js no busque la carpeta /src todavía
RUN pnpm install --frozen-lockfile --ignore-scripts

# --- STAGE 2: La Forja (Construcción) ---
FROM node:20-alpine AS builder
WORKDIR /app

# Traemos las dependencias del stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiamos todo el código fuente (incluyendo /src)
COPY . .

# Desactivar telemetría
ENV NEXT_TELEMETRY_DISABLED=1

# Construir en modo standalone
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
RUN pnpm build

# --- STAGE 3: Operación (Runtime Minimalista) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar el output standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start_period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
