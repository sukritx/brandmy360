import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { console.log('retry', i + 1); await sleep(3000); }
}
await sleep(2500);
await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 110); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
await sleep(1500);

const rows = await page.evaluate(`(() => {
  const out = [];
  for (const li of document.querySelectorAll('#laptops li, section li')) {
    if (!li.querySelector('div[style*="container-type"]')) continue;
    const title = li.querySelector('p');
    if (!title) continue;
    const priceRow = [...li.querySelectorAll('div')].find((d) => /items-baseline/.test(d.className) && /\\$/.test(d.textContent));
    const spans = priceRow ? [...priceRow.querySelectorAll(':scope > span')] : [];
    const left = spans[0] ? spans[0].textContent.replace(/\\s+/g, ' ').trim() : null;
    const goal = spans[0] ? (spans[0].querySelector('span') ? spans[0].querySelector('span').textContent.trim() : null) : null;
    const right = spans[1] ? spans[1].textContent.replace(/\\s+/g, ' ').trim() : null;
    out.push({ title: title.textContent.trim().slice(0, 55), left, goal, right });
  }
  return out;
})()`);
fs.writeFileSync(`docs/research/${SITE}/root-7280be29/card-labels.json`, JSON.stringify(rows, null, 1));
console.log('cards:', rows.length);
console.log(JSON.stringify(rows.slice(0, 12), null, 1));
await browser.close();
