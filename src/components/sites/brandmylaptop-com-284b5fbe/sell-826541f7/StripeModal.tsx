"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export function StripeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      data-overlay="true"
      role="dialog"
      aria-modal="true"
      aria-label="Getting paid"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 px-4 py-6 sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <h2 className="text-[19px] font-medium tracking-[-0.02em]">You will need a Stripe account.</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          Buyers pay you directly, so the money never passes through us. It is free, three clicks if you already have
          one, and{" "}
          <a
            href="https://stripe.com/global"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue hover:underline"
          >
            available in these countries
          </a>
          .
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-blue px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-blue-hover"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-medium text-blue hover:underline"
          >
            Not available in my country
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
