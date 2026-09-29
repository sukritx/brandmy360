import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = 'docs/design-references/brandmylaptop-com-284b5fbe/_qa-cards';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
await sleep(2500);
await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < 4200) setTimeout(s, 100); else setTimeout(r, 800); }; s(); }); });
await sleep(1200);

const info = await page.evaluate(() => {
  const sec = document.querySelector('#laptops');
  if (!sec) return { error: 'no #laptops' };
  const lis = [...sec.querySelectorAll('li')];
  const idx = lis.findIndex((li) => li.querySelectorAll('img[src*="og/"], img[src*="logos/"]').length >= 2);
  return { count: lis.length, pick: idx };
});
console.log('clone:', JSON.stringify(info));
if (info.pick >= 0) {
  const sel = `#laptops li:nth-child(${info.pick + 1})`;
  const el = await page.$(sel);
  console.log('element found:', !!el);
  if (el) {
    await el.scrollIntoView();
    await sleep(900);
    await el.screenshot({ path: `${OUT}/clone-card.png` });
    console.log('shot saved');
  }
}
const styles = await page.evaluate((i) => {
  const li = document.querySelectorAll('#laptops li')[i];
  if (!li) return { error: 'no li' };
  const lid = li.querySelector('div[style*="container-type"]');
  return {
    containerW: lid ? getComputedStyle(lid).width : null,
    slots: [...li.querySelectorAll('div[style*="grid-area"]')].map((s) => {
      const img = s.querySelector('img');
      const cellR = s.getBoundingClientRect();
      const imgR = img ? img.getBoundingClientRect() : null;
      return {
        area: (s.getAttribute('style') || '').slice(0, 40),
        img: img ? img.src.split('/').pop() : null,
        imgBox: imgR ? `${Math.round(imgR.width)}x${Math.round(imgR.height)}` : null,
        cell: `${Math.round(cellR.width)}x${Math.round(cellR.height)}`,
      };
    }),
  };
}, info.pick >= 0 ? info.pick : 0);
console.log(JSON.stringify(styles, null, 1).slice(0, 2200));
fs.writeFileSync(`${OUT}/clone-card-styles.json`, JSON.stringify(styles, null, 1));
await browser.close();
