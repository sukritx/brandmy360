import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/giulia', { waitUntil: 'networkidle2', timeout: 120000 }); break; }
  catch (e) { await sleep(3000); }
}
await sleep(2500);

const info = await page.evaluate(() => {
  const box = (el) => { const r = el.getBoundingClientRect(); return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height), w: Math.round(r.width), x: Math.round(r.x) }; };
  const header = document.querySelector('main > header') || document.querySelector('header');
  const lidWrap = header.querySelector('div[style*="container-type"]');
  const vynse = [...header.querySelectorAll('a')].find((a) => /VynseDev/.test(a.textContent));
  const tagsGroup = header.querySelector('[role="group"]');
  const shareBtn = [...header.querySelectorAll('button')].find((b) => /share/i.test(b.getAttribute('aria-label') || b.textContent));
  const cells = [...header.querySelectorAll('div[style*="grid-area"]')].map((c) => {
    const a = c.querySelector('a');
    return {
      area: (c.getAttribute('style') || '').match(/grid-area:\s*([^;"]+)/)?.[1]?.trim(),
      box: box(c),
      href: a ? a.getAttribute('href') : null,
      aria: a ? a.getAttribute('aria-label') : null,
      price: (c.innerText.match(/([\d\u00a0\s]+€)/) || [])[1] || null,
      img: (c.querySelector('img') || {}).getAttribute?.('src') || null,
      borderCls: a ? a.className.slice(0, 200) : null,
    };
  });
  return {
    headerCls: header.className,
    headerBox: box(header),
    lidBox: box(lidWrap),
    lidStyle: lidWrap.getAttribute('style'),
    lidInnerStyle: lidWrap.firstElementChild.getAttribute('style').slice(0, 700),
    lidMaxW: getComputedStyle(lidWrap).maxWidth,
    vynseBox: vynse ? box(vynse) : null,
    vynseHTML: vynse ? vynse.parentElement.outerHTML.slice(0, 1400) : null,
    tagsBox: tagsGroup ? box(tagsGroup) : null,
    shareBox: shareBtn ? box(shareBtn) : null,
    shareHTML: shareBtn ? shareBtn.outerHTML.slice(0, 600) : null,
    cells,
  };
});
console.log(JSON.stringify(info, null, 1).slice(0, 5200));
await browser.close();
