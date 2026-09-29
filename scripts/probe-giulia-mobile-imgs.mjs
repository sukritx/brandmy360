import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const probe = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
    catch (e) { await sleep(3000); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(700);
  const out = await page.evaluate(() => {
    const ul = document.querySelector('#spots ul.mt-8');
    const rows = [];
    for (const idx of [0, 5, 8]) {
      const li = ul.children[idx];
      const r1 = li.children[0];
      const r2 = li.children[1];
      const img = li.querySelector('img');
      const badge = r2.querySelector('span:last-child');
      const logoWrap = r2.querySelector('span > a > span');
      const rect = (el) => (el ? { w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null);
      rows.push({
        idx,
        liH: Math.round(li.getBoundingClientRect().height),
        r1H: Math.round(r1.getBoundingClientRect().height),
        r2H: Math.round(r2.getBoundingClientRect().height),
        imgBox: rect(img),
        imgNatural: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
        imgStyle: img ? { maxH: getComputedStyle(img).maxHeight, maxW: getComputedStyle(img).maxWidth, w: getComputedStyle(img).width, h: getComputedStyle(img).height } : null,
        logoWrap: rect(logoWrap),
        badge: rect(badge),
        badgeText: badge ? badge.textContent.trim() : null,
      });
    }
    return rows;
  });
  await page.close();
  return out;
};

const live = await probe('https://brandmylaptop.com/giulia');
const clone = await probe('http://localhost:3000/giulia');
for (let i = 0; i < live.length; i++) {
  console.log(`\n--- card #${live[i].idx} ---`);
  console.log('LIVE :', JSON.stringify(live[i]));
  console.log('CLONE:', JSON.stringify(clone[i]));
}
await browser.close();
