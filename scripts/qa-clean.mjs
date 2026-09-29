import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const PAGES = [
  ['/', 'home'],
  ['/brands', 'brands'],
  ['/briefs', 'briefs'],
  ['/stats', 'stats'],
  ['/sell', 'sell'],
];
let bad = 0;
for (const [path, name] of PAGES) {
  const page = await browser.newPage();
  const problems = [];
  page.on('response', (r) => { if (r.status() >= 400) problems.push(`${r.status()} ${r.url().replace('http://localhost:3000', '')}`); });
  page.on('pageerror', (e) => problems.push('JS ' + String(e).slice(0, 100)));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 900; window.scrollTo(0, y); if (y < document.body.scrollHeight) setTimeout(s, 50); else setTimeout(r, 500); }; s(); }); });
  await sleep(1500);
  // broken images
  const brokenImgs = await page.evaluate(() => [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')));
  const uniq = [...new Set(problems)];
  console.log(`${name}: ${uniq.length} network/JS problems, ${brokenImgs.length} broken images`);
  if (uniq.length) console.log('   ' + uniq.slice(0, 6).join('\n   '));
  if (brokenImgs.length) console.log('   broken: ' + [...new Set(brokenImgs)].slice(0, 6).join(', '));
  bad += uniq.length + brokenImgs.length;
  await page.close();
}
console.log(bad === 0 ? '\nALL PAGES CLEAN' : `\n${bad} issues remain`);
await browser.close();
