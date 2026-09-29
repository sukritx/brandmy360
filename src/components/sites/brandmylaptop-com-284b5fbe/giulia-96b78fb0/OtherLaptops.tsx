import Link from "next/link";

import { listingOtherLaptops } from "./data";

function fromLabel(item: (typeof listingOtherLaptops)[number]): string {
  return item.fromCurrency === "EUR"
    ? `from ${item.fromAmount}\u00A0€`
    : `from £${item.fromAmount}`;
}

export function OtherLaptops() {
  return (
    <section
      aria-labelledby="other-lids"
      className="mx-4 mt-4 scroll-mt-20 rounded-3xl py-16 sm:mx-6 sm:mt-6 md:py-20 lg:mx-8 bg-surface"
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 id="other-lids" className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
          Other laptops looking for brands.
        </h2>
        <p className="mt-3 max-w-[60ch] text-ink-2">
          This one has closed, but these are still taking brands.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {listingOtherLaptops.map((item) => (
            <li key={item.href}>
              <Link
                className="flex h-full flex-col rounded-2xl border border-hairline bg-white p-5 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                href={item.href}
                prefetch={false}
              >
                <span className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                    src={item.avatar}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium">{item.name}</span>
                    {item.sub && (
                      <span className="block truncate text-[12px] text-ink-2">{item.sub}</span>
                    )}
                  </span>
                </span>
                <span className="mt-3 inline-flex w-fit rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium">
                  {item.role}
                </span>
                <span className="mt-2 block text-[12px] leading-relaxed text-ink-2">
                  {item.seen}
                </span>
                <span className="mt-auto flex items-baseline justify-between gap-2 pt-4 text-[12px] text-ink-2">
                  <span className="whitespace-nowrap">{item.spotsLeft}</span>
                  <span className="whitespace-nowrap font-medium text-ink">{fromLabel(item)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
