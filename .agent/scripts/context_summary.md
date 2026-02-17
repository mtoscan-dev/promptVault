# Project Context Summary
Generated on: Sat Feb 14 18:16:51 -03 2026

## Directory Structure
```
.
|____pnpm-lock.yaml
|____WORKFLOWS.md
|____docker-compose.yaml
|____ENVIRONMENT.md
|____seed_output.txt
|____messages
| |____en.json
| |____es.json
|____init-db
| |____01_extensions.sql
|____postcss.config.mjs
|____Dockerfile
|____ollama_data
| |____id_ed25519
| |____id_ed25519.pub
| |____models
| | |____blobs
| | |____manifests
|____node_modules
| |____zod
| |____@types
| | |____react-dom
| | |____node
| | |____uuid
| | |____react
| |____ollama-ai-provider
| |____drizzle-kit
| |____next
| |____tailwind-merge
| |____@ai-sdk
| | |____openai
| |____@tailwindcss
| | |____postcss
| |____typescript
| |____date-fns
| |____postcss
| |____lucide-react
| |____react-dom
| |____clsx
| |____postgres
| |____drizzle-orm
| |____ai
| |____ollama
| |____tailwindcss
| |____next-intl
| |____uuid
| |____framer-motion
| |____react
|____docs
| |____tasks.md
| |____05-forge-idea.md
|____next-env.d.ts
|____README.md
|____Dockerfile.dev
|____public
| |____icons
|____postgres_data
| |____pg_multixact
| | |____members
| | |____offsets
| |____pg_wal
| | |____archive_status
| | |____000000010000000000000001
| |____pg_snapshots
| |____pg_commit_ts
| |____pg_stat
| |____PG_VERSION
| |____pg_stat_tmp
| |____pg_hba.conf
| |____postmaster.pid
| |____pg_logical
| | |____snapshots
| | |____replorigin_checkpoint
| | |____mappings
| |____pg_notify
| |____pg_subtrans
| | |____0000
| |____pg_serial
| |____pg_replslot
| |____postgresql.conf
| |____pg_tblspc
| |____postgresql.auto.conf
| |____pg_twophase
| |____pg_xact
| | |____0000
| |____pg_dynshmem
| |____postmaster.opts
| |____pg_ident.conf
| |____global
| | |____4178
| | |____4185
| | |____6245
| | |____4176
| | |____4182
| | |____3593
| | |____4183
| | |____6244
| | |____4177
| | |____2396_vm
| | |____6243
| | |____4184
| | |____1262
| | |____3592
| | |____2672
| | |____2964
| | |____4060
| | |____2397
| | |____4061
| | |____2396
| | |____pg_control
| | |____2965
| | |____1213_fsm
| | |____1260_fsm
| | |____1260_vm
| | |____1261_fsm
| | |____pg_filenode.map
| | |____1262_fsm
| | |____6000
| | |____2695
| | |____1214
| | |____1213
| | |____1261_vm
| | |____2694
| | |____6001
| | |____pg_internal.init
| | |____2396_fsm
| | |____1233
| | |____2677
| | |____1260
| | |____1213_vm
| | |____2847
| | |____6246
| | |____4175
| | |____4181
| | |____4186
| | |____2676
| | |____2671
| | |____1232
| | |____1262_vm
| | |____2846
| | |____6247
| | |____1261
| | |____6100
| | |____2967
| | |____2966
| | |____6115
| | |____6114
| | |____2698
| | |____6002
| | |____2697
| |____base
| | |____1
| | |____16384
| | |____4
| | |____5
|____package-lock.json
|____package.json
|____seed_log.txt
|____new-agent
| |____SKILL-1.md
| |____SKILL-2.md
|____scripts
| |____restore-bunker.sh
| |____docker-stop.sh
| |____rotate-secrets.sh
| |____check-node.sh
| |____pg-dump.sh
| |____init-models.sh
| |____docker-start.sh
| |____init-bunker.sh
|____tsconfig.json
|____GEMINI.md
|____nginx.conf
|____drizzle.config.ts
|____CLAUDE.md
|____next.config.ts
|____pnpm-workspace.yaml
|____src
| |____types
| | |____index.ts
| | |____forge.ts
| |____contexts
| | |____ForgeContext.tsx
| |____app
| | |____[locale]
| | |____actions
| | |____api
| | |____globals.css
| |____utils
| | |____cn.ts
| | |____styling.ts
| | |____classification.ts
| |____index.css
| |____components
| | |____LocaleSwitcher.tsx
| | |____ui
| | |____TagCloud.tsx
| | |____SystemErrorModal.tsx
| | |____VaultSkeleton.tsx
| | |____terminal
| | |____TagBadge.tsx
| | |____TerminalSearch.tsx
| | |____forge
| | |____ThemeToggle.tsx
| | |____PromptCard.tsx
| | |____governance
| | |____PromptEditor.tsx
| |____hooks
| | |____use-ollama-stream.ts
| |____proxy.ts
| |____lib
| | |____vectorize.ts
| | |____actions
| | |____compiler.ts
| |____db
| | |____schema.ts
| | |____queries
| | |____seed.ts
| | |____index.ts
| |____i18n
| | |____routing.ts
| | |____request.ts
| |____data
| | |____mock.ts
```

