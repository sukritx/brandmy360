import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const APP = process.cwd();
const PAGES = JSON.parse(process.argv[2] || '[]');
const W = Number(process.argv[3] || 1440);
const SUFFIX = process.argv[4] || 'desktop';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-color-profile=srgb'],
  defaultViewport: { width: W, height: 900, deviceScaleFactor: 1 },
});

for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: 900 });
  await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 120000 });
  await sleep(2200);
  await page.evaluate(async () => {
    await new Promise((res) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 60); else { window.scrollTo(0, 0); setTimeout(res, 600); } }; s(); });
  });
  await sleep(600);
  const sections = await page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    const out = [];
    [...root.children].forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.height < 40) return;
      out.push({ i, y: Math.round(r.top + window.scrollY), h: Math.round(r.height), cls: (el.className || '').toString().slice(0, 60) });
    });
    return out;
  });
  const dir = path.join(APP, 'docs', 'design-references', SITE, p.key, 'sections-' + SUFFIX);
  fs.mkdirSync(dir, { recursive: true });
  for (const s of sections) {
    const clipH = Math.min(s.h, 6000);
    try {
      await page.screenshot({ path: path.join(dir, `${String(s.i).padStart(2, '0')}-y${s.y}-h${s.h}.png`), clip: { x: 0, y: s.y, width: W, height: clipH }, captureBeyondViewport: true });
    } catch (e) { console.log('  crop fail', s.i, e.message.slice(0, 80)); }
  }
  console.log(`${p.slug}: ${sections.length} sections cropped`);
  await page.close();
}
await browser.close();
console.log('CROPS DONE');
