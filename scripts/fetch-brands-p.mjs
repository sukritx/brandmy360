import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/brands', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { await sleep(2500); }
}
await sleep(2500);
const out = await page.evaluate(() => {
  const main = document.querySelector('main');
  const p = main.children[5];
  return p ? { text: p.innerText, html: p.outerHTML } : null;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
