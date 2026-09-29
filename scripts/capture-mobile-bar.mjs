import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { await sleep(2500); }
}
await sleep(3000);
const out = await page.evaluate(() => {
  const asides = [...document.querySelectorAll('aside')];
  return {
    bodyClass: document.body.className,
    asides: asides.map((a) => ({ cls: a.className, label: a.getAttribute('aria-label'), h: Math.round(a.getBoundingClientRect().height), html: a.outerHTML.length > 4000 ? a.outerHTML.slice(0, 4000) : a.outerHTML })),
  };
});
console.log('body class @390:', out.bodyClass);
out.asides.forEach((a, i) => {
  console.log(`\n=== ASIDE ${i} h${a.h} label=${a.label} ===\n${a.cls}`);
});
const bar = out.asides.find((a) => /z-\[55\]/.test(a.cls));
if (bar) {
  fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/_shared-html/mobile-ad-bar.html', bar.html);
  console.log('\n--- BAR MARKUP ---');
  console.log(bar.html.replace(/></g, '>\n<').slice(0, 3000));
} else {
  console.log('\nno z-[55] aside found');
  console.log(JSON.stringify(out.asides.map((a) => a.cls), null, 1));
}
// capture sponsors inside the bar
const items = await page.evaluate(() => {
  const bar = document.querySelector('aside[class*="z-[55]"]');
  if (!bar) return null;
  return [...bar.querySelectorAll('a')].map((a) => ({ href: a.getAttribute('href'), text: a.innerText.replace(/\n/g, ' | '), img: (a.querySelector('img') || {}).src }));
});
console.log('\nBAR ITEMS:', JSON.stringify(items, null, 1));
await browser.close();
