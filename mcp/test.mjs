// Smoke test for the MCP core (run: node mcp/test.mjs, after `npm run build:registry`).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createCore } from './core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const json = (n) => JSON.parse(readFileSync(join(here, n), 'utf8'));
const core = createCore({ registry: json('registry.json'), api: json('api.json') });

const tools = core.getTools().map((t) => t.name);
for (const t of ['list_components', 'search', 'get_docs', 'get_api']) {
  assert.ok(tools.includes(t), `tool ${t} present`);
}

const doc = core.callTool('get_docs', { name: 'onboarding-tour' }).content[0].text;
assert.match(doc, /steps/, 'get_docs lists steps');
assert.match(doc, /TourStep/, 'get_docs documents TourStep');
assert.match(doc, /Two-way models/, 'get_docs has two-way section');

const apiText = core.callTool('get_api', { name: 'data-table' }).content[0].text;
assert.match(apiText, /columns/, 'get_api lists data-table inputs');

const resources = core.listResources().resources;
assert.ok(resources.length > 100, `resources listed (${resources.length})`);
assert.match(
  core.readResource('ngblatui://component/onboarding-tour').contents[0].text,
  /TourStep/,
);

const prompt = core.getPrompt('use-component', { name: 'dialog' });
assert.match(prompt.messages[0].content.text, /dialog/i, 'use-component prompt');

const init = core.rpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
assert.equal(init.result.protocolVersion, core.PROTOCOL_VERSION, 'initialize');
assert.deepEqual(
  core.rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' }).result.tools.length,
  tools.length,
);
assert.equal(
  core.rpc({ jsonrpc: '2.0', method: 'notifications/initialized' }),
  null,
  'notification → null',
);
assert.ok(
  core.rpc({ jsonrpc: '2.0', id: 3, method: 'bogus' }).error.code === -32601,
  'unknown method',
);

console.log(
  `mcp/test: OK — ${tools.length} tools, ${resources.length} resources, get_docs/get_api/resources/prompts/rpc verified.`,
);
