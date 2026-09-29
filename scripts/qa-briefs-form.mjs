import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2500);
  const out = await page.evaluate(() => {
    const main = document.querySelector('main');
    const form = main ? main.querySelector('form') : null;
    if (!form) return { error: 'no form' };
    return {
      formHeight: Math.round(form.getBoundingClientRect().height),
      fields: [...form.querySelectorAll('fieldset, legend, label, input, textarea, button')].map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), t: (el.innerText || el.placeholder || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 45), h: Math.round(r.height), y: Math.round(r.top) };
      }).filter((f) => f.h > 0).slice(0, 60),
    };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/briefs');
const clone = await read('http://localhost:3000/briefs');
console.log('LIVE form h', live.formHeight, 'fields', live.fields.length);
console.log('CLONE form h', clone.formHeight, 'fields', clone.fields.length);
const n = Math.max(live.fields.length, clone.fields.length);
for (let i = 0; i < n; i++) {
  const a = live.fields[i];
  const b = clone.fields[i];
  console.log(`#${i} L: ${a ? `${a.tag} "${a.t}" h${a.h}` : '-'}`);
  if (!a || !b || a.t !== b.t) console.log(`     C: ${b ? `${b.tag} "${b.t}" h${b.h}` : '-'}   <<<`);
}
await browser.close();
