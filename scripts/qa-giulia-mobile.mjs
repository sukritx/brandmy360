import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
    catch (e) { await sleep(3000); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
  await sleep(900);
  const out = await page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    const secs = [...root.children].map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, y: Math.round(r.top + window.scrollY), h: Math.round(r.height), t: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 34) };
    }).filter((s) => s.h > 20);
    return { total: document.body.scrollHeight, bodyClass: document.body.className, secs, overflow: document.documentElement.scrollWidth > window.innerWidth + 2 };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/giulia');
const clone = await read('http://localhost:3000/giulia');
console.log(`=== /giulia @390 — LIVE ${live.total} vs CLONE ${clone.total} (Δ${clone.total - live.total}) ===`);
console.log('body LIVE :', live.bodyClass, '| overflow:', live.overflow);
console.log('body CLONE:', clone.bodyClass, '| overflow:', clone.overflow);
const n = Math.max(live.secs.length, clone.secs.length);
for (let i = 0; i < n; i++) {
  const a = live.secs[i];
  const b = clone.secs[i];
  const dh = a && b ? b.h - a.h : null;
  console.log(`#${i} L:${a ? `y${a.y} h${a.h}` : '-'} C:${b ? `y${b.y} h${b.h}` : '-'}${dh !== null && Math.abs(dh) > 20 ? `  <<< Δ${dh}` : ''} | ${(a || {}).t || b.t}`);
  if (dh !== null && Math.abs(dh) > 20) console.log(`     L:${a.t} C:${b.t}`);
}
await browser.close();
