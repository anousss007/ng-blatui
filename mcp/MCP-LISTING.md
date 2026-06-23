# Listing the ng-blatui MCP server in directories

The hosted MCP server is live at `POST https://ngblatui.remix-it.com/mcp`
(Streamable HTTP, stateless) and advertised by its card at
`/.well-known/mcp/server-card.json`. It exposes **tools** (list/search/get_docs/
get_api), **resources** (`ngblatui://component|block|chart|template/{name}`) and
**prompts** (`use-component`, `scaffold-page`).

`server.json` (repo root) is the submission manifest for the official registry.

These steps are **outward-facing** (public submissions under your accounts /
namespace) — they're left for your approval; this file is the playbook.

## Where to submit (each needs your account / approval)

1. **Official MCP Registry** — `registry.modelcontextprotocol.io`
   - Install the publisher: `brew install mcp-publisher` (or download a release).
   - Auth with GitHub (proves ownership of the `io.github.anousss007/*` namespace):
     `mcp-publisher login github`
   - From the repo root: `mcp-publisher publish` (reads `server.json`).
   - This feeds the downstream aggregators below.
2. **Smithery** — https://smithery.ai/new — add the GitHub repo or the remote URL.
3. **mcp.so** — https://mcp.so/submit — submit name, description, remote URL.
4. **Glama** — https://glama.ai/mcp/servers — auto-indexes; can submit the repo.
5. **PulseMCP** — https://www.pulsemcp.com/submit

## Suggested listing copy

> **ng-blatui** — shadcn-style UI for Angular. An MCP server that lets your AI
> editor search, read and understand 155 accessible Angular components, 16 blocks,
> 70 charts and 34 page templates — including each component's **typed API**
> (inputs, two-way models, outputs and the types it uses). Free, MIT.
> Tools: `search`, `get_docs`, `get_api`, `list_components`.

## Editor quick-add (for the README)

Hosted (recommended — zero install):

```json
{
  "mcpServers": {
    "ng-blatui": { "type": "streamable-http", "url": "https://ngblatui.remix-it.com/mcp" }
  }
}
```

Or the local stdio server (npm):

```json
{ "mcpServers": { "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] } } }
```
