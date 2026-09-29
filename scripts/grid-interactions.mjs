import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (o, n) => fs.writeFileSync(`docs/research/${SITE}/root-7280be29/${n}`, typeof o === 'string' ? o : JSON.stringify(o, null, 1));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2' });
await sleep(3000);
await page.evaluate(() => document.getElementById('laptops')?.scrollIntoView());
await sleep(1500);

const filterDumps = {};
for (const label of ['Most raised', 'Seen at', 'Ownership', 'How you buy', 'Who they are']) {
  const r = await page.evaluate(async (label) => {
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    const sec = document.getElementById('laptops');
    const btn = [...sec.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(label));
    if (!btn) return { error: 'button not found ' + label };
    btn.click();
    await sleep(600);
    const wrap = btn.parentElement;
    const panel = wrap.querySelector('[role="menu"], [data-open], div[class*="absolute"]');
    const html = wrap.outerHTML.slice(0, 8000);
    // capture option labels
    const opts = panel ? [...panel.querySelectorAll('button, label, a')].map((o) => o.textContent.trim().slice(0, 60)) : [];
    btn.click();
    await sleep(300);
    return { html, opts };
  }, label);
  filterDumps[label] = r;
}
write(filterDumps, 'filters.json');

// sort behaviour: pick 2nd option of "Most raised"
const sortBehav = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const sec = document.getElementById('laptops');
  const btn = [...sec.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith('Most raised'));
  const first = () => [...sec.querySelectorAll('li')].slice(0, 3).map((li) => li.innerText.replace(/\n/g, ' | ').slice(0, 90));
  const before = first();
  btn.click();
  await sleep(500);
  const opts = [...btn.parentElement.querySelectorAll('button')];
  const target = opts[1];
  if (target) target.click();
  await sleep(1500);
  const after = first();
  return { before, after, optionTexts: opts.map((o) => o.textContent.trim()) };
});
write(sortBehav, 'sort-behavior.json');

// show more
const moreBehav = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const sec = document.getElementById('laptops');
  const before = sec.querySelectorAll('li').length;
  const btn = [...sec.querySelectorAll('button')].find((b) => /Show .* more/.test(b.textContent));
  if (!btn) return { error: 'no show more' };
  btn.scrollIntoView({ block: 'center' });
  btn.click();
  await sleep(2500);
  const after = sec.querySelectorAll('li').length;
  const label = [...sec.querySelectorAll('button')].find((b) => /Show .* more/.test(b.textContent));
  return { before, after, newLabel: label ? label.textContent.trim() : null };
});
write(moreBehav, 'show-more-behavior.json');
console.log('filters:', Object.entries(filterDumps).map(([k, v]) => `${k}:${v.error ? 'ERR' : (v.opts || []).length}`).join(' '));
console.log('sort:', JSON.stringify(sortBehav.optionTexts));
console.log('showMore:', JSON.stringify(moreBehav));

// full first card html after loading more
const cardHtml = await page.evaluate(() => {
  const sec = document.getElementById('laptops');
  const li = sec.querySelector('li');
  return li ? li.outerHTML : null;
});
write(cardHtml, 'grid-card-full.html');
await browser.close();
console.log('GRID INTERACTIONS DONE');
