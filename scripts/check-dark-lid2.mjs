import fs from 'node:fs';
const c = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/root-7280be29/sections-html/01-y633.html', 'utf8');
console.log('has dark lid:', c.includes('rgb(59, 59, 61)') || c.includes('lid-dark-1'));
// split by card
const idx = c.indexOf('rgb(59, 59, 61)');
const seg = idx >= 0 ? c.slice(Math.max(0, idx - 2500), idx + 3000) : c.slice(0, 3000);
const pretty = seg
  .replace(/></g, '>\n<')
  .split('\n')
  .filter((l) => /radial-gradient|text-\[#|drop-shadow|rounded-\[inherit\]|linear-gradient|box-shadow|w-\[15|svg viewBox="0 0 24 24"|max-w-full text-center/.test(l));
console.log(pretty.join('\n').slice(0, 3000));
