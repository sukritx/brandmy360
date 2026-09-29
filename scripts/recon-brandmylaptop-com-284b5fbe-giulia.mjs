import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const APP = process.cwd();
const URL_ = 'https://brandmylaptop.com/giulia';
const KEY = 'giulia-96b78fb0';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const shotDir = path.join(APP, 'docs', 'design-references', SITE, KEY);
const resDir = path.join(APP, 'docs', 'research', SITE, KEY);
fs.mkdirSync(shotDir, { recursive: true });
fs.mkdirSync(resDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-color-profile=srgb'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
for (let i = 0; i < 4; i++) {
  try { await page.goto(URL_, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
  catch (e) { console.log('retry', i + 1, String(e).slice(0, 60)); await sleep(3000); }
}
await sleep(2500);
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const step = () => {
      y += 400;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight + 800) setTimeout(step, 180);
      else { window.scrollTo(0, 0); setTimeout(res, 900); }
    };
    step();
  });
});
await sleep(1500);

const info = await page.evaluate(() => {
  const root = document.querySelector('main') || document.body;
  const secs = [...root.children].map((el, i) => {
    const r = el.getBoundingClientRect();
    return {
      i,
      tag: el.tagName,
      cls: (el.className || '').toString(),
      y: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      html: el.outerHTML.length < 60000 ? el.outerHTML : el.outerHTML.slice(0, 60000),
    };
  }).filter((s) => s.h > 20);
  return { total: document.body.scrollHeight, bodyClass: document.body.className, mainCls: root.className, secs };
});

fs.mkdirSync(path.join(resDir, 'sections-html'), { recursive: true });
for (const s of info.secs) {
  fs.writeFileSync(path.join(resDir, 'sections-html', `${String(s.i).padStart(2, '0')}-y${s.y}.html`), s.html);
}
fs.writeFileSync(path.join(resDir, '_index.json'), JSON.stringify(info.secs.map(({ html, ...rest }) => rest), null, 1));
fs.writeFileSync(path.join(resDir, 'rendered.html'), await page.evaluate(() => document.documentElement.outerHTML));

await page.screenshot({ path: path.join(shotDir, 'desktop-1440-full.png'), fullPage: true });
for (const s of info.secs) {
  try {
    await page.screenshot({ path: path.join(shotDir, `sections-desktop/${String(s.i).padStart(2, '0')}-y${s.y}-h${s.h}.png`), clip: { x: 0, y: s.y, width: 1440, height: Math.min(s.h, 6000) }, captureBeyondViewport: true });
  } catch (e) { console.log('crop fail', s.i, String(e).slice(0, 60)); }
}
await page.setViewport({ width: 390, height: 844 });
await sleep(1200);
await page.screenshot({ path: path.join(shotDir, 'mobile-390-full.png'), fullPage: true });
const mobileH = await page.evaluate(() => document.body.scrollHeight);

console.log('total h:', info.total, '| mobile h:', mobileH, '| sections:', info.secs.length);
info.secs.forEach((s) => console.log(`  #${s.i} ${s.tag} y${s.y} h${s.h} | ${s.cls.slice(0, 60)} | ${s.text.slice(0, 70)}`));
await browser.close();
console.log('GIULIA RECON DONE');
