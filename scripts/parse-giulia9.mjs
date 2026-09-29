import fs from 'node:fs';
const header = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html/17-y53.html', 'utf8');

// 1) BrandMyLaptop pill full markup (before the sticker img)
const vIdx = header.indexOf('@VynseDev');
const pillStart = header.lastIndexOf('<div class="absolute bottom-0 left-1/2', vIdx);
console.log('=== PILL MARKUP ===');
console.log(header.slice(pillStart, header.indexOf('</div>', vIdx) + 6).replace(/></g, '>\n<').slice(0, 2600));

// 2) Creatorbuzz cell (spot 5) full markup
const cIdx = header.indexOf('grid-area: 2 / 2');
const cEnd = header.indexOf('grid-area: 2 / 5', cIdx);
console.log('\n=== SPOT 5 (Creatorbuzz) ===');
console.log(header.slice(cIdx - 40, cEnd).replace(/></g, '>\n<').slice(0, 2600));
