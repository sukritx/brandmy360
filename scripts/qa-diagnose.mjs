import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 1000 } });

// ---- 404s on home ----
{
  const page = await browser.newPage();
  const failed = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 900; window.scrollTo(0, y); if (y < document.body.scrollHeight) setTimeout(s, 60); else setTimeout(r, 600); }; s(); }); });
  await sleep(1500);
  console.log('=== 404 / failed requests on / ===');
  console.log(failed.length ? [...new Set(failed)].join('\n') : 'none');
  await page.close();
}

// ---- sell step 1 buttons ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000/sell', { waitUntil: 'networkidle2' });
  await sleep(2000);
  const info = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const got = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Got it');
    if (got) { got.click(); await sleep(600); }
    const buttons = [...document.querySelectorAll('button')].map((b) => ({ t: b.textContent.trim().slice(0, 28), disabled: b.disabled, cls: b.className.slice(0, 60), pressed: b.getAttribute('aria-pressed') }));
    const alert = document.querySelector('[role="alert"]');
    return { buttons: buttons.filter((b) => b.t).slice(0, 24), alert: alert ? alert.textContent.trim() : null };
  });
  console.log('\n=== /sell step 1 ===');
  console.log('alert:', info.alert);
  info.buttons.forEach((b) => console.log(`  [${b.disabled ? 'disabled' : 'enabled '}] "${b.t}" pressed=${b.pressed} | ${b.cls}`));
  await page.close();
}

// ---- FAQ behaviour on the LIVE site for comparison ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
    catch (e) { await sleep(2500); }
  }
  await sleep(2500);
  const faq = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const sec = document.getElementById('faq');
    if (!sec) return { error: 'no #faq' };
    const buttons = [...sec.querySelectorAll('button')];
    const state = () => buttons.map((b) => b.getAttribute('aria-expanded'));
    const initial = state();
    buttons[1].click();
    await sleep(500);
    const afterClickSecond = state();
    buttons[1].click();
    await sleep(500);
    const afterSecondClickAgain = state();
    return { count: buttons.length, initial, afterClickSecond, afterSecondClickAgain };
  });
  console.log('\n=== LIVE FAQ behaviour ===');
  console.log(JSON.stringify(faq, null, 1).slice(0, 800));
  await page.close();
}
await browser.close();
