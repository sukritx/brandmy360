import fs from 'node:fs';

const OLD = '/og/emma-pet.png';
const NEW = '/sites/brandmylaptop-com-284b5fbe/shared/og/emma-pet.png';

for (const p of [
  'src/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/BrandedShowcase.tsx',
  'src/components/sites/brandmylaptop-com-284b5fbe/shared/data.ts',
]) {
  let c = fs.readFileSync(p, 'utf8');
  const before = (c.match(new RegExp(OLD.replace(/[/.]/g, '\\$&'), 'g')) || []).length;
  c = c.split(OLD).join(NEW);
  fs.writeFileSync(p, c);
  console.log(p, 'replaced', before);
}

const mf = 'public/sites/brandmylaptop-com-284b5fbe/shared/seo/site.webmanifest';
const j = JSON.parse(fs.readFileSync(mf, 'utf8'));
const base = '/sites/brandmylaptop-com-284b5fbe/shared/seo';
j.icons = j.icons.map((i) => ({ ...i, src: base + i.src }));
fs.writeFileSync(mf, JSON.stringify(j, null, 2));
console.log('manifest icons:', j.icons.map((i) => i.src));
