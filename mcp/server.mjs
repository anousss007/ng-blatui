#!/usr/bin/env node
// ng-blatui hosted MCP server — stateless Streamable-HTTP (JSON-RPC over POST /mcp), dependency-free.
// Deployed on the VPS behind nginx (location /mcp) at https://ngblatui.remix-it.com/mcp.
// Reads registry.json + api.json from DATA_DIR (the served static site dir, so it tracks deploys).
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createCore } from './core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? '127.0.0.1';
const DATA_DIR = process.env.DATA_DIR ?? '/var/www/ngblatui';

// Load registry.json + api.json from DATA_DIR, falling back to copies next to this file.
function loadJson(name) {
  try {
    return JSON.parse(readFileSync(join(DATA_DIR, name), 'utf8'));
  } catch {
    return JSON.parse(readFileSync(join(here, name), 'utf8'));
  }
}

let core;
let stamp = 0;
function rebuild() {
  core = createCore({ registry: loadJson('registry.json'), api: loadJson('api.json') });
}
/** Reload data if registry.json changed on disk (so a site deploy is picked up without a restart). */
function current() {
  try {
    const m = statSync(join(DATA_DIR, 'registry.json')).mtimeMs;
    if (m !== stamp) {
      rebuild();
      stamp = m;
    }
  } catch {
    if (!core) rebuild();
  }
  return core;
}
rebuild();

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id, Mcp-Protocol-Version',
};

const server = createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    return res.end();
  }
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json', ...CORS });
    return res.end(
      JSON.stringify({
        error: 'Use POST for JSON-RPC. Server card: /.well-known/mcp/server-card.json',
      }),
    );
  }
  if (req.method !== 'POST') {
    res.writeHead(405, CORS);
    return res.end();
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 2_000_000) req.destroy();
  });
  req.on('end', () => {
    let out;
    try {
      const msg = JSON.parse(body);
      const c = current();
      out = Array.isArray(msg) ? msg.map((m) => c.rpc(m)).filter(Boolean) : c.rpc(msg);
    } catch {
      out = { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } };
    }
    res.writeHead(200, { 'Content-Type': 'application/json', ...CORS });
    // null (notification) or empty batch → empty 200 body, per JSON-RPC.
    res.end(out == null || (Array.isArray(out) && out.length === 0) ? '' : JSON.stringify(out));
  });
});

server.listen(PORT, HOST, () => {
  console.error(`ng-blatui MCP (streamable-http) → http://${HOST}:${PORT}  [DATA_DIR=${DATA_DIR}]`);
});
