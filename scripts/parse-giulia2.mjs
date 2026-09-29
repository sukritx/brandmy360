import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const header = fs.readFileSync(`${dir}/17-y53.html`, 'utf8');

// hero top: views / h1 / progress / author / tags
const text = header
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map((s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim())
  .filter(Boolean);
console.log('=== HERO TEXT NODES ===');
console.log(text.slice(0, 40).join(' | '));

console.log('\n=== HERO PRICE CELLS ===');
const cells = [...header.matchAll(/<div style="grid-area:([^"]+)">([\s\S]*?)<\/div><\/div>/g)];
for (const c of cells.slice(0, 12)) {
  const area = c[1].trim();
  const inner = c[2];
  const seg = inner.match(/<div[^>]*>[\s\S]*?(?=<\/div>\s*<\/div>|$)/);
  const price = (inner.match(/([\d][\d\s\u00a0]*)\s*&nbsp;€/) || [])[1];
  const img = (inner.match(/<img[^>]*src="([^"]+)"/) || [])[1];
  const label = (inner.match(/<span[^>]*>([^<]{2,40})<\/span>/) || [])[1];
  console.log(`${area} | price=${price ? price.trim() : null} | img=${img ? img.split('/').pop() : null} | label=${label || null}`);
}

console.log('\n=== ONE FULL CELL (first) ===');
const first = header.match(/<div style="grid-area:1 \/ 1[^"]*">[\s\S]*?<\/div><\/div>/);
console.log(first ? first[0].replace(/></g, '>\n<') : 'none');

const details = fs.readFileSync(`${dir}/18-y1199.html`, 'utf8');
console.log('\n=== DETAILS TEXT ===');
console.log(
  details
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim())
    .filter(Boolean)
    .slice(0, 80)
    .join(' | ')
);

const others = fs.readFileSync(`${dir}/20-y3150.html`, 'utf8');
console.log('\n=== OTHERS TEXT ===');
console.log(others.replace(/<[^>]+>/g, '\n').split('\n').map((s) => s.replace(/&nbsp;/g, ' ').trim()).filter(Boolean).slice(0, 20).join(' | '));

const spots = fs.readFileSync(`${dir}/19-y2126.html`, 'utf8');
console.log('\n=== SPOTS TEXT (head) ===');
console.log(spots.replace(/<[^>]+>/g, '\n').split('\n').map((s) => s.replace(/&nbsp;/g, ' ').trim()).filter(Boolean).slice(0, 16).join(' | '));
