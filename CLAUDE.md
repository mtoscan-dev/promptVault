# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PromptVault** is a Next.js 16 (React 19) web application for managing and versioning AI prompts with a terminal-inspired UI. Features: version control, AI-powered smart tagging (via Ollama), bilingual support (es/en), prompt analysis/evaluation, pgvector semantic search, and Docker-based local AI infrastructure.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + pgvector (via Drizzle ORM)
- **AI**: Ollama (local LLM) + AI SDK (`@ai-sdk/openai`)
- **i18n**: next-intl (es/en locales)
- **Styling**: Tailwind CSS 4 + PostCSS + Framer Motion
- **UI Components**: Lucide React Icons
- **Utilities**: date-fns, uuid, clsx, tailwind-merge, zod
- **Package Manager**: pnpm
- **Deployment**: Docker Compose (app + PostgreSQL + Nginx + Drizzle Studio)

## Architecture

Two React contexts: `ForgeContext` (persona/skill/rule selection + LLM inference) and `SettingsContext` (app preferences). Server Actions + Drizzle ORM for persistence. UI orchestrated from `src/components/forge/ForgeWorkspace.tsx`, rendered within `src/app/[locale]/page.tsx`.

### Directory Structure

```
src/
├── app/
│   ├── [locale]/page.tsx      # Entry point (server-side data fetch)
│   ├── actions/               # Server actions (forge-ai.ts, taxonomy.ts)
│   └── api/chat/              # Chat API route
├── components/
│   ├── forge/                 # Core workspace (ForgeWorkspace, AssemblyArea, IngredientsPanel, OutputStream, CompilerLab, LiveBlueprint)
│   ├── terminal/              # Terminal UI (BunkerHUD, BunkerHeader, QuickTerminal, SystemStats)
│   ├── governance/            # Rule management (GovExplorer)
│   ├── ui/                    # Reusable cards (PersonaCard, ResultLogCard, SkillCard)
│   ├── PromptEditor.tsx       # Create/edit modal with translation + AI analysis
│   ├── TerminalSearch.tsx     # Tag autocomplete (space=select, backspace=remove, enter=confirm)
│   ├── TaxonomyManager.tsx    # Smart tagging taxonomy CRUD
│   ├── SystemMonitor.tsx      # CPU, Ollama connectivity, model memory
│   ├── SettingsModal.tsx      # App settings (language, theme, developer mode)
│   └── ...                    # TagCloud, TagBadge, PromptCard, ThemeToggle, LocaleSwitcher, etc.
├── contexts/                  # ForgeContext (persona/skill/rule + inference), SettingsContext (preferences)
├── db/
│   ├── schema.ts              # Drizzle schema (prompts, tags, tagDimensions, personas, governance, settings, promptTags)
│   ├── queries/forge.ts       # Database query functions
│   └── seed.ts, seed-tags.ts  # Seed scripts
├── hooks/                     # use-ollama-stream, useProcessSimulator
├── i18n/                      # next-intl config (routing.ts, request.ts)
├── lib/
│   ├── actions/               # vault.ts, settings.ts, log-activity.ts
│   ├── compiler.ts            # Prompt compilation logic
│   └── vectorize.ts           # pgvector embedding generation
├── types/
│   ├── index.ts               # Prompt, PromptVersion, Tag, SmartTag, TagDimension, Taxonomy, AnalysisResult
│   └── forge.ts               # ForgePersona, ForgeSkill, ForgeRule, ForgeInferenceMetrics
└── utils/                     # classification.ts, styling.ts, cn.ts, languageDetection.ts
```

### Database Schema (PostgreSQL + pgvector)

Key tables: `prompts` (bilingual titles/descriptions, content, versions JSONB, 768-dim embedding vector), `tags` + `tag_dimensions` (multi-dimensional taxonomy), `prompt_tags` (M2M), `personas`, `governance`, `settings` (singleton id=1).

All text fields are bilingual (`*_es`, `*_en`). The `tags` array on prompts is a read cache; canonical tag relationships live in `prompt_tags`.

