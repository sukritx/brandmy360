import fs from 'node:fs';
const p = 'scripts/extract-socials.mjs';
let c = fs.readFileSync(p, 'utf8');
const target = "await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2' });";
const replacement = `for (let i = 0; i < 4; i++) {
  try { await page.goto('https://brandmylaptop.com/', { waitUntil: 'networkidle2', timeout: 90000 }); break; }
  catch (e) { console.log('retry', i + 1); await sleep(3000); }
}`;
if (!c.includes(target)) {
  console.log('target not found; already patched?', c.includes('retry'));
} else {
  c = c.replace(target, replacement);
  fs.writeFileSync(p, c);
  console.log('patched');
}
