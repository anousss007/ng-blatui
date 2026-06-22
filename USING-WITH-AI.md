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

`ng-blatui-mcp` exposes: `list_components` (optional `category`), `list_blocks`, `list_charts`, `list_templates`, `search({ query })`, and `get_docs({ name })` (returns full usage + code for a slug). It reads the live registry with an offline fallback bundled in the package.

### Claude Desktop / Claude Code

Add to `claude_desktop_config.json` (Desktop) or `.mcp.json` (Claude Code):

```json
{
  "mcpServers": {
    "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] }
  }
}
```

Or, with the Claude Code CLI:

```bash
claude mcp add ng-blatui -- npx -y ng-blatui-mcp
```

### Cursor

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] }
  }
}
```

### Windsurf

`~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] }
  }
}
```

### Cline / Roo Code / Zed / VS Code (Continue, etc.)

All take the same shape — a server named `ng-blatui` running `npx -y ng-blatui-mcp` over stdio. Drop the block above into that client's MCP config file.

---

## Editor rules (copy-paste)

For tools that read project rules files, drop this in so the assistant uses ng-blatui correctly. Save as `.cursor/rules/ng-blatui.md`, `.windsurfrules`, `.github/copilot-instructions.md`, or append to your `AGENTS.md`:

```md
# ng-blatui usage

- UI library: ng-blatui (Angular 22, standalone, signals, zoneless, SSR-safe). Install: `npm i ng-blatui`.
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
