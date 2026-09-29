import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [name, path, key, offsetsJson] = process.argv.slice(2);
const offsets = JSON.parse(fs.readFileSync(offsetsJson, 'utf8'));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle2' });
await sleep(2200);
await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 80); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
await sleep(900);
const dir = `docs/design-references/brandmylaptop-com-284b5fbe/_clone/${key}`;
fs.mkdirSync(dir, { recursive: true });
for (const o of offsets) {
  try {
    await page.screenshot({ path: `${dir}/${String(o.i).padStart(2, '0')}-y${o.y}-h${o.h}.png`, clip: { x: 0, y: o.y, width: 1440, height: Math.min(o.h, 6000) }, captureBeyondViewport: true });
  } catch (e) { console.log('fail', o.i, String(e).slice(0, 60)); }
}
console.log(name, 'crops done:', offsets.length);
await browser.close();
