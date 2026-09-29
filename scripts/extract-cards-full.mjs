import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (o, p) => fs.writeFileSync(p, JSON.stringify(o, null, 1));
const goto = async (page, url) => {
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); return; }
    catch (e) { console.log('  retry', i + 1, String(e).slice(0, 50)); await sleep(2500); }
  }
  throw new Error('nav failed');
};

const EXTRACT = `(() => {
  const slotData = (li) => {
    const lidWrap = li.querySelector('div[style*="container-type"]');
    if (!lidWrap) return null;
    const lidStyle = lidWrap.getAttribute('style') || '';
    const lidBg = (() => {
      const inner = lidWrap.firstElementChild;
      return inner ? inner.getAttribute('style') : null;
    })();
    const grid = lidWrap.querySelector('div[class*="grid"][style*="grid-template-columns"]');
    const slots = grid ? [...grid.children].map((slot) => {
      const st = slot.getAttribute('style') || '';
      const img = slot.querySelector('img');
      const label = slot.querySelector('span');
      return {
        area: ((st.match(/grid-area:\\s*([^;"]+)/) || [])[1] || '').trim() || null,
        img: img ? img.getAttribute('src') : null,
        imgStyle: img ? img.getAttribute('style') : null,
        label: label ? label.textContent.trim() : null,
        labelStyle: label ? label.getAttribute('style') : null,
      };
    }) : [];
    return { lidStyle, lidBg, slots };
  };
  const out = [];
  const seen = new Set();
  const lis = [...document.querySelectorAll('li')];
  for (const li of lis) {
    const lid = slotData(li);
    if (!lid) continue;
    if (seen.has(li)) continue;
    seen.add(li);
    const a = li.querySelector('a');
    const titleEl = li.querySelector('p');
    const authorP = [...li.querySelectorAll('p')].find((p) => p.querySelector('img'));
    const avatar = authorP && authorP.querySelector('img') ? authorP.querySelector('img').getAttribute('src') : null;
    let author = null, followers = null;
    if (authorP) {
      const clone = authorP.cloneNode(true);
      const av = clone.querySelector('img'); if (av) av.remove();
      author = clone.textContent.split('·')[0].trim();
      followers = authorP.textContent.split('·')[1] ? authorP.textContent.split('·')[1].trim() : null;
    }
    const socials = authorP ? [...authorP.querySelectorAll('svg')].map((s) => (s.querySelector('path') || {}).getAttribute ? s.querySelector('path').getAttribute('fill') : null) : [];
    const priceEl = [...li.querySelectorAll('span')].find((s) => s.className.includes('text-green') || (s.className.includes('font-semibold') && /[$€£]/.test(s.textContent)));
    const spotsEl = [...li.querySelectorAll('span')].find((s) => /left|sold|spots/.test(s.textContent.trim()) && s.textContent.length < 24);
    const goalEl = priceEl ? priceEl.querySelector('span') : null;
    const stamp = li.querySelector('.sold-stamp, .auction-stamp');
    const tags = [...li.querySelectorAll('span')].filter((s) => /text-\\[11px\\]|text-\\[12px\\]/.test(s.className) && s.textContent.trim()).map((s) => s.textContent.trim());
    out.push({
      href: a ? a.getAttribute('href') : null,
      title: titleEl ? titleEl.textContent.trim() : null,
      author,
      followers,
      avatar,
      socialsCount: socials.length,
      price: priceEl ? priceEl.textContent.replace(/\\s+/g, ' ').trim() : null,
      goal: goalEl ? goalEl.textContent.replace(/\\s+/g, ' ').trim() : null,
      spots: spotsEl ? spotsEl.textContent.trim() : null,
      stamp: stamp ? stamp.textContent.trim() : null,
      stampClass: stamp ? stamp.className : null,
      tags: tags.slice(0, 6),
      lid,
      outerLen: li.outerHTML.length,
    });
  }
  return out;
})()`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
{
  const page = await browser.newPage();
  await goto(page, 'https://brandmylaptop.com/');
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 110); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
  await sleep(1500);
  const cards = await page.evaluate(EXTRACT);
  write(cards, `docs/research/${SITE}/root-7280be29/cards-full.json`);
  console.log('root cards:', cards.length, 'with stickers:', cards.filter((c) => c.lid.slots.some((s) => s.img)).length);
  await page.close();
}
{
  const page = await browser.newPage();
  await goto(page, 'https://brandmylaptop.com/brands');
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 100); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
  await sleep(1500);
  const rows = await page.evaluate(`(() => {
    const main = document.querySelector('main');
    const lis = [...main.querySelectorAll('li')];
    return lis.map((li) => {
      const a = li.querySelector('a');
      const img = li.querySelector('img');
      const spans = [...li.querySelectorAll('span')].map((s) => s.textContent.trim()).filter(Boolean);
      return {
        href: a ? a.getAttribute('href') : null,
        logo: img ? img.getAttribute('src') : null,
        name: spans[0] || null,
        meta: spans.slice(1).join(' | '),
        text: li.innerText.replace(/\\n/g, ' | '),
      };
    }).filter((r) => r.logo && r.text.length < 300);
  })()`);
  write(rows, `docs/research/${SITE}/brands-b0addea9/brands-rows.json`);
  console.log('brand rows:', rows.length);
  await page.close();
}
await browser.close();
console.log('DONE');
