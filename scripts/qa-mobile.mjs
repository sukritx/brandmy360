import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = [
  ['root', '/'],
  ['brands', '/brands'],
  ['briefs', '/briefs'],
  ['stats', '/stats'],
  ['sell', '/sell'],
];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });
for (const [name, path] of PAGES) {
  const read = async (url) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    for (let i = 0; i < 4; i++) {
      try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
      catch (e) { await sleep(2500); }
    }
    await sleep(2200);
    await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 60); else { window.scrollTo(0, 0); setTimeout(r, 400); } }; s(); }); });
    await sleep(800);
    const h = await page.evaluate(() => document.body.scrollHeight);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    await page.close();
    return { h, overflow };
  };
  const live = await read('https://brandmylaptop.com' + path);
  const clone = await read('http://localhost:3000' + path);
  const d = clone.h - live.h;
  console.log(`${name}: live ${live.h} vs clone ${clone.h} (Δ${d})${live.overflow ? ' [live h-overflow]' : ''}${clone.overflow ? ' [CLONE h-overflow!]' : ''}`);
}
await browser.close();
