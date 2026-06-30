import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const dir='/tmp/claude-1000/-home-anousss-projects-ng-blatui/3103d0f9-308f-44f3-b03a-3c9810ece426/scratchpad';
const axe=readFileSync(`${dir}/axe.min.js`,'utf8');
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1366,height:900}});
const seen={};
for (const r of ['/analytics','/payments','/calendar','/datatable','']) {
  await p.goto('http://localhost:4271/templates/admincn'+r,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(800); await p.addScriptTag({content:axe});
  const res=await p.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}}));
  for (const x of res.violations) for (const n of x.nodes) {
    const cls=(n.html.match(/class="([^"]*)"/)||[])[1]||'';
    const key=n.html.slice(0,55);
    if(!seen[key]){seen[key]=1; console.log((n.any?.[0]?.message||'').match(/of [\d.]+/)?.[0], '|', n.html.slice(0,110));}
  }
}
await b.close();
