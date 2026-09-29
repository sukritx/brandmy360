import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const APP = process.cwd();
const URL_ = process.argv[2];
const KEY = process.argv[3];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-color-profile=srgb'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL_, { waitUntil: 'networkidle2', timeout: 120000 });
await sleep(2500);

// slow scroll to trigger all lazy content
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const step = () => {
      y += 300;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight + 1200) setTimeout(step, 220);
      else { window.scrollTo(0, 0); setTimeout(res, 1500); }
    };
    step();
  });
});
await sleep(2500);

const dump = await page.evaluate(() => {
  const root = document.querySelector('main') || document.body;
  const sections = [];
  [...root.children].forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.height < 40) return;
    sections.push({ i, y: Math.round(r.top + window.scrollY), h: Math.round(r.height), cls: (el.className || '').toString(), html: el.outerHTML });
  });
  return sections;
});

const dir = path.join(APP, 'docs', 'research', SITE, KEY, 'sections-html');
fs.mkdirSync(dir, { recursive: true });
for (const s of dump) {
  fs.writeFileSync(path.join(dir, `${String(s.i).padStart(2, '0')}-y${s.y}.html`), s.html);
}
fs.writeFileSync(path.join(dir, '_index.json'), JSON.stringify(dump.map(({ html, ...rest }) => rest), null, 1));

// re-crop with content loaded
const cdir = path.join(APP, 'docs', 'design-references', SITE, KEY, 'sections-desktop');
fs.mkdirSync(cdir, { recursive: true });
for (const s of dump) {
  await page.evaluate((yy) => window.scrollTo(0, Math.max(0, yy - 100)), s.y);
  await sleep(900);
  await page.evaluate((yy) => window.scrollTo(0, yy), s.y);
  await sleep(700);
  try {
    await page.screenshot({ path: path.join(cdir, `${String(s.i).padStart(2, '0')}-y${s.y}-h${s.h}.png`), clip: { x: 0, y: s.y, width: 1440, height: Math.min(s.h, 6000) }, captureBeyondViewport: true });
  } catch (e) { console.log('crop fail', s.i, e.message.slice(0, 60)); }
}
console.log(`${KEY}: ${dump.length} sections dumped, h=${await page.evaluate(() => document.body.scrollHeight)}`);
fs.writeFileSync(path.join(APP, 'docs', 'research', SITE, KEY, 'rendered-slow.html'), await page.evaluate(() => document.documentElement.outerHTML));
await browser.close();
console.log('DEEP DONE');
