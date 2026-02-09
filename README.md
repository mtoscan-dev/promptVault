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
