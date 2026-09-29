import fs from 'node:fs';
const SITE = 'brandmylaptop-com-284b5fbe';
const rows = JSON.parse(fs.readFileSync(`docs/research/${SITE}/stats-d8625d36/brands-bought.json`, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(`docs/research/${SITE}/_asset-manifest.json`, 'utf8'));
const local = (u) => {
  if (!u) return null;
  const hit = manifest[u];
  if (hit && hit.local) return hit.local;
  const noQ = u.split('?')[0];
  for (const [k, v] of Object.entries(manifest)) if (k.split('?')[0] === noQ && v.local) return v.local;
  return u;
};
const num = (s) => (s ? Number(String(s).replace(/[^\d]/g, '')) : null);
const j = (v) => JSON.stringify(v);
const data = rows
  .map((r) => `  { name: ${j(r.name)}, meta: ${j(r.meta)}, amount: ${num(r.amount)}, href: ${j(r.href)}, logo: ${j(local(r.logo))} },`)
  .join('\n');

const content = `import Link from "next/link";

import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";

const BRANDS: {
  name: string;
  meta: string;
  amount: number | null;
  href: string;
  logo: string | null;
}[] = [
${data}
];

export function BrandsBought() {
  return (
    <section className="mt-6 rounded-3xl bg-surface p-6 sm:p-10">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.025em]">
        The 40 brands that have bought
      </h2>
      <p className="mt-3 text-[15px] text-ink-2">What each has spent to be on somebody\u2019s laptop.</p>
      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BRANDS.map((row) => (
          <li key={row.name}>
            <Link
              className="flex items-center gap-3 rounded-2xl border border-hairline bg-white p-4 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              href={row.href}
            >
              {row.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.logo} alt="" loading="lazy" className="h-8 w-8 shrink-0 object-contain" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{row.name}</span>
                <span className="block text-[12px] text-ink-2">{row.meta}</span>
              </span>
              {row.amount !== null && (
                <span className="shrink-0 text-[14px] font-semibold tabular-nums text-green">
                  <Money usd={row.amount} className="tabular-nums" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] text-ink-2">
        <Link className="text-blue hover:underline" href="/brands">
          Every brand, filterable by date and spend \u2192
        </Link>
      </p>
    </section>
  );
}
`;
fs.writeFileSync('src/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/BrandsBought.tsx', content);
console.log('wrote BrandsBought.tsx with', rows.length, 'rows');
