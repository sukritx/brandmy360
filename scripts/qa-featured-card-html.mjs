import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });

const grab = async (url, tag) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2500);
  const html = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('section')].find((s) => /Featured now/.test(s.textContent));
    const card = sec.querySelectorAll('li')[1];
    return card ? card.outerHTML : 'none';
  });
  fs.writeFileSync(`docs/design-references/brandmylaptop-com-284b5fbe/_qa-cards/${tag}-featured-card.html`, html);
  const pretty = html.replace(/></g, '>\n<').split('\n').filter((l) => !/^\s*<\/(div|p|span|a|li)>/.test(l));
  console.log(`--- ${tag} (${html.length} bytes) ---`);
  console.log(pretty.slice(0, 42).join('\n').slice(0, 3600));
  await page.close();
};

await grab('https://brandmylaptop.com/', 'live');
await grab('http://localhost:3000/', 'clone');
await browser.close();
