import fs from 'node:fs';
const SITE = 'brandmylaptop-com-284b5fbe';
const dir = `docs/research/${SITE}/giulia-96b78fb0/sections-html`;
const manifest = JSON.parse(fs.readFileSync(`docs/research/${SITE}/_asset-manifest.json`, 'utf8'));

const local = (u) => {
  if (!u) return null;
  const clean = u.replace(/&amp;/g, '&');
  let base = clean;
  if (base.includes('/_next/image?')) {
    const m = base.match(/[?&]url=([^&]+)/);
    if (m) base = decodeURIComponent(m[1]);
  }
  if (base.startsWith('/')) base = 'https://brandmylaptop.com' + base;
  const hit = manifest[base] || manifest[base.replace('https://brandmylaptop.com', '')] || manifest[clean];
  if (hit && hit.local) return hit.local;
  const noQ = base.split('?')[0];
  for (const [k, v] of Object.entries(manifest)) if (k.split('?')[0] === noQ && v.local) return v.local;
  return null;
};

const header = fs.readFileSync(`${dir}/17-y53.html`, 'utf8');
const details = fs.readFileSync(`${dir}/18-y1199.html`, 'utf8');
const spotsHtml = fs.readFileSync(`${dir}/19-y2126.html`, 'utf8');
const othersHtml = fs.readFileSync(`${dir}/20-y3150.html`, 'utf8');

