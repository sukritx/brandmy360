"use client";

import Link from "next/link";
import { useState } from "react";
import { CurrencySelect } from "./CurrencySelect";

const NAV_LINKS = [
  { href: "/#laptops", label: "Laptops" },
  { href: "/brands", label: "Brands" },
  { href: "/briefs", label: "Briefs" },
  { href: "/stats", label: "Stats" },
  { href: "/#how", label: "How it works" },
];

const LAPTOP_LOGO = "/sites/brandmylaptop-com-284b5fbe/shared/media/logo-small.1zmf4nfgeac61.png";
const WORDMARK = "/sites/brandmylaptop-com-284b5fbe/shared/stickers/brandmylaptop.png";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 border-b border-hairline/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-13 max-w-6xl items-center justify-between px-6 py-3">
        <Link
          className="flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em] sm:gap-2.5 sm:text-[15px]"
          href="/"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LAPTOP_LOGO} alt="" width={256} height={171} className="h-7 w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WORDMARK}
            alt="BrandMyLaptop"
            className="h-[22px] w-auto -rotate-2 sm:h-6 [filter:drop-shadow(0_0.6px_1px_rgba(0,0,0,0.25))]"
          />
        </Link>
        <div className="hidden items-center gap-7 text-[13px] text-ink-2 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} className="transition-colors hover:text-ink" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block">
            <CurrencySelect />
          </span>
          <a
            className="relative rounded-full bg-ink px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
            href="/sell"
          >
            Sell your lid
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-black/5 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="relative z-40 border-t border-hairline/70 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-2">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                className="block border-b border-hairline/50 py-3.5 text-[15px] font-medium last:border-0"
                href={l.href}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center justify-between border-t border-hairline/50 py-3.5 text-[13px] text-ink-2">
              Currency
              <CurrencySelect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
