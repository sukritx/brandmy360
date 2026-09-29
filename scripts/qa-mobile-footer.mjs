import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2200);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 60); else { window.scrollTo(0, 0); setTimeout(r, 400); } }; s(); }); });
  await sleep(800);
  const out = await page.evaluate(() => {
    const f = document.querySelector('footer');
    const rows = f ? [...f.children].map((c) => ({ tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), cls: (c.className || '').toString().slice(0, 40) })) : [];
    const badgeList = f ? f.querySelector('ul:last-of-type') : null;
    const main = document.querySelector('main');
    return {
      footerH: f ? Math.round(f.getBoundingClientRect().height) : null,
      footerRows: rows,
      badgeCount: badgeList ? badgeList.children.length : null,
      badgeH: badgeList ? Math.round(badgeList.getBoundingClientRect().height) : null,
      mainH: main ? Math.round(main.getBoundingClientRect().height) : null,
    };
  });
  await page.close();
  return out;
};

for (const p of ['/briefs', '/stats']) {
  const live = await read('https://brandmylaptop.com' + p);
  const clone = await read('http://localhost:3000' + p);
  console.log(`\n=== ${p} mobile ===`);
  console.log('LIVE :', JSON.stringify(live));
  console.log('CLONE:', JSON.stringify(clone));
}
await browser.close();
