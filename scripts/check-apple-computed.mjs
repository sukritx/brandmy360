import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2' });
await sleep(3000);
const res = await page.evaluate(() => {
  const lids = [...document.querySelectorAll('div[style*="container-type"]')];
  const out = [];
  for (const l of lids.slice(0, 8)) {
    const inner = l.firstElementChild;
    const style = inner ? inner.getAttribute('style') : '';
    const isDark = /59, 59, 61|--lid-dark-1/.test(style || '');
    const overlay = l.querySelector('[class*="rounded-[inherit]"]');
    const appleWrap = l.querySelector('svg[viewBox="0 0 24 24"]');
    const appleParent = appleWrap ? appleWrap.closest('div') : null;
    out.push({
      dark: isDark,
      overlayBg: overlay ? overlay.getAttribute('style') : null,
      appleClass: appleWrap ? appleWrap.getAttribute('class') : null,
      appleComputedColor: appleWrap ? getComputedStyle(appleWrap).color : null,
      appleWrapperW: appleParent ? getComputedStyle(appleParent).width : null,
      stickerFilter: (() => { const s = l.querySelector('img[src*="brandmylaptop"]'); return s ? getComputedStyle(s).filter : null; })(),
      slotImgFilter: (() => { const s = [...l.querySelectorAll('img')].find((i) => !i.src.includes('brandmylaptop')); return s ? getComputedStyle(s).filter : null; })(),
    });
  }
  return out;
});
console.log(JSON.stringify(res, null, 1));
await browser.close();
