import fs from 'node:fs';
const c = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/root-7280be29/rendered-slow.html', 'utf8');
for (const tag of ['<nav', '<main', '</main>', '<footer', 'min-h-screen', '<aside']) {
  const idxs = [];
  let i = -1;
  while ((i = c.indexOf(tag, i + 1)) !== -1) idxs.push(i);
  console.log(tag, '-> positions', idxs.slice(0, 6), 'count', idxs.length);
}
// print structure skeleton of body-level
const bodyStart = c.indexOf('<body');
const seg = c.slice(bodyStart, bodyStart + 3000);
console.log('\n--- body start ---');
console.log(seg.replace(/></g, '>\n<').slice(0, 1800));
const tail = c.slice(-2500);
console.log('\n--- tail ---');
console.log(tail.replace(/></g, '>\n<').slice(-1200));
