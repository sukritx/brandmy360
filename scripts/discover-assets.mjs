import fs from 'node:fs';
import path from 'node:path';

const base = 'docs/research/brandmylaptop-com-284b5fbe';
const keys = fs.readdirSync(base).filter((d) => fs.existsSync(path.join(base, d, 'sections-html')));
const urls = new Set();

const add = (u) => {
  if (!u) return;
  u = u.trim();
  if (u.startsWith('data:')) return;
  urls.add(u);
};

for (const k of keys) {
  const dir = path.join(base, k, 'sections-html');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    [...c.matchAll(/<img[^>]*>/g)].forEach((m) => {
      const tag = m[0];
      const src = tag.match(/\ssrc="([^"]+)"/);
      if (src) add(src[1].replace(/&amp;/g, '&'));
      const srcset = tag.match(/\ssrcset="([^"]+)"/);
      if (srcset) srcset[1].split(',').forEach((s) => add(s.trim().split(/\s+/)[0].replace(/&amp;/g, '&')));
    });
    [...c.matchAll(/<source[^>]*srcset="([^"]+)"/g)].forEach((m) => m[1].split(',').forEach((s) => add(s.trim().split(/\s+/)[0].replace(/&amp;/g, '&'))));
    [...c.matchAll(/background-image:\s*url\(&quot;([^&]+)&quot;\)/g)].forEach((m) => add(m[1]));
    [...c.matchAll(/backgroundImage:"url\(([^"']+)\)/g)].forEach((m) => add(m[1]));
    [...c.matchAll(/https:\/\/rihdbhaulfvzfhbafmax\.supabase\.co\/[^"'\\ )]+/g)].forEach((m) => add(m[0]));
  }
}
const list = [...urls].sort();
fs.writeFileSync(base + '/_assets.json', JSON.stringify(list, null, 1));
const cats = {};
for (const u of list) {
  let c = 'other';
  if (u.includes('/_next/image')) c = 'next-image';
  else if (u.includes('/stickers/')) c = 'stickers';
  else if (u.includes('/_next/static/media')) c = 'next-media';
  else if (u.includes('supabase.co')) c = u.includes('/logos/sponsors/') ? 'sponsor-logos' : u.includes('/logos/') ? 'brand-logos' : 'supabase-other';
  else if (u.startsWith('http')) c = 'external';
  cats[c] = (cats[c] || 0) + 1;
}
console.log('total asset urls:', list.length, JSON.stringify(cats, null, 1));
console.log('\nNON-next-image URLs:');
list.filter((u) => !u.includes('/_next/image')).slice(0, 200).forEach((u) => console.log(' ', u.slice(0, 150)));
