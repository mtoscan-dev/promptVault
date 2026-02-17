# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PromptVault** is a Next.js 16 (React 19) web application that serves as a personal repository for managing and versioning prompts with a terminal-inspired user interface. Key features include version control for every prompt save, automatic AI-powered tag classification, local storage persistence, and a terminal-style search interface.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + PostCSS
- **UI Components**: Lucide React Icons
- **Utilities**: date-fns, uuid, clsx, tailwind-merge
- **Package Manager**: pnpm
- **Deployment**: Docker + Nginx (standalone output)

## Architecture

The application uses a **centralized state management pattern** combined with **Server Actions** and **Drizzle ORM** for persistence. The UI is orchestrated from `src/components/forge/ForgeWorkspace.tsx` and its descendants, which are rendered within the localized route `src/app/[locale]/page.tsx`.

### Core Data Model

```
Prompt
├── id: string (UUID)
├── title, description: string
├── tags: string[] (auto-generated via classifyPrompt)
├── versions: PromptVersion[]
│   ├── id: string (UUID)
│   ├── content: string
│   ├── createdAt: Date
│   └── versionNumber: number
├── currentVersionId: string (pointer to active version)
├── createdAt, updatedAt: Date
```

### Component Structure

- **`src/app/[locale]/page.tsx`**: Entry point for the Forge workspace. Fetches initial data via server-side queries.
- **`ForgeWorkspace.tsx`**: Main orchestration component for the Forge environment.
- **`IngredientsPanel.tsx`**, **`AssemblyArea.tsx`**, **`OutputStream.tsx`**: Core modular components of the Forge interface.
- **`TerminalSearch.tsx`**: Terminal-style search input with tag autocomplete. Uses space to select tags, backspace to remove, and enter to confirm.
- **`PromptCard.tsx`**: Individual prompt display showing title, description, tags, and version count. Includes delete and edit triggers.
- **`PromptEditor.tsx`**: Modal for creating/editing prompts with title, description, content fields and version history dropdown. Supports multi-language translation and AI analysis.
- **`TerminalSearch.tsx`**: Terminal-style search input with tag autocomplete. Uses space to select tags, backspace to remove, and enter to confirm.
- **`PromptCard.tsx`**: Individual prompt display showing title, description, tags, and version count. Includes delete and edit triggers.
- **`PromptEditor.tsx`**: Modal for creating/editing prompts with title, description, content fields and version history dropdown.
- **`TagCloud.tsx`**: Interactive tag display showing all tags with counts and colors. Clicking toggles tag filter.
- **`TagBadge.tsx`**: Small reusable component for displaying individual tags.

### Utility Functions

- **`classification.ts`**: `classifyPrompt()` - keyword-based auto-tagging for 10 categories (coding, writing, analysis, creative, translation, summary, debugging, education, api, frontend). Returns `['general']` if no matches.
- **`styling.ts`**: `TAG_COLORS` object mapping tag names to Tailwind color classes with a default fallback.
- **`cn.ts`**: Utility for merging class names (clsx + tailwind-merge integration).

### Data Flow

1. **Initialization**: `initialPrompts` from `src/data/mock.ts` loaded into state
2. **Tag Derivation**: Tags computed from all prompts via useEffect, sorted by count
3. **Filtering**: Prompts filtered by selected tags (all match required) and search query (title/description/content)
4. **Save Operation**: Creates new `PromptVersion` with UUID and incremented version number, auto-tags via `classifyPrompt()`, updates `currentVersionId`
5. **Version Switching**: Updates `currentVersionId` pointer without modifying version history

All data is persisted in a **PostgreSQL database** via **Drizzle ORM**. Server actions in `src/app/actions/` handle data mutations and AI-powered operations (translations, suggestions, analysis).

## Commands

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm run dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run TypeScript linter
pnpm run lint
```

## Key Patterns

- **React Hooks**: Extensive use of `useState`, `useEffect`, `useCallback` for state and side effects
- **Conditional Rendering**: Tag filters combined with search query (AND logic for tags, text search on current version content)
- **UUID Generation**: Every prompt and version gets a UUID via `uuid.v4()` for unique identification
- **Date Tracking**: Timestamps on both prompts and versions for history
- **Type Safety**: Full TypeScript with strict mode enabled; all major types defined in `src/types/index.ts`

## Important Implementation Details

- Versions are **immutable** - new version created on save, old versions preserved
- Current version pointed to by `currentVersionId` to allow switching without duplication
- Tag classification runs on `content + title + description` concatenated for broader matching
- Modal state (`isEditorOpen`, `isNewPrompt`, `selectedPrompt`) manages editor visibility separately
- Search filters by text (case-insensitive on title/description/content) AND selected tags
- No persistence layer implemented yet - use localStorage or a backend API for production

## Development Notes

- TypeScript is configured with path alias `@/*` pointing to `src/*` for clean imports
- All components use `'use client'` directive for Client Component rendering
- Styling is utility-first Tailwind with a monospace font for terminal aesthetic
- The app follows a fixed header, scrollable main content, fixed footer layout
- Green color (`green-400`, `green-600`) used as primary accent color throughout
