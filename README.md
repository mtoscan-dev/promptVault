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
- **AI Engine:** Ollama (Host Mode) with Qwen 2.5 (1.5B/7B) for GPU acceleration.
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

### Prerequisites

- **Docker Desktop** installed and running.
- **Ollama** installed on your host machine (Mac/Windows/Linux).
- **Node.js 20+** and **pnpm** (if running locally without Docker).

### AI Setup (Host Mode)

To enable GPU acceleration (Metal), this project uses your host's Ollama instance.

1.  **Install Ollama:** [Download here](https://ollama.com).
2.  **Pull the Model:**
    ```bash
    ollama pull qwen2.5:1.5b
    # Or for more power (if you have >16GB RAM):
    ollama pull qwen2.5:7b
    ```
3.  **Ensure Ollama is running:** It should be accessible at `http://localhost:11434`.

### Project Setup

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
    ./scripts/docker-start.sh
    ```

    _Note: This starts the App and Database. The internal AI container is disabled in favor of the Host AI._

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
