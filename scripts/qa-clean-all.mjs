import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = ['/', '/brands', '/briefs', '/stats', '/sell', '/giulia'];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
let bad = 0;
for (const path of PAGES) {
  const page = await browser.newPage();
  const problems = [];
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('_rsc=')) problems.push(`${r.status()} ${r.url().replace('http://localhost:3000', '')}`); });
  page.on('pageerror', (e) => problems.push('JS ' + String(e).slice(0, 90)));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 900; window.scrollTo(0, y); if (y < document.body.scrollHeight) setTimeout(s, 50); else setTimeout(r, 400); }; s(); }); });
  await sleep(1200);
  const broken = await page.evaluate(() => [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')));
  const h = await page.evaluate(() => document.body.scrollHeight);
  const uniq = [...new Set(problems)];
  const ok = uniq.length === 0 && broken.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${path} — h${h}, ${uniq.length} net/JS problems, ${broken.length} broken imgs`);
  if (uniq.length) console.log('   ' + uniq.slice(0, 5).join('\n   '));
  if (broken.length) console.log('   broken: ' + [...new Set(broken)].slice(0, 5).join(', '));
  await page.close();
}
console.log(bad === 0 ? '\nALL 6 ROUTES CLEAN' : `\n${bad} route(s) with issues`);
await browser.close();
