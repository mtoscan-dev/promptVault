# Vault v1 Simplification — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove Forge, Persona, Governance, Logic, Activity, and Analytics features to ship a clean Vault-only app.

**Architecture:** The Vault is already self-contained with zero ForgeContext dependencies. We delete the Forge subtree, placeholder routes, and empty scaffolds. The root `/` renders the Vault directly. `forge-ai.ts` is renamed to `ai.ts` with Forge-only functions removed. Schema drops `personas` and `governance` tables. BunkerHUD shows only VAULT.

**Tech Stack:** Next.js 16, Drizzle ORM, PostgreSQL, TypeScript

---

### Task 1: Delete Forge components and infrastructure

**Files:**
- Delete: `src/components/forge/ForgeWorkspace.tsx`
- Delete: `src/components/forge/IngredientsPanel.tsx`
- Delete: `src/components/forge/AssemblyArea.tsx`
- Delete: `src/components/forge/LiveBlueprint.tsx`
- Delete: `src/components/forge/OutputStream.tsx`
- Delete: `src/contexts/ForgeContext.tsx`
- Delete: `src/types/forge.ts`
- Delete: `src/db/queries/forge.ts`

**Step 1: Delete all Forge files**

```bash
rm -rf src/components/forge/
rm src/contexts/ForgeContext.tsx
rm src/types/forge.ts
rm src/db/queries/forge.ts
```

**Step 2: Verify no remaining imports**

```bash
grep -r "ForgeContext\|ForgeWorkspace\|ForgeProvider\|useForge\|types/forge\|queries/forge" src/ --include="*.ts" --include="*.tsx"
```

Expected: Only hits in `src/app/[locale]/page.tsx` and `src/app/[locale]/(sectors)/forge/page.tsx` (deleted in Task 2).

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove Forge components and infrastructure"
```

---

### Task 2: Delete placeholder sector routes

**Files:**
- Delete: `src/app/[locale]/(sectors)/forge/page.tsx`
- Delete: `src/app/[locale]/(sectors)/logic/page.tsx`
- Delete: `src/app/[locale]/(sectors)/persona/page.tsx`
- Delete: `src/app/[locale]/(sectors)/governance/page.tsx`
- Delete: `src/app/[locale]/(sectors)/activity/page.tsx`
- Delete: `src/app/[locale]/(sectors)/analytics/page.tsx`

**Step 1: Delete all placeholder and forge sector routes**

```bash
rm -rf src/app/\[locale\]/\(sectors\)/forge/
rm -rf src/app/\[locale\]/\(sectors\)/logic/
rm -rf src/app/\[locale\]/\(sectors\)/persona/
rm -rf src/app/\[locale\]/\(sectors\)/governance/
rm -rf src/app/\[locale\]/\(sectors\)/activity/
rm -rf src/app/\[locale\]/\(sectors\)/analytics/
```

**Step 2: Verify only vault sector remains**

```bash
ls src/app/\[locale\]/\(sectors\)/
```

Expected: Only `vault/` directory.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove placeholder sector routes (forge, logic, persona, governance, activity, analytics)"
```

---

### Task 3: Delete empty scaffold components

**Files:**
- Delete: `src/components/governance/GovExplorer.tsx`
- Delete: `src/components/ui/PersonaCard.tsx`
- Delete: `src/components/ui/SkillCard.tsx`
- Delete: `src/components/ui/ResultLogCard.tsx`

**Step 1: Delete empty files**

```bash
rm -rf src/components/governance/
rm src/components/ui/PersonaCard.tsx
rm src/components/ui/SkillCard.tsx
rm src/components/ui/ResultLogCard.tsx
```

**Step 2: Verify no imports reference these files**

```bash
grep -r "GovExplorer\|PersonaCard\|SkillCard\|ResultLogCard" src/ --include="*.ts" --include="*.tsx"
```

Expected: No matches.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove empty scaffold components (GovExplorer, PersonaCard, SkillCard, ResultLogCard)"
```

---

### Task 4: Move Vault page to root route

**Files:**
- Modify: `src/app/[locale]/page.tsx` — replace ForgeWorkspace with Vault content
- Delete: `src/app/[locale]/(sectors)/vault/page.tsx` — content moves to root

**Step 1: Replace root page.tsx**

Replace the entire content of `src/app/[locale]/page.tsx` with:

```tsx
import VaultPage from "./(sectors)/vault/page";

export default function Home() {
  return <VaultPage />;
}
```

Wait — VaultPage is a `"use client"` component that exports `default function VaultPage()`. We can simply re-export it.

Actually, the simplest approach: keep the vault/page.tsx file and just have the root re-export it. But we said we'd render Vault at root. Let's keep vault/page.tsx as-is (it's a full client component) and have the root route import and render it.

Replace `src/app/[locale]/page.tsx` with:

```tsx
import VaultPage from "./(sectors)/vault/page";

export default function Home() {
  return <VaultPage />;
}
```

**Step 2: Verify the app compiles**

```bash
pnpm run build
```

Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: render Vault as root page"
```

---

### Task 5: Rename forge-ai.ts to ai.ts and remove Forge-only functions

