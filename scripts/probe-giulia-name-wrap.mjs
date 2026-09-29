import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844 } });

const probe = async (url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (let i = 0; i < 4; i++) {
    try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); break; }
    catch (e) { await sleep(3000); }
  }
  await sleep(2500);
  await page.evaluate(async () => { await new Promise((r) => { let y = 0; const s = () => { y += 700; window.scrollTo(0, y); if (y < document.body.scrollHeight + 700) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); }); });
  await sleep(700);
  const out = await page.evaluate(() => {
    const li = document.querySelector('#spots ul.mt-8').children[5];
    const r1 = li.children[0];
    const nameP = r1.querySelectorAll('p')[1];
    const cs = getComputedStyle(nameP);
    return {
      r1Text: r1.innerText.replace(/\n/g, ' | '),
      nameHTML: nameP.outerHTML,
      nameText: nameP.textContent,
      whiteSpace: cs.whiteSpace,
      overflow: cs.overflow,
      textOverflow: cs.textOverflow,
      width: Math.round(nameP.getBoundingClientRect().width),
      height: Math.round(nameP.getBoundingClientRect().height),
      wrap: getComputedStyle(nameP).textWrap,
      parentWidth: Math.round(r1.children[0].getBoundingClientRect().width),
      r1Width: Math.round(r1.getBoundingClientRect().width),
    };
  });
  await page.close();
  return out;
};
console.log('LIVE :', JSON.stringify(await probe('https://brandmylaptop.com/giulia'), null, 1));
console.log('CLONE:', JSON.stringify(await probe('http://localhost:3000/giulia'), null, 1));
await browser.close();
