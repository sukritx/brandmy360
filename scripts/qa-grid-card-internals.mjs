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
    const li = document.querySelector('#laptops li');
    const a = li.querySelector('a');
    return {
      liH: Math.round(li.getBoundingClientRect().height),
      aH: Math.round(a.getBoundingClientRect().height),
      aPad: getComputedStyle(a).padding,
      children: [...a.children].map((c) => {
        const cs = getComputedStyle(c);
        return { tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), mt: cs.marginTop, pt: cs.paddingTop, cls: (c.className || '').toString().slice(0, 40), text: (c.innerText || '').slice(0, 25) };
      }),
      inner: (() => {
        const p = [...a.querySelectorAll('p')];
        return p.map((x) => ({ h: Math.round(x.getBoundingClientRect().height), lh: getComputedStyle(x).lineHeight, fs: getComputedStyle(x).fontSize, cls: x.className.slice(0, 45), t: (x.innerText || '').slice(0, 22) }));
      })(),
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
