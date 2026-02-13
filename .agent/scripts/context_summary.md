# Project Context Summary
Generated on: Fri Feb 13 09:55:25 -03 2026

## Directory Structure
```
.
|____pnpm-lock.yaml
|____WORKFLOWS.md
|____ENVIRONMENT.md
|____messages
| |____en.json
| |____es.json
|____postcss.config.mjs
|____Dockerfile
|____node_modules
| |____@types
| | |____react-dom
| | |____node
| | |____uuid
| | |____react
| |____next
| |____tailwind-merge
| |____@tailwindcss
| | |____postcss
| |____typescript
| |____date-fns
| |____postcss
| |____lucide-react
| |____react-dom
| |____clsx
| |____tailwindcss
| |____next-intl
| |____uuid
| |____react
|____next-env.d.ts
|____README.md
|____package-lock.json
|____package.json
|____new-agent
| |____SKILL-1.md
| |____SKILL-2.md
|____scripts
|____tsconfig.json
|____GEMINI.md
|____nginx.conf
|____CLAUDE.md
|____next.config.ts
|____pnpm-workspace.yaml
|____src
| |____types
| | |____index.ts
| |____app
| | |____[locale]
| | |____globals.css
| |____utils
| | |____cn.ts
| | |____styling.ts
| | |____classification.ts
| |____index.css
| |____components
| | |____LocaleSwitcher.tsx
| | |____TagCloud.tsx
| | |____SystemErrorModal.tsx
| | |____TagBadge.tsx
| | |____TerminalSearch.tsx
| | |____ThemeToggle.tsx
| | |____PromptCard.tsx
| | |____PromptEditor.tsx
| |____hooks
| |____proxy.ts
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
    "lint": "next lint"
  },
  "dependencies": {
    "@types/uuid": "^10.0.0",
    "clsx": "2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.563.0",
    "next": "16.1.6",
    "next-intl": "^4.8.2",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "tailwind-merge": "3.4.0",
    "uuid": "^13.0.0"
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
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
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
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### README.md
```md
# PromptVault 🖥️

A personal prompt repository with version control, featuring a terminal-style UI.

## Features

- 📝 **Prompt Management**: Create, edit, and delete prompts
- 🔄 **Version Control**: Every update creates a new version, with full history access
- 🏷️ **Auto-Tagging**: AI-powered automatic classification based on content
- 🔍 **Smart Search**: Search by text with tag autocomplete
- 💾 **Local Storage**: All data persisted in browser localStorage
- 🖥️ **Terminal UI**: Beautiful terminal-inspired interface

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# Access at http://localhost:3000
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Search Bar

The search bar at the bottom simulates a terminal prompt:

- Type to search prompts by title, description, or content
- Start typing a tag name for autocomplete suggestions
- Press **SPACE** to select a suggested tag
- Press **BACKSPACE** to remove the last selected tag
- Press **ENTER** to confirm search

### Tags

Tags are automatically generated based on prompt content:

- `coding` - Programming-related prompts
- `writing` - Writing and essays
- `analysis` - Data analysis
- `creative` - Creative content
- `translation` - Language translation
- `summary` - Summarization tasks
- `debugging` - Bug fixing
- `education` - Learning and teaching
- `api` - API-related
- `frontend` - UI/UX development

### Version History

Click on any prompt to open the editor, then use the version dropdown to:

- View all previous versions
- Switch between versions
- Create new versions by editing and saving

## Tech Stack

- Next.js 16 (React 19) + TypeScript
- Tailwind CSS 4
- date-fns
- Lucide React Icons
- Docker + Nginx

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main application page
│   ├── components/
│   │   ├── PromptCard.tsx      # Individual prompt display
│   │   ├── PromptEditor.tsx    # Create/edit modal
│   │   ├── TagCloud.tsx        # Tag display component
│   │   └── TerminalSearch.tsx  # Search bar component
│   ├── data/
│   │   └── mock.ts             # Initial mock data
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/
│   │   ├── classification.ts   # AI logic for tags
│   │   ├── cn.ts               # CSS utility
│   │   └── styling.ts          # Theme and tag colors
│   └── index.css               # Global styles
├── Dockerfile                  # Container definition
├── docker-compose.yml          # Local orchestration
├── nginx.conf                  # Nginx configuration
└── README.md
```

## Quick Start (pnpm)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## License

MIT
```

## Active Source Outline (Brief)
- src
- src/types
- src/types/index.ts
- src/app
- src/app/[locale]
- src/app/globals.css
- src/utils
- src/utils/cn.ts
- src/utils/styling.ts
- src/utils/classification.ts
- src/index.css
- src/components
- src/components/LocaleSwitcher.tsx
- src/components/TagCloud.tsx
- src/components/SystemErrorModal.tsx
- src/components/TagBadge.tsx
- src/components/TerminalSearch.tsx
- src/components/ThemeToggle.tsx
- src/components/PromptCard.tsx
- src/components/PromptEditor.tsx
- src/hooks
- src/proxy.ts
- src/i18n
- src/i18n/routing.ts
- src/i18n/request.ts
- src/data
- src/data/mock.ts
