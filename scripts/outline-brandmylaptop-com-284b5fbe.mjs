import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const APP = process.cwd();
const PAGES = JSON.parse(process.argv[2] || '[]');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-color-profile=srgb'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

const OUTLINE = () => {
  const main = document.querySelector('div.min-h-screen') || document.body;
  const rows = [];
  const walk = (el, depth, maxDepth, pathStr) => {
    if (depth > maxDepth) return;
    const r = el.getBoundingClientRect();
    if (r.height < 4) return;
    const txt = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    rows.push({
      d: depth,
      tag: el.tagName.toLowerCase(),
      cls: (el.className || '').toString().slice(0, 100),
      y: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      w: Math.round(r.width),
      text: txt,
      kidCount: el.children.length,
    });
    [...el.children].forEach((c, i) => walk(c, depth + 1, maxDepth, `${pathStr}>${i}`));
  };
  walk(main, 0, 2, '');
  return { rows, mainTag: main.tagName, mainCls: main.className.toString(), scrollH: document.body.scrollHeight };
};

for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 120000 });
  await sleep(2500);
  await page.evaluate(async () => {
    await new Promise((res) => { let y = 0; const s = () => { y += 800; window.scrollTo(0, y); if (y < document.body.scrollHeight + 800) setTimeout(s, 60); else { window.scrollTo(0, 0); setTimeout(res, 500); } }; s(); });
  });
  await sleep(800);
  const out = await page.evaluate(OUTLINE);
  fs.mkdirSync(path.join(APP, 'docs', 'research', SITE, p.key), { recursive: true });
  fs.writeFileSync(path.join(APP, 'docs', 'research', SITE, p.key, 'topology.json'), JSON.stringify(out, null, 1));
  console.log(`${p.slug}: ${out.rows.length} rows, main=${out.mainCls.slice(0, 60)}`);
  await page.close();
}
await browser.close();
console.log('OUTLINE DONE');
