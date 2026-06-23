// Shared, dependency-free MCP core for ng-blatui. Pure JSON-RPC logic (tools, resources, prompts)
// over a loaded { registry, api } pair — no transport, no SDK. Used by both the stdio server
// (index.mjs, published as `ng-blatui-mcp`) and the hosted streamable-HTTP server (server.mjs).
//
//   registry = registry.json   (items[], description, install, homepage, npm, version)
//   api      = api.json         (slug → { summary, components[], types[] }) from scripts/extract-api.mjs

const PROTOCOL_VERSION = '2025-06-18';

export function createCore({ registry, api = {} }) {
  const items = registry.items ?? [];
  const PKG = registry.npm ?? 'ng-blatui';
  const HOME = registry.homepage ?? 'https://ngblatui.remix-it.com';
  const INSTALL = registry.install ?? `npm i ${PKG}`;

  const byType = (t) => items.filter((i) => i.type === t);
  const findItem = (slug) => items.find((i) => i.name === slug);
  const listLines = (arr) =>
    arr
      .map((i) => `- ${i.label} (${i.name})${i.category ? ` · ${i.category}` : ''} — ${i.url}`)
      .join('\n');

  const overview =
    `ng-blatui — ${registry.description}\n` +
    `Install: ${INSTALL}. Import from the "${PKG}" barrel; selectors are prefixed "bui" ` +
    `(e.g. <button buiButton>, <bui-avatar>). Standalone, signal-based, zoneless, SSR-safe. Docs: ${HOME}.`;

  const instructions =
    `ng-blatui is an accessible Angular UI library (Angular 21 & 22) themed with Tailwind v4. ` +
    `Discover components with list_components/search, then get_docs (or the get_api focused alias) ` +
    `for a component's inputs, two-way models, outputs and the shape of the types it uses. ` +
    `Install with "${INSTALL}" and import the bui-prefixed standalone directives/components from "${PKG}".`;

  // ── structured-API rendering (from api.json) ──────────────────────────────
  function renderApi(slug) {
    const entry = api[slug];
    if (!entry) return '';
    const out = [];
    for (const c of entry.components) {
      if (entry.components.length > 1) out.push(`### \`${c.selector}\` — ${c.class}`);
      if (c.inputs.length) {
        out.push('**Inputs**');
        for (const m of c.inputs) {
          const meta = m.required
            ? ' _(required)_'
            : m.default != null
              ? ` = \`${m.default}\``
              : '';
          out.push(`- \`${m.name}\`: \`${m.type}\`${meta} — ${m.description}`);
        }
      }
      if (c.models.length) {
        out.push('**Two-way models** — bind `[(name)]`, or one-way as an input');
        for (const m of c.models) {
          out.push(
            `- \`${m.name}\`: \`${m.type}\`${m.default != null ? ` = \`${m.default}\`` : ''} — ${m.description}`,
          );
        }
      }
      if (c.outputs.length) {
        out.push('**Outputs**');
        for (const m of c.outputs) out.push(`- \`${m.name}\`: \`${m.type}\` — ${m.description}`);
      }
      out.push('');
    }
    if (entry.types.length) {
      out.push('**Types**');
      for (const t of entry.types) {
        if (t.kind === 'interface' && t.fields) {
          out.push(`- \`${t.name}\`${t.description ? ` — ${t.description}` : ''}`);
          for (const f of t.fields) {
            out.push(
              `    - \`${f.name}${f.optional ? '?' : ''}\`: \`${f.type}\` — ${f.description}`,
            );
          }
        } else {
          out.push(
            `- \`${t.name}\` = \`${t.definition}\`${t.description ? ` — ${t.description}` : ''}`,
          );
        }
      }
    }
    return out.join('\n').trim();
  }

  function importLine(slug) {
    const entry = api[slug];
    const classes = entry ? entry.components.map((c) => c.class) : [];
    return classes.length ? `import { ${classes.join(', ')} } from '${PKG}';` : '';
  }

  /** Full doc for a slug: header + install + import + structured API (or a link for non-components). */
  function docFor(slug) {
    const item = findItem(slug);
    if (!item) return null;
    const out = [`# ${item.label} (${item.type})`, `Docs: ${item.url}`, `Install: ${INSTALL}`];
    const imp = importLine(slug);
    if (imp) out.push(`Import: ${imp}`);
    out.push('');
    const apiMd = renderApi(slug);
    out.push(
      apiMd ||
        (item.type === 'component'
          ? `(No documented inputs — see ${item.url} for usage.)`
          : `Open ${item.url} for the full ${item.type} markup and copy-paste code.`),
    );
    out.push(`\nEvery component also accepts a \`class\` input to merge Tailwind classes.`);
    return out.join('\n');
  }

  // ── tools ─────────────────────────────────────────────────────────────────
  const TOOLS = [
    {
      name: 'list_components',
      description: `List ng-blatui's ${byType('component').length} Angular components, optionally filtered by category.`,
      inputSchema: {
        type: 'object',
        properties: { category: { type: 'string', description: 'e.g. "Forms & Input".' } },
      },
    },
    {
      name: 'list_blocks',
      description: `List ${byType('block').length} prebuilt blocks (login, signup, …).`,
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
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
    },
    {
      name: 'get_docs',
      description:
        "Get a component/block/chart/template's docs by slug: install, import and the full structured API (inputs, two-way models, outputs, types).",
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Slug, e.g. "onboarding-tour".' } },
        required: ['name'],
      },
    },
    {
      name: 'get_api',
      description:
        'Focused: just the typed API (inputs, two-way models, outputs and referenced types) of a component, by slug.',
      inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
    },
  ];

  function callTool(name, args = {}) {
    if (name === 'list_components') {
      let comps = byType('component');
      if (args.category) {
        const q = String(args.category).toLowerCase();
        comps = comps.filter((c) => (c.category ?? '').toLowerCase().includes(q));
      }
      return text(`${overview}\n\n${comps.length} components:\n${listLines(comps)}`);
    }
    if (name === 'list_blocks')
      return text(`${overview}\n\nBlocks:\n${listLines(byType('block'))}`);
    if (name === 'list_charts')
      return text(`${overview}\n\nCharts:\n${listLines(byType('chart'))}`);
    if (name === 'list_templates')
      return text(`${overview}\n\nTemplates:\n${listLines(byType('template'))}`);
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
          ? `${hits.length} result(s) for "${args.query}":\n${listLines(hits)}`
          : `No results for "${args.query}".`,
      );
    }
    if (name === 'get_docs') {
      const doc = docFor(
        String(args.name ?? '')
          .toLowerCase()
          .trim(),
      );
      return text(
        doc ?? `Unknown name "${args.name}". Use search or a list_* tool to find valid slugs.`,
      );
    }
    if (name === 'get_api') {
      const slug = String(args.name ?? '')
        .toLowerCase()
        .trim();
      const md = renderApi(slug);
      if (md) return text(`# ${findItem(slug)?.label ?? slug} — API\n${importLine(slug)}\n\n${md}`);
      return text(
        findItem(slug)
          ? `"${slug}" has no documented inputs/outputs.`
          : `Unknown component "${args.name}".`,
      );
    }
    throw rpcError(-32602, `Unknown tool: ${name}`);
  }

  // ── resources (components carry the rich API) ──────────────────────────────
  function listResources() {
    return {
      resources: byType('component').map((i) => ({
        uri: `ngblatui://component/${i.name}`,
        name: i.label,
        description: api[i.name]?.summary ?? undefined,
        mimeType: 'text/markdown',
      })),
    };
  }
  function resourceTemplates() {
    return {
      resourceTemplates: [
        {
          uriTemplate: 'ngblatui://component/{name}',
          name: 'ng-blatui component',
          description: 'Install, import and typed API of a component',
          mimeType: 'text/markdown',
        },
        {
          uriTemplate: 'ngblatui://block/{name}',
          name: 'ng-blatui block',
          description: 'Prebuilt block',
          mimeType: 'text/markdown',
        },
        {
          uriTemplate: 'ngblatui://chart/{name}',
          name: 'ng-blatui chart',
          description: 'Chart example',
          mimeType: 'text/markdown',
        },
        {
          uriTemplate: 'ngblatui://template/{name}',
          name: 'ng-blatui template',
          description: 'Full page template',
          mimeType: 'text/markdown',
        },
      ],
    };
  }
  function readResource(uri) {
    const m = /^ngblatui:\/\/(component|block|chart|template)\/([a-z0-9-]+)$/.exec(
      String(uri ?? ''),
    );
    if (!m) throw rpcError(-32602, `Unknown resource: ${uri}`);
    const doc = docFor(m[2]);
    if (!doc) throw rpcError(-32602, `Resource not found: ${uri}`);
    return { contents: [{ uri, mimeType: 'text/markdown', text: doc }] };
  }

  // ── prompts ────────────────────────────────────────────────────────────────
  function listPrompts() {
    return {
      prompts: [
        {
          name: 'use-component',
          description: 'Insert and use an ng-blatui component (import + usage + typed API).',
          arguments: [
            {
              name: 'name',
              description: 'Component slug, e.g. dialog, date-picker.',
              required: true,
            },
          ],
        },
        {
          name: 'scaffold-page',
          description: 'Scaffold a page from ng-blatui templates/blocks.',
          arguments: [
            {
              name: 'kind',
              description: 'e.g. dashboard, login, pricing, settings.',
              required: true,
            },
          ],
        },
      ],
    };
  }
  function getPrompt(name, args = {}) {
    if (name === 'use-component') {
      const slug = String(args.name ?? '')
        .toLowerCase()
        .trim();
      const doc =
        docFor(slug) ?? `Component "${slug}" not found — use list_components to discover slugs.`;
      return {
        description: `Use the ng-blatui ${slug} component`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Add the ng-blatui "${slug}" component to my Angular app and use it.\n\n${doc}`,
            },
          },
        ],
      };
    }
    if (name === 'scaffold-page') {
      const kind = String(args.kind ?? 'dashboard')
        .toLowerCase()
        .trim();
      const hits = items.filter(
        (i) =>
          (i.type === 'template' || i.type === 'block') &&
          (i.name.includes(kind) || i.label.toLowerCase().includes(kind)),
      );
      return {
        description: `Scaffold a ${kind} page with ng-blatui`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Build a ${kind} page in my Angular app using ng-blatui. Install: ${INSTALL}.\n` +
                (hits.length
                  ? `Relevant templates/blocks:\n${listLines(hits)}\n`
                  : `Browse ${HOME}/templates and ${HOME}/blocks for a starting point.\n`) +
                `Open the chosen page's docs URL for its full markup, then import the bui-prefixed components from "${PKG}" and adapt the content.`,
            },
          },
        ],
      };
    }
    throw rpcError(-32602, `Unknown prompt: ${name}`);
  }

  // ── JSON-RPC dispatcher (used by the HTTP transport) ───────────────────────
  function rpc(message) {
    const { id, method, params } = message ?? {};
    if (id === undefined || id === null) return null; // notification (e.g. notifications/initialized)
    try {
      const result = route(method, params ?? {});
      return { jsonrpc: '2.0', id, result };
    } catch (e) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: e.code ?? -32603, message: e.message ?? 'Internal error' },
      };
    }
  }

  function route(method, params) {
    switch (method) {
      case 'initialize':
        return {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {}, resources: {}, prompts: {} },
          serverInfo: serverInfo(),
          instructions,
        };
      case 'ping':
        return {};
      case 'tools/list':
        return { tools: TOOLS };
      case 'tools/call':
        return callTool(params.name, params.arguments ?? {});
      case 'resources/list':
        return listResources();
      case 'resources/templates/list':
        return resourceTemplates();
      case 'resources/read':
        return readResource(params.uri);
      case 'prompts/list':
        return listPrompts();
      case 'prompts/get':
        return getPrompt(params.name, params.arguments ?? {});
      default:
        throw rpcError(-32601, `Method not found: ${method}`);
    }
  }

  const serverInfo = () => ({ name: 'ng-blatui', version: registry.version ?? '1.0.0' });

  return {
    serverInfo: serverInfo(),
    instructions,
    PROTOCOL_VERSION,
    getTools: () => TOOLS,
    callTool,
    listResources,
    resourceTemplates,
    readResource,
    listPrompts,
    getPrompt,
    rpc,
  };
}

const text = (t) => ({ content: [{ type: 'text', text: t }] });
function rpcError(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}
