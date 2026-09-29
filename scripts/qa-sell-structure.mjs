import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 1000 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2500);
  const out = await page.evaluate(() => {
    const wrap = document.querySelector('main > div') || document.querySelector('main') || document.body;
    const h1 = document.querySelector('h1');
    const grid = document.querySelector('main div[class*="md:grid-cols"]');
    const left = grid ? grid.children[0] : null;
    const right = grid ? grid.children[1] : null;
    return {
      wrapH: Math.round(wrap.getBoundingClientRect().height),
      wrapCls: (wrap.className || '').toString().slice(0, 50),
      h1H: h1 ? Math.round(h1.getBoundingClientRect().height) : null,
      h1Text: h1 ? h1.textContent.slice(0, 20) : null,
      gridH: grid ? Math.round(grid.getBoundingClientRect().height) : null,
      gridCls: grid ? grid.className.slice(0, 80) : null,
      leftH: left ? Math.round(left.getBoundingClientRect().height) : null,
      leftCls: left ? left.className.slice(0, 60) : null,
      rightH: right ? Math.round(right.getBoundingClientRect().height) : null,
      rightCls: right ? right.className.slice(0, 60) : null,
      kids: wrap ? [...wrap.children].map((c) => ({ tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), cls: (c.className || '').toString().slice(0, 45), t: (c.innerText || '').replace(/\s+/g, ' ').slice(0, 32) })) : [],
    };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/sell');
const clone = await read('http://localhost:3000/sell');
console.log('LIVE ', JSON.stringify(live, null, 1));
console.log('CLONE', JSON.stringify(clone, null, 1));
await browser.close();
