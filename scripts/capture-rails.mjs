import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2' });
await sleep(3500);
const info = await page.evaluate(() => {
  const asides = [...document.querySelectorAll('aside[aria-label="Sponsors"]')];
  return asides.map((a) => ({
    side: a.className.includes('left-2') ? 'left' : 'right',
    cls: a.className,
    lis: [...a.querySelectorAll('li')].map((li) => ({
      placeholder: li.innerHTML.includes('border-dashed'),
      text: li.innerText.replace(/\n/g, ' | '),
      href: (li.querySelector('a') || {}).getAttribute?.('href') || null,
      logo: (li.querySelector('img') || {}).getAttribute?.('src') || null,
      liCls: li.className,
      aCls: (li.querySelector('a') || {}).className || null,
    })),
  }));
});
console.log(JSON.stringify(info, null, 1).slice(0, 4000));
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/_shared-html/rails-live.json', JSON.stringify(info, null, 1));
// also capture each rail item's full HTML (first of each type)
const html = await page.evaluate(() => {
  const asides = [...document.querySelectorAll('aside[aria-label="Sponsors"]')];
  return asides.map((a) => ({
    side: a.className.includes('left-2') ? 'left' : 'right',
    outer: a.outerHTML,
  }));
});
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/_shared-html/rails-full.json', JSON.stringify(html, null, 1));
console.log('full rail html bytes:', html.map((h) => h.outer.length));
await browser.close();
