import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";

type PriceRow = {
  label: string;
  value: number;
  width: string;
  sold: number;
  from: number;
  to: number;
  thin: boolean;
};

const ROWS: PriceRow[] = [
  { label: "Top", value: 742, width: "100%", sold: 8, from: 170, to: 983, thin: true },
  {
    label: "Middle",
    value: 187,
    width: "25.236593059936908%",
    sold: 28,
    from: 29,
    to: 1170,
    thin: false,
  },
  {
    label: "Bottom",
    value: 370,
    width: "49.8422712933754%",
    sold: 8,
    from: 228,
    to: 491,
    thin: true,
  },
];

export function PriceBreakdown() {
  return (
    <section className="mt-6 rounded-3xl bg-surface p-6 sm:p-10">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.025em]">
        What a spot costs, by where it sits
      </h2>
      <p className="mt-3 text-[15px] text-ink-2">The typical price, and what it has ranged between.</p>
      <ul className="mt-8 space-y-4">
        {ROWS.map((row) => (
          <li key={row.label} className="rounded-2xl border border-hairline bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[15px] font-medium">{row.label}</h3>
              <p className="text-[24px] font-semibold tabular-nums tracking-[-0.02em]">
                <Money usd={row.value} className="tabular-nums" />
              </p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-hairline/60" aria-hidden="true">
              <div className="h-full rounded-full bg-blue/50" style={{ width: row.width }} />
            </div>
            <p className="mt-2 text-[12px] tabular-nums text-ink-2">
              {row.sold} sold, from <Money usd={row.from} className="tabular-nums" /> to{" "}
              <Money usd={row.to} className="tabular-nums" />
              {row.thin && <span className="text-amber-deep"> · thin, so far</span>}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed">
        <strong className="font-medium">
          A spot on the top row goes for about 4 times one in the middle.
        </strong>
      </p>
    </section>
  );
}
