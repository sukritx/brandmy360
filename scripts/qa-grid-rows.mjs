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
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < 4200) setTimeout(s, 100); else setTimeout(r, 800); }; s(); }); });
  await sleep(1200);
  const out = await page.evaluate(() => [...document.querySelectorAll('#laptops li')].map((li) => {
    const a = li.querySelector('a');
    const titleEl = a.querySelector('p');
    return {
      h: Math.round(li.getBoundingClientRect().height),
      titleH: titleEl ? Math.round(titleEl.getBoundingClientRect().height) : 0,
      followersH: (() => { const s = a.querySelector('p span.inline-flex'); return s ? Math.round(s.getBoundingClientRect().height) : 0; })(),
      title: (titleEl || {}).textContent?.slice(0, 34),
    };
  }));
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/');
const clone = await read('http://localhost:3000/');
for (let i = 0; i < Math.max(live.length, clone.length); i++) {
  const a = live[i];
  const b = clone[i];
  const diff = a && b ? b.h - a.h : '?';
  console.log(`#${i} L h${a ? a.h : '-'} (t${a ? a.titleH : '-'}) C h${b ? b.h : '-'} (t${b ? b.titleH : '-'}) Δ${diff}${diff !== 0 ? '  <<<' : ''} | ${(a || b || {}).title}`);
}
await browser.close();
