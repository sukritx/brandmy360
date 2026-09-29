import fs from 'node:fs';
const dir = 'docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort();
console.log('files:', files.join(', '));

const byName = {};
for (const f of files) {
  const c = fs.readFileSync(`${dir}/${f}`, 'utf8');
  if (/^<nav/.test(c.trim())) byName.nav = c;
  else if (/^<aside/.test(c.trim())) (byName.asides ||= []).push(c);
  else if (/^<header/.test(c.trim())) byName.header = c;
  else if (/^<footer/.test(c.trim())) byName.footer = c;
  else if (/^<section/.test(c.trim())) (byName.sections ||= []).push({ file: f, html: c });
}
console.log('nav:', !!byName.nav, 'asides:', byName.asides?.length, 'header:', !!byName.header, 'sections:', byName.sections?.length, 'footer:', !!byName.footer);

// Spots table rows
const spots = byName.sections?.find((s) => /The spots/.test(s.html));
if (spots) {
  const rows = [...spots.html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) =>
    [...m[1].matchAll(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/g)].map((x) => x[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  );
  console.log('\nSPOTS ROWS:', rows.length);
  rows.forEach((r) => console.log('  ', JSON.stringify(r)));
  const imgs = [...spots.html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1].split('/').pop());
  console.log('  spot logos:', imgs.join(', '));
}

// Other laptops cards
const others = byName.sections?.find((s) => /Other laptops/.test(s.html));
if (others) {
  const lis = [...others.html.matchAll(/<li[\s\S]*?<\/li>/g)].map((m) => m[0]);
  console.log('\nOTHER CARDS:', lis.length);
  lis.forEach((li, i) => {
    const img = (li.match(/<img[^>]*src="([^"]+)"/) || [])[1];
    console.log(`  #${i}: ${li.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220)}`);
    console.log(`      img: ${img ? img.split('/').pop() : 'none'}`);
  });
  console.log('\n--- first other-card markup ---');
  console.log(lis[0].replace(/></g, '>\n<').slice(0, 2200));
}

// Hero price cells
const header = byName.header;
if (header) {
  const cells = [...header.matchAll(/<div style="grid-area:[^"]*">[\s\S]*?(?=<div style="grid-area:|<\/div><\/div><\/div>)/g)];
  console.log('\nHERO price-ish cells:', cells.length);
  const cellInfo = [...header.matchAll(/style="grid-area:([^;"]+)[^"]*"/g)].map((m) => m[1].trim());
  console.log('grid areas:', cellInfo.join(' | '));
  const prices = [...header.matchAll(/([\d\s\u00a0]+)€/g)].map((m) => m[1]);
  console.log('€ values in header:', prices.slice(0, 20).join(' , '));
}
fs.writeFileSync('docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/_parsed-index.json', JSON.stringify(Object.keys(byName), null, 1));
