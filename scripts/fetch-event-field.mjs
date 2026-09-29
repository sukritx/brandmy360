import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/briefs', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { await sleep(2500); }
}
await sleep(2500);
const html = await page.evaluate(() => {
  const form = document.querySelector('form');
  if (!form) return 'NO FORM';
  const label = [...form.querySelectorAll('label, span, div')].find((el) => el.textContent.trim().startsWith('At an event?') && el.textContent.length < 200);
  if (!label) return 'NO LABEL';
  // climb to the field wrapper (the element that also contains the input)
  let node = label;
  while (node && node !== form && !node.querySelector('input, select, textarea')) node = node.parentElement;
  const wrap = node && node !== form ? node : label.parentElement;
  return (wrap ? wrap.parentElement : label).outerHTML;
});
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/briefs-dc03d02e/event-field.html', html);
console.log(html.replace(/></g, '>\n<').slice(0, 3000));
await browser.close();
