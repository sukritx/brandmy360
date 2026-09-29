"use client";

import { useCurrency, type Currency } from "./CurrencyProvider";

export function CurrencySelect({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className={className ?? "relative flex items-center"}>
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="appearance-none rounded-full bg-hairline/50 py-1 pl-2.5 pr-6 text-[12px] font-medium text-ink outline-none transition-colors hover:bg-hairline focus:ring-1 focus:ring-blue"
      >
        <option value="EUR">€ EUR</option>
        <option value="USD">$ USD</option>
        <option value="GBP">£ GBP</option>
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 10 6"
        className="pointer-events-none absolute right-2 h-[5px] w-[9px] fill-none stroke-ink-2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 1l4 4 4-4" />
      </svg>
    </label>
  );
}
