import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";

export function PaidChart() {
  return (
    <section className="mt-6 rounded-3xl bg-surface p-6 sm:p-10">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.025em]">
        Paid to creators
      </h2>
      <p className="mt-3 text-[15px] text-ink-2">Running total across 44 sticker spots.</p>
      <ul className="mt-8 flex items-end gap-3 sm:gap-5">
        <li className="flex-1">
          <div className="flex h-44 items-end">
            <div
              className="w-full rounded-t-lg bg-apple-green/70"
              style={{ height: "27.591178965224767%" }}
            />
          </div>
          <p className="mt-2 text-[15px] font-semibold tabular-nums text-green">
            <Money usd={3806} className="tabular-nums" />
          </p>
          <p className="text-[12px] text-ink-2">Aug 26</p>
        </li>
        <li className="flex-1">
          <div className="flex h-44 items-end">
            <div className="w-full rounded-t-lg bg-apple-green/70" style={{ height: "100%" }} />
          </div>
          <p className="mt-2 text-[15px] font-semibold tabular-nums text-green">
            <Money usd={13794} className="tabular-nums" />
          </p>
          <p className="text-[12px] text-ink-2">Sept 26</p>
        </li>
      </ul>
    </section>
  );
}
