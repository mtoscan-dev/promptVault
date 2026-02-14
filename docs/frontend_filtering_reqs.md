# Frontend Requirements: Vault Domain Filtering & Metadata

## Overview

We have updated the backend to support **Domain-based Filtering** (e.g., `vault:standard`, `logic:claude`) and **Rich Metadata**. We need to update the `VaultPage` UI to expose these capabilities.

## 1. Domain Navigation (New Component)

Implement a tabbed interface or "Pill" selector above the search bar to switch between Vault Sectors.

### Sectors Mapping

| Label            | Domain Filter (Prefix) | Description       |
| :--------------- | :--------------------- | :---------------- |
| **All**          | `undefined` (or empty) | Show everything   |
| **[01] Vault**   | `vault:`               | Standard Prompts  |
| **[02] Logic**   | `logic:`               | Skills & Tools    |
| **[03] Persona** | `persona:`             | AI Identities     |
| **[05] Forge**   | `forge:`               | Complex workflows |

### Technical Implementation

- **State**: Add `selectedDomain` state to `VaultPage`.
- **Action**: Pass `selectedDomain` to `searchPrompts(query, selectedDomain)`.
- **Visuals**: Use the existing "Sector Colors" from `STYLING_CONSTANTS` (Vault=Green, Logic=Amber, Persona=Cyan).

## 2. Advanced Search & Filtering

Allow filtering by specific tools nested within domains (e.g., "Logic > Claude Code").

- **Idea**: If "Logic" is selected, show a secondary filter for specific tools (`claude`, `cursor`, `antigravity`) derived from `prompts.metadata.tool_compatibility`.

## 3. Metadata Display (Prompt Card)

Update `PromptCard` to visualize the new metadata fields if they exist.

### New Visual Elements

- **Complexity Badge**:
  - `basic`: Green dot
  - `intermediate`: Yellow dot
  - `advanced`: Red dot
- **Tool Compatibility Icons**:
  - Display icons for `claude`, `cursor`, `v0` if present in `metadata.tool_compatibility`.
- **Context Info**:
  - Show "4k" or "32k" badge if `metadata.context_window_required` is set.

## 4. Editor Updates (`PromptEditor`)

- **Metadata JSON Editor**: Allow advanced users (or specific personas) to edit the `metadata` JSON field directly or via specific inputs.
- **Domain Selector**: Dropdown to categorize the prompt into a specific domain when creating/editing.

## Deliverables

1. Updated `VaultPage` with Domain Tabs.
2. Updated `PromptCard` to show Metadata.
3. Updated `PromptEditor` to support saving Domain/Metadata.
