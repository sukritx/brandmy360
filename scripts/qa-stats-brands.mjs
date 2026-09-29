import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/stats', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { console.log('retry', i + 1); await sleep(3000); }
}
await sleep(2500);
await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 100); else { setTimeout(r, 600); } }; s(); }); });
await sleep(1200);
const info = await page.evaluate(() => {
  const sec = [...document.querySelectorAll('section')].find((s) => /The 40 brands that have bought/.test(s.textContent));
  if (!sec) return { error: 'not found' };
  return {
    liCount: sec.querySelectorAll('li').length,
    heading: sec.querySelector('h2')?.textContent,
    sub: sec.querySelector('p')?.textContent,
    buttons: [...sec.querySelectorAll('button, a')].map((b) => b.textContent.trim().slice(0, 40)).filter((t) => t && !/^\$/.test(t)).slice(-6),
    browseSection: (() => {
      const b = [...document.querySelectorAll('section')].find((s) => /Browse by who carries it/.test(s.textContent));
      return b ? { h: Math.round(b.getBoundingClientRect().height), pills: [...b.querySelectorAll('a')].map((a) => a.textContent.trim()).slice(0, 20), html: b.outerHTML.slice(0, 2500) } : null;
    })(),
  };
});
console.log(JSON.stringify(info, null, 1).slice(0, 3500));
await browser.close();
