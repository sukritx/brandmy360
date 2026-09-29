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
const info = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bar = document.querySelector('aside[class*="z-[55]"]');
  if (!bar) return { error: 'no bar' };
  const lists = [...bar.querySelectorAll('ul')];
  const slots = lists.map((ul) => [...ul.querySelectorAll('a')].map((a) => a.getAttribute('href')));
  const scroller = bar.firstElementChild;
  const before = scroller.scrollLeft;
  await sleep(2500);
  const after = scroller.scrollLeft;
  const anim = getComputedStyle(lists[0]).animationName;
  const divAnim = getComputedStyle(bar.querySelector('div.flex.w-max') || lists[0].parentElement).animationName;
  return {
    listCount: lists.length,
    ariaHidden: lists.map((l) => l.getAttribute('aria-hidden')),
    slots,
    scrollerCls: scroller.className,
    scrollBefore: before,
    scrollAfter: after,
    autoScrolls: after !== before,
    listAnim: anim,
    trackAnim: divAnim,
    trackCls: (bar.querySelector('div.flex.w-max') || {}).className,
    listCls: lists[0].className,
    barStyle: bar.getAttribute('style'),
  };
});
console.log(JSON.stringify(info, null, 1));
// desktop visibility
await page.setViewport({ width: 1440, height: 900 });
await sleep(1500);
const desktop = await page.evaluate(() => {
  const bar = document.querySelector('aside[class*="z-[55]"]');
  return { exists: !!bar, visible: bar ? getComputedStyle(bar).display !== 'none' : false, bodyClass: document.body.className };
});
console.log('desktop:', JSON.stringify(desktop));
await browser.close();
