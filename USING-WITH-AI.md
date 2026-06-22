# Using ng-blatui with AI agents

ng-blatui ships first-class support for AI coding assistants so they can **discover, choose and correctly use** its 155 components, 16 blocks, 70 charts and 34 page templates — instead of guessing.

There are three layers; use any or all:

| Layer             | What it is                                                                                                                 | URL / command                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **MCP server**    | A Model Context Protocol server with tools to list/search the catalog and fetch full docs + code. Works in any MCP client. | `npx ng-blatui-mcp`                         |
| **llms.txt**      | The [llms.txt](https://llmstxt.org) standard index — auto-discovered by many AI tools.                                     | https://ngblatui.remix-it.com/llms.txt      |
| **registry.json** | Machine-readable catalog (name, type, category, url) for every item.                                                       | https://ngblatui.remix-it.com/registry.json |

Every docs page is **server-prerendered**, so `https://ngblatui.remix-it.com/components/<slug>` (and `/blocks`, `/charts`, `/templates`) returns real HTML with the live example, props and copy-paste code — fetchable by any agent or the MCP `get_docs` tool.

---

## MCP server

`ng-blatui-mcp` exposes: `list_components` (optional `category`), `list_blocks`, `list_charts`, `list_templates`, `search({ query })`, and `get_docs({ name })` (returns full usage + code for a slug). It runs over **stdio** as `npx -y ng-blatui-mcp`, reads the live registry, and falls back to a copy bundled in the package when offline.

### The standard block

Most MCP clients use a `mcpServers` map. Paste this into the client's config file (locations in the table below):

```json
{
  "mcpServers": {
    "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] }
  }
}
```

> On Windows, some clients need the command wrapped: `"command": "cmd"`, `"args": ["/c", "npx", "-y", "ng-blatui-mcp"]`.

### Where to put it, per tool

| Tool                               | Config                                                                                                                       | Key          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **Claude Code**                    | `claude mcp add ng-blatui -- npx -y ng-blatui-mcp`, or project `.mcp.json`                                                   | `mcpServers` |
| **Claude Desktop**                 | `claude_desktop_config.json` (macOS `~/Library/Application Support/Claude/`, Windows `%APPDATA%\Claude\`)                    | `mcpServers` |
| **Cursor**                         | `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global)                                                                | `mcpServers` |
| **Windsurf**                       | `~/.codeium/windsurf/mcp_config.json`                                                                                        | `mcpServers` |
| **Cline**                          | MCP Servers panel → `cline_mcp_settings.json`                                                                                | `mcpServers` |
| **Roo Code**                       | MCP settings → `mcp_settings.json`                                                                                           | `mcpServers` |
| **JetBrains AI Assistant / Junie** | Settings → Tools → AI Assistant → MCP (`mcp.json`)                                                                           | `mcpServers` |
| **Gemini CLI**                     | `~/.gemini/settings.json`                                                                                                    | `mcpServers` |
| **Continue**                       | `~/.continue/config.yaml`                                                                                                    | `mcpServers` |
| **Warp**                           | Settings → AI → MCP servers                                                                                                  | `mcpServers` |
| **LibreChat**                      | `librechat.yaml`                                                                                                             | `mcpServers` |
| **Goose**                          | `goose configure` → Add extension → Command-line (STDIO), command `npx -y ng-blatui-mcp`                                     | —            |
| **Claude / ChatGPT (web)**         | only support **remote** (HTTP/SSE) servers, not stdio — use the MCP server locally via the desktop apps or an editor instead | —            |

### Clients with a different shape

**VS Code** (GitHub Copilot agent mode) — `.vscode/mcp.json`, top-level key is `servers`:

```json
{
  "servers": {
    "ng-blatui": { "type": "stdio", "command": "npx", "args": ["-y", "ng-blatui-mcp"] }
  }
}
```

**Zed** — `settings.json`, key is `context_servers` with a nested `command`:

```json
{
  "context_servers": {
    "ng-blatui": {
      "command": { "path": "npx", "args": ["-y", "ng-blatui-mcp"] }
    }
  }
}
```

**OpenAI Codex CLI** — `~/.codex/config.toml` (TOML):

```toml
[mcp_servers.ng-blatui]
command = "npx"
args = ["-y", "ng-blatui-mcp"]
```

Any other MCP-capable client works the same way: run `npx -y ng-blatui-mcp` over stdio and name it `ng-blatui`.

---

## Editor rules (copy-paste)

For tools that read project rules files, drop this in so the assistant uses ng-blatui correctly. Save as `.cursor/rules/ng-blatui.md`, `.windsurfrules`, `.github/copilot-instructions.md`, or append to your `AGENTS.md`:

```md
# ng-blatui usage

- UI library: ng-blatui (Angular 21 & 22, standalone, signals, zoneless, SSR-safe). Install: `npm i ng-blatui`.
- Import component classes from the `ng-blatui` barrel and add them to a standalone component's `imports[]` (no NgModule).
- Selectors are prefixed `bui`: `<bui-avatar>`, `<button buiButton>`, `<input buiInput>`, `<span buiBadge tone="success">`.
- Inputs/outputs are signals: bind `[checked]`/`(checkedChange)` etc. Form controls implement ControlValueAccessor (Reactive/Template/Signal forms).
- Theme with Tailwind v4 + oklch CSS tokens (`--primary`, `--background`, `--border`, `--radius`…).
- Do NOT guess component names or props. Look them up via the ng-blatui MCP server (`get_docs`), https://ngblatui.remix-it.com/registry.json, or the prerendered page https://ngblatui.remix-it.com/components/<slug>.
```

---

## llms.txt

Point any llms.txt-aware tool at:

```
https://ngblatui.remix-it.com/llms.txt
```

It lists every component (grouped by category), block, chart and template with its docs URL.
