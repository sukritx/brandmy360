import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (o, p) => fs.writeFileSync(p, JSON.stringify(o, null, 1));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const goto = async (page, url) => {
  for (let i = 0; i < 4; i++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
      return;
    } catch (e) {
      console.log(`  retry ${i + 1} for ${url}: ${String(e).slice(0, 60)}`);
      await sleep(2500);
    }
  }
  throw new Error('nav failed ' + url);
};

// ---------- shared page-side extractor ----------
const CARD_EXTRACT = () => {
  const lidSlots = (card) => {
    const lidWrap = card.querySelector('div[style*="container-type"]');
    if (!lidWrap) return null;
    const grid = lidWrap.querySelector('div[class*="grid"][style*="grid-template-columns"]');
    if (!grid) return null;
    const slots = [...grid.children].map((slot) => {
      const style = slot.getAttribute('style') || '';
      const area = (style.match(/grid-area:\s*([^;"]+)/) || [])[1] || null;
      const img = slot.querySelector('img');
      const label = slot.querySelector('span');
      return {
        area: area ? area.trim() : null,
        img: img ? img.getAttribute('src') : null,
        imgStyle: img ? img.getAttribute('style') : null,
        imgCls: img ? img.className : null,
        label: label ? label.textContent.trim() : null,
        labelStyle: label ? label.getAttribute('style') : null,
      };
    });
    return { lidw: (lidWrap.getAttribute('style') || '').match(/--lidw:\s*([^;"]+)/)?.[1] || null, slots };
  };
  const cards = [...document.querySelectorAll('li')].filter((li) => li.querySelector('div[style*="container-type"]'));
  return cards.map((li) => {
    const a = li.querySelector('a') || li;
    const title = (li.querySelector('p') || {}).textContent || null;
    const authorP = [...li.querySelectorAll('p')].find((p) => p.querySelector('img'));
    const pricing = [...li.querySelectorAll('span')].filter((s) => /text-green|text-ink/.test(s.className) && /\d/.test(s.textContent));
    const stamp = li.querySelector('.sold-stamp, .auction-stamp, .closing-soon');
    return {
      href: a.getAttribute('href') || null,
      title: title ? title.trim() : null,
      author: authorP ? authorP.textContent.replace(/\s+/g, ' ').trim() : null,
      authorAvatar: authorP && authorP.querySelector('img') ? authorP.querySelector('img').src : null,
      priceText: pricing.length ? pricing[0].textContent.replace(/\s+/g, ' ').trim() : null,
      spotsText: pricing.length > 1 ? pricing[pricing.length - 1].textContent.replace(/\s+/g, ' ').trim() : null,
      stampText: stamp ? stamp.textContent.trim() : null,
      stampCls: stamp ? stamp.className : null,
      lid: lidSlots(li),
    };
  });
};

// ---------- ROOT ----------
{
  const page = await browser.newPage();
  await goto(page, 'https://brandmylaptop.com/');
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 600; window.scrollTo(0, y); if (y < 3000) setTimeout(s, 120); else setTimeout(r, 500); }; s(); }); });
  await sleep(1500);

  const featured = await page.evaluate(() => {
    const dark = [...document.querySelectorAll('section')].find((s) => /Featured now/.test(s.textContent));
    if (!dark) return null;
    const cards = [...dark.querySelectorAll('li')].map((li) => ({
      title: (li.querySelector('p') || {}).textContent || null,
      tags: [...li.querySelectorAll('span')].map((s) => s.textContent.trim()).filter(Boolean).slice(-6),
      html: li.outerHTML.length,
    }));
    return { count: dark.querySelectorAll('li').length, cards };
  });
  write(featured, `docs/research/${SITE}/root-7280be29/featured-cards.json`);

  const activity = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('section,div')].find((s) => /Latest activity/.test(s.textContent) && s.textContent.length < 2000);
    if (!sec) return null;
    return { html: sec.outerHTML.slice(0, 12000), text: sec.innerText.slice(0, 800) };
  });
  write(activity, `docs/research/${SITE}/root-7280be29/latest-activity.json`);

  const gridCards = await page.evaluate('(' + CARD_EXTRACT.toString() + ')()');
  write(gridCards, `docs/research/${SITE}/root-7280be29/grid-cards.json`);

  const showcase = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('section')].find((s) => /Laptops fully branded/.test(s.textContent));
    if (!sec) return null;
    const lidSlots = (card) => {
      const lidWrap = card.querySelector('div[style*="container-type"]');
      if (!lidWrap) return null;
      const grid = lidWrap.querySelector('div[class*="grid"][style*="grid-template-columns"]');
      if (!grid) return null;
      return [...grid.children].map((slot) => {
        const style = slot.getAttribute('style') || '';
        const img = slot.querySelector('img');
        const label = slot.querySelector('span');
        return {
          area: ((style.match(/grid-area:\s*([^;"]+)/) || [])[1] || '').trim() || null,
          img: img ? img.getAttribute('src') : null,
          imgStyle: img ? img.getAttribute('style') : null,
          label: label ? label.textContent.trim() : null,
        };
      });
    };
    return {
      heading: sec.querySelector('h2')?.textContent || null,
      sub: sec.querySelector('p')?.innerText || null,
      items: [...sec.querySelectorAll('li')].map((li) => ({
        href: (li.querySelector('a') || {}).getAttribute?.('href') || null,
        handle: (li.querySelector('span') || {}).textContent || null,
        slots: lidSlots(li),
      })),
    };
  });
  write(showcase, `docs/research/${SITE}/root-7280be29/showcase.json`);

  // just sold rows
  const justSold = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('section')].find((s) => /Just sold/.test(s.textContent));
    if (!sec) return null;
    return { heading: sec.querySelector('h2')?.textContent, sub: sec.querySelector('span')?.textContent, rows: [...sec.querySelectorAll('li')].map((li) => li.innerText.replace(/\n/g, ' | ')) };
  });
  write(justSold, `docs/research/${SITE}/root-7280be29/just-sold.json`);
  await page.close();
}

// ---------- BRANDS ----------
{
  const page = await browser.newPage();
  await goto(page, 'https://brandmylaptop.com/brands');
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 100); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(1200);
  const brands = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('li')].filter((li) => li.querySelector('a[href^="/"]'));
    const list = rows
      .map((li) => {
        const img = li.querySelector('img');
        const txt = li.innerText.replace(/\n/g, ' | ');
        return { text: txt, img: img ? img.src : null, href: (li.querySelector('a') || {}).getAttribute?.('href') };
      })
      .filter((r) => /spots?|placement/.test(r.text));
    const logoWall = [...document.querySelectorAll('img')].map((i) => i.src).filter((s) => s.includes('supabase')).length;
    return { count: list.length, list, logoWall };
  });
  write(brands, `docs/research/${SITE}/brands-b0addea9/brands-list.json`);

  const wall = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('section')].find((s) => /Already on a lid/.test(s.textContent));
    if (!sec) return null;
    return { heading: sec.querySelector('h2')?.textContent, items: [...sec.querySelectorAll('li')].map((li) => ({ img: (li.querySelector('img') || {}).src, alt: (li.querySelector('img') || {}).alt, text: li.innerText.trim() })) };
  });
  write(wall, `docs/research/${SITE}/brands-b0addea9/logo-wall.json`);
  await page.close();
}

console.log('DATA EXTRACTION DONE');
await browser.close();
