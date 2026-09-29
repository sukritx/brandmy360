import fs from 'node:fs';
const c = fs.readFileSync('docs/research/brandmylaptop-com-284b5fbe/stats-d8625d36/sections-html/07-y1842.html', 'utf8');
const lis = [...c.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
const rows = lis.map((li) => {
  const href = (li.match(/href="([^"]+)"/) || [])[1] || null;
  const img = (li.match(/<img[^>]*src="([^"]+)"/) || [])[1] || null;
  const name = (li.match(/class="block truncate text-\[14px\] font-medium">([^<]*)</) || [])[1] || null;
  const meta = (li.match(/class="block text-\[12px\] text-ink-2">([\s\S]*?)<\/span>/) || [])[1] || null;
  const amount = (li.match(/<span class="tabular-nums">([^<]*)</) || [])[1] || null;
  return { name, meta: meta ? meta.replace(/<!-- -->/g, '').trim() : null, amount, logo: img, href };
});
console.log('rows:', rows.length);
rows.forEach((r, i) => console.log(`${i + 1}. ${r.name} | ${r.meta} | ${r.amount} | ${r.href}`));
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/stats-d8625d36/brands-bought.json', JSON.stringify(rows, null, 1));
