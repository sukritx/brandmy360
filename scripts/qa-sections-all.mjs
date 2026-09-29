import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = [
  ['root', '/', '/'],
  ['brands', '/brands', '/brands'],
  ['briefs', '/briefs', '/briefs'],
  ['stats', '/stats', '/stats'],
  ['sell', '/sell', '/sell'],
];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(900);
  const out = await page.evaluate(() => {
    const main = document.querySelector('main');
    const secs = [...main.querySelectorAll(':scope > *')].map((el) => {
      const r = el.getBoundingClientRect();
      return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height), t: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 42) };
    }).filter((s) => s.h > 30);
    return { total: document.body.scrollHeight, secs };
  });
  await page.close();
  return out;
};

for (const [name, livePath, clonePath] of PAGES) {
  const live = await read('https://brandmylaptop.com' + livePath);
  const clone = await read('http://localhost:3000' + clonePath);
  console.log(`\n=== ${name} — LIVE ${live.total} vs CLONE ${clone.total} (Δ${clone.total - live.total}) ===`);
  const n = Math.max(live.secs.length, clone.secs.length);
  for (let i = 0; i < n; i++) {
    const a = live.secs[i];
    const b = clone.secs[i];
    const dh = a && b ? b.h - a.h : null;
    const dy = a && b ? b.y - a.y : null;
    const flag = dh !== null && (Math.abs(dh) > 30 || Math.abs(dy) > 30) ? '   <<< DIFF' : '';
    console.log(`  #${i} L:${a ? `y${a.y} h${a.h}` : '-'} C:${b ? `y${b.y} h${b.h}` : '-'}${flag}`);
    console.log(`       L: ${a ? a.t : '-'}`);
    if (flag) console.log(`       C: ${b ? b.t : '-'}`);
  }
}
await browser.close();