// --- hero cells: split on grid-area divs ---
const cellRe = /<div style="grid-area:\s*([^";]+);?">([\s\S]*?)(?=<div style="grid-area:|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div aria-hidden)/g;
const cells = [];
let m;
while ((m = cellRe.exec(header))) {
  const area = m[1].trim();
  const inner = m[2];
  const a = inner.match(/<a href="([^"]+)"[^>]*aria-label="([^"]*)"/);
  const price = (inner.match(/>([\d][\d\s\u00a0]*)&nbsp;€</) || [])[1];
  const img = inner.match(/<img[^>]*src="([^"]+)"/);
  const label = (inner.match(/<span class="shrink-0 text-\[11px\][^>]*>([^<]+)</) || [])[1] || null;
  cells.push({ area, href: a ? a[1] : null, aria: a ? a[2].replace(/&amp;/g, '&') : null, price: price ? price.trim() : null, img: img ? img[1] : null, label });
}
console.log('hero cells found:', cells.length);
cells.forEach((c) => console.log(' ', c.area, '|', c.price, '€ |', (c.aria || '').slice(0, 60), '|', c.img ? c.img.split('/').pop() : 'no img'));

// --- spots table ---
const rows = [...spotsHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].slice(1).map((r) => {
  const tds = [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((x) => x[1]);
  const img = (tds[2] || '').match(/<img[^>]*src="([^"]+)"/);
  const name = (tds[2] || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const num = ((tds[0] || '').match(/tabular-nums text-ink-2">(\d+)</) || [])[1] || '';
  const nameSpan = ((tds[0] || '').match(/<span class="font-medium">([^<]*)</) || [])[1] || '';
  const brandAlt = ((tds[2] || '').match(/<img alt="([^"]*)"/) || [])[1] || '';
  const sizeRaw = (tds[1] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const price = (tds[3] || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  return { num, size: sizeRaw, name: nameSpan || name, brandAlt, img: img ? img[1] : null, price, struck: /line-through/.test(tds[3] || '') };
});
console.log('\nspots rows:', rows.length);
rows.forEach((r) => console.log(`  ${r.num} | ${r.size} | ${r.name} | ${r.price} | ${r.img ? r.img.split('/').pop() : ''}`));

// spot names/sizes for aria from hero labels: derive size labels from table
// --- other laptops ---
const otherLis = [...othersHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => x[1]);
const others = otherLis.map((li) => {
  const href = (li.match(/href="([^"]+)"/) || [])[1];
  const img = (li.match(/<img[^>]*src="([^"]+)"/) || [])[1];
  const name = (li.match(/<span class="block truncate text-\[14px\] font-medium">([^<]*)</) || [])[1];
  const role = (li.match(/rounded-full bg-surface px-2\.5 py-1 text-\[12px\] font-medium">([^<]*)</) || [])[1];
  const seen = (li.match(/mt-2 block text-\[12px\] leading-relaxed text-ink-2">([^<]*)</) || [])[1];
  const sub = (li.match(/<span class="block truncate text-\[12px\] text-ink-2">([^<]*)</) || [])[1];
  const left = (li.match(/<span class="whitespace-nowrap">([^<]*)</) || [])[1];
  const from = (li.match(/whitespace-nowrap font-medium text-ink">([^<]*)</) || [])[1];
  return { href, name, sub: sub || null, role, seen, left, from: from ? from.replace(/&nbsp;/g, ' ').replace(/&pound;/g, '£') : null, img };
});
console.log('\nother cards:', others.length);
others.forEach((o) => console.log(' ', JSON.stringify(o)));

// --- details text blocks ---
const dtext = (re) => (details.match(re) || [])[1];
const detailsData = {
  whoHeading: dtext(/Who you are buying from/),
  name: dtext(/truncate text-\[15px\] font-medium[^>]*>([^<]*)</) || 'giulia',
  handle: (details.match(/@giutheginger/) || [])[0],
  followers: (details.match(/([\d.]+k)/) || [])[1],
  chips: [...details.matchAll(/rounded-full[^>]*>([^<]{3,60})</g)].map((x) => x[1].trim()),
};

const j = (v) => JSON.stringify(v);
const out = `// Generated from live brandmylaptop.com/giulia data — do not hand-edit.

export type ListingSpot = {
  n: number;
  name: string;
  size: string;
  sizeShort: string;
  dims: string;
  price: number;
  brand: string;
  brandHref: string;
  logo: string | null;
  area: string;
};

export const listingTitle = "Want to sponsor my next season? 👀";
export const listingSeoTitle = ${j("Ad space on Giulia's 16\\u2033 MacBook")};
export const listingViews = 4817;
export const listingAuthor = {
  name: "giulia",
  handle: "@giutheginger",
  handleHref: "https://x.com/giutheginger",
  followers: "13.3k",
  avatar: ${j(local((header.match(/h-11 w-11 shrink-0 rounded-full object-cover" src="([^"]+)"/) || [])[1]))},
  socials: [
    { label: "linkedin", href: "https://linkedin.com/in/giuliacamaargo" },
    { label: "instagram", href: "https://instagram.com/giutheginger" },
  ],
};
export const listingMoney = { sold: 4200, goalPct: 100 };

export const listingSpots: ListingSpot[] = [
${rows
  .map((r, i) => {
    const cell = cells[i] || {};
    const dims = (r.size.match(/([\d.]+ × [\d.]+ cm)/) || [])[1] || '';
    const sizeShort = (r.size.match(/^([LMS])\b/) || [])[1] || '';
    const nameClean = r.name.replace(/\s*Sold\s*$/, '').trim();
    const ariaBrand = (cell.aria || '').match(/Taken by ([^.]+)\./);
    const brand = ariaBrand ? ariaBrand[1] : r.brandAlt || nameClean;
    return `  { n: ${Number(r.num) || i + 1}, name: ${j(nameClean)}, size: ${j(sizeShort)}, sizeShort: ${j(sizeShort)}, dims: ${j(dims)}, price: ${Number(r.price.replace(/[^\d]/g, '')) || 0}, brand: ${j(brand)}, brandHref: ${j((cell.href || '').replace(/&amp;/g, '&'))}, logo: ${j(local(cell.img))}, area: ${j(cell.area)} },`;
  })
  .join('\n')}
];

export const listingOtherLaptops = [
${others
  .map((o) => {
    const from = o.from || '';
    const amount = Number((from.match(/([\d,]+)/) || [])[1]?.replace(/,/g, '') || 0);
    const currency = /£/.test(from) ? "GBP" : "EUR";
    return `  { href: ${j(o.href)}, name: ${j((o.name || '').trim())}, sub: ${j(o.sub)}, role: ${j((o.role || '').trim())}, seen: ${j((o.seen || '').trim())}, spotsLeft: ${j((o.left || '').trim())}, fromAmount: ${amount}, fromCurrency: ${j(currency)}, avatar: ${j(local(o.img))} },`;
  })
  .join('\n')}
];
`;
fs.mkdirSync('src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0', { recursive: true });
fs.writeFileSync('src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/data.ts', out);
console.log('\nwrote giulia data.ts', out.length, 'bytes');
console.log('unmapped logos:', cells.filter((c) => !local(c.img)).length, '| unmapped avatars:', others.filter((o) => !local(o.img)).length);
console.log('details chips:', JSON.stringify(detailsData));
