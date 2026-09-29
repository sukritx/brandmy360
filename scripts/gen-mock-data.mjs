import fs from 'node:fs';
const SITE = 'brandmylaptop-com-284b5fbe';
const d = `docs/research/${SITE}/`;
const manifest = JSON.parse(fs.readFileSync(d + '_asset-manifest.json', 'utf8'));

const local = (u) => {
  if (!u) return null;
  const direct = manifest[u];
  if (direct && direct.local) return direct.local;
  const noQ = u.split('?')[0];
  for (const [k, v] of Object.entries(manifest)) {
    if (k.split('?')[0] === noQ && v.local) return v.local;
  }
  return u;
};

const num = (s) => {
  if (!s) return null;
  const m = String(s).replace(/[^\d.,]/g, '');
  if (!m) return null;
  return Number(m.replace(/,/g, ''));
};

// ---------- laptops ----------
const cards = JSON.parse(fs.readFileSync(d + 'root-7280be29/cards-full.json', 'utf8'));
const seen = new Set();
const laptops = [];
for (const c of cards) {
  if (!c.title || seen.has(c.title)) continue;
  seen.add(c.title);
  const priceM = (c.price || '').match(/([$€£])\s*([\d,]+)\s*(?:of\s*([$€£])?\s*([\d,]+))?/);
  const soldOnly = /sold/.test(c.price || '') && !/of/.test(c.price || '');
  laptops.push({
    slug: (c.href || '').replace(/^\//, '') || null,
    title: c.title,
    author: c.author || null,
    followers: c.followers || null,
    avatar: local(c.avatar),
    socials: c.socialsCount || 0,
    raised: priceM ? num(priceM[2]) : null,
    goal: priceM && priceM[4] ? num(priceM[4]) : null,
    soldOnly,
    spots: c.spots || null,
    stamp: c.stamp || null,
    stampClass: c.stampClass || null,
    tags: (c.tags || []).filter((t) => !/^(of |\d+\/\d+ left)/.test(t)),
    lid: {
      lidStyle: (c.lid.lidStyle || '').replace(/--lidw:[^;"]+;?/, ''),
      lidBg: c.lid.lidBg || null,
      slots: c.lid.slots
        .filter((s) => s.img || s.label)
        .map((s) => ({ area: s.area, img: local(s.img), imgStyle: s.imgStyle, label: s.label })),
    },
  });
}
console.log('laptops:', laptops.length, 'with stickers:', laptops.filter((l) => l.lid.slots.length).length);

// ---------- brands list ----------
const rawRows = JSON.parse(fs.readFileSync(d + 'brands-b0addea9/brands-rows.json', 'utf8'));
const brandsList = [];
for (const r of rawRows) {
  const t = (r.text || '').trim();
  if (!t || !/[$€£][\d,]+|sponsor/i.test(t)) continue;
  const parts = t.split(' | ').map((x) => x.trim()).filter(Boolean);
  const priceIdx = parts.findIndex((p) => /^[$€£][\d,]+$/.test(p) || /sponsor/i.test(p));
  if (priceIdx < 1) continue;
  brandsList.push({
    name: parts[0],
    meta: parts.slice(1, priceIdx).join(' '),
    amount: /^[$€£][\d,]+$/.test(parts[priceIdx]) ? num(parts[priceIdx]) : null,
    sponsor: /sponsor/i.test(parts[priceIdx]),
    logo: local(r.logo),
  });
}
console.log('brands list rows:', brandsList.length);
const uniqBrands = [];
const seenB = new Set();
for (const b of brandsList) {
  const key = b.name + '|' + b.logo;
  if (seenB.has(key)) continue;
  seenB.add(key);
  uniqBrands.push(b);
}
console.log('unique brands:', uniqBrands.length);

// ---------- logo wall ----------
const wall = JSON.parse(fs.readFileSync(d + 'brands-b0addea9/logo-wall.json', 'utf8'));
const logoWall = (wall.items || []).map((i) => ({ img: local(i.img), alt: i.alt, text: i.text }));

// ---------- just sold ----------
const js = JSON.parse(fs.readFileSync(d + 'root-7280be29/just-sold.json', 'utf8'));

const out = { laptops, brandsList: uniqBrands, logoWall, justSold: js ? js.rows : [] };
fs.writeFileSync(d + 'mock-data.json', JSON.stringify(out, null, 1));
console.log('written mock-data.json');
console.log(JSON.stringify(laptops[1], null, 1).slice(0, 900));
