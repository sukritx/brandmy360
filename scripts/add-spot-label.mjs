import fs from 'node:fs';
const p = 'src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/data.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace('  logo: string | null;\n  area: string;', '  logo: string | null;\n  label: string | null;\n  area: string;');

// every spot literal: insert label before `area:`
c = c.replace(/(\{ n: (\d+),[^\n]*?)(, area: )/g, (m, head, n, tail) => {
  const label = n === '5' ? '"Creatorbuzz"' : 'null';
  return `${head}, label: ${label}${tail}`;
});
fs.writeFileSync(p, c);
const lines = c.split('\n').filter((l) => /n: (5|6),/.test(l));
lines.forEach((l) => console.log(l.trim().slice(0, 210)));
console.log('label field in type:', c.includes('  label: string | null;'));
