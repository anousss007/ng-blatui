# ng-blatui-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server for **[ng-blatui](https://ngblatui.remix-it.com)** — the accessible Angular UI library (Angular 22, standalone, signals, zoneless, SSR-ready) ported from BlatUI.

It lets any MCP-capable AI agent — Claude Desktop/Code, Cursor, Windsurf, Cline, Zed, VS Code — **discover and correctly use** ng-blatui's 155 components, 16 blocks, 70 charts and 34 page templates instead of guessing.

## Tools

- `list_components` — list components, optional `category` filter
- `list_blocks` · `list_charts` · `list_templates`
- `search({ query })` — keyword search across the whole catalog
- `get_docs({ name })` — full usage, props and copy-paste code for any slug

It reads the live registry (`https://ngblatui.remix-it.com/registry.json`) and falls back to a bundled copy offline.

## Setup

Add to your MCP client config (Claude Desktop `claude_desktop_config.json`, Claude Code `.mcp.json`, Cursor `.cursor/mcp.json`, Windsurf `mcp_config.json`, …):

```json
{
  "mcpServers": {
    "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] }
  }
}
```

Claude Code CLI: `claude mcp add ng-blatui -- npx -y ng-blatui-mcp`

## Links

- Docs & live demo: https://ngblatui.remix-it.com
- ng-blatui on npm: https://www.npmjs.com/package/ng-blatui
- Full AI integration guide: https://github.com/anousss007/ng-blatui/blob/main/USING-WITH-AI.md

MIT
