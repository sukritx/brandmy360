import fs from 'node:fs';
const p = 'scripts/gen-giulia-data.mjs';
let c = fs.readFileSync(p, 'utf8');

// fix spot row parsing: number span + name span + brand from img alt + struck price
c = c.replace(
  `  const num = (tds[0] || '').replace(/<[^>]+>/g, '').trim();`,
  `  const num = ((tds[0] || '').match(/tabular-nums text-ink-2">(\\d+)</) || [])[1] || '';
  const nameSpan = ((tds[0] || '').match(/<span class="font-medium">([^<]*)</) || [])[1] || '';
  const brandAlt = ((tds[2] || '').match(/<img alt="([^"]*)"/) || [])[1] || '';`
);
c = c.replace(
  `  return { num, size: sizeRaw, name, img: img ? img[1] : null, price };`,
  `  return { num, size: sizeRaw, name: nameSpan || name, brandAlt, img: img ? img[1] : null, price, struck: /line-through/.test(tds[3] || '') };`
);

// use brandAlt as fallback for the brand name
c = c.replace(
  `    const brand = (cell.aria || '').match(/Taken by ([^.]+)\\./) ? cell.aria.match(/Taken by ([^.]+)\\./)[1] : nameClean;`,
  `    const ariaBrand = (cell.aria || '').match(/Taken by ([^.]+)\\./);
    const brand = ariaBrand ? ariaBrand[1] : r.brandAlt || nameClean;`
);
fs.writeFileSync(p, c);
console.log('patched gen-giulia-data');
