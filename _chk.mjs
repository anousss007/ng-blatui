import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:4271/templates/admincn/productivity',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(1000);
const btns = await p.locator('button[role="combobox"]').all();
console.log('combobox buttons:', btns.length);
for (const btn of btns.slice(0,3)) {
  const al = await btn.getAttribute('aria-label');
  const txt = (await btn.innerText()).replace(/\n/g,' ').slice(0,30);
  console.log(`aria-label=${JSON.stringify(al)} text="${txt}"`);
}
await b.close();
