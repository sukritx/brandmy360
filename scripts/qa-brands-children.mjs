import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/brands', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { await sleep(2500); }
}
await sleep(2500);
const out = await page.evaluate(() => {
  const main = document.querySelector('main');
  return [...main.children].map((el, i) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      i,
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 70),
      y: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      mt: cs.marginTop,
      mb: cs.marginBottom,
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
    };
  });
});
out.forEach((s) => console.log(`#${s.i} ${s.tag} y${s.y} h${s.h} mt${s.mt} mb${s.mb} | ${s.cls} | ${s.text}`));
await browser.close();
