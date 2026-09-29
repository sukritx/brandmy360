import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 1000 } });

const readTotal = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2500);
  const out = await page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    return {
      total: document.body.scrollHeight,
      mainTag: root.tagName,
      secs: [...root.children].map((el) => ({ tag: el.tagName, h: Math.round(el.getBoundingClientRect().height), t: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40) })).filter((s) => s.h > 30),
    };
  });
  await page.close();
  return out;
};

const live = await readTotal('https://brandmylaptop.com/sell');
const clone = await readTotal('http://localhost:3000/sell');
console.log('SELL LIVE total', live.total, 'vs CLONE', clone.total, `(Δ${clone.total - live.total})`);
console.log('LIVE secs:', JSON.stringify(live.secs));
console.log('CLONE secs:', JSON.stringify(clone.secs));

// gated-step verification on the clone
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000/sell', { waitUntil: 'networkidle2' });
  await sleep(2000);
  const out = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const got = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Got it');
    if (got) { got.click(); await sleep(500); }
    const cont = () => [...document.querySelectorAll('button')].reverse().find((b) => /^Continue$/.test(b.textContent.trim()));
    const log = [];
    // step 1 -> 2 -> 3
    cont().click(); await sleep(800);
    cont().click(); await sleep(800);
    log.push({ at: 'showcase', continueDisabled: cont().disabled, alert: (document.querySelector('[role=alert]') || {}).textContent });
    // satisfy required dropdown
    const dd = [...document.querySelectorAll('button[aria-expanded]')].find((b) => /Where will it be seen/.test(b.getAttribute('aria-label') || ''));
    if (dd) {
      dd.click(); await sleep(600);
      const panel = dd.parentElement.querySelector('div[class*="absolute"]');
      const opt = panel ? panel.querySelector('button') : null;
      if (opt) { opt.click(); await sleep(600); }
    }
    await sleep(600);
    log.push({ at: 'showcase-filled', continueDisabled: cont().disabled, alert: (document.querySelector('[role=alert]') || {}).textContent });
    if (!cont().disabled) { cont().click(); await sleep(800); }
    log.push({ at: 'layout', continueDisabled: cont().disabled });
    if (!cont().disabled) { cont().click(); await sleep(800); }
    log.push({ at: 'prices', continueDisabled: cont().disabled, alert: (document.querySelector('[role=alert]') || {}).textContent });
    const chooser = document.querySelector('button[aria-pressed="false"]');
    if (chooser) { chooser.click(); await sleep(600); }
    log.push({ at: 'prices-filled', continueDisabled: cont().disabled });
    return log;
  });
  console.log('\n=== GATED STEPS (clone) ===');
  out.forEach((l) => console.log(JSON.stringify(l)));
  await page.close();
}
await browser.close();