## Key Configuration Files
### package.json
```json
{
  "name": "vault",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean:install": "rm -rf node_modules pnpm-lock.yaml && pnpm install",
    "build:standalone": "next build && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio --port 4984",
    "db:seed": "DATABASE_URL=postgresql://admin:secret@localhost:5433/promptvault_db pnpm tsx db/seed.ts"
  },
  "dependencies": {
    "@ai-sdk/openai": "^3.0.29",
    "@types/uuid": "^10.0.0",
    "ai": "^6.0.86",
    "clsx": "2.1.1",
    "date-fns": "^4.1.0",
    "drizzle-kit": "^0.31.9",
    "drizzle-orm": "^0.45.1",
    "framer-motion": "^12.34.0",
    "lucide-react": "^0.563.0",
    "next": "16.1.6",
    "next-intl": "^4.8.2",
    "ollama": "^0.6.3",
    "ollama-ai-provider": "^1.2.0",
    "postgres": "^3.4.8",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "tailwind-merge": "3.4.0",
    "uuid": "^13.0.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.18",
    "@types/node": "^20.0.0",
    "@types/react": "19.2.13",
    "@types/react-dom": "19.2.3",
    "postcss": "^8.5.6",
    "tailwindcss": "4.1.18",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### README.md
```md
# 🏔️ PromptVault: Sovereign AI Bunker

**Digital Sovereignty & Operational Logic from Patagonia**

`PromptVault` is a local AI management ecosystem designed for data sovereignty, high performance on constrained hardware (**8GB RAM**), and operational excellence. This system allows for the orchestration of Small Language Models (SLLMs) through a modular architecture of **Personas, Skills, and Governance Laws**.

---

## 🧭 Project Philosophy

- **Digital Sovereignty:** Total cloud-exit. Data and processing never leave the local network in Patagonia.
- **White Hat Philosophy:** Honest marketing and business strategies integrated into the core of decision-making.
- **Resource Optimization:** Precision engineering to run complex workflows on consumer-grade hardware.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router) + React.
- **Database:** PostgreSQL with `pgvector` extension for semantic search.
- **ORM:** Drizzle ORM.
- **AI Engine:** Ollama (Qwen 2.5 1.5B/7B) running in Docker containers.
- **Styling:** Tailwind CSS with a Terminal/Neon aesthetic.
- **Package Management:** pnpm (Optimized disk space and RAM usage).

---

## 📂 Bunker Architecture (Sectors)

The system is divided into 7 logical sectors, each with its own visual identity and technical purpose:

