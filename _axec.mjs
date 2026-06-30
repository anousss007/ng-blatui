import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const dir = '/tmp/claude-1000/-home-anousss-projects-ng-blatui/3103d0f9-308f-44f3-b03a-3c9810ece426/scratchpad';
const axe = readFileSync(`${dir}/axe.min.js`, 'utf8');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
for (const r of ['/payments','/calendar','/mail']) {
  await p.goto('http://localhost:4271/templates/admincn'+r, { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(900);
  await p.addScriptTag({ content: axe });
  const res = await p.evaluate(async () => await window.axe.run(document, { runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']} }));
  console.log(`\n===== ${r} =====`);
  for (const x of res.violations.filter(v=>['color-contrast','nested-interactive'].includes(v.id))) {
    console.log(`# ${x.id} ${x.nodes.length}×`);
    for (const n of x.nodes.slice(0,5)) console.log('  ', (n.any?.[0]?.message||'').slice(0,90), '||', n.html.slice(0,90));
  }
}
await b.close();
