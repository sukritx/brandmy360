import fs from 'node:fs';
const p = 'scripts/gen-data-ts.mjs';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(
  "    socials: ${l.socials},",
  "    socials: ${j(l.socialsList || [])},"
);
c = c.replace(
  "  socials: number;",
  "  socials: string[];"
);
fs.writeFileSync(p, c);
console.log('patched gen-data-ts');
