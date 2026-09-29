import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = (obj, name) => fs.writeFileSync(`docs/research/${SITE}/root-7280be29/${name}`, typeof obj === 'string' ? obj : JSON.stringify(obj, null, 1));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2' });
await sleep(3000);

// ---------- Mobile menu ----------
await page.setViewport({ width: 390, height: 844 });
await sleep(1200);
await page.click('button[aria-controls="mobile-menu"]');
await sleep(800);
const menu = await page.evaluate(() => {
  const m = document.getElementById('mobile-menu');
  return m ? m.outerHTML : 'NOT FOUND';
});
out(menu, 'mobile-menu.html');
await page.screenshot({ path: `docs/design-references/${SITE}/root-7280be29/mobile-menu-open.png` });
await page.click('button[aria-controls="mobile-menu"]');
await sleep(500);
await page.setViewport({ width: 1440, height: 900 });
await sleep(1000);

// ---------- FAQ ----------
await page.evaluate(() => document.getElementById('faq')?.scrollIntoView());
await sleep(1200);
const faq = await page.evaluate(async () => {
  const items = [...document.querySelectorAll('#faq details, [id="faq"] button')];
  const res = [];
  const qs = [...document.querySelectorAll('[id="faq"] h3, #faq button, #faq summary')];
  return { count: qs.length, sample: qs.slice(0, 12).map((q) => q.outerHTML.slice(0, 200)) };
});
out(faq, 'faq-structure.json');

// click each FAQ toggle and capture answer
const faqAnswers = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const container = document.getElementById('faq');
  if (!container) return { error: 'no #faq' };
  const buttons = [...container.querySelectorAll('button')];
  const answers = [];
  for (const b of buttons) {
    b.click();
    await sleep(400);
    const wrap = b.parentElement;
    answers.push({ q: b.innerText.trim().slice(0, 200), html: wrap ? wrap.outerHTML.slice(0, 4000) : null });
    b.click();
    await sleep(200);
  }
  return answers;
});
out(faqAnswers, 'faq-answers.json');

// ---------- Featured carousel ----------
const carousel = await page.evaluate(() => {
  const dark = [...document.querySelectorAll('section')].find((s) => /Featured now/.test(s.textContent));
  if (!dark) return { error: 'no featured section' };
  const track = dark.querySelector('ul, [class*="overflow-x-auto"]');
  return {
    sectionHTML: dark.outerHTML.slice(0, 30000),
    trackCls: track ? track.className : null,
    trackHTML: track ? track.outerHTML.slice(0, 40000) : null,
    buttons: [...dark.querySelectorAll('button')].map((b) => ({ cls: b.className, label: b.getAttribute('aria-label'), disabled: b.disabled })),
    dots: [...dark.querySelectorAll('button[aria-label*="slide"], [role="tab"]')].map((d) => d.outerHTML.slice(0, 160)),
  };
});
out(carousel, 'carousel.json');

// carousel next click behaviour
const carouselBehav = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const dark = [...document.querySelectorAll('section')].find((s) => /Featured now/.test(s.textContent));
  const scroller = dark.querySelector('[class*="overflow-x"]');
  const before = scroller ? { scrollLeft: scroller.scrollLeft, scrollWidth: scroller.scrollWidth, clientWidth: scroller.clientWidth } : null;
  const next = [...dark.querySelectorAll('button')].find((b) => /next/i.test(b.getAttribute('aria-label') || ''));
  if (next) next.click();
  await sleep(900);
  const after = scroller ? { scrollLeft: scroller.scrollLeft } : null;
  const cards = dark.querySelectorAll('li').length;
  return { before, after, cards, trackCls: scroller ? scroller.className : null };
});
out(carouselBehav, 'carousel-behavior.json');
await page.screenshot({ path: `docs/design-references/${SITE}/root-7280be29/featured-after-next.png` });

// ---------- Laptops grid ----------
const grid = await page.evaluate(() => {
  const sec = document.querySelector('#laptops') || [...document.querySelectorAll('section')].find((s) => /laptops looking for brands/.test(s.textContent));
  if (!sec) return { error: 'not found' };
  const cards = [...sec.querySelectorAll('li')].slice(0, 50);
  return {
    sectionCls: sec.className,
    headerHTML: sec.outerHTML.slice(0, 2000),
    cardCount: sec.querySelectorAll('li').length,
    firstCardHTML: cards.length ? cards[0].outerHTML.slice(0, 12000) : null,
    filters: [...sec.querySelectorAll('select, button[aria-haspopup]')].map((f) => ({ tag: f.tagName, text: f.innerText.slice(0, 60), html: f.outerHTML.slice(0, 400) })),
    showMore: [...sec.querySelectorAll('button')].map((b) => b.innerText.trim().slice(0, 60)).filter(Boolean),
  };
});
out(grid, 'grid.json');
console.log('grid cards:', grid.cardCount, 'filters:', grid.filters ? grid.filters.length : 0);

await browser.close();
console.log('INTERACTIONS DONE');
