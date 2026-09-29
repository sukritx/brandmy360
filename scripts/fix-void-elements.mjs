import fs from 'node:fs';
import path from 'node:path';

const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.tsx')) files.push(p);
  }
};
walk('src/components/sites');

const VOID = ['path', 'img', 'input', 'br', 'hr', 'source', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'use', 'stop', 'meta', 'link'];
let total = 0;
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;
  for (const tag of VOID) {
    c = c.replace(new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'g'), (m, attrs) => {
      if (attrs.trimEnd().endsWith('/')) return m;
      return `<${tag}${attrs} />`;
    });
  }
  // fix empty children left from stripped close tags: <path .../>\n\n is fine; remove stray blank lines inside svg
  c = c.replace(/(<svg[^>]*>)\s*\n\s*(<[^>]+\/>)\s*\n\s*(<[^>]+\/>)?\s*\n\s*(<\/svg>)/g, (m, a, b, d, e) => `${a}\n        ${b}\n        ${d || ''}\n        ${e}`);
  if (c !== before) {
    fs.writeFileSync(f, c);
    total++;
    console.log('fixed', f);
  }
}
console.log('files fixed:', total);
