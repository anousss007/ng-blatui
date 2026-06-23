#!/usr/bin/env node
// ng-blatui-mcp — Model Context Protocol server (stdio) for ng-blatui. Lets any MCP-capable AI agent
// (Claude Desktop/Code, Cursor, Windsurf, Cline, Zed, VS Code, …) discover and use ng-blatui.
// Tools (list_*, search, get_docs, get_api), resources (ngblatui://…) and prompts come from core.mjs,
// shared with the hosted streamable-HTTP server (server.mjs). Prefer the hosted server for zero setup:
//   { "mcpServers": { "ng-blatui": { "type": "streamable-http", "url": "https://ngblatui.remix-it.com/mcp" } } }
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { createCore } from './core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const HOME = 'https://ngblatui.remix-it.com';

async function fetchJson(url, ms) {
  const res = await fetch(url, { signal: AbortSignal.timeout(ms) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Prefer the live registry + api (always current); fall back to the copies bundled with the package.
async function loadData() {
  try {
    const [registry, api] = await Promise.all([
      fetchJson(`${HOME}/registry.json`, 5000),
      fetchJson(`${HOME}/api.json`, 5000),
    ]);
    return { registry, api };
  } catch {
    return {
      registry: JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8')),
      api: JSON.parse(readFileSync(join(here, 'api.json'), 'utf8')),
    };
  }
}

const { registry, api } = await loadData();
const core = createCore({ registry, api });

const server = new Server(core.serverInfo, {
  capabilities: { tools: {}, resources: {}, prompts: {} },
  instructions: core.instructions,
});

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: core.getTools() }));
server.setRequestHandler(CallToolRequestSchema, (req) =>
  core.callTool(req.params.name, req.params.arguments ?? {}),
);
server.setRequestHandler(ListResourcesRequestSchema, () => core.listResources());
server.setRequestHandler(ListResourceTemplatesRequestSchema, () => core.resourceTemplates());
server.setRequestHandler(ReadResourceRequestSchema, (req) => core.readResource(req.params.uri));
server.setRequestHandler(ListPromptsRequestSchema, () => core.listPrompts());
server.setRequestHandler(GetPromptRequestSchema, (req) =>
  core.getPrompt(req.params.name, req.params.arguments ?? {}),
);

await server.connect(new StdioServerTransport());
console.error(`ng-blatui-mcp (stdio) ready — ${registry.items?.length ?? 0} registry items.`);
