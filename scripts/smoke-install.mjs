#!/usr/bin/env node
/*
 * Fresh-install smoke test.
 *
 * Scaffolds a real Angular app of the given major, installs the *packed*
 * ng-blatui + version-matched peers, wires up the DOCUMENTED Tailwind setup
 * (the `@import 'ng-blatui/foundations/blatui.css'` path the demo never
 * exercises because it inlines its own tokens), drops in a component that pulls
 * the CDK + Aria re-exports into compilation, and runs `ng build`.
 *
 * Fails (non-zero) if installing or building the documented setup breaks — e.g.
 * the regression where the package `exports` field omitted the foundations CSS.
 *
 * Usage: node scripts/smoke-install.mjs [angularMajor=22]
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const major = process.argv[2] ?? '22';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(repoRoot, 'dist', 'ng-blatui');

const run = (cmd, cwd) => {
  console.log(`\n$ ${cmd}\n  (cwd: ${cwd})`);
  execSync(cmd, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, NG_CLI_ANALYTICS: 'false', HUSKY: '0' },
  });
};

// 1. Build + pack the library exactly as it would publish to npm.
run('npm run build:lib', repoRoot);
const { version } = JSON.parse(readFileSync(join(distDir, 'package.json'), 'utf8'));
run('npm pack', distDir);
const tarball = join(distDir, `ng-blatui-${version}.tgz`);

let work;
let failed = false;
try {
  // 2. Scaffold a fresh app on the requested Angular major.
  work = mkdtempSync(join(tmpdir(), `ngblatui-smoke-${major}-`));
  run(
    `npx -y -p @angular/cli@${major} ng new smoke --style=css --ssr=false --routing=false --skip-git --package-manager=npm`,
    work,
  );
  const appDir = join(work, 'smoke');

  // 3. Install the packed lib + version-matched peers + Tailwind v4.
  run(`npm i "${tarball}" @angular/cdk@${major} @angular/aria@${major}`, appDir);
  run('npm i -D tailwindcss @tailwindcss/postcss', appDir);

  // 4. Wire up the DOCUMENTED install — the path that must resolve.
  writeFileSync(
    join(appDir, '.postcssrc.json'),
    `${JSON.stringify({ plugins: { '@tailwindcss/postcss': {} } }, null, 2)}\n`,
  );
  writeFileSync(
    join(appDir, 'src', 'styles.css'),
    `@import 'tailwindcss';\n@import 'ng-blatui/foundations/blatui.css';\n@source '../node_modules/ng-blatui';\n`,
  );

  // 5. A component that forces compilation of a directive plus the CDK overlay,
  //    CDK dialog and Angular Aria re-exports (the version-sensitive surfaces).
  writeFileSync(
    join(appDir, 'src', 'app', 'app.ts'),
    `import { Component, inject } from '@angular/core';
import { BuiButton, BuiTooltip, BuiTabs, BuiTabList, BuiTabTrigger, Tabs, TabList, Tab, Dialog } from 'ng-blatui';

@Component({
  selector: 'app-root',
  imports: [BuiButton, BuiTooltip, BuiTabs, BuiTabList, BuiTabTrigger, Tabs, TabList, Tab],
  template: \`
    <button buiButton buiTooltip="hi">Go</button>
    <div ngTabs buiTabs>
      <div ngTabList buiTabList selectedTab="a">
        <div ngTab value="a" buiTabTrigger>A</div>
      </div>
    </div>
  \`,
})
export class App {
  protected readonly dialog = inject(Dialog);
}
`,
  );

  // 6. Build. Throws on any compile/resolve failure.
  run('npm run build', appDir);

  console.log(`\n✅ ng-blatui ${version} installs & builds cleanly on Angular ${major}.`);
} catch (error) {
  failed = true;
  console.error(`\n❌ Smoke test failed on Angular ${major}: ${error.message ?? error}`);
} finally {
  if (work) {
    try {
      rmSync(work, { recursive: true, force: true });
    } catch {
      /* ephemeral temp dir — best effort */
    }
  }
}

process.exit(failed ? 1 : 0);
