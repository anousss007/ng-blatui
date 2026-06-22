// Capture preview thumbnails for every /templates/:slug and /blocks/:slug page.
//
// Serves the already-built static site (dist/demo/browser) on a local port,
// drives a headless browser with Playwright, and writes a JPEG thumbnail for
// each route to BOTH:
//   - projects/demo/public/previews/<kind>/<slug>.jpg  (committed source of truth,
//     bundled into future builds by the Angular `public/` assets pipeline)
//   - dist/demo/browser/previews/<kind>/<slug>.jpg      (so the current dist is
//     deployable immediately, without a second build)
//
// Run AFTER `ng build demo`:  node scripts/capture-previews.mjs
// Re-run only when a template/block design changes, then redeploy.
//
// Uses the system Edge (channel: 'msedge') so no Playwright browser download is needed.

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist/demo/browser');
const PUBLIC_DIR = join(ROOT, 'projects/demo/public/previews');
const PAGES = join(ROOT, 'projects/demo/src/app/pages');

const WIDTH = 1280;
const HEIGHT = 800;
const QUALITY = 72;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

/** Pull the quoted slugs out of an `export const NAME = [ '...', ... ]` array. */
function readSlugs(file, name) {
  const source = readFileSync(join(PAGES, file), 'utf8');
  const block = source.match(new RegExp(`${name}\\s*=\\s*\\[([\\s\\S]*?)]`));
  if (!block) {
    throw new Error(`Could not find ${name} in ${file}`);
  }
  return (block[1].match(/'[^']+'/g) ?? []).map((quoted) => quoted.slice(1, -1));
}

/** Minimal static file server over dist/demo/browser with directory→index.html. */
function serveDist() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://x').pathname);
      // A path with no file extension is a route → serve its prerendered index.html.
      const filePath = extname(pathname)
        ? join(DIST, pathname)
        : join(DIST, pathname, 'index.html');
      const body = await readFile(filePath);
      response.writeHead(200, {
        'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function main() {
  if (!existsSync(DIST)) {
    throw new Error(`No build found at ${DIST}. Run "ng build demo" first.`);
  }

  const targets = [
    ...readSlugs('templates.ts', 'TEMPLATES').map((slug) => ({ kind: 'templates', slug })),
    ...readSlugs('blocks.ts', 'BLOCKS').map((slug) => ({ kind: 'blocks', slug })),
  ];
  console.log(`Capturing ${targets.length} previews…`);

  await mkdir(join(PUBLIC_DIR, 'templates'), { recursive: true });
  await mkdir(join(PUBLIC_DIR, 'blocks'), { recursive: true });
  await mkdir(join(DIST, 'previews/templates'), { recursive: true });
  await mkdir(join(DIST, 'previews/blocks'), { recursive: true });

  const { server, port } = await serveDist();
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  let done = 0;
  for (const { kind, slug } of targets) {
    const url = `http://127.0.0.1:${port}/${kind}/${slug}`;
    // Use domcontentloaded (not networkidle) — the art-directed templates have
    // perpetual animations/typewriters so the network/CPU never goes idle.
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    // Strip the docs chrome (top nav, back-bar, theme-customizer) so the thumbnail
    // is a clean shot of just the template/block design.
    await page.addStyleTag({ content: '[data-preview-hide]{display:none !important}' });
    await page.waitForTimeout(1500);
    const buffer = await page.screenshot({
      type: 'jpeg',
      quality: QUALITY,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    await writeFile(join(PUBLIC_DIR, kind, `${slug}.jpg`), buffer);
    await writeFile(join(DIST, 'previews', kind, `${slug}.jpg`), buffer);
    done += 1;
    console.log(`  ✓ ${kind}/${slug} (${done}/${targets.length})`);
  }

  await browser.close();
  server.close();
  console.log(`Done — ${done} previews written to public/previews + dist.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
