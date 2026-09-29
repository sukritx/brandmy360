import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2200);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 60); else { window.scrollTo(0, 0); setTimeout(r, 400); } }; s(); }); });
  await sleep(600);
  const out = await page.evaluate(() => ({
    total: document.body.scrollHeight,
    kids: [...document.body.children].filter((c) => !['SCRIPT', 'NEXT-ROUTE-ANNOUNCER'].includes(c.tagName)).map((c) => ({ tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), cls: (c.className || '').toString().slice(0, 40), t: (c.innerText || '').replace(/\s+/g, ' ').slice(0, 30) })),
  }));
  await page.close();
  return out;
};

for (const p of ['/briefs', '/stats']) {
  const live = await read('https://brandmylaptop.com' + p);
  const clone = await read('http://localhost:3000' + p);
  console.log(`\n=== ${p} @390 (live ${live.total} / clone ${clone.total}) ===`);
  const n = Math.max(live.kids.length, clone.kids.length);
  for (let i = 0; i < n; i++) {
    const a = live.kids[i];
    const b = clone.kids[i];
    const mark = a && b && Math.abs(a.h - b.h) > 8 ? '  <<<' : '';
    console.log(`  L ${a ? `${a.tag} h${a.h} ${a.cls} | ${a.t}` : '-'}`);
    if (mark) console.log(`  C ${b ? `${b.tag} h${b.h} ${b.cls} | ${b.t}` : '-'}${mark}`);
  }
}
await browser.close();