| Sector                | Identity   | Purpose                                                                       |
| :-------------------- | :--------- | :---------------------------------------------------------------------------- |
| **`[01] VAULT`**      | 🟢 Green   | General repository for prompts and creative knowledge.                        |
| **`[02] LOGIC`**      | 🟠 Amber   | **Skills.** Technical commands for Claude Code, Antigravity, and automations. |
| **`[03] PERSONA`**    | 🔵 Cyan    | **Identities.** System Prompt configuration and model parameters.             |
| **`[04] GOVERNANCE`** | 🟣 Magenta | **Protocols.** `.cursorrules` files, ethical guidelines, and style guides.    |
| **`[05] THE FORGE`**  | 🔥 Special | **Compiler.** Modular assembly and real-time execution.                       |
| **`[06] ACTIVITY`**   | ⚪ Gray    | **Logs.** Execution history and output auditing.                              |
| **`[07] ANALYTICS`**  | 📊 Chart   | **Metrics.** Hardware performance and AI quality tracking.                    |

---

## ⚡ Key Features

### 1. Context Compiler (The Forge)

A dynamic engine that performs a "merge" of components to generate the perfect prompt:
$$Prompt_{final} = Persona + Governance + Skill + Context_{User}$$

### 2. Telemetry Streaming

Direct connection to Ollama via `ReadableStream`, allowing for instantaneous visual feedback (typewriter effect) without saturating RAM.

### 3. Bilingual Vector Search (i18n)

Native integration with `pgvector`. The system detects the selected language (ES/EN) and prioritizes semantic search in the corresponding column for higher accuracy.

### 4. Performance Monitor

Real-time tracking of hardware efficiency:
$$\text{Performance} = \frac{\text{Generated Tokens}}{\text{Response Time (s)}}$$

---

## 🚀 Installation & Deployment

1.  **Clone & Configure:**

    ```bash
    git clone [https://github.com/your-user/prompt-vault.git](https://github.com/your-user/prompt-vault.git)
    cd prompt-vault
    cp .env.example .env
    ```

2.  **Initialize Structure:**

    ```bash
    chmod +x init-bunker.sh
    ./init-bunker.sh
    ```

3.  **Spin up Infrastructure (Docker):**

    ```bash
    docker-compose up -d
    ```

4.  **Sync Database:**

    ```bash
    pnpm db:push
    ```

5.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

---

## 🛡️ Security Protocols

- **Local-First:** All AI traffic is routed to `localhost:11434`.
- **Data Integrity:** Automatic vector database backups in the `init-db` folder.
- **Privacy:** No external trackers or cloud analytics are used.

---

## 📍 Author's Note

Developed with a focus on **Digital Sovereignty** from General Roca, Río Negro, Argentina. This bunker serves as the operational base for projects like **Starflow** and the personal brand **miguel-angel.dev**.
```

## Active Source Outline (Brief)
- src
- src/types
- src/types/index.ts
- src/types/forge.ts
- src/contexts
- src/contexts/ForgeContext.tsx
- src/app
- src/app/[locale]
- src/app/actions
- src/app/api
- src/app/globals.css
- src/utils
- src/utils/cn.ts
- src/utils/styling.ts
- src/utils/classification.ts
- src/index.css
- src/components
- src/components/LocaleSwitcher.tsx
- src/components/ui
- src/components/TagCloud.tsx
- src/components/SystemErrorModal.tsx
- src/components/VaultSkeleton.tsx
- src/components/terminal
- src/components/TagBadge.tsx
- src/components/TerminalSearch.tsx
- src/components/forge
- src/components/ThemeToggle.tsx
- src/components/PromptCard.tsx
- src/components/governance
- src/components/PromptEditor.tsx
- src/hooks
- src/hooks/use-ollama-stream.ts
- src/proxy.ts
- src/lib
- src/lib/vectorize.ts
- src/lib/actions
- src/lib/compiler.ts
- src/db
- src/db/schema.ts
- src/db/queries
- src/db/seed.ts
- src/db/index.ts
- src/i18n
- src/i18n/routing.ts
- src/i18n/request.ts
- src/data
- src/data/mock.ts
