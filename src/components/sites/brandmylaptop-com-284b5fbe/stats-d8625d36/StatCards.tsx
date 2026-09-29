import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";

export function StatCards() {
  return (
    <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-2xl border border-hairline bg-white p-5">
        <dt className="text-[13px] text-ink-2">Paid to creators</dt>
        <dd className="mt-1 text-[clamp(1.5rem,3.4vw,2rem)] font-semibold tabular-nums tracking-[-0.03em] text-green">
          <Money usd={13794} className="tabular-nums" />
        </dd>
        <dd className="mt-1 text-[12px] leading-snug text-ink-2">44 sticker spots sold</dd>
      </div>
      <div className="rounded-2xl border border-hairline bg-white p-5">
        <dt className="text-[13px] text-ink-2">Combined following</dt>
        <dd className="mt-1 text-[clamp(1.5rem,3.4vw,2rem)] font-semibold tabular-nums tracking-[-0.03em]">
          11.9M
        </dd>
        <dd className="mt-1 text-[12px] leading-snug text-ink-2">
          1.3M of it verified by X and YouTube
        </dd>
      </div>
      <div className="rounded-2xl border border-hairline bg-white p-5">
        <dt className="text-[13px] text-ink-2">Laptops taking brands</dt>
        <dd className="mt-1 text-[clamp(1.5rem,3.4vw,2rem)] font-semibold tabular-nums tracking-[-0.03em]">
          166
        </dd>
        <dd className="mt-1 text-[12px] leading-snug text-ink-2">of 301 ever put up</dd>
      </div>
      <div className="rounded-2xl border border-hairline bg-white p-5">
        <dt className="text-[13px] text-ink-2">Visits to the site</dt>
        <dd className="mt-1 text-[clamp(1.5rem,3.4vw,2rem)] font-semibold tabular-nums tracking-[-0.03em]">
          42,433
        </dd>
        <dd className="mt-1 text-[12px] leading-snug text-ink-2">
          12,311 of them on a laptop&apos;s page
        </dd>
      </div>
    </dl>
  );
}
