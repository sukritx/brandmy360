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
    const sec = [...document.querySelectorAll('section')].find((s) => /Featured now/.test(s.textContent));
    if (!sec) return { error: 'not found' };
    const cs = getComputedStyle(sec);
    const track = sec.querySelector('ul');
    const card = sec.querySelector('li');
    const h2 = sec.querySelector('h2');
    const inner = sec.firstElementChild;
    return {
      secCls: sec.className,
      secPad: `${cs.paddingTop} ${cs.paddingBottom}`,
      secMt: cs.marginTop,
      secH: Math.round(sec.getBoundingClientRect().height),
      innerH: inner ? Math.round(inner.getBoundingClientRect().height) : null,
      h2H: h2 ? Math.round(h2.getBoundingClientRect().height) : null,
      trackH: track ? Math.round(track.getBoundingClientRect().height) : null,
      cardH: card ? Math.round(card.getBoundingClientRect().height) : null,
      cardW: card ? Math.round(card.getBoundingClientRect().width) : null,
      cardTitleH: card ? Math.round((card.querySelector('p') || { getBoundingClientRect: () => ({ height: 0 }) }).getBoundingClientRect().height) : null,
      dotsH: (() => { const d = sec.querySelector('[role="tablist"], nav, [class*="dot"]'); return d ? Math.round(d.getBoundingClientRect().height) : null; })(),
      children: [...inner.children].map((c) => ({ tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), cls: (c.className || '').toString().slice(0, 60) })),
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
