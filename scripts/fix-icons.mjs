import fs from 'node:fs';
const p = 'src/components/sites/brandmylaptop-com-284b5fbe/shared/icons.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/<\/path>/g, '').replace(/<\/circle>/g, '').replace(/<\/rect>/g, '');
// collapse the blank filler lines left inside svgs
c = c.replace(/\n\s*\n(\s*<\/svg>)/g, '\n$1');
c = c.replace(/(<svg[^>]*>)\n\s*\n/g, '$1');
fs.writeFileSync(p, c);
console.log('stray paths left:', c.includes('</path>'));
console.log(c.slice(0, 700));
