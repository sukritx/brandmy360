import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const header = fs.readFileSync(`${dir}/17-y53.html`, 'utf8');

const at = (needle, before = 200, after = 1800) => {
  const i = header.indexOf(needle);
  if (i === -1) return `NOT FOUND: ${needle}`;
  return header.slice(Math.max(0, i - before), i + after).replace(/></g, '>\n<');
};

console.log('=== VISIBLE TITLE ===');
console.log(at('Want to sponsor my next season', 500, 1400));

console.log('\n=== PROGRESS BAR ===');
console.log(at('goal passed', -2200, 400));

console.log('\n=== AUTHOR ROW (giutheginger) ===');
console.log(at('@giutheginger', -600, 2200));

console.log('\n=== STICKER BAR / VYNSE ===');
console.log(at('@VynseDev', -1600, 600));
