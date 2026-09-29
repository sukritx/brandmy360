import fs from 'node:fs';
const a = JSON.parse(fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/_shared-html/asides.json', 'utf8'));
for (const [i, html] of a.entries()) {
  const lis = [...html.matchAll(/<li[\s\S]*?<\/li>/g)].map((m) => m[0]);
  console.log(`ASIDE ${i} li count:`, lis.length, '| side:', html.includes('left-2') ? 'left' : 'right');
  lis.forEach((li, k) => {
    const name = (li.match(/>([^<>]{3,40})<\/span>/) || [])[1] || '';
    const href = (li.match(/href="([^"]+)"/) || [])[1] || '';
    const isPlaceholder = li.includes('border-dashed');
    const logo = (li.match(/src="([^"]+)"/) || [])[1] || '';
    const tagline = [...li.matchAll(/>([^<>]{3,60})<\/span>/g)].map((m) => m[1]).slice(-2).join(' / ');
    console.log(`   ${k}: ${isPlaceholder ? 'PLACEHOLDER' : 'SPONSOR'} ${name} | ${tagline} | ${href.slice(0, 60)} | ${logo.split('/').pop()}`);
  });
}
