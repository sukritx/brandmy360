import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const read = async (url, idx) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < 4200) setTimeout(s, 100); else setTimeout(r, 800); }; s(); }); });
  await sleep(1200);
  const out = await page.evaluate((i) => {
    const a = document.querySelectorAll('#laptops li a')[i];
    if (!a) return { error: 'no card' };
    const rows = [];
    const rec = (el, d) => {
      if (d > 1) return;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      rows.push({ d, tag: el.tagName, h: Math.round(r.height), mt: cs.marginTop, minH: cs.minHeight, cls: (el.className || '').toString().slice(0, 42), t: (el.innerText || '').replace(/\s+/g, ' ').slice(0, 26) });
      [...el.children].forEach((c) => rec(c, d + 1));
    };
    rec(a, 0);
    return { aH: Math.round(a.getBoundingClientRect().height), rows };
  }, idx);
  await page.close();
  return out;
};

for (const idx of [1, 3, 4]) {
  const live = await read('https://brandmylaptop.com/', idx);
  const clone = await read('http://localhost:3000/', idx);
  console.log(`\n=== CARD ${idx}: LIVE aH${live.aH} vs CLONE aH${clone.aH} ===`);
  const n = Math.max(live.rows.length, clone.rows.length);
  for (let k = 0; k < n; k++) {
    const A = live.rows[k];
    const B = clone.rows[k];
    const mark = A && B && A.h !== B.h ? '  <<<' : '';
    console.log(`  L ${A ? `${A.tag} h${A.h} mt${A.mt} minH${A.minH} ${A.cls} ${A.t}` : '-'}`);
    if (mark) console.log(`  C ${B ? `${B.tag} h${B.h} mt${B.mt} minH${B.minH} ${B.cls} ${B.t}` : '-'}${mark}`);
  }
}
await browser.close();
