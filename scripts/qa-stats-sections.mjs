import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(900);
  const out = await page.evaluate(() => {
    const main = document.querySelector('main');
    const secs = [...main.querySelectorAll(':scope > *')].map((el, i) => {
      const r = el.getBoundingClientRect();
      return { i, tag: el.tagName, y: Math.round(r.top + window.scrollY), h: Math.round(r.height), t: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 55) };
    }).filter((s) => s.h > 30);
    return { total: document.body.scrollHeight, secs };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/stats');
const clone = await read('http://localhost:3000/stats');
console.log('LIVE total', live.total, '| CLONE total', clone.total);
const n = Math.max(live.secs.length, clone.secs.length);
for (let i = 0; i < n; i++) {
  const a = live.secs[i];
  const b = clone.secs[i];
  console.log(`#${i} LIVE ${a ? `y${a.y} h${a.h} ${a.t.slice(0, 40)}` : '-'}`);
  console.log(`   CLONE ${b ? `y${b.y} h${b.h} ${b.t.slice(0, 40)}` : '-'}${a && b && Math.abs(a.h - b.h) > 30 ? '   <<< HEIGHT DIFF' : ''}`);
}
await browser.close();
