import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const KEY = 'giulia-96b78fb0';
const shotDir = path.join('docs', 'design-references', SITE, KEY);
const resDir = path.join('docs', 'research', SITE, KEY);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (o, n) => fs.writeFileSync(path.join(resDir, n), typeof o === 'string' ? o : JSON.stringify(o, null, 1));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/giulia', { waitUntil: 'networkidle2', timeout: 120000 }); break; }
  catch (e) { console.log('retry', i + 1); await sleep(3000); }
}
await sleep(2500);
await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 400; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 160); else { window.scrollTo(0, 0); setTimeout(r, 900); } }; s(); }); });
await sleep(1500);

// ---- section crops ----
fs.mkdirSync(path.join(shotDir, 'sections-desktop'), { recursive: true });
const secs = await page.evaluate(() => {
  const root = document.querySelector('main') || document.body;
  return [...root.children].map((el, i) => {
    const r = el.getBoundingClientRect();
    return { i, y: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
  }).filter((s) => s.h > 20);
});
for (const s of secs) {
  try {
    await page.screenshot({ path: path.join(shotDir, 'sections-desktop', `${String(s.i).padStart(2, '0')}-y${s.y}-h${s.h}.png`), clip: { x: 0, y: s.y, width: 1440, height: Math.min(s.h, 6000) }, captureBeyondViewport: true });
  } catch (e) { console.log('crop fail', s.i, String(e).slice(0, 50)); }
}
console.log('crops done:', secs.length);

// ---- structured data ----
const data = await page.evaluate(`(() => {
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const header = q('main > header') || q('header');
  const priceCells = qa('div[style*="grid-area"]').filter((c) => /€/.test(c.textContent));
  return {
    hero: {
      views: (header.innerText.match(/[\\d,]+ views/) || [])[0] || null,
      h1: q('h1') ? q('h1').textContent.trim() : null,
      soldLine: (header.innerText.match(/[\\d\\s\\u00a0]+€\\s*sold/) || [])[0] || null,
      goalLine: (header.innerText.match(/goal passed[^\\n]*/) || [])[0] || null,
      closedNote: (header.innerText.match(/This lid is no longer[^\\n]*/) || [])[0] || null,
      author: (() => { const a = header.innerText.match(/giulia[\\s\\S]{0,80}/); return a ? a[0].replace(/\\n/g, ' | ') : null; })(),
      tags: qa('span,div').filter((e) => /^(For sale|Final look|Auction|Sold out)$/.test(e.textContent.trim()) && e.children.length === 0).map((e) => ({ t: e.textContent.trim(), cls: e.className.slice(0, 70) })),
      lidNote: (header.innerText.match(/This lid is closed[^\\n]*/) || [])[0] || null,
      stickerBar: (header.innerText.match(/BrandMyLaptop[^\\n]*by[^\\n]*/) || [])[0] || null,
    },
    prices: priceCells.map((c) => ({ area: (c.getAttribute('style') || '').match(/grid-area:\\s*([^;"]+)/)?.[1]?.trim(), text: c.innerText.replace(/\\n/g, ' | '), cls: c.className.slice(0, 80), html: c.outerHTML.slice(0, 900) })),
    details: (() => {
      const sec = qa('section').find((s) => /The details/.test(s.textContent));
      if (!sec) return null;
      return { html: sec.outerHTML.slice(0, 40000), text: sec.innerText.slice(0, 2500) };
    })(),
    spots: (() => {
      const sec = qa('section').find((s) => /The spots\\./.test(s.textContent));
      if (!sec) return null;
      const rows = qa('tr', sec).map((tr) => qa('td,th', tr).map((td) => td.innerText.replace(/\\n/g, ' | ').trim()));
      const imgs = qa('img', sec).map((i) => i.getAttribute('src'));
      return { heading: q(sec, 'h2')?.textContent, sub: q(sec, 'p')?.textContent, rows, imgs, html: sec.outerHTML.slice(0, 40000) };
    })(),
    others: (() => {
      const sec = qa('section').find((s) => /Other laptops looking for brands/.test(s.textContent));
      if (!sec) return null;
      return {
        heading: q(sec, 'h2')?.textContent,
        sub: q(sec, 'p')?.textContent,
        cards: qa('li', sec).map((li) => ({ text: li.innerText.replace(/\\n/g, ' | '), html: li.outerHTML.slice(0, 4000), href: li.querySelector('a')?.getAttribute('href') })),
      };
    })(),
  };
})()`);
write(data, 'page-data.json');
console.log('hero:', JSON.stringify(data.hero, null, 1).slice(0, 700));
console.log('prices:', data.prices.length, 'spots rows:', data.spots ? data.spots.rows.length : 0, 'other cards:', data.others ? data.others.cards.length : 0);
await browser.close();
console.log('GIULIA DATA DONE');
