import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = [
  ['root', '/', 'root-7280be29'],
  ['brands', '/brands', 'brands-b0addea9'],
  ['briefs', '/briefs', 'briefs-dc03d02e'],
  ['stats', '/stats', 'stats-d8625d36'],
  ['sell', '/sell', 'sell-826541f7'],
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const rows = [];
for (const [name, path, key] of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 80); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(900);
  const clone = await page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    return [...root.children].map((el, i) => {
      const r = el.getBoundingClientRect();
      return { i, y: Math.round(r.top + window.scrollY), h: Math.round(r.height), text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60) };
    }).filter((s) => s.h > 40);
  });
  const orig = JSON.parse(fs.readFileSync(`docs/research/brandmylaptop-com-284b5fbe/${key}/topology.json`, 'utf8'));
  const origRows = orig.rows.filter((r) => r.d <= 1 && r.h > 40);
  console.log(`\n=== ${name} — clone ${clone.length} sections vs orig ${origRows.length} ===`);
  const n = Math.max(clone.length, origRows.length);
  for (let i = 0; i < n; i++) {
    const c = clone[i];
    const o = origRows[i];
    if (!c || !o) {
      console.log(`  #${i} MISSING  clone=${c ? 'ok' : '-'} orig=${o ? 'ok' : '-'} ${(c || o).text.slice(0, 50)}`);
      continue;
    }
    const dy = c.y - o.y;
    const dh = c.h - o.h;
    const flag = Math.abs(dy) > 40 || Math.abs(dh) > 40 ? '  <<<' : '';
    console.log(`  #${i} y ${o.y}→${c.y} (Δ${dy})  h ${o.h}→${c.h} (Δ${dh})${flag}  | ${o.text.slice(0, 40)}`);
  }
  rows.push({ name, clone, orig: origRows });
  await page.close();
}
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/_qa-offsets.json', JSON.stringify(rows, null, 1));
await browser.close();
