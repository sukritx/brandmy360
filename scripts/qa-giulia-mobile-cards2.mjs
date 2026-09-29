import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const grab = async (url, tag) => {
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
    const pick = (i) => ul.children[i].outerHTML.replace(/></g, '>\n<');
    return { c5: pick(5), c8: pick(8), c5h: Math.round(ul.children[5].getBoundingClientRect().height), c8h: Math.round(ul.children[8].getBoundingClientRect().height) };
  });
  fs.writeFileSync(`docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/_mobile-cards-${tag}.txt`, `C5 h${out.c5h}\n${out.c5}\n\nC8 h${out.c8h}\n${out.c8}`);
  await page.close();
  return out;
};
const live = await grab('https://brandmylaptop.com/giulia', 'live');
const clone = await grab('http://localhost:3000/giulia', 'clone');
for (const k of ['c5', 'c8']) {
  console.log(`\n########## ${k} — LIVE h${live[k + 'h']} / CLONE h${clone[k + 'h']} ##########`);
  console.log('--- LIVE ---\n' + live[k].slice(0, 2000));
  console.log('--- CLONE ---\n' + clone[k].slice(0, 2000));
}
await browser.close();
