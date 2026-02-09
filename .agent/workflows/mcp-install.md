---
description: Install a new Model Context Protocol (MCP) server using Node.js
---

This workflow helps install and configure MCP servers for enhanced AI capabilities.

## Prerequisites

- Node.js installed (LTS version recommended)
- npm, yarn, or pnpm available

## Installation Steps

1. **Identify MCP Server**
   - Determine the MCP server package name
   - Common examples: `@anthropic/mcp-server-*`, `@modelcontextprotocol/*`

2. **Install Package**
   ```bash
   # Using npm
   npm install -g <mcp-package-name>
   
   # Using npx (no global install)
   npx <mcp-package-name>
   ```

3. **Configure Server**
   - Check the MCP server documentation
   - Add configuration to your IDE or agent settings
   - Example configuration locations:
     - Cursor: `.cursor/mcp.json`
     - VSCode: `.vscode/mcp.json`

4. **Verify Installation**
   ```bash
   # Check if server is available
   npx <mcp-package-name> --help
   ```

## Configuration Example

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "npx",
      "args": ["<mcp-package-name>"]
    }
  }
}
```

## Troubleshooting

- Ensure Node.js version is compatible
- Check for required environment variables
- Review server-specific documentation
