import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = 'docs/design-references/brandmylaptop-com-284b5fbe/_clone';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });

// desktop rails check
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await sleep(2200);
  const rails = await page.evaluate(() => [...document.querySelectorAll('aside[data-overlay]')].map((a) => ({ h: Math.round(a.getBoundingClientRect().height), display: getComputedStyle(a).display, x: Math.round(a.getBoundingClientRect().x), w: Math.round(a.getBoundingClientRect().width) })));
  console.log('desktop rails:', JSON.stringify(rails));
  await page.close();
}
// mobile screenshots (top + bar area)
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await sleep(2500);
  await page.screenshot({ path: `${OUT}/mobile-home-top.png` });
  await page.evaluate(() => window.scrollTo(0, 400));
  await sleep(900);
  await page.screenshot({ path: `${OUT}/mobile-home-scrolled.png` });
  const bar = await page.evaluate(() => {
    const a = document.querySelector('aside[class*="z-[55]"]');
    const r = a ? a.getBoundingClientRect() : null;
    return r ? { top: Math.round(r.top), h: Math.round(r.height), visible: r.height > 0 } : null;
  });
  console.log('mobile bar:', JSON.stringify(bar));
  await page.close();
}
await browser.close();
