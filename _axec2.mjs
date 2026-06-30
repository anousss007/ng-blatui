import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const dir = '/tmp/claude-1000/-home-anousss-projects-ng-blatui/3103d0f9-308f-44f3-b03a-3c9810ece426/scratchpad';
const axe = readFileSync(`${dir}/axe.min.js`, 'utf8');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
const routes = ['','/finance','/logistics','/productivity','/campaign','/analytics','/payments','/ecommerce','/orders','/kanban','/calendar','/datatable'];
const buckets = {};
for (const r of routes) {
  await p.goto('http://localhost:4271/templates/admincn'+r, { waitUntil:'networkidle', timeout:60000 });
  await p.waitForTimeout(800);
  await p.addScriptTag({ content: axe });
  const res = await p.evaluate(async () => await window.axe.run(document, { runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']} }));
  for (const x of res.violations.filter(v=>['serious','critical'].includes(v.impact))) {
    for (const n of x.nodes) {
      const m = (n.any?.[0]?.message||'').match(/contrast of ([\d.]+).*?foreground color: (#\w+), background color: (#\w+)/);
      const key = x.id==='color-contrast' && m ? `${m[2]} on ${m[3]} (${m[1]})` : x.id;
      buckets[key] = (buckets[key]||0)+1;
    }
  }
}
for (const [k,v] of Object.entries(buckets).sort((a,b)=>b[1]-a[1])) console.log(`${v}×  ${k}`);
await b.close();
