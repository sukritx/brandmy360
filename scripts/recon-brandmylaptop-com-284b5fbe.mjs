import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'brandmylaptop-com-284b5fbe';
const APP = process.cwd();

const PAGES = [
  { key: 'root-7280be29', slug: 'root', url: 'https://brandmylaptop.com/' },
  { key: 'brands-b0addea9', slug: 'brands', url: 'https://brandmylaptop.com/brands' },
  { key: 'briefs-dc03d02e', slug: 'briefs', url: 'https://brandmylaptop.com/briefs' },
  { key: 'stats-d8625d36', slug: 'stats', url: 'https://brandmylaptop.com/stats' },
  { key: 'sell-826541f7', slug: 'sell', url: 'https://brandmylaptop.com/sell' },
];

const shotDir = (k) => path.join(APP, 'docs', 'design-references', SITE, k);
const resDir = (k) => path.join(APP, 'docs', 'research', SITE, k);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await sleep(1800);
  try {
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const step = () => {
          y += 700;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight + 700) setTimeout(step, 90);
          else { window.scrollTo(0, 0); setTimeout(res, 700); }
        };
        step();
      });
    });
  } catch {}
  await sleep(900);
}

const GLOBAL_SCRIPT = () => {
  const cs = (el, props) => {
    const c = getComputedStyle(el);
    const o = {};
    props.forEach((p) => (o[p] = c[p]));
    return o;
  };
  const rootVars = {};
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ':root' || rule.selectorText === 'html' || rule.selectorText?.startsWith(':root')) {
          for (const p of rule.style) if (p.startsWith('--')) rootVars[p] = rule.style.getPropertyValue(p).trim();
        }
      }
    } catch {}
  }
  const fonts = [...document.fonts].map((f) => ({ family: f.family, weight: f.weight, style: f.style, status: f.status }));
  const fontLinks = [...document.querySelectorAll('link[rel*="stylesheet"], link[rel*="preload"]')].map((l) => l.href);
  const favicons = [...document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')].map((l) => ({ rel: l.rel, href: l.href, sizes: l.sizes?.toString() }));
  const nav = document.querySelector('nav');
  const footer = document.querySelector('footer');
  const aside = [...document.querySelectorAll('aside')].map((a) => a.outerHTML.slice(0, 3000));
  return {
    rootVars,
    fonts,
    fontLinks,
    favicons,
    bodyFont: getComputedStyle(document.body).fontFamily,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    navHTML: nav ? nav.outerHTML : null,
    navStyles: nav ? cs(nav, ['height', 'padding', 'backgroundColor', 'backdropFilter', 'borderBottom', 'position', 'zIndex', 'display', 'alignItems', 'justifyContent', 'gap', 'maxWidth']) : null,
    navInner: nav ? cs(nav.firstElementChild, ['maxWidth', 'padding', 'height', 'display', 'alignItems', 'justifyContent', 'gap']) : null,
    footerHTML: footer ? footer.outerHTML.slice(0, 12000) : null,
    asides: aside,
    htmlClass: document.documentElement.className,
    bodyClass: document.body.className,
    scrollH: document.body.scrollHeight,
    scrollW: document.documentElement.scrollWidth,
    stylesheetCount: document.styleSheets.length,
    hasLenis: !!document.querySelector('.lenis, [class*="lenis"]'),
  };
};

const run = async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-color-profile=srgb'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  });
  const results = {};
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 120000 });
    await settle(page);
    fs.mkdirSync(shotDir(p.key), { recursive: true });
    fs.mkdirSync(resDir(p.key), { recursive: true });
    await page.screenshot({ path: path.join(shotDir(p.key), `desktop-1440-full.png`), fullPage: true });
    results[p.key] = await page.evaluate(GLOBAL_SCRIPT);
    // mobile
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await sleep(1200);
    await page.screenshot({ path: path.join(shotDir(p.key), `mobile-390-full.png`), fullPage: true });
    fs.writeFileSync(path.join(resDir(p.key), 'global.json'), JSON.stringify(results[p.key], null, 2));
    fs.writeFileSync(path.join(resDir(p.key), 'rendered.html'), await page.evaluate(() => document.documentElement.outerHTML));
    await page.close();
    console.log(`done ${p.slug} -> h=${results[p.key].scrollH}`);
  }
  fs.writeFileSync(path.join(APP, 'docs', 'research', SITE, 'global-all.json'), JSON.stringify(results, null, 2));
  await browser.close();
  console.log('RECON COMPLETE');
};

run().catch((e) => { console.error('FAILED', e); process.exit(1); });
