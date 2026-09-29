import fs from 'node:fs';
const p = 'scripts/gen-data-ts.mjs';
let c = fs.readFileSync(p, 'utf8');
c = c.replace('    spots: ${j(l.spots)},', '    spots: ${j(l.spots)},\n    rightLabel: ${j(l.rightLabel ?? l.spots)},\n    leftSuffix: ${j(l.leftSuffix)},');
c = c.replace('  spots: string | null;', '  spots: string | null;\n  rightLabel: string | null;\n  leftSuffix: string | null;');
fs.writeFileSync(p, c);
console.log('patched');
