# PromptVault v1 — Simplification Design

**Date**: 2026-02-28
**Branch**: feat/vault
**Goal**: Remove Forge, Persona, Governance, Logic features. Ship a clean Vault-only app.

## Context

PromptVault currently has two independent feature worlds:
1. **The Vault** — fully implemented prompt CRUD, versioning, tags, taxonomy, AI analysis, semantic search
2. **The Forge** — AI inference workspace with personas/skills/governance rules as context

Plus 5 placeholder routes (Logic, Persona, Governance, Activity, Analytics) and 4 empty component files.

The Forge and Vault are cleanly separated — ForgeContext has zero consumers outside the Forge subtree. This makes surgical removal safe.

## Decisions

| Decision | Choice |
|----------|--------|
| Root route `/` | Render Vault directly (move vault/page.tsx content to page.tsx) |
| Navigation (BunkerHUD) | Keep simplified — only VAULT sector |
| DB tables for Forge | Remove from schema (personas, governance, govTypeEnum) |
| SystemStats (fake RAM/TPS) | Keep — maintains terminal aesthetic |
| Approach | Full surgical removal (no feature flags) |

## Files to Delete

### Forge components
- `src/components/forge/ForgeWorkspace.tsx`
- `src/components/forge/IngredientsPanel.tsx`
- `src/components/forge/AssemblyArea.tsx`
- `src/components/forge/LiveBlueprint.tsx`
- `src/components/forge/OutputStream.tsx`

### Forge infrastructure
- `src/contexts/ForgeContext.tsx`
- `src/types/forge.ts`
- `src/db/queries/forge.ts`

### Sector route pages (placeholders + forge)
- `src/app/[locale]/(sectors)/forge/`
- `src/app/[locale]/(sectors)/logic/`
- `src/app/[locale]/(sectors)/persona/`
- `src/app/[locale]/(sectors)/governance/`
- `src/app/[locale]/(sectors)/activity/`
- `src/app/[locale]/(sectors)/analytics/`

### Empty scaffold components
- `src/components/governance/GovExplorer.tsx`
- `src/components/ui/PersonaCard.tsx`
- `src/components/ui/SkillCard.tsx`
- `src/components/ui/ResultLogCard.tsx`

### Forge seed data
- `src/db/seed.ts` (if only contains persona/governance seeds)

## Files to Modify

### `src/app/[locale]/page.tsx`
Replace ForgeWorkspace render with Vault page content (from vault/page.tsx).

### `src/app/actions/forge-ai.ts` → `src/app/actions/ai.ts`
Rename file. Remove Forge-only functions:
- `streamForgeResponse()`
- `getSystemStatus()` (if Forge-only)

Keep Vault functions:
- `generatePromptMetadata()`
- `analyzePromptEnhanced()`
- `optimizePromptEnhanced()`
- `suggestSmartTags()`
- `translatePromptFields()`
- `checkAIGateway()`
- `getTaxonomy()`
- `predictDimension()`

### `src/db/schema.ts`
- Remove `personas` table
- Remove `governance` table
- Remove `govTypeEnum` enum
- Consider removing `promptTypeEnum` (everything is "standard") or keep for future use
- Remove the `type` field from `prompts` table if removing enum

### `src/components/terminal/BunkerHUD.tsx`
Reduce SECTORS array to only VAULT.

### `src/components/terminal/BunkerHeader.tsx`
Verify no Forge imports; should be clean already.

### Update imports
Any file importing from deleted modules (forge-ai.ts path) needs import path updates.

## What Does NOT Change

- SettingsContext, SettingsModal, ThemeToggle, LocaleSwitcher
- PromptEditor, PromptCard, TagCloud, TerminalSearch
- TaxonomyManager, TaxonomyPicker, PromptEvaluationResults
- SystemMonitor, SystemStats, PromptToolbar
- All AI functions used by the Vault
- Docker Compose setup (except seed references)
- i18n messages (remove Forge-specific keys if any)
- BunkerHeader layout structure

## Migration

A Drizzle migration will be needed to:
1. Drop `personas` table
2. Drop `governance` table
3. Drop `gov_type` enum
4. Optionally drop `prompt_type` enum and `type` column from `prompts`

## Risk Assessment

**Low risk** — The Forge subtree is fully self-contained with no external consumers. The Vault has zero dependency on ForgeContext or Forge components. The only shared file (forge-ai.ts) has clearly separated functions.
