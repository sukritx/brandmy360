import fs from 'node:fs';
const SITE = 'brandmylaptop-com-284b5fbe';
const d = `docs/research/${SITE}/`;
const extra = JSON.parse(fs.readFileSync(d + 'root-7280be29/featured-extra.json', 'utf8'));
const md = JSON.parse(fs.readFileSync(d + 'mock-data.json', 'utf8'));
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
let n = 0;
for (const e of extra) {
  const hit = md.laptops.find((l) => norm(l.title) === norm(e.title) || norm(l.title).startsWith(norm(e.title).slice(0, 30)));
  if (!hit) continue;
  hit.caption = e.caption || null;
  if (e.stamp) {
    hit.stamp = e.stamp.text;
    hit.stampClass = e.stamp.cls;
  }
  n++;
}
console.log('featured extras merged:', n);
console.log(md.laptops.filter((l) => l.caption).map((l) => `${l.caption} | stamp=${l.stamp}`).join('\n'));
fs.writeFileSync(d + 'mock-data.json', JSON.stringify(md, null, 1));
