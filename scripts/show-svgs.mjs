import fs from 'node:fs';
const svgs = JSON.parse(fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/_svgs.json', 'utf8'));
svgs.forEach((s, i) => {
  const inner = s.svg
    .replace(/\s*class="[^"]*"/, '')
    .replace(/stroke-width="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 260);
  console.log(`--- ${i} [${s.key}]`);
  console.log(inner);
});
