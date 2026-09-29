import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = [
  ['root', '/', 'root-7280be29'],
  ['brands', '/brands', 'brands-b0addea9'],
  ['briefs', '/briefs', 'briefs-dc03d02e'],
  ['stats', '/stats', 'stats-d8625d36'],
  ['sell', '/sell', 'sell-826541f7'],
];
const OUT = 'docs/design-references/brandmylaptop-com-284b5fbe/_clone';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });
const report = {};
for (const [name, path, key] of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
  await sleep(1200);
  const h = await page.evaluate(() => document.body.scrollHeight);
  await page.screenshot({ path: `${OUT}/${name}-desktop-full.png`, fullPage: true });
  await page.setViewport({ width: 390, height: 844 });
  await sleep(1200);
  await page.screenshot({ path: `${OUT}/${name}-mobile-full.png`, fullPage: true });
  const h2 = await page.evaluate(() => document.body.scrollHeight);
  report[name] = { desktopH: h, mobileH: h2 };
  // console errors
  const errors = await page.evaluate(() => (window.__errs || []).slice(0, 5));
  report[name].errors = errors;
  console.log(name, 'desktop h =', h, '| mobile h =', h2);
  await page.close();
}
fs.writeFileSync(`${OUT}/_report.json`, JSON.stringify(report, null, 1));
await browser.close();
console.log('CLONE SHOTS DONE');
