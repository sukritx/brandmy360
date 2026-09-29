import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const header = fs.readFileSync(`${dir}/17-y53.html`, 'utf8');

const all = [];
let i = -1;
while ((i = header.indexOf('VynseDev', i + 1)) !== -1) all.push(i);
console.log('VynseDev occurrences:', all.length);
for (const idx of all) console.log(header.slice(Math.max(0, idx - 1200), idx + 300).replace(/></g, '>\n<').slice(0, 2200), '\n---');

console.log('\n=== TAGS WRAPPER ===');
const tagsIdx = header.indexOf('For sale');
console.log(header.slice(Math.max(0, tagsIdx - 700), tagsIdx + 700).replace(/></g, '>\n<'));

console.log('\n=== LID WRAPPER (hero) ===');
const lidIdx = header.indexOf('max-w-[900px]');
console.log(header.slice(lidIdx - 100, lidIdx + 900).replace(/></g, '>\n<'));
