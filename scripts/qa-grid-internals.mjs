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
  const out = await page.evaluate(() => {
    const sec = document.querySelector('#laptops');
    const inner = sec.querySelector('div');
    return {
      secH: Math.round(sec.getBoundingClientRect().height),
      children: [...inner.children].map((c) => ({ tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), cls: (c.className || '').toString().slice(0, 55), text: (c.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 35) })),
      cardCount: sec.querySelectorAll('li').length,
      gridH: (() => { const ul = sec.querySelector('ul'); return ul ? Math.round(ul.getBoundingClientRect().height) : null; })(),
      rowH: (() => { const li = sec.querySelector('li'); return li ? Math.round(li.getBoundingClientRect().height) : null; })(),
    };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/');
const clone = await read('http://localhost:3000/');
console.log('LIVE ', JSON.stringify(live, null, 1));
console.log('CLONE', JSON.stringify(clone, null, 1));
await browser.close();
