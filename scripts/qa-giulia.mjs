import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
    catch (e) { await sleep(3000); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
  await sleep(1200);
  const out = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const secs = [...main.children].map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, y: Math.round(r.top + window.scrollY), h: Math.round(r.height), t: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40) };
    }).filter((s) => s.h > 20);
    const broken = [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
    return { total: document.body.scrollHeight, secs, broken: [...new Set(broken)] };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/giulia');
const clone = await read('http://localhost:3000/giulia');
console.log(`=== /giulia — LIVE ${live.total} vs CLONE ${clone.total} (Δ${clone.total - live.total}) ===`);
const n = Math.max(live.secs.length, clone.secs.length);
for (let i = 0; i < n; i++) {
  const a = live.secs[i];
  const b = clone.secs[i];
  const dh = a && b ? b.h - a.h : null;
  const dy = a && b ? b.y - a.y : null;
  const flag = dh !== null && (Math.abs(dh) > 12 || Math.abs(dy) > 12) ? '   <<< DIFF' : '  ok';
  console.log(`#${i}${flag}  L:${a ? `y${a.y} h${a.h}` : '-'}  C:${b ? `y${b.y} h${b.h}` : '-'}`);
  console.log(`     L: ${a ? a.t : '-'}`);
  if (flag.includes('DIFF')) console.log(`     C: ${b ? b.t : '-'}`);
}
console.log('LIVE broken imgs:', live.broken.length, '| CLONE broken imgs:', clone.broken.length);
if (clone.broken.length) console.log(' clone broken:', clone.broken.slice(0, 5).join(', '));
await browser.close();
