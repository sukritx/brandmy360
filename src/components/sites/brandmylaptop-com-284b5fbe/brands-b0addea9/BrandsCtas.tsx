import Link from "next/link";

import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";

export function BrandsCtas() {
  return (
    <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-hairline bg-white p-6">
        <h2 className="text-[15px] font-medium">Let creators come to you</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
          Name the audience you are looking for and your budget. Creators who fit apply; you
          review them. No account, nothing charged.
        </p>
        <Link
          className="mt-4 inline-block rounded-full bg-blue px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover"
          href="/briefs"
        >
          Post a brief
        </Link>
      </div>
      <div className="rounded-2xl border border-hairline bg-white p-6">
        <h2 className="text-[15px] font-medium">Or pick a creator yourself</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
          166 laptops are taking brands right now, from{" "}
          <Money usd={26} className="tabular-nums" />. One click on a free spot opens the
          checkout.
        </p>
        <Link
          className="mt-4 inline-block rounded-full border border-hairline bg-white px-6 py-3 text-[15px] font-medium transition-colors hover:border-ink/30"
          href="/"
        >
          Browse the laptops
        </Link>
      </div>
    </section>
  );
}
