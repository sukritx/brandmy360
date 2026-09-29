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
    const cards = [...sec.querySelectorAll('li')];
    return cards.map((li, idx) => {
      const a = li.querySelector('a') || li;
      const walk = (el, d) => {
        const r = el.getBoundingClientRect();
        return {
          d,
          tag: el.tagName,
          h: Math.round(r.height),
          cls: (el.className || '').toString().slice(0, 55),
          own: [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').slice(0, 40),
        };
      };
      const rows = [];
      const rec = (el, d) => {
        if (d > 2) return;
        rows.push(walk(el, d));
        [...el.children].forEach((c) => rec(c, d + 1));
      };
      rec(a, 0);
      return { idx, h: Math.round(li.getBoundingClientRect().height), rows: rows.slice(0, 30) };
    });
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/');
const clone = await read('http://localhost:3000/');
for (let i = 0; i < Math.min(live.length, clone.length); i++) {
  console.log(`\n--- CARD ${i}: LIVE h${live[i].h} vs CLONE h${clone[i].h} ---`);
  const n = Math.max(live[i].rows.length, clone[i].rows.length);
  for (let k = 0; k < n; k++) {
    const a = live[i].rows[k];
    const b = clone[i].rows[k];
    const ha = a ? a.h : null;
    const hb = b ? b.h : null;
    const flag = ha !== hb ? '  <<< h' + (hb - ha) : '';
    console.log(`  L ${a ? `${' '.repeat(a.d)}${a.tag} h${a.h} ${a.cls} ${a.own}` : '-'}`);
    if (flag) console.log(`  C ${b ? `${' '.repeat(b.d)}${b.tag} h${b.h} ${b.cls} ${b.own}` : '-'}${flag}`);
  }
}
await browser.close();
