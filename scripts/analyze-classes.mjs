import fs from 'node:fs';
import path from 'node:path';
const base = 'docs/research/brandmylaptop-com-284b5fbe';
const keys = fs.readdirSync(base).filter((d) => fs.existsSync(path.join(base, d, 'sections-html')));
const all = new Set();
for (const k of keys) {
  const d = path.join(base, k, 'sections-html');
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.html'))) {
    const c = fs.readFileSync(path.join(d, f), 'utf8');
    [...c.matchAll(/class="([^"]+)"/g)].forEach((m) => m[1].split(/\s+/).forEach((x) => all.add(x)));
  }
}
const classes = [...all];
const tokens = ['hairline', 'ink', 'surface', 'blue', 'green', 'amber', 'lid'];
console.log('=== COLOR-TOKEN CLASSES USED ===');
console.log(classes.filter((c) => tokens.some((t) => c.includes(t))).sort().join('\n'));
console.log('\n=== ANIMATE / CUSTOM CLASSES ===');
console.log(classes.filter((c) => c.startsWith('animate-') || c === 'closing-soon' || c.includes('sponsor-preview') || c.includes('has-')).sort().join('\n'));
console.log('\n=== TOTAL UNIQUE CLASSES ===', classes.length);
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/_all-classes.json', JSON.stringify(classes.sort(), null, 1));
