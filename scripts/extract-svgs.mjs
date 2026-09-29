import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const base = 'docs/research/brandmylaptop-com-284b5fbe';
const keys = fs.readdirSync(base).filter((d) => fs.existsSync(path.join(base, d, 'sections-html')));
const svgs = new Map();
const ctx = [];

for (const k of keys) {
  const dir = path.join(base, k, 'sections-html');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    let i = 0;
    while ((i = c.indexOf('<svg', i)) !== -1) {
      // find matching </svg>
      const end = c.indexOf('</svg>', i);
      if (end === -1) break;
      const svg = c.slice(i, end + 6);
      const norm = svg.replace(/\s+/g, ' ');
      const key = crypto.createHash('sha1').update(norm).digest('hex').slice(0, 10);
      if (!svgs.has(key)) {
        const before = c.slice(Math.max(0, i - 300), i);
        const after = c.slice(end + 6, end + 200);
        svgs.set(key, { key, svg, file: `${k}/${f}`, before: before.slice(-160), after: after.slice(0, 120) });
      }
      i = end + 6;
    }
  }
}
console.log('unique svgs:', svgs.size);
const list = [...svgs.values()];
fs.writeFileSync(base + '/_svgs.json', JSON.stringify(list, null, 1));
list.forEach((s, idx) => {
  const vb = (s.svg.match(/viewBox="([^"]+)"/) || [])[1];
  const size = (s.svg.match(/class="([^"]*)"/) || [])[1];
  console.log(`${idx}. [${s.key}] vb=${vb} cls=${(size || '').slice(0, 60)}`);
  console.log(`    ctx: ...${s.before.replace(/\s+/g, ' ').slice(-90)}`);
});