**Files:**
- Rename: `src/app/actions/forge-ai.ts` → `src/app/actions/ai.ts`
- Modify: `src/app/actions/ai.ts` — remove `streamForgeResponse` function
- Modify: `src/components/PromptEditor.tsx` — update import path
- Modify: `src/components/TaxonomyManager.tsx` — update import path
- Modify: `src/components/SystemMonitor.tsx` — update import path

**Step 1: Rename the file**

```bash
git mv src/app/actions/forge-ai.ts src/app/actions/ai.ts
```

**Step 2: Remove `streamForgeResponse` function from `src/app/actions/ai.ts`**

Delete lines 17-40 (the entire `streamForgeResponse` function).

Also update the console.log on line 10 from `[ForgeAI]` to `[AI]` — and all other `[ForgeAI]` references throughout the file to `[AI]`.

**Step 3: Update import paths in consumers**

In `src/components/PromptEditor.tsx`, change:
```tsx
// FROM:
} from "@/app/actions/forge-ai";
// TO:
} from "@/app/actions/ai";
```

In `src/components/TaxonomyManager.tsx`, change:
```tsx
// FROM:
import { predictDimension } from "@/app/actions/forge-ai";
// TO:
import { predictDimension } from "@/app/actions/ai";
```

In `src/components/SystemMonitor.tsx`, change:
```tsx
// FROM:
import { getSystemStatus } from "@/app/actions/forge-ai";
// TO:
import { getSystemStatus } from "@/app/actions/ai";
```

**Step 4: Verify no remaining references to forge-ai**

```bash
grep -r "forge-ai" src/ --include="*.ts" --include="*.tsx"
```

Expected: No matches.

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: rename forge-ai.ts to ai.ts and remove streamForgeResponse"
```

---

### Task 6: Simplify BunkerHUD navigation

**Files:**
- Modify: `src/components/terminal/BunkerHUD.tsx`

**Step 1: Reduce SECTORS array to only VAULT**

Replace the SECTORS array (lines 8-36) with:

```tsx
const SECTORS = [
  {
    id: "01",
    name: "VAULT",
    path: "/vault",
    color: "var(--sector-vault, #22c55e)",
  },
];
```

Note: The root `/` page now renders Vault, but BunkerHUD uses `pathname.includes(sector.path)` for active detection. Since root `/` does not include `/vault`, we need to adjust the active check.

**Step 2: Update active detection to handle root path**

Change the `isActive` check to also match the root path:

```tsx
const isActive = pathname === "/" || pathname.includes(sector.path);
```

Since there's only one sector now, this is safe.

**Step 3: Commit**

```bash
git add src/components/terminal/BunkerHUD.tsx
git commit -m "refactor: simplify BunkerHUD to Vault-only navigation"
```

---

### Task 7: Clean database schema

**Files:**
- Modify: `src/db/schema.ts`

**Step 1: Remove Forge-specific tables and enums**

Delete from `src/db/schema.ts`:
- The `govTypeEnum` definition (lines 32-37)
- The `personas` table definition (lines 86-95)
- The `governance` table definition (lines 98-105)

Keep `promptTypeEnum` for now — it's used by the `prompts` table and the seed data. Removing it would require a larger refactor of the `type` field.

**Step 2: Verify schema is valid**

```bash
pnpm run db:generate
```

Expected: Generates a migration that drops `personas` and `governance` tables and the `gov_type` enum.

**Step 3: Commit**

```bash
git add src/db/schema.ts drizzle/
git commit -m "chore: remove personas and governance tables from schema"
```

---

### Task 8: Clean seed.ts

**Files:**
- Modify: `src/db/seed.ts`

**Step 1: Remove Forge-specific seed data**

Rewrite `src/db/seed.ts` to:
1. Remove the `personas` and `governance` imports from `./schema`
2. Remove the persona seed (lines 10-17)
3. Remove the governance seed (lines 113-119)
4. Remove the skill-type vault asset (the "React Optimizer" with `type: "skill"`, lines 55-71)
5. Keep only the `standard` type prompts

**Step 2: Verify seed compiles**

```bash
npx tsx src/db/seed.ts --help 2>&1 | head -5
```

Just check it parses without errors.

**Step 3: Commit**

```bash
git add src/db/seed.ts
git commit -m "chore: remove Forge seed data (personas, governance, skills)"
```

---

### Task 9: Build verification

**Step 1: Run lint**

```bash
pnpm run lint
```

Expected: No errors.

**Step 2: Run production build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

**Step 3: Final commit if any lint fixes were needed**

```bash
git add -A
git commit -m "fix: lint and build fixes after simplification"
```

---

### Task 10: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update project documentation**

Update CLAUDE.md to reflect the simplified architecture:
- Remove Forge, Persona, Governance references from the overview
- Update the directory structure (remove forge/, governance/ directories)
- Remove ForgeContext from Architecture section
- Update the Database Schema section (remove personas, governance tables)
- Remove `types/forge.ts` and `db/queries/forge.ts` from references
- Update BunkerHUD description (only VAULT sector)
- Simplify the Data Flow section
- Remove Forge-related gotchas

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md to reflect Vault-only architecture"
```
