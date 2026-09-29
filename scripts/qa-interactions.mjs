import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = 'docs/design-references/brandmylaptop-com-284b5fbe/_qa-interactions';
fs.mkdirSync(OUT, { recursive: true });
const results = [];
const log = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} — ${detail}`); };

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'], defaultViewport: { width: 1440, height: 900 } });

// ---------- homepage interactions ----------
{
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await sleep(2500);

  // carousel next
  const carousel = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const track = document.querySelector('section ul.no-scrollbar');
    const before = track.scrollLeft;
    const next = [...document.querySelectorAll('button')].find((b) => /next/i.test(b.getAttribute('aria-label') || ''));
    if (!next) return { error: 'no next button' };
    next.click();
    await sleep(900);
    const after = track.scrollLeft;
    const prev = [...document.querySelectorAll('button')].find((b) => /prev/i.test(b.getAttribute('aria-label') || ''));
    if (prev) { prev.click(); await sleep(900); }
    return { before, after, back: track.scrollLeft, moved: after > before };
  });
  log('carousel next/prev', carousel.moved, JSON.stringify(carousel));

  // filters
  const filter = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const sec = document.querySelector('#laptops');
    const btn = [...sec.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith('Most raised'));
    if (!btn) return { error: 'no filter button' };
    const titlesBefore = [...sec.querySelectorAll('li a p')].slice(0, 3).map((p) => p.textContent.slice(0, 30));
    btn.click();
    await sleep(600);
    const panel = btn.parentElement.querySelector('div[class*="absolute"]');
    if (!panel) return { error: 'no panel' };
    const opts = [...panel.querySelectorAll('button')];
    const target = opts.find((o) => /followers/i.test(o.textContent));
    if (target) target.click();
    await sleep(1200);
    const titlesAfter = [...sec.querySelectorAll('li a p')].slice(0, 3).map((p) => p.textContent.slice(0, 30));
    const label = [...sec.querySelectorAll('button')].find((b) => /Most/i.test(b.textContent))?.textContent.trim();
    return { opts: opts.map((o) => o.textContent.trim()), changed: JSON.stringify(titlesBefore) !== JSON.stringify(titlesAfter), label };
  });
  log('grid filter sort', !!filter.changed, JSON.stringify(filter).slice(0, 220));

  // show more
  const more = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const sec = document.querySelector('#laptops');
    const before = sec.querySelectorAll('li').length;
    const btn = [...sec.querySelectorAll('button')].find((b) => /Show .* more/.test(b.textContent));
    if (!btn) return { error: 'no show more' };
    btn.click();
    await sleep(1500);
    return { before, after: sec.querySelectorAll('li').length };
  });
  log('show more cards', more.after > more.before, JSON.stringify(more));

  // FAQ accordion
  const faq = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const sec = document.getElementById('faq');
    if (!sec) return { error: 'no #faq' };
    const buttons = [...sec.querySelectorAll('button')];
    const openCount = () => buttons.filter((b) => b.getAttribute('aria-expanded') === 'true').length;
    const initial = openCount();
    buttons[1].click();
    await sleep(500);
    const afterSecond = openCount();
    const secondExpanded = buttons[1].getAttribute('aria-expanded');
    buttons[1].click();
    await sleep(400);
    return { initial, afterSecond, secondExpanded, final: openCount() };
  });
  log('FAQ accordion', faq.initial === 1 && faq.afterSecond === 1 && faq.secondExpanded === 'true' && faq.final === 0, JSON.stringify(faq));

  // currency switch
  const curr = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const sel = document.querySelector('select');
    if (!sel) return { error: 'no select' };
    const priceEl = () => [...document.querySelectorAll('#laptops li span')].map((s) => s.textContent).find((t) => /[$€£]/.test(t));
    const usd = priceEl();
    sel.value = 'EUR';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(800);
    const eur = priceEl();
    sel.value = 'USD';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(600);
    return { usd, eur, back: priceEl(), persisted: localStorage.getItem('bml.currency') };
  });
  log('currency switch', curr.eur !== curr.usd, JSON.stringify(curr));

  // hero anchors
  const anchors = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    return { laptops: links.filter((h) => h === '/#laptops').length, how: links.filter((h) => h === '/#how').length, sell: links.filter((h) => h === '/sell').length, targets: !!document.getElementById('laptops') && !!document.getElementById('how') };
  });
  log('anchor targets exist', anchors.targets, JSON.stringify(anchors));
  log('no runtime errors (home)', errors.length === 0, JSON.stringify(errors.slice(0, 3)));
  await page.screenshot({ path: `${OUT}/home-interactions.png` });
  await page.close();
}

// ---------- mobile menu ----------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await sleep(2000);
  const menu = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const btn = document.querySelector('button[aria-controls="mobile-menu"]');
    if (!btn) return { error: 'no burger' };
    const before = !!document.getElementById('mobile-menu');
    btn.click();
    await sleep(400);
    const after = !!document.getElementById('mobile-menu');
    const links = after ? document.querySelectorAll('#mobile-menu a').length : 0;
    btn.click();
    await sleep(300);
    return { before, after, links, closed: !document.getElementById('mobile-menu') };
  });
  log('mobile menu toggle', menu.after && menu.closed, JSON.stringify(menu));
  await page.screenshot({ path: `${OUT}/mobile-home.png` });
  await page.close();
}

// ---------- sell wizard ----------
{
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000/sell', { waitUntil: 'networkidle2' });
  await sleep(2500);
  const modal = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const open = /You will need a Stripe account/.test(document.body.innerText);
    const got = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Got it');
    if (got) { got.click(); await sleep(500); }
    const closed = !/You will need a Stripe account/.test(document.body.innerText);
    return { open, closed };
  });
  log('stripe modal', modal.open && modal.closed, JSON.stringify(modal));

  const wizard = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const steps = [];
    for (let i = 0; i < 9; i++) {
      const cont = [...document.querySelectorAll('button')].reverse().find((b) => /^Continue$/.test(b.textContent.trim()));
      const progress = document.querySelector('div[class*="rounded-full"][style*="width"]');
      steps.push({ i, cont: cont ? cont.textContent.trim() : null, disabled: cont ? cont.disabled : null, progress: progress ? progress.getAttribute('style') : null });
      if (cont && cont.disabled) {
        // try to satisfy: press first aria-pressed=false, or pick first dropdown option
        const chooser = document.querySelector('button[aria-pressed="false"]');
        if (chooser) { chooser.click(); await sleep(400); }
        const drops = [...document.querySelectorAll('button[aria-expanded="false"]')].filter((b) => /Choose|Pick a country|Pick up to three/.test(b.textContent.trim()));
        for (const d of drops.slice(0, 1)) {
          d.click(); await sleep(400);
          const panel = d.parentElement.querySelector('div[class*="absolute"]');
          const opt = panel ? panel.querySelector('button') : null;
          if (opt) { opt.click(); await sleep(400); }
        }
      }
      const cont2 = [...document.querySelectorAll('button')].reverse().find((b) => /^Continue$/.test(b.textContent.trim()));
      if (!cont2 || cont2.disabled) { break; }
      cont2.click();
      await sleep(900);
    }
    return { steps, finalStep: (() => { const el = [...document.querySelectorAll('span,button')].find((e) => e.getAttribute('aria-current') === 'step'); return el ? el.textContent : null; })() };
  });
  const reached = wizard.steps.filter((s) => !s.disabled).length;
  log('wizard advances', reached >= 8, `reached ${reached} enabled continue states; steps=${JSON.stringify(wizard.steps.map((s) => `${s.i}:${s.disabled === false ? 'ok' : 'blocked'}`))}`);
  log('no runtime errors (sell)', errors.length === 0, JSON.stringify(errors.slice(0, 3)));
  await page.screenshot({ path: `${OUT}/sell-wizard.png` });
  await page.close();
}

// ---------- briefs form ----------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/briefs', { waitUntil: 'networkidle2' });
  await sleep(1500);
  const pills = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const btns = [...document.querySelectorAll('form button[aria-pressed]')];
    const base = btns.length;
    btns[0].click(); btns[1].click(); btns[2].click(); btns[3].click(); await sleep(200);
    const four = btns.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
    btns[4].click(); await sleep(200);
    const five = btns.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
    btns[0].click(); await sleep(200);
    const afterDeselect = btns.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
    return { base, four, five, afterDeselect };
  });
  log('briefs pills max 4', pills.four === 4 && pills.five === 4 && pills.afterDeselect === 3, JSON.stringify(pills));
  await page.close();
}

// ---------- stats bars ----------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/stats', { waitUntil: 'networkidle2' });
  await sleep(2000);
  const bars = await page.evaluate(() => {
    const styled = [...document.querySelectorAll('[style*="width"]')].map((e) => e.getAttribute('style')).filter((s) => /width:\s*\d+/.test(s));
    return { count: styled.length, sample: styled.slice(0, 4) };
  });
  log('stats bars present', bars.count > 3, JSON.stringify(bars));
  await page.close();
}

fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 1));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} interaction checks passed`);
await browser.close();
