import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
    catch (e) { await sleep(3000); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
  await sleep(900);
  const out = await page.evaluate(() => {
    const sec = document.getElementById('spots');
    if (!sec) return { error: 'no #spots' };
    const inner = sec.firstElementChild;
    const cs = getComputedStyle(sec);
    return {
      secCls: sec.className.slice(0, 90),
      secH: Math.round(sec.getBoundingClientRect().height),
      pad: `${cs.paddingTop}/${cs.paddingBottom}`,
      kids: [...inner.children].map((c) => ({ tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), cls: (c.className || '').toString().slice(0, 80), t: (c.innerText || '').replace(/\s+/g, ' ').slice(0, 30) })),
    };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/giulia');
const clone = await read('http://localhost:3000/giulia');
console.log('LIVE ', JSON.stringify(live, null, 1));
console.log('CLONE', JSON.stringify(clone, null, 1));
await browser.close();
