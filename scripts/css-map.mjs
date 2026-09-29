import fs from 'node:fs';

const css = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/_source-html/site.css', 'utf8');
const used = new Set(JSON.parse(fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/_all-classes.json', 'utf8')));

// strip comments
const src = css.replace(/\/\*[\s\S]*?\*\//g, '');

const rules = [];
let i = 0;
const stack = []; // media contexts
while (i < src.length) {
  const ch = src[i];
  if (ch === '@') {
    const braceIdx = src.indexOf('{', i);
    if (braceIdx === -1) break;
    const at = src.slice(i, braceIdx).trim();
    if (at.startsWith('@media') || at.startsWith('@supports') || at.startsWith('@layer')) {
      stack.push(at);
      i = braceIdx + 1;
      continue;
    }
    // other at-rules like @keyframes, @font-face: skip block
    let depth = 1;
    let j = braceIdx + 1;
    while (j < src.length && depth > 0) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') depth--;
      j++;
    }
    i = j;
    continue;
  }
  if (ch === '}') {
    stack.pop();
    i++;
    continue;
  }
  const braceIdx = src.indexOf('{', i);
  if (braceIdx === -1) break;
  const sel = src.slice(i, braceIdx).trim();
  const closeIdx = src.indexOf('}', braceIdx);
  if (closeIdx === -1) break;
  const decls = src.slice(braceIdx + 1, closeIdx).trim();
  rules.push({ sel, decls, media: [...stack].join(' && ') });
  i = closeIdx + 1;
}

const map = {};
for (const r of rules) {
  const selNorm = r.sel.replace(/\\/g, '');
  for (const cls of used) {
    const re = new RegExp('\\.' + cls.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '(?![\\w\\-])');
    if (re.test(selNorm)) {
      const key = r.media ? `@${r.media} :: .${cls}` : `.${cls}`;
      map[key] = r.decls;
    }
  }
}
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/_used-classes-css.json', JSON.stringify(map, null, 1));
console.log('rules mapped:', Object.keys(map).length, 'of', used.size, 'used classes');

// Print classes with no CSS found (potential typos or JS-only)
const missing = [...used].filter((c) => !Object.keys(map).some((k) => k.endsWith('.' + c)));
console.log('\nNO CSS FOUND FOR', missing.length, 'classes:');
console.log(missing.sort().join(' '));
