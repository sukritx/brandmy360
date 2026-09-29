import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const read = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
    catch (e) { await sleep(3000); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(600);
  const out = await page.evaluate(() => {
    const ul = document.querySelector('#spots ul.mt-8');
    return [...ul.children].map((li) => ({ h: Math.round(li.getBoundingClientRect().height), t: li.innerText.replace(/\s+/g, ' ').slice(0, 46) }));
  });
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/giulia');
const clone = await read('http://localhost:3000/giulia');
let sumL = 0, sumC = 0;
for (let i = 0; i < Math.max(live.length, clone.length); i++) {
  const a = live[i], b = clone[i];
  if (a) sumL += a.h;
  if (b) sumC += b.h;
  const d = a && b ? b.h - a.h : null;
  console.log(`#${i} L${a ? a.h : '-'} C${b ? b.h : '-'}${d ? `  Δ${d}  <<<` : ''} | ${(a || b).t}`);
  if (d) console.log(`     L: ${a.t}\n     C: ${b.t}`);
}
console.log(`sum L ${sumL} vs C ${sumC} (Δ${sumC - sumL})`);
await browser.close();
