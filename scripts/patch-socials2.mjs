import fs from 'node:fs';
const p = 'scripts/extract-socials.mjs';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(
  "console.log('sample socials:', JSON.stringify(rows.slice(0, 6).map((r) => ({ t: r.t.slice(0, 30), s: r.socials })), null, 1));",
  "console.log('sample socials:', JSON.stringify(rows.slice(0, 6).map((r) => ({ t: (r.title || '').slice(0, 30), s: r.socials })), null, 1));"
);
fs.writeFileSync(p, c);
console.log('patched');
