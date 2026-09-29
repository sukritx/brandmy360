import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const header = fs.readFileSync(`${dir}/17-y53.html`, 'utf8');

const slice = (from, to) => {
  const a = header.indexOf(from);
  const b = to ? header.indexOf(to, a + 1) : -1;
  return header.slice(a, b === -1 ? a + 3000 : b).replace(/></g, '>\n<');
};

console.log('=== AUTHOR BLOCK ===');
console.log(slice('h-11 w-11 shrink-0 rounded-full', 'Want to sponsor').slice(0, 3000));

console.log('\n=== AFTER LID (sticker + tags + closed) ===');
console.log(slice('For sale', '').slice(0, 2600));
