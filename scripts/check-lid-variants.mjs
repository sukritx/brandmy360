import fs from 'node:fs';
const cards = JSON.parse(fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/root-7280be29/cards-full.json', 'utf8'));
const styles = new Map();
for (const c of cards) {
  const bg = c.lid.lidBg || '';
  const key = bg.slice(0, 120);
  if (!styles.has(key)) styles.set(key, { count: 0, sample: c.title?.slice(0, 45), full: bg });
  styles.get(key).count++;
}
console.log('=== distinct lid backgrounds ===');
for (const [k, v] of styles) console.log(v.count + 'x |', v.sample, '\n   ', v.full, '\n');
const labels = new Set();
for (const c of cards) for (const s of c.lid.slots) if (s.label && s.labelStyle) labels.add(s.labelStyle);
console.log('distinct labelStyles:', JSON.stringify([...labels]));
const imgStyles = new Set();
for (const c of cards) for (const s of c.lid.slots) if (s.img && s.imgStyle) imgStyles.add(s.imgStyle);
console.log('distinct imgStyles:', JSON.stringify([...imgStyles]));
