"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Currency = "USD" | "EUR" | "GBP";

const RATES: Record<Currency, number> = { USD: 1, EUR: 0.8547, GBP: 0.7436 };
const STORAGE_KEY = "bml.currency";

type Ctx = { currency: Currency; setCurrency: (c: Currency) => void; format: (usd: number) => string };
const CurrencyCtx = createContext<Ctx | null>(null);

export function formatMoney(usd: number, currency: Currency): string {
  const value = usd * RATES[currency];
  if (currency === "EUR") {
    const rounded = Math.round(value);
    return `${rounded.toLocaleString("fr-FR")}\u00a0\u20ac`;
  }
  const rounded = Math.round(value);
  const locale = currency === "GBP" ? "en-GB" : "en-US";
  const symbol = currency === "GBP" ? "\u00a3" : "$";
  return `${symbol}${rounded.toLocaleString(locale)}`;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (stored === "USD" || stored === "EUR" || stored === "GBP") {
      queueMicrotask(() => setCurrencyState(stored as Currency));
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      currency,
      setCurrency: (c: Currency) => {
        setCurrencyState(c);
        try {
          window.localStorage.setItem(STORAGE_KEY, c);
        } catch {}
      },
      format: (usd: number) => formatMoney(usd, currency),
    }),
    [currency]
  );

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyCtx);
  if (!ctx) {
    return { currency: "USD", setCurrency: () => {}, format: (usd: number) => formatMoney(usd, "USD") };
  }
  return ctx;
}

export function Money({ usd, className }: { usd: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={className}>{format(usd)}</span>;
}
