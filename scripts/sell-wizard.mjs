import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (o, n) => fs.writeFileSync(`docs/research/${SITE}/sell-826541f7/${n}`, typeof o === 'string' ? o : JSON.stringify(o, null, 1));
const shot = (n) => page.screenshot({ path: `docs/design-references/${SITE}/sell-826541f7/${n}.png`, fullPage: false });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 1100 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100 });
await page.goto('https://brandmylaptop.com/sell', { waitUntil: 'networkidle2' });
await sleep(3000);

// dismiss the stripe modal
const modalHtml = await page.evaluate(() => {
  const m = [...document.querySelectorAll('div')].find((d) => /You will need a Stripe account/.test(d.textContent) && d.className.includes('fixed'));
  return m ? m.outerHTML.slice(0, 6000) : null;
});
write(modalHtml || 'none', 'stripe-modal.html');
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Got it');
  if (btn) btn.click();
});
await sleep(700);

const steps = [];
const stepNames = ['Machine', 'Ownership', 'Showcase', 'Layout', 'Prices', 'Listing', 'Sticker', 'You', 'Publish'];
for (let i = 0; i < stepNames.length; i++) {
  const info = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    return {
      scrollH: document.body.scrollHeight,
      mainHTML: main.outerHTML.slice(0, 60000),
      activeStep: (() => {
        const pills = [...document.querySelectorAll('button,span')].filter((e) => ['Machine', 'Ownership', 'Showcase', 'Layout', 'Prices', 'Listing', 'Sticker', 'You', 'Publish'].includes(e.textContent.trim()));
        return pills.map((p) => ({ t: p.textContent.trim(), cls: p.className.slice(0, 80) }));
      })(),
      continueBtn: (() => { const b = [...document.querySelectorAll('button')].find((x) => /Continue|Publish|Pay|Finish|Post/i.test(x.textContent.trim()) && !x.disabled); return b ? { text: b.textContent.trim(), cls: b.className.slice(0, 100) } : null; })(),
    };
  });
  steps.push({ step: stepNames[i], ...info });
  write(info.mainHTML, `step-${i + 1}-${stepNames[i].toLowerCase()}.html`);
  await shot(`step-${i + 1}-${stepNames[i].toLowerCase()}`);
  // advance by clicking the step pill for the next step
  const nextName = stepNames[i + 1];
  if (nextName) {
    const clicked = await page.evaluate((nm) => {
      const pills = [...document.querySelectorAll('button,span')].filter((e) => e.textContent.trim() === nm);
      const target = pills.find((p) => p.tagName === 'BUTTON') || pills[pills.length - 1];
      if (!target) return false;
      if (target.tagName === 'BUTTON') { target.click(); return true; }
      const parentBtn = target.closest('button');
      if (parentBtn) { parentBtn.click(); return true; }
      target.click();
      return true;
    }, nextName);
    if (!clicked) { console.log('stopped at step', stepNames[i]); break; }
  }
  await sleep(1200);
}
console.log('steps captured:', steps.length, steps.map((s) => s.step).join(' > '));
console.log('activeStep pills sample:', JSON.stringify(steps[0].activeStep));
await browser.close();
console.log('SELL WIZARD DONE');
