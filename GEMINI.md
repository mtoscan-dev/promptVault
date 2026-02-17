# GEMINI Project Context: PromptVault

## 1. Project Overview

This is a **Next.js 16 (React 19) web application** called **PromptVault**. It acts as a personal repository for managing and versioning prompts, featuring a terminal-inspired user interface.

- **Purpose**: To provide a local tool for creating, editing, versioning, and searching a personal collection of prompts.
- **Key Technologies**:
  - **Frontend**: Next.js (React 19), TypeScript
  - **Styling**: Tailwind CSS 4, PostCSS, Lucide React Icons
  - **Data**: Data is persisted in a **Postgres database** managed via **Drizzle ORM**. Global state for the Forge workspace is handled through the `ForgeProvider` context.
- **Architecture**:
  - The application is built using Next.js **App Router** with internationalization support via `src/app/[locale]`.
  - The main workspace is orchestrated in `src/components/forge/ForgeWorkspace.tsx`.
  - Reusable UI elements are organized by feature, with core Forge components in `src/components/forge/` and shared elements like `PromptCard`, `PromptEditor`, and `TerminalSearch` in `src/components/`.
  - Utility functions for classification (`classifyPrompt`) and styling (`cn`) exist in `src/utils`.
  - Type definitions are centralized in `src/types/index.ts`.
- **Deployment**: The project is configured for containerized deployment using Docker and Nginx, as indicated by the `Dockerfile`, `nginx.conf`, and `output: "standalone"` setting in `next.config.ts`.

## 2. Building and Running the Project

The project uses `pnpm` as the package manager. Key commands are defined in `package.json`.

- **To install dependencies:**

  ```bash
  pnpm install
  ```

- **To run the development server:**

  ```bash
  pnpm run dev
  ```

  The application will be available at `http://localhost:3000`.

- **To build the project for production:**

  ```bash
  pnpm run build
  ```

- **To start the production server:**

  ```bash
  pnpm run start
  ```

- **To lint the code:**
  ```bash
  pnpm run lint
  ```

## 3. Development Conventions

- **Package Manager**: The project uses `pnpm`, as indicated by the `pnpm-lock.yaml` file. Please use `pnpm` for managing dependencies.
- **Coding Style**: The code is written in TypeScript with a functional approach using React Hooks. The file structure is organized by feature/domain (`components`, `hooks`, `types`, `utils`).
- **Styling**: Utility-first CSS is implemented with Tailwind CSS. The `clsx` and `tailwind-merge` libraries are used for conditional and clean class name composition.
- **Component Logic**: Business logic and state management are orchestrated via a React Context (`ForgeProvider`) and Server Actions for data synchronization. Shared UI components receive state and handlers via props or context hooks.
- **Features**:
  - **Prompt Versioning**: Every save action creates a new version of a prompt, preserving its history.
  - **Auto-Tagging**: Prompts are automatically tagged using a classification utility (`src/utils/classification.ts`).
  - **Terminal UI**: The search and interaction model is designed to mimic a command-line interface.
