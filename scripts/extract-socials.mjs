import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { console.log('retry', i + 1); await sleep(3000); }
}
await sleep(2500);
await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 110); else { window.scrollTo(0, 0); setTimeout(r, 600); } }; s(); }); });
await sleep(1500);

const rows = await page.evaluate(`(() => {
  const PLAT = [
    ['youtube', '#FF0000', 'M23.498'],
    ['instagram', '#E4405F', 'M7.03'],
    ['tiktok', '#000000', 'M12.525'],
    ['twitch', '#9146FF', 'M11.571'],
    ['linkedin', '#0A66C2', 'M20.447'],
    ['x', '#000000', 'M18.901'],
  ];
  const out = [];
  for (const li of document.querySelectorAll('li')) {
    if (!li.querySelector('div[style*="container-type"]')) continue;
    const titleEl = li.querySelector('p');
    const authorP = [...li.querySelectorAll('p')].find((p) => p.querySelector('img'));
    if (!titleEl) continue;
    const icons = authorP ? [...authorP.querySelectorAll('svg path')].map((p) => p.getAttribute('d').slice(0, 10)) : [];
    const socials = icons.map((d) => (PLAT.find(([, , pre]) => d.startsWith(pre)) || ['?', '', ''])[0]);
    // social counts row (h-[18px])
    const statsRow = [...li.querySelectorAll('p')].find((p) => /inline-flex items-center gap-1/.test(p.innerHTML) && /aria-label="Where they post"/.test(p.innerHTML));
    out.push({ title: titleEl.textContent.trim().slice(0, 60), socials, statsHtml: statsRow ? statsRow.outerHTML : null });
  }
  return out;
})()`);
fs.writeFileSync(`docs/research/${SITE}/root-7280be29/socials.json`, JSON.stringify(rows, null, 1));
console.log('cards scanned:', rows.length);
console.log('sample socials:', JSON.stringify(rows.slice(0, 6).map((r) => ({ t: (r.title || '').slice(0, 30), s: r.socials })), null, 1));
const withStats = rows.filter((r) => r.statsHtml);
console.log('cards with stats row:', withStats.length);
if (withStats[0]) console.log('stats row html:', withStats[0].statsHtml.slice(0, 1500));
await browser.close();
