import fs from 'node:fs';

const files = ['src/app/page.tsx', 'src/app/brands/page.tsx', 'src/app/briefs/page.tsx', 'src/app/stats/page.tsx'];
const IMPORT_AFTER = 'import { SponsorRail } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/SponsorRail";\n';
const IMPORT_LINE = 'import { MobileAdBar } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/MobileAdBar";\n';
const RAIL = '      <SponsorRail side="right" />\n';

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('MobileAdBar')) {
    console.log(f, 'already wired');
    continue;
  }
  if (!c.includes(IMPORT_AFTER)) {
    console.log(f, 'IMPORT ANCHOR MISSING');
    continue;
  }
  c = c.replace(IMPORT_AFTER, IMPORT_AFTER + IMPORT_LINE);
  if (!c.includes(RAIL)) {
    console.log(f, 'RAIL ANCHOR MISSING');
    continue;
  }
  c = c.replace(RAIL, RAIL + '      <MobileAdBar />\n');
  fs.writeFileSync(f, c);
  console.log(f, 'patched');
}
