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
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Got it');
  if (btn) btn.click();
});
await sleep(600);

const getWizard = () =>
  page.evaluate(() => {
    // wizard = the element containing the step pills row
    const pill = [...document.querySelectorAll('button,span')].find((e) => e.textContent.trim() === 'Publish' && e.className.includes('rounded-full'));
    let root = pill;
    for (let i = 0; i < 6 && root && root.parentElement; i++) root = root.parentElement;
    return root ? root.outerHTML : 'NOT FOUND';
  });

const names = ['Machine', 'Ownership', 'Showcase', 'Layout', 'Prices', 'Listing', 'Sticker', 'You', 'Publish'];
const log = [];
for (let i = 0; i < 9; i++) {
  const html = await getWizard();
  write(html, `wiz-${i + 1}-${names[i].toLowerCase()}.html`);
  await page.screenshot({ path: `docs/design-references/${SITE}/sell-826541f7/wiz-${i + 1}-${names[i].toLowerCase()}.png` });
  const state = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter((b) => b.offsetParent !== null).map((b) => ({ t: b.textContent.trim().slice(0, 40), cls: b.className.slice(0, 60), disabled: b.disabled }));
    const cont = [...document.querySelectorAll('button')].find((b) => /^Continue|^Publish/.test(b.textContent.trim()));
    return { buttons: btns.slice(0, 30), continueDisabled: cont ? cont.disabled : null, continueText: cont ? cont.textContent.trim() : null };
  });
  log.push({ step: names[i], ...state });
  const advanced = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /^Continue|^Publish/.test(x.textContent.trim()) && !x.disabled);
    if (!b) return false;
    b.click();
    return true;
  });
  if (!advanced) {
    console.log(`step ${i + 1} (${names[i]}) blocked. Buttons:`, JSON.stringify(state.buttons.slice(0, 18)));
    break;
  }
  await sleep(1300);
}
write(log, 'wizard-steps.json');
console.log('captured', log.length, 'steps:', log.map((l) => l.step).join(' > '));
await browser.close();
