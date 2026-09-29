import fs from 'node:fs';
const SITE = 'brandmylaptop-com-284b5fbe';
const d = `docs/research/${SITE}/`;
const socials = JSON.parse(fs.readFileSync(d + 'root-7280be29/socials.json', 'utf8'));
const md = JSON.parse(fs.readFileSync(d + 'mock-data.json', 'utf8'));

// match by title prefix
const byTitle = new Map(socials.map((s) => [(s.title || '').trim(), s.socials]));
let matched = 0;
for (const l of md.laptops) {
  const t = (l.title || '').trim();
  let hit = byTitle.get(t);
  if (!hit) {
    for (const [k, v] of byTitle) {
      if (k && (t.startsWith(k) || k.startsWith(t.slice(0, 40)))) { hit = v; break; }
    }
  }
  l.socialsList = hit || [];
  if (hit) matched++;
}
console.log('socials matched:', matched, '/', md.laptops.length);
fs.writeFileSync(d + 'mock-data.json', JSON.stringify(md, null, 1));
