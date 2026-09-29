import fs from 'node:fs';
const SITE = 'brandmylaptop-com-284b5fbe';
const md = JSON.parse(fs.readFileSync(`docs/research/${SITE}/mock-data.json`, 'utf8'));
const DEST = `src/components/sites/${SITE}/shared/data.ts`;

const j = (v) => JSON.stringify(v);
const laptopLit = (l) =>
  `  {
    slug: ${j(l.slug)},
    title: ${j(l.title)},
    author: ${j(l.author)},
    followers: ${j(l.followers)},
    avatar: ${j(l.avatar)},
    socials: ${j(l.socialsList || [])},
    caption: ${j(l.caption ?? null)},
    raised: ${l.raised},
    goal: ${l.goal},
    soldOnly: ${!!l.soldOnly},
    spots: ${j(l.spots)},
    rightLabel: ${j(l.rightLabel ?? l.spots)},
    leftSuffix: ${j(l.leftSuffix)},
    stamp: ${j(l.stamp)},
    stampClass: ${j(l.stampClass)},
    tags: ${j(l.tags)},
    lid: {
      lidStyle: ${j(l.lid.lidStyle)},
      lidBg: ${j(l.lid.lidBg)},
      slots: [
${l.lid.slots
  .map(
    (s) => `        { area: ${j(s.area)}, img: ${j(s.img)}, imgStyle: ${j(s.imgStyle)}, label: ${j(s.label)} },`
  )
  .join('\n')}
      ],
    },
  },`;

const content = `// Generated from live brandmylaptop.com data — do not hand-edit.

export type LidSlot = {
  area: string | null;
  img: string | null;
  imgStyle: string | null;
  label: string | null;
};

export type Lid = {
  lidStyle: string | null;
  lidBg: string | null;
  slots: LidSlot[];
};

export type Laptop = {
  slug: string | null;
  title: string;
  author: string | null;
  followers: string | null;
  avatar: string | null;
  socials: string[];
  caption: string | null;
  raised: number | null;
  goal: number | null;
  soldOnly: boolean;
  spots: string | null;
  rightLabel: string | null;
  leftSuffix: string | null;
  stamp: string | null;
  stampClass: string | null;
  tags: string[];
  lid: Lid;
};

export type BrandRow = {
  name: string;
  meta: string;
  amount: number | null;
  sponsor: boolean;
  logo: string | null;
};

export const laptops: Laptop[] = [
${md.laptops.map(laptopLit).join('\n')}
];

export const brandsList: BrandRow[] = [
${md.brandsList.map((b) => `  { name: ${j(b.name)}, meta: ${j(b.meta)}, amount: ${b.amount}, sponsor: ${!!b.sponsor}, logo: ${j(b.logo)} },`).join('\n')}
];

export const logoWall: { img: string | null; alt: string; text: string }[] = [
${md.logoWall.map((l) => `  { img: ${j(l.img)}, alt: ${j(l.alt)}, text: ${j(l.text)} },`).join('\n')}
];

export const justSold: string[] = ${j(md.justSold)};
`;

fs.writeFileSync(DEST, content);
console.log('wrote', DEST, content.length, 'bytes; laptops:', md.laptops.length, 'brands:', md.brandsList.length, 'wall:', md.logoWall.length);
