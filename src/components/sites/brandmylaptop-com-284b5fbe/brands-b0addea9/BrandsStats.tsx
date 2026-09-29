import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";

export function BrandsStats() {
  return (
    <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-hairline bg-white p-5">
        <dt className="text-[13px] text-ink-2">Brands on laptops</dt>
        <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em]">40</dd>
      </div>
      <div className="rounded-2xl border border-hairline bg-white p-5">
        <dt className="text-[13px] text-ink-2">Paid to creators</dt>
        <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-green">
          <Money usd={13794} className="tabular-nums" />
        </dd>
      </div>
      <div className="rounded-2xl border border-hairline bg-white p-5">
        <dt className="text-[13px] text-ink-2">A spot from</dt>
        <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em]">
          <Money usd={26} className="tabular-nums" />
        </dd>
      </div>
    </dl>
  );
}
