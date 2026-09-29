import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = 'docs/design-references/brandmylaptop-com-284b5fbe/_qa-cards';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });

async function grab(url, tag) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < 4200) setTimeout(s, 100); else { setTimeout(r, 800); } }; s(); }); });
  await sleep(1200);
  // find a grid card with at least 2 sticker imgs
  const info = await page.evaluate(() => {
    const sec = document.querySelector('#laptops');
    if (!sec) return { error: 'no #laptops' };
    const lis = [...sec.querySelectorAll('li')];
    const idx = lis.findIndex((li) => li.querySelectorAll('img[src*="og/"], img[src*="logos/"]').length >= 2);
    return { count: lis.length, pick: idx };
  });
  console.log(tag, 'cards:', info.count, 'pick:', info.pick);
  if (info.pick >= 0) {
    const el = await page.$(`#laptops li:nth-child(${info.pick + 1})`);
    if (el) {
      await el.scrollIntoView();
      await sleep(800);
      await el.screenshot({ path: `${OUT}/${tag}-card.png` });
      // dump the sticker styles for comparison
      const styles = await page.evaluate((i) => {
        const li = document.querySelectorAll('#laptops li')[i];
        const lid = li.querySelector('div[style*="container-type"]');
        return {
          containerW: lid ? getComputedStyle(lid).width : null,
          lidwInline: lid ? lid.getAttribute('style') : null,
          slots: [...li.querySelectorAll('div[style*="grid-area"]')].map((s) => {
            const img = s.querySelector('img');
            return {
              area: s.getAttribute('style'),
              imgSrc: img ? img.src.split('/').pop() : null,
              imgBox: img ? `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}` : null,
              cellBox: (() => { const r = s.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; })(),
            };
          }),
        };
      }, info.pick);
      fs.writeFileSync(`${OUT}/${tag}-styles.json`, JSON.stringify(styles, null, 1));
    }
  }
  await page.close();
}

await grab('https://brandmylaptop.com/', 'live');
await grab('http://localhost:3000/', 'clone');
await browser.close();
console.log('CARD QA DONE');
