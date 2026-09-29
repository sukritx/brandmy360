import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.goto('https://brandmylaptop.com/brands', { waitUntil: 'networkidle2' });
await sleep(3000);
const read = () =>
  page.evaluate(() => {
    const main = document.querySelector('main');
    const out = {};
    // stat cards
    out.cards = [...main.querySelectorAll('div')]
      .filter((d) => d.textContent.length < 220 && /Paid to creators|A spot from/.test(d.textContent))
      .map((d) => d.innerText.replace(/\n/g, ' | '));
    // first brand row price
    const rows = [...main.querySelectorAll('li')].filter((li) => /1 placement|2 placements|spots/.test(li.textContent));
    out.row = rows.length ? rows[0].innerText.replace(/\n/g, ' | ') : null;
    out.codes = rows.length ? [...rows[0].textContent].slice(-30).map((c) => c.charCodeAt(0)).join(',') : null;
    return out;
  });
console.log('USD:', JSON.stringify(await read(), null, 1));
for (const cur of ['EUR', 'GBP']) {
  await page.select('select', cur);
  await sleep(2500);
  console.log(cur + ':', JSON.stringify(await read(), null, 1));
}
await browser.close();
