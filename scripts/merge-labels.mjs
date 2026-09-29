import fs from 'node:fs';
const SITE = 'brandmylaptop-com-284b5fbe';
const d = `docs/research/${SITE}/`;
const labels = JSON.parse(fs.readFileSync(d + 'root-7280be29/card-labels.json', 'utf8'));
const md = JSON.parse(fs.readFileSync(d + 'mock-data.json', 'utf8'));

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
let matched = 0;
for (const l of md.laptops) {
  const t = norm(l.title);
  let hit = labels.find((x) => norm(x.title) === t);
  if (!hit) hit = labels.find((x) => t.startsWith(norm(x.title)) || norm(x.title).startsWith(t.slice(0, 40)));
  if (hit) {
    l.rightLabel = hit.right || null;
    l.leftSuffix = hit.goal || null;
    matched++;
  } else {
    l.rightLabel = l.spots || null;
    l.leftSuffix = null;
  }
}
// keep only the fields we already export plus the new ones
fs.writeFileSync(d + 'mock-data.json', JSON.stringify(md, null, 1));
console.log('labels matched:', matched, '/', md.laptops.length);
console.log(md.laptops.slice(0, 3).map((l) => `${l.rightLabel} | ${l.leftSuffix}`).join('\n'));
