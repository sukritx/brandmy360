import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const header = fs.readFileSync(`${dir}/17-y53.html`, 'utf8');

// Locate the lid container and print the first two cells in full
const lidIdx = header.indexOf('container-type');
console.log('=== LID CONTAINER ATTRS ===');
console.log(header.slice(Math.max(0, lidIdx - 400), lidIdx + 120).split('<').slice(-1)[0].slice(0, 500));

const gridIdx = header.indexOf('grid-template-columns');
console.log('\n=== GRID ===');
console.log(header.slice(Math.max(0, gridIdx - 300), gridIdx + 200).replace(/></g, '>\n<'));

const cellStart = header.indexOf('grid-area: 1 / 1', gridIdx);
const cellEnd = header.indexOf('grid-area: 1 / 3', cellStart);
console.log('\n=== CELL 1 FULL ===');
console.log(header.slice(cellStart - 60, cellEnd).replace(/></g, '>\n<'));

// All asset urls on the page
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));
const urls = new Set();
for (const f of files) {
  const c = fs.readFileSync(`${dir}/${f}`, 'utf8');
  [...c.matchAll(/<img[^>]*src="([^"]+)"/g)].forEach((m) => urls.add(m[1].replace(/&amp;/g, '&')));
  [...c.matchAll(/srcset="([^"]+)"/g)].forEach((m) => m[1].split(',').forEach((s) => urls.add(s.trim().split(/\s+/)[0])));
}
console.log('\n=== ASSET URLS (' + urls.size + ') ===');
[...urls].sort().forEach((u) => console.log(' ', u.slice(0, 140)));
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/_assets-raw.json', JSON.stringify([...urls].sort(), null, 1));
