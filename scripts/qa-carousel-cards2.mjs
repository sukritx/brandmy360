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
    const track = sec.querySelector('ul');
    return {
      trackH: Math.round(track.getBoundingClientRect().height),
      cards: [...track.children].map((li, i) => {
        const a = li.querySelector('a') || li;
        return {
          i,
          liH: Math.round(li.getBoundingClientRect().height),
          aH: Math.round(a.getBoundingClientRect().height),
          w: Math.round(li.getBoundingClientRect().width),
          titleLines: (() => { const p = a.querySelector('p'); return p ? Math.round(p.getBoundingClientRect().height / 24) : 0; })(),
          hasStamp: /absolute -bottom-2.5/.test(a.innerHTML),
          stampText: (() => { const s = a.querySelector('span.absolute'); return s ? s.textContent : null; })(),
          badge: (() => { const b = [...a.querySelectorAll('span')].find((x) => /ago|ends in|left|goal|sold|placements/i.test(x.textContent) && x.children.length === 0); return b ? b.textContent.trim().slice(0, 24) : null; })(),
          title: (a.querySelector('p') || {}).textContent?.slice(0, 40),
          dashed: a.querySelectorAll('div[class*="border-dashed"]').length,
        };
      }),
    };
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/');
console.log('LIVE trackH', live.trackH);
live.cards.forEach((c) => console.log(` #${c.i} li${c.liH} a${c.aH} w${c.w} lines${c.titleLines} dashed${c.dashed} stamp=${c.stampText} badge=${c.badge} | ${c.title}`));
const clone = await read('http://localhost:3000/');
console.log('CLONE trackH', clone.trackH);
clone.cards.forEach((c) => console.log(` #${c.i} li${c.liH} a${c.aH} w${c.w} lines${c.titleLines} dashed${c.dashed} stamp=${c.stampText} badge=${c.badge} | ${c.title}`));
await browser.close();
