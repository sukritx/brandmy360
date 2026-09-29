import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = 'docs/design-references/brandmylaptop-com-284b5fbe/_clone';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/giulia', { waitUntil: 'networkidle2' });
await sleep(2500);
await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
await sleep(1200);
await page.screenshot({ path: `${OUT}/giulia-desktop-full.png`, fullPage: true });

// interactions: toggle group + spot hover
const checks = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = {};
  const group = document.querySelector('[role="group"][aria-label="Lid view"]');
  const btns = group ? [...group.querySelectorAll('button')] : [];
  out.toggleInitial = btns.map((b) => b.getAttribute('aria-pressed'));
  if (btns[1]) { btns[1].click(); await sleep(300); }
  out.toggleAfter = btns.map((b) => b.getAttribute('aria-pressed'));
  out.finalLookActive = btns[1] ? btns[1].className.includes('bg-white') : null;
  if (btns[0]) btns[0].click();
  await sleep(200);
  const cells = [...document.querySelectorAll('div[style*="grid-area"] a[aria-label^="Spot"]')];
  out.spotCells = cells.length;
  out.firstAria = cells[0] ? cells[0].getAttribute('aria-label') : null;
  const pillLayer = cells[0] ? cells[0].parentElement.querySelector('span[class*="opacity-0"]') : null;
  out.visitPill = pillLayer ? pillLayer.textContent.trim() : null;
  out.progress = (() => { const p = document.querySelector('[role="progressbar"]'); return p ? { now: p.getAttribute('aria-valuenow'), width: p.firstElementChild.style.width } : null; })();
  out.tableViewport = !!document.querySelector('table');
  out.mobileListPresent = !!document.querySelector('ul.sm\\:hidden');
  return out;
});
console.log('interaction checks:', JSON.stringify(checks, null, 1));

// hover a spot cell and screenshot the lid
const lid = await page.$('div[style*="container-type"]');
if (lid) {
  const cell = await page.$('div[style*="grid-area: 1 / 1"] a[aria-label^="Spot"]');
  if (cell) {
    await cell.hover();
    await sleep(500);
    await lid.screenshot({ path: `${OUT}/giulia-lid-hover.png` });
    console.log('hover screenshot saved');
  }
  await page.mouse.move(0, 0);
  await sleep(400);
  await lid.screenshot({ path: `${OUT}/giulia-lid.png` });
}
await page.setViewport({ width: 390, height: 844 });
await sleep(1200);
await page.screenshot({ path: `${OUT}/giulia-mobile-full.png`, fullPage: true });
console.log('mobile h:', await page.evaluate(() => document.body.scrollHeight));
await browser.close();
console.log('GIULIA SHOTS DONE');
