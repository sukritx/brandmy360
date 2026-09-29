import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { await sleep(2500); }
}
await sleep(3000);

const CARDS = `(() => {
  const sec = [...document.querySelectorAll('section')].find((s) => /Featured now/.test(s.textContent));
  const track = sec.querySelector('ul');
  const STAMP = (a) => {
    const s = [...a.querySelectorAll('span')].find((x) => /^(ends in|sold out|sold|auction)/i.test(x.textContent.trim()) && x.className.includes('absolute'));
    return s ? { text: s.textContent.trim(), cls: s.className } : null;
  };
  return [...track.children].map((li) => {
    const a = li.querySelector('a');
    const title = (a.querySelector('p') || {}).textContent || '';
    const caption = (li.querySelector(':scope > p') || {}).textContent || null;
    const lidWrap = a.querySelector('div[style*="container-type"]');
    const grid = lidWrap ? lidWrap.querySelector('div[class*="grid"][style*="grid-template-columns"]') : null;
    const areas = grid ? [...grid.children].map((c) => {
      const st = c.getAttribute('style') || '';
      return {
        area: ((st.match(/grid-area:\\s*([^;"]+)/) || [])[1] || '').trim(),
        hasSticker: !!c.querySelector('img'),
        hasLabel: !!c.querySelector('span'),
        dashed: !!c.querySelector('div[class*="border-dashed"]'),
      };
    }) : [];
    return { title: title.slice(0, 45), caption, stamp: STAMP(a), areas };
  });
})()`;
const cards = await page.evaluate(CARDS);
fs.writeFileSync(`docs/research/${SITE}/root-7280be29/featured-extra.json`, JSON.stringify(cards, null, 1));
cards.forEach((c, i) => {
  console.log(`#${i} ${c.title}`);
  console.log(`   caption: ${c.caption}`);
  console.log(`   stamp: ${c.stamp ? c.stamp.text + ' | ' + c.stamp.cls : 'none'}`);
  console.log(`   areas: ${c.areas.map((a) => `${a.area}${a.hasSticker ? '[img]' : a.hasLabel ? '[lbl]' : a.dashed ? '[dash]' : '[empty]'}`).join('  ')}`);
});
await browser.close();
