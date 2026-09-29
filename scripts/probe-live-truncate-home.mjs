import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 120000 }); break; }
  catch (e) { await sleep(3000); }
}
await sleep(2500);
const out = await page.evaluate(() => {
  const els = [...document.querySelectorAll('.truncate')].slice(0, 40);
  const sample = els.slice(0, 6).map((e) => ({ tag: e.tagName, ws: getComputedStyle(e).whiteSpace, tw: getComputedStyle(e).textWrap, cls: e.className.slice(0, 50), t: (e.textContent || '').slice(0, 26) }));
  const counts = { total: els.length, nowrap: els.filter((e) => getComputedStyle(e).whiteSpace === 'nowrap').length };
  let hasRule = false;
  for (const sheet of document.styleSheets) {
    try { for (const r of sheet.cssRules) if (/\.truncate\b/.test(r.cssText || '')) hasRule = true; } catch {}
  }
  return { counts, sample, hasRule, sheet: [...document.styleSheets].map((s) => (s.href || '').split('/').pop()).join(',') };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
