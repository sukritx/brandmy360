import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { await sleep(2500); }
}
await sleep(2500);
const out = await page.evaluate(() => {
  const sec = [...document.querySelectorAll('section')].find((s) => /Featured now/.test(s.textContent));
  const track = sec.querySelector('ul');
  return [...track.children].map((li, i) => ({
    i,
    liH: Math.round(li.getBoundingClientRect().height),
    kids: [...li.children].map((c) => ({ tag: c.tagName, h: Math.round(c.getBoundingClientRect().height), cls: (c.className || '').toString().slice(0, 50), text: (c.textContent || '').trim().slice(0, 40) })),
  }));
});
out.forEach((c) => {
  console.log(`#${c.i} liH ${c.liH} children: ${c.kids.length}`);
  c.kids.forEach((k) => console.log(`   ${k.tag} h${k.h} | ${k.cls} | ${k.text}`));
});
await browser.close();
