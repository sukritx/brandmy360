"use client";

import { cn } from "@/lib/utils";

import type { WizardDraft } from "../SellWizard";
import { FINISHES, LAYOUT_OPTIONS, spotDims } from "../SellPreview";

type StepProps = {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
};

export function StepMachine({ draft, update }: StepProps) {
  const mac = draft.device === "mac";
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">What are you selling space on?</legend>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={mac}
          onClick={() => update({ device: "mac" })}
          className={cn(
            "flex flex-col items-start justify-start rounded-2xl border p-5 text-left transition-colors",
            mac ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">A Mac</span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">
            The drawn lid wears the Apple mark, because yours does.
          </span>
        </button>
        <button
          type="button"
          aria-pressed={!mac}
          onClick={() => update({ device: "pc" })}
          className={cn(
            "flex flex-col items-start justify-start rounded-2xl border p-5 text-left transition-colors",
            !mac ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">A PC</span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">
            A bare lid. No maker&apos;s mark — it is not ours to print.
          </span>
        </button>
      </div>
      <div className="mt-6">
        <span className="text-[13px] font-medium">How big is the screen?</span>
        <div className="mt-2 flex gap-2">
          {[13, 14, 15, 16].map((size) => {
            const selected = draft.lidInches === size;
            return (
              <button
                key={size}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ lidInches: size })}
                className={cn(
                  "flex-1 rounded-2xl border px-2 py-3 text-center transition-colors",
                  selected ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
                )}
              >
                <span className="block text-[15px] font-medium tabular-nums">{size}″</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-2">
          A large sticker prints at <strong className="font-medium text-ink">{spotDims("L", draft.lidInches)}</strong>{" "}
          on this one. Pick the nearest if yours is in between.
        </p>
      </div>
      <div className="mt-6">
        <span className="text-[13px] font-medium">Which colour is it?</span>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {FINISHES.map((entry) => {
            const selected = draft.finish === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                aria-pressed={selected}
                title={entry.label}
                onClick={() => update({ finish: entry.id })}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] transition-colors",
                  selected ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                  style={{ background: `linear-gradient(135deg, ${entry.stops[0]}, ${entry.stops[2]})` }}
                />
                {entry.label}
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}

export function StepOwnership({ draft, update }: StepProps) {
  const own = draft.mode === "own";
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">Do you already own it?</legend>
      <div className="mt-5 grid gap-3">
        <button
          type="button"
          aria-pressed={own}
          onClick={() => update({ mode: "own" })}
          className={cn(
            "flex flex-col items-start justify-start rounded-2xl border p-5 text-left transition-colors",
            own ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">I own it</span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">
            What it raises is yours. Set a target at the next step, or don&apos;t.
          </span>
        </button>
        <button
          type="button"
          aria-pressed={!own}
          onClick={() => update({ mode: "fund" })}
          className={cn(
            "flex flex-col items-start justify-start rounded-2xl border p-5 text-left transition-colors",
            !own ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">I&apos;m funding it</span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">
            The spots pay for the machine, and the stickers go on when it arrives.
          </span>
        </button>
      </div>
    </fieldset>
  );
}

export function StepLayout({ draft, update }: StepProps) {
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">How many spots?</legend>
      <div className="mt-5 grid gap-3">
        {LAYOUT_OPTIONS.map((layout) => {
          const selected = draft.layoutId === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              aria-pressed={selected}
              onClick={() => update({ layoutId: layout.id })}
              className={cn(
                "flex flex-col items-start justify-start rounded-2xl border p-5 text-left transition-colors",
                selected ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
              )}
            >
              <span className="block text-[15px] font-medium">{layout.name}</span>
              <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">{layout.description}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function StepSticker({ draft, update }: StepProps) {
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">How long do the stickers stay on?</legend>
      <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
        This is what a buyer is actually buying. Longer is more commitment, but worth more!
      </p>
      <div className="mt-5 flex gap-2 sm:gap-3">
        {[3, 6, 12, 24].map((months) => {
          const selected = draft.stickerMonths === months;
          return (
            <button
              key={months}
              type="button"
              aria-pressed={selected}
              onClick={() => update({ stickerMonths: months })}
              className={cn(
                "flex-1 rounded-2xl border px-2 py-4 text-center transition-colors",
                selected ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
              )}
            >
              <span className="block text-[17px] font-medium tabular-nums">{months}</span>
              <span className="mt-0.5 block text-[12px] text-ink-2">months</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 max-w-[46ch] text-[12px] leading-relaxed text-ink-2">
        It is shown on your listing and on the board, and it runs from the day of each purchase. Take one off early and
        you owe that buyer a refund.
      </p>
    </fieldset>
  );
}
