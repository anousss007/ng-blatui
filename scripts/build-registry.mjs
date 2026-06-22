// Generates the AI-consumable artifacts for ng-blatui:
//   projects/demo/public/registry.json  — machine-readable index of every component/block/chart/template
//   projects/demo/public/llms.txt        — the llms.txt standard index (auto-discovered by AI tools)
//   mcp/registry.json                    — bundled copy shipped with the MCP server (offline fallback)
// Source of truth = the demo app's own catalog data, parsed from source (no TS execution needed).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOMEPAGE = 'https://ngblatui.remix-it.com';
const PKG = 'ng-blatui';
const read = (p) => readFileSync(join(root, p), 'utf8');

const ACRONYMS = new Map(
  Object.entries({
    otp: 'OTP',
    api: 'API',
    ui: 'UI',
    json: 'JSON',
    css: 'CSS',
    qr: 'QR',
    svg: 'SVG',
    kbd: 'Kbd',
    faq: 'FAQ',
    crm: 'CRM',
    saas: 'SaaS',
  }),
);
const titleCase = (slug) =>
  slug
    .split('-')
    .map((w) => ACRONYMS.get(w) ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/** Extract a flat string array assigned to `export const NAME = [ '...', ... ]`. */
function strArray(src, name) {
  const m = src.match(new RegExp(`export const ${name}\\b[^=]*=\\s*\\[([\\s\\S]*?)\\]`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
}

// ── Components, grouped by category (mirrors the docs sidebar) ──────────────────
const categoriesSrc = read('projects/demo/src/app/pages/categories.ts');
const categories = [];
for (const block of categoriesSrc.matchAll(
  /\{\s*label:\s*'([^']+)',\s*slugs:\s*\[([\s\S]*?)\]\s*,?\s*\}/g,
)) {
  const label = block[1];
  const slugs = [...block[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  categories.push({ label, slugs });
}
const slugCategory = new Map();
for (const c of categories) for (const s of c.slugs) slugCategory.set(s, c.label);

const allComponentSlugs = strArray(read('projects/demo/src/app/app.ts'), 'COMPONENTS');
const components = allComponentSlugs.map((slug) => ({
  name: slug,
  label: titleCase(slug),
  type: 'component',
  category: slugCategory.get(slug) ?? 'Components',
  url: `${HOMEPAGE}/components/${slug}`,
}));

// ── Templates / Blocks / Charts ────────────────────────────────────────────────
const templates = strArray(read('projects/demo/src/app/pages/templates.ts'), 'TEMPLATES').map(
  (slug) => ({
    name: slug,
    label: titleCase(slug),
    type: 'template',
    url: `${HOMEPAGE}/templates/${slug}`,
  }),
);
const blocks = strArray(read('projects/demo/src/app/pages/blocks.ts'), 'BLOCKS').map((slug) => ({
  name: slug,
  label: titleCase(slug),
  type: 'block',
  url: `${HOMEPAGE}/blocks/${slug}`,
}));
// Charts are built via factory calls: `radar('chart-radar-radius', 'Radar Chart — Radius Axis', '…')`.
const chartsSrc = read('projects/demo/src/app/pages/charts.ts');
const seenChart = new Set();
const charts = [];
for (const m of chartsSrc.matchAll(/'(chart-[a-z0-9-]+)'\s*,\s*'([^']+)'/g)) {
  const [, slug, label] = m;
  if (seenChart.has(slug)) continue;
  seenChart.add(slug);
  charts.push({ name: slug, label, type: 'chart', url: `${HOMEPAGE}/charts/${slug}` });
}

const docs = [
  { name: 'introduction', label: 'Introduction', type: 'doc', url: `${HOMEPAGE}/` },
  {
    name: 'installation',
    label: 'Installation',
    type: 'doc',
    url: `${HOMEPAGE}/docs/installation`,
  },
  { name: 'theming', label: 'Theming', type: 'doc', url: `${HOMEPAGE}/docs/theming` },
];

const items = [...components, ...blocks, ...charts, ...templates, ...docs];

// ── registry.json ──────────────────────────────────────────────────────────────
const registry = {
  $schema: `${HOMEPAGE}/registry.schema.json`,
  name: PKG,
  homepage: HOMEPAGE,
  npm: PKG,
  description:
    'Accessible Angular UI library (Angular 22, standalone, signals, zoneless, SSR-ready) ported from BlatUI. Components, blocks, charts and ready-made page templates, themed with Tailwind CSS v4 + oklch design tokens.',
  install: `npm i ${PKG}`,
  llms: `${HOMEPAGE}/llms.txt`,
  generatedAt: new Date().toISOString().slice(0, 10),
  counts: {
    components: components.length,
    blocks: blocks.length,
    charts: charts.length,
    templates: templates.length,
  },
  items,
};
const registryJson = JSON.stringify(registry, null, 2) + '\n';
writeFileSync(join(root, 'projects/demo/public/registry.json'), registryJson);
mkdirSync(join(root, 'mcp'), { recursive: true });
writeFileSync(join(root, 'mcp/registry.json'), registryJson);

// ── llms.txt (https://llmstxt.org standard) ──────────────────────────────────────
const section = (title, list) =>
  `## ${title}\n\n${list.map((i) => `- [${i.label}](${i.url})`).join('\n')}\n`;

const byCategory = new Map();
for (const c of components) {
  if (!byCategory.has(c.category)) byCategory.set(c.category, []);
  byCategory.get(c.category).push(c);
}
const componentSections = [...byCategory.entries()]
  .map(
    ([label, list]) =>
      `### ${label}\n\n${list.map((i) => `- [${i.label}](${i.url})`).join('\n')}\n`,
  )
  .join('\n');

const llms = `# ng-blatui

> ${registry.description}

ng-blatui is an Angular port of BlatUI. Install with \`${registry.install}\`, import any component from the \`ng-blatui\` barrel (selectors are prefixed \`bui\`), and theme it with Tailwind v4 + oklch tokens. Every component is standalone, signal-based, zoneless and SSR-safe. Each page below is server-prerendered, so its full markup, props and code are fetchable as plain HTML.

- Docs & live demo: ${HOMEPAGE}
- npm: https://www.npmjs.com/package/${PKG}
- Machine-readable registry: ${HOMEPAGE}/registry.json
- MCP server: \`npx ${PKG}-mcp\` (see ${HOMEPAGE}/docs/installation)

## Getting started

${docs.map((i) => `- [${i.label}](${i.url})`).join('\n')}

## Components (${components.length})

${componentSections}
${section(`Blocks (${blocks.length})`, blocks)}
${section(`Charts (${charts.length})`, charts)}
${section(`Templates (${templates.length})`, templates)}`;

writeFileSync(join(root, 'projects/demo/public/llms.txt'), llms.trimEnd() + '\n');

console.log(
  `registry: ${items.length} items (${components.length} components, ${blocks.length} blocks, ${charts.length} charts, ${templates.length} templates) → registry.json + llms.txt + mcp/registry.json`,
);
