#!/usr/bin/env node
// ng-blatui-mcp — a Model Context Protocol server that lets any MCP-capable AI agent
// (Claude Desktop/Code, Cursor, Windsurf, Cline, Zed, VS Code, …) discover and use ng-blatui.
// Tools: list_components, list_blocks, list_charts, list_templates, search, get_docs.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const here = dirname(fileURLToPath(import.meta.url));
const REGISTRY_URL = 'https://ngblatui.remix-it.com/registry.json';

// Prefer the live registry (always current); fall back to the copy bundled with the package.
async function loadRegistry() {
  try {
    const res = await fetch(REGISTRY_URL, { signal: AbortSignal.timeout(5000) });
    if (res.ok) return await res.json();
  } catch {
    /* offline — use bundled copy */
  }
  return JSON.parse(readFileSync(join(here, 'registry.json'), 'utf8'));
}

const registry = await loadRegistry();
const items = registry.items ?? [];
const byType = (t) => items.filter((i) => i.type === t);
const list = (arr) =>
  arr
    .map((i) => `- ${i.label} (${i.name})${i.category ? ` · ${i.category}` : ''} — ${i.url}`)
    .join('\n');

/** Fetch a server-prerendered docs page and reduce its HTML to readable text. */
async function fetchDoc(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  return main
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/(\S)\s{2,}/g, '$1 ')
    .trim()
    .slice(0, 12000);
}

const server = new Server(
  { name: 'ng-blatui', version: registry.version ?? '1.0.0' },
  { capabilities: { tools: {} } },
);

const TOOLS = [
  {
    name: 'list_components',
    description: `List ng-blatui's ${byType('component').length} Angular components, optionally filtered by category.`,
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category filter, e.g. "Forms & Input".',
        },
      },
    },
  },
  {
    name: 'list_blocks',
    description: `List ${byType('block').length} prebuilt blocks (login, signup, etc.).`,
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_charts',
    description: `List ${byType('chart').length} chart examples.`,
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_templates',
    description: `List ${byType('template').length} full page templates.`,
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'search',
    description:
      'Search the ng-blatui registry (components, blocks, charts, templates) by keyword.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search term.' } },
      required: ['query'],
    },
  },
  {
    name: 'get_docs',
    description:
      'Fetch the full docs page (usage, props, code) for a component/block/chart/template by its name (slug).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The slug, e.g. "button" or "dashboard".' },
      },
      required: ['name'],
    },
  },
];

const text = (t) => ({ content: [{ type: 'text', text: t }] });

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  const overview = `ng-blatui — ${registry.description}\nInstall: ${registry.install}\nImport from the "ng-blatui" barrel; selectors are prefixed "bui". Docs: ${registry.homepage}\n`;

  if (name === 'list_components') {
    let comps = byType('component');
    if (args.category)
      comps = comps.filter((c) =>
        (c.category ?? '').toLowerCase().includes(String(args.category).toLowerCase()),
      );
    return text(`${overview}\n${comps.length} components:\n${list(comps)}`);
  }
  if (name === 'list_blocks') return text(`${overview}\nBlocks:\n${list(byType('block'))}`);
  if (name === 'list_charts') return text(`${overview}\nCharts:\n${list(byType('chart'))}`);
  if (name === 'list_templates')
    return text(`${overview}\nTemplates:\n${list(byType('template'))}`);
  if (name === 'search') {
    const q = String(args.query ?? '')
      .toLowerCase()
      .trim();
    const hits = items.filter(
      (i) =>
        i.name.includes(q) ||
        i.label.toLowerCase().includes(q) ||
        (i.category ?? '').toLowerCase().includes(q),
    );
    return text(
      hits.length
        ? `${hits.length} result(s) for "${args.query}":\n${list(hits)}`
        : `No results for "${args.query}".`,
    );
  }
  if (name === 'get_docs') {
    const slug = String(args.name ?? '')
      .toLowerCase()
      .trim();
    const item = items.find((i) => i.name === slug);
    if (!item)
      return text(`Unknown name "${args.name}". Use search or a list_* tool to find valid names.`);
    try {
      const doc = await fetchDoc(item.url);
      return text(
        `# ${item.label} (${item.type})\nURL: ${item.url}\nInstall: ${registry.install}\n\n${doc}`,
      );
    } catch {
      return text(
        `# ${item.label} (${item.type})\nURL: ${item.url}\n(Could not fetch the page right now — open the URL for full docs and code.)`,
      );
    }
  }
  return text(`Unknown tool: ${name}`);
});

await server.connect(new StdioServerTransport());
console.error(`ng-blatui-mcp ready — ${items.length} registry items.`);
