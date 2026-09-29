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
  await sleep(2500);
  const out = await page.evaluate(() => {
    const body = document.body;
    const cs = getComputedStyle(body);
    const bar = document.querySelector('aside[class*="z-\\[55\\]"], aside[aria-label="Sponsors"][data-overlay]');
    const bars = [...document.querySelectorAll('aside[data-overlay]')].map((a) => ({ cls: a.className.slice(0, 60), h: Math.round(a.getBoundingClientRect().height), top: Math.round(a.getBoundingClientRect().top) }));
    return {
      bodyClass: body.className,
      paddingBottom: cs.paddingBottom,
      total: body.scrollHeight,
      bars,
    };
  });
  await page.close();
  return out;
};

for (const p of ['/', '/brands', '/briefs', '/stats']) {
  const live = await read('https://brandmylaptop.com' + p);
  const clone = await read('http://localhost:3000' + p);
  console.log(`\n=== ${p} @390 ===`);
  console.log('LIVE :', JSON.stringify(live));
  console.log('CLONE:', JSON.stringify(clone));
}
await browser.close();