### Data Flow

1. **Initialization**: Server-side fetch via Drizzle queries in page.tsx
2. **State**: ForgeContext manages persona/skill/rule selection and LLM inference; SettingsContext handles app preferences
3. **Filtering**: AND logic for tags + case-insensitive text search on title/description/content
4. **Save**: Creates new version entry in JSONB array, auto-tags via AI (Ollama) or keyword fallback
5. **Smart Tagging**: Ollama classifies prompts against the taxonomy (tag_dimensions + tags)
6. **Analysis**: AI-powered prompt evaluation with scoring rubric (structure, context, quality, viability)

## Commands

```bash
pnpm install                  # Install dependencies
pnpm run dev                  # Dev server (http://localhost:3000)
pnpm build                    # Production build
pnpm start                    # Production server
pnpm run lint                 # TypeScript + ESLint

# Database (Drizzle)
pnpm run db:generate          # Generate migrations from schema
pnpm run db:migrate           # Run migrations
pnpm run db:push              # Push schema directly (dev)
pnpm run db:studio            # Drizzle Studio UI (port 4984)
pnpm run db:seed              # Seed database

# Docker (services: db, app, studio, nginx)
docker compose up -d          # Start all services
docker compose down           # Stop all services
pnpm run build:standalone     # Build standalone output for Docker
pnpm run clean:install        # Nuclear reinstall (rm node_modules + lockfile)
```

## Environment Setup

Required env vars (see `.env.example`):

| Variable                     | Docker value                                       | Local dev value                                           |
| ---------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `DATABASE_URL`               | `postgresql://admin:secret@db:5432/promptvault_db` | `postgresql://admin:secret@localhost:5433/promptvault_db` |
| `OLLAMA_HOST`                | `http://ollama:11434`                              | `http://localhost:11434`                                  |
| `DEFAULT_MODEL`              | `qwen2.5:1.5b`                                     | `qwen2.5:3b`                                              |
| `ANALYSIS_MODEL`             | `qwen2.5:7b`                                       | `qwen2.5:7b`                                              |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `es`                                               | `es`                                                      |

Docker uses internal service names (`db`) for networking. Ollama runs on the **host machine** (not containerized) — app reaches it via `host.docker.internal`. External ports: app=3080, db=5433, studio=4984, nginx=80.

## Key Patterns

- **Bilingual everywhere**: All user-facing text has `*Es`/`*En` variants in DB and types
- **Immutable versions**: New version created on save, old versions preserved in JSONB array
- **Smart tagging**: Multi-dimensional taxonomy (tag_dimensions -> tags -> prompt_tags) with AI classification
- **Ollama via OpenAI compat**: AI SDK connects to Ollama's `/v1` endpoint using `@ai-sdk/openai` provider with `apiKey: "ollama"`
- **Type safety**: Strict TypeScript; types in `src/types/index.ts` + `src/types/forge.ts`
- **Path alias**: `@/*` maps to `src/*`
- **Client components**: Most components use `'use client'` directive
- **Terminal aesthetic**: Monospace font, green accent (`green-400`, `green-600`), fixed header/footer layout

## Gotchas

- DB host is `db` inside Docker but `localhost:5433` when running Next.js outside Docker
- The `tags` text array on the `prompts` table is a **read cache** — the source of truth is the `prompt_tags` join table
- pgvector embeddings are 768-dim (sized for nomic-embed-text / Qwen models)
- Settings table is a singleton (always `id=1`)
- The `versions` field on prompts is JSONB (not a separate table)
- Ollama is **not containerized** — runs on host for GPU access; Docker app uses `extra_hosts: host.docker.internal` to reach it
- `next.config.ts` wraps config with `withNextIntl()` and sets `serverExternalPackages: ["drizzle-orm"]`
- i18n middleware matches `["/", "/(es|en)/:path*"]`; default locale is `es`; messages live in `messages/es.json` and `messages/en.json`
- `APP_DOCKERFILE` env var switches between `Dockerfile.dev` (hot reload) and `Dockerfile` (standalone production)
