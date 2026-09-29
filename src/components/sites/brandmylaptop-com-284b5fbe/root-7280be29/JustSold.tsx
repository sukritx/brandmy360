import { Money } from "../shared/CurrencyProvider";
import { justSold } from "../shared/data";

const LOGO_BASE = "/sites/brandmylaptop-com-284b5fbe/shared/logos/";

const ROW_META = [
  { href: "/eliana", logo: `${LOGO_BASE}391d41f1-7a71-4d18-ab1b-ebf8f87698be.png` },
  { href: "/apple", logo: `${LOGO_BASE}4692ee81-f985-4db7-a35a-283a80041700.png` },
  { href: "/margaridaporto", logo: `${LOGO_BASE}0ef4f13c-abce-4c73-be83-e8a8bf10ae64.png` },
  { href: "/djnlj", logo: `${LOGO_BASE}d225692b-1f40-4d75-b020-ab571681ced0.png` },
  { href: "/digbyfox", logo: `${LOGO_BASE}22cb75ea-d31d-4128-af8b-5e2f856d21f7.jpg` },
  { href: "/digbyfox", logo: `${LOGO_BASE}86f916d3-062b-4e5b-991d-093878d810f8.png` },
] as const;

const ROWS = justSold.map((raw, i) => {
  const [text, price, time] = raw.split(" | ");
  const splitAt = text.indexOf(" took a spot on ");
  return {
    ...ROW_META[i],
    brand: text.slice(0, splitAt),
    desc: text.slice(splitAt),
    usd: Number(price.replace(/[$,]/g, "")),
    time,
  };
});

export function JustSold() {
  return (
    <section className="border-t border-hairline/60 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-medium">Just sold</h2>
          <span className="text-[13px] text-ink-2">Every spot bought on these lids</span>
        </div>
        <ul className="mt-4 divide-y divide-hairline/70">
          {ROWS.map((row) => (
            <li key={row.href + row.brand + row.time}>
              <a
                className="flex items-center gap-3 py-3 transition-opacity hover:opacity-70"
                href={row.href}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  loading="lazy"
                  className="h-8 w-8 shrink-0 rounded-lg object-contain"
                  src={row.logo}
                />
                <span className="min-w-0 flex-1 truncate text-[14px]">
                  <span className="font-medium">{row.brand}</span>
                  <span className="text-ink-2">{row.desc}</span>
                </span>
                <Money
                  usd={row.usd}
                  className="shrink-0 text-[14px] font-semibold tabular-nums text-green"
                />
                <span className="hidden w-16 shrink-0 text-right text-[12px] text-ink-2 sm:block">
                  {row.time}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
