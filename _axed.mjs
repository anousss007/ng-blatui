import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const dir = '/tmp/claude-1000/-home-anousss-projects-ng-blatui/3103d0f9-308f-44f3-b03a-3c9810ece426/scratchpad';
const axe = readFileSync(`${dir}/axe.min.js`, 'utf8');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
for (const r of ['/datatable','/mail','']) {
  await p.goto('http://localhost:4271/templates/admincn'+r, { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(900);
  await p.addScriptTag({ content: axe });
  const res = await p.evaluate(async () => await window.axe.run(document, { runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']} }));
  console.log(`\n===== ${r||'/sales'} =====`);
  for (const x of res.violations.filter(v=>['serious','critical'].includes(v.impact))) {
    if (!['button-name','aria-prohibited-attr','nested-interactive'].includes(x.id)) continue;
    console.log(`\n# ${x.id} (${x.impact}) ${x.nodes.length}×`);
    for (const n of x.nodes.slice(0,4)) console.log('  T:', n.target.join(' '), '\n  H:', n.html.slice(0,140));
  }
}
await b.close();
