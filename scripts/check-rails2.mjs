import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/_shared-html/rails-live.json', 'utf8'));
for (const aside of data) {
  console.log('SIDE', aside.side, 'items', aside.lis.length);
  aside.lis.forEach((li, i) => console.log(` ${i} ${li.placeholder ? 'PH' : 'SP'} ${li.text} ${li.href}`));
}
const full = JSON.parse(fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/_shared-html/rails-full.json', 'utf8'));
const left = full.find((f) => f.side === 'left');
// one sponsor item markup
const sponsorLi = left.outer.match(/<li[\s\S]*?<\/li>/)[0];
console.log('\n=== SPONSOR ITEM MARKUP ===\n', sponsorLi.replace(/></g, '>\n<'));
const phLi = [...left.outer.matchAll(/<li[\s\S]*?<\/li>/g)].map((m) => m[0]).find((s) => s.includes('border-dashed'));
console.log('\n=== PLACEHOLDER ITEM MARKUP ===\n', phLi.replace(/></g, '>\n<'));
console.log('\n=== RAIL HEADER ===\n', left.outer.slice(0, 900).replace(/></g, '>\n<'));
