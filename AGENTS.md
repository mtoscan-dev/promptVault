# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

**PromptVault** is a Next.js 16 (React 19) web application for managing and versioning AI prompts with a terminal-inspired UI. Features: version control, AI-powered smart tagging (via freeLLMAPI), bilingual support (es/en), prompt analysis/evaluation, pgvector semantic search, and Docker-based local AI infrastructure.

## Architecture

One React context: `SettingsContext` (app preferences). Server Actions + Drizzle ORM for persistence. The root `src/app/[locale]/page.tsx` renders the Vault page directly.

### Database Schema (PostgreSQL + pgvector)

Key tables: `prompts` (bilingual titles/descriptions, content, versions JSONB, 768-dim embedding vector), `tags` + `tag_dimensions` (multi-dimensional taxonomy), `prompt_tags` (M2M), `settings` (singleton id=1).

All text fields are bilingual (`*_es`, `*_en`).

### Data Flow

1. **Initialization**: Root page renders VaultPage client component which fetches data via server actions
2. **State**: SettingsContext handles app preferences
3. **Filtering**: AND logic for tags + case-insensitive text search on title/description/content
4. **Save**: Creates new version entry in JSONB array, auto-tags via AI (freeLLMAPI) or keyword fallback
5. **Smart Tagging**: The LLM classifies prompts against the taxonomy (tag_dimensions + tags)
6. **Analysis**: AI-powered prompt evaluation with scoring rubric (structure, context, quality, viability)

## Environment Setup

Required env vars: see `.env.example` (each variable is commented with its Docker vs. local-dev value).

## Key Patterns

- **Bilingual everywhere**: All user-facing text has `*Es`/`*En` variants in DB and types
- **Immutable versions**: New version created on save, old versions preserved in JSONB array
- **Smart tagging**: Multi-dimensional taxonomy (tag_dimensions -> tags -> prompt_tags) with AI classification
- **freeLLMAPI via OpenAI compat**: AI SDK connects directly to freeLLMAPI's `/v1` endpoint using `@ai-sdk/openai`'s `.chat()` method (Chat Completions — see Gotchas for why not the default Responses API)
- **Type safety**: Strict TypeScript; types in `src/types/index.ts`
- **Path alias**: `@/*` maps to `src/*`
- **Client components**: Most components use `'use client'` directive
- **Terminal aesthetic**: Monospace font, green accent (`green-400`, `green-600`), fixed header/footer layout

## Gotchas

- DB host is `db` inside Docker but `localhost:5433` when running Next.js outside Docker
- The `tags` text array on the `prompts` table is a **read cache** — the source of truth is the `prompt_tags` join table
- pgvector embeddings are 768-dim; `src/lib/vectorize.ts` pins the embedding model (`nomic-embed-text`) instead of using `DEFAULT_MODEL` — a changing model/dimension would break existing vectors. Re-run `pnpm run db:backfill-embeddings` if the pinned model ever changes. The exact id must match what freeLLMAPI reports at `GET /v1/models`.
- Settings table is a singleton (always `id=1`)
- The `versions` field on prompts is JSONB (not a separate table)
- freeLLMAPI runs as a Docker container with OpenAI-compatible API. Docker app uses `host.docker.internal` to reach the host; scripts run directly on the host (`pnpm run db:backfill-embeddings`, `pnpm run dev` outside Docker) need `http://127.0.0.1:3001/v1`.
- Use `127.0.0.1`, not `localhost`, for the host-side `LLM_BASE_URL`: on this machine `localhost` resolves to `::1` (IPv6) first, and freeLLMAPI's server doesn't accept IPv6 connections. `curl` masks this (it silently falls back to IPv4), but Node's `fetch` (used by the AI SDK) does not — it fails outright with `ECONNREFUSED ::1:3001`.
- freeLLMAPI requires a valid API key generated from the dashboard (http://localhost:3001). Set `LLM_API_KEY` in `.env` after creating your account and API key.
- There is no `db:seed` script anymore — `seed.ts` (example prompts) was removed. `pnpm run db:seed-tags` seeds the minimum needed for the app to function: the tag taxonomy (dimensions + tags). Prompts start empty.
- If freeLLMAPI hasn't loaded a model yet, the *first* request after a cold start can be slow or time out — not a bug, just retry.
- `@ai-sdk/openai`'s bare `provider(modelId)` defaults to the Responses API (`/v1/responses`). freeLLMAPI accepts those requests but doesn't honor structured output there — `generateObject` calls come back with unparseable prose instead of JSON. Always call `llmProvider.chat(modelId)` (Chat Completions) in `src/app/actions/ai.ts`.
- `next.config.ts` wraps config with `withNextIntl()` and sets `serverExternalPackages: ["drizzle-orm"]`
- i18n middleware matches `["/", "/(es|en)/:path*"]`; default locale is `es`; messages live in `messages/es.json` and `messages/en.json`
- `APP_DOCKERFILE` env var switches between `Dockerfile.dev` (hot reload) and `Dockerfile` (standalone production)
