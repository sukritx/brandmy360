import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const read = async (url, tag) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
    catch (e) { await sleep(3000); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90) ; else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(600);
  const out = await page.evaluate(() => {
    const ul = document.querySelector('#spots ul.mt-8');
    if (!ul) return { error: 'no ul' };
    const li = ul.firstElementChild;
    return { liH: Math.round(li.getBoundingClientRect().height), html: li.outerHTML, liCls: li.className };
  });
  fs.writeFileSync(`docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/_mobile-card-${tag}.html`, out.html || '');
  await page.close();
  return out;
};

const live = await read('https://brandmylaptop.com/giulia', 'live');
const clone = await read('http://localhost:3000/giulia', 'clone');
console.log('LIVE  li h:', live.liH, '| cls:', live.liCls);
console.log('CLONE li h:', clone.liH, '| cls:', clone.liCls);
console.log('\n=== LIVE CARD ===');
console.log((live.html || '').replace(/></g, '>\n<'));
console.log('\n=== CLONE CARD ===');
console.log((clone.html || '').replace(/></g, '>\n<'));
await browser.close();
