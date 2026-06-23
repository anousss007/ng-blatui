# ng-blatui-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server for **[ng-blatui](https://ngblatui.remix-it.com)** — the accessible Angular UI library (Angular 21 & 22, standalone, signals, zoneless, SSR-ready) ported from BlatUI.

It lets any MCP-capable AI agent — Claude Desktop/Code, Cursor, Windsurf, Cline, Zed, VS Code — **discover and correctly use** ng-blatui's 155 components, 16 blocks, 70 charts and 34 page templates instead of guessing.

## Tools

- `list_components` — list components, optional `category` filter
- `list_blocks` · `list_charts` · `list_templates`
- `search({ query })` — keyword search across the whole catalog
- `get_docs({ name })` — install, import and the full **structured API** (inputs, two-way models, outputs and the types they use) for any slug
- `get_api({ name })` — focused: just a component's typed API

It also exposes **resources** (`ngblatui://component/{name}`) and **prompts** (`use-component`, `scaffold-page`).

## Setup

### Hosted (recommended — zero install)

Point your client at the hosted Streamable-HTTP endpoint:

```json
{
  "mcpServers": {
    "ng-blatui": { "type": "streamable-http", "url": "https://ngblatui.remix-it.com/mcp" }
  }
}
```

### Local (stdio, via npm)

```json
{
  "mcpServers": {
    "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] }
  }
}
```

Claude Code CLI: `claude mcp add --transport http ng-blatui https://ngblatui.remix-it.com/mcp`
(or `claude mcp add ng-blatui -- npx -y ng-blatui-mcp` for the local server).

The stdio server reads the live registry + API (`https://ngblatui.remix-it.com/registry.json` and `/api.json`) and falls back to a bundled copy offline.

## Links

- Docs & live demo: https://ngblatui.remix-it.com
- ng-blatui on npm: https://www.npmjs.com/package/ng-blatui
- Full AI integration guide: https://github.com/anousss007/ng-blatui/blob/main/USING-WITH-AI.md

MIT
