import Link from "next/link";

import { LatestActivity } from "./LatestActivity";

export function HeroSection() {
  return (
    <header className="mx-auto max-w-5xl px-6 pb-10 pt-12 text-center md:pt-16">
      <p className="sold-total text-[14px] text-ink-2 transition-opacity duration-500 opacity-100">
        <a className="hover:text-ink" href="/stats">
          <strong className="font-semibold tabular-nums text-green">$13,794</strong> of ad space
          sold · <strong className="font-semibold tabular-nums">42,430</strong> visits
        </a>
      </p>
      <h1 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.06em]">
        The marketplace for ads on laptops.
      </h1>
      <p className="mx-auto mt-4 max-w-[62ch] text-[14px] leading-relaxed text-ink-2 sm:text-[16px]">
        Creators sell the sticker spots on their lid.{" "}
        <span className="block sm:inline">
          Brands buy them<span className="sm:hidden"> for advertising</span>.
        </span>
        <span className="hidden sm:block">Print stickers, print money.</span>
      </p>
      <div className="mt-8 flex flex-row-reverse flex-wrap items-center justify-center gap-x-2.5 gap-y-3 sm:flex-row">
        <a
          className="rounded-full bg-blue px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          href="/brands"
        >
          I’m a brand
        </a>
        <a
          className="rounded-full border border-hairline bg-white px-6 py-3 text-[15px] font-medium transition-colors hover:border-ink/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          href="/sell"
        >
          I’m a creator
        </a>
      </div>
      <p className="mt-3 text-[13px] text-ink-2">
        Or{" "}
        <Link
          className="font-medium text-ink underline decoration-hairline underline-offset-2 hover:decoration-ink"
          href="/#laptops"
        >
          browse the laptops
        </Link>
        .
      </p>
      <div className="mt-10 text-left">
        <div>
          <div className="flex items-center gap-2 text-[14px] font-medium">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-apple-green" />
            </span>
            Latest activity
          </div>
          <LatestActivity />
        </div>
      </div>
    </header>
  );
}
