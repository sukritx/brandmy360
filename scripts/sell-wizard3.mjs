import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (o, n) => fs.writeFileSync(`docs/research/${SITE}/sell-826541f7/${n}`, typeof o === 'string' ? o : JSON.stringify(o, null, 1));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 1100 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100 });
await page.goto('https://brandmylaptop.com/sell', { waitUntil: 'networkidle2' });
await sleep(3000);
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Got it');
  if (b) b.click();
});
await sleep(500);

const names = ['Machine', 'Ownership', 'Showcase', 'Layout', 'Prices', 'Listing', 'Sticker', 'You', 'Publish'];
const dropdownLog = [];
const results = [];
for (let i = 0; i < 9; i++) {
  const html = await page.evaluate(() => {
    const pills = [...document.querySelectorAll('button')].find((e) => e.textContent.trim() === 'Publish');
    let root = pills;
    for (let k = 0; k < 8 && root && root.parentElement; k++) root = root.parentElement;
    return root ? root.outerHTML : 'NOT FOUND';
  });
  write(html, `wiz-${i + 1}-${names[i].toLowerCase()}.html`);
  await page.screenshot({ path: `docs/design-references/${SITE}/sell-826541f7/wiz-${i + 1}-${names[i].toLowerCase()}.png` });

  // interrogate dropdowns
  const dl = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const found = [];
    const drops = [...document.querySelectorAll('button[aria-expanded]')].filter((b) => !b.disabled);
    for (const d of drops) {
      const label = d.getAttribute('aria-label') || d.textContent.trim().slice(0, 40);
      d.click();
      await sleep(500);
      const wrapper = d.parentElement;
      const panel = wrapper.querySelector('div[class*="absolute"], [role="listbox"], [role="menu"]');
      const opts = panel ? [...panel.querySelectorAll('button, label, input, a')].map((o) => ({ t: o.textContent.trim().slice(0, 50), tag: o.tagName, type: o.type || null })) : [];
      found.push({ label, optCount: opts.length, opts: opts.slice(0, 20), panelHtml: panel ? panel.outerHTML.slice(0, 5000) : null });
      d.click();
      await sleep(300);
    }
    return found;
  });
  dropdownLog.push({ step: names[i], dropdowns: dl });

  let advanced = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /^Continue|^Publish/.test(x.textContent.trim()) && !x.disabled);
    if (!b) return false;
    b.click();
    return true;
  });
  if (!advanced) {
    // satisfy required chooser: pick first aria-pressed=false option, then any empty dropdown
    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      try {
        const c = document.querySelector('button[aria-pressed="false"]');
        if (c) { c.click(); await sleep(600); }
      } catch {}
      const drops = [...document.querySelectorAll('button[aria-expanded]')].filter((b) => !b.disabled);
      for (const d of drops) {
        try {
          const txt = d.textContent.trim();
          if (!/^(Choose|Pick a country|Pick up to three)/.test(txt)) continue;
          d.click();
          await sleep(500);
          const panel = d.parentElement.querySelector('div[class*="absolute"]');
          if (panel) {
            const opt = panel.querySelector('button, label');
            if (opt) { opt.click(); await sleep(500); }
          }
        } catch {}
        await sleep(200);
      }
    });
    await sleep(900);
    advanced = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /^Continue|^Publish/.test(x.textContent.trim()) && !x.disabled);
      if (!b) return false;
      b.click();
      return true;
    });
  }
  results.push({ step: names[i], advanced });
  if (!advanced) { console.log('BLOCKED at', names[i]); break; }
  await sleep(1400);
}
write(dropdownLog, 'wizard-dropdowns.json');
console.log('steps advanced:', results.filter((r) => r.advanced).length, '/', results.length);
console.log(results.map((r) => `${r.step}:${r.advanced ? 'ok' : 'BLOCKED'}`).join(' '));
console.log('dropdowns captured:', dropdownLog.map((d) => `${d.step}(${d.dropdowns.length})`).join(' '));
await browser.close();
