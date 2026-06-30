import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const dir = '/tmp/claude-1000/-home-anousss-projects-ng-blatui/3103d0f9-308f-44f3-b03a-3c9810ece426/scratchpad';
const axe = readFileSync(`${dir}/axe.min.js`, 'utf8');
const routes = ['', '/finance','/logistics','/productivity','/campaign','/analytics','/payments','/ecommerce','/orders','/mail','/chat','/kanban','/calendar','/contact','/pricing','/faq','/form-validation','/datatable'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
let total = 0;
for (const r of routes) {
  const url = 'http://localhost:4271/templates/admincn' + r;
  try {
    await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await p.waitForTimeout(900);
    await p.addScriptTag({ content: axe });
    const res = await p.evaluate(async () => {
      // serious/critical WCAG 2.1 AA
      return await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } });
    });
    const v = res.violations.filter(x => ['serious','critical'].includes(x.impact));
    total += v.reduce((n,x)=>n+x.nodes.length,0);
    const name = r || '/sales';
    if (v.length === 0) console.log(`✅ ${name}`);
    else {
      console.log(`❌ ${name} — ${v.reduce((n,x)=>n+x.nodes.length,0)} nodes`);
      for (const x of v) console.log(`   [${x.impact}] ${x.id}: ${x.nodes.length}× — ${x.help}`);
    }
  } catch(e) { console.log(`⚠️ ${r}: ${e.message.split('\n')[0]}`); }
}
console.log('TOTAL serious/critical violation nodes:', total);
await b.close();
