import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/giulia', { waitUntil: 'networkidle2', timeout: 120000 }); break; }
  catch (e) { await sleep(3000); }
}
await sleep(2500);
const out = await page.evaluate(() => {
  const rules = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        const t = rule.cssText || '';
        if (/\.truncate\b/.test(t) && t.length < 420) rules.push(t);
        if (/\btext-wrap\b/.test(t) && /(^|[,{ ])(p|html|body|\*)\b/.test(t.split('{')[0] || '') && t.length < 300) rules.push('TW: ' + t);
      }
    } catch {}
  }
  const sheets = [...document.styleSheets].map((s) => s.href || 'inline');
  return { rules: [...new Set(rules)], sheets };
});
console.log('sheets:', out.sheets.join('\n  '));
console.log('\n--- truncate / text-wrap rules ---');
out.rules.forEach((r) => console.log(r));
await browser.close();
