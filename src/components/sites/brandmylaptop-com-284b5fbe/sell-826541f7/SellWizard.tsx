"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { CurrencySelect } from "../shared/CurrencySelect";
import { SellPreview, type WizardDevice, type WizardFinish, type WizardLayoutId, type WizardSale } from "./SellPreview";
import { StripeModal } from "./StripeModal";
import { StepLayout, StepMachine, StepOwnership, StepSticker } from "./steps/StepsBasics";
import { StepListing, StepPrices, StepShowcase, StepYou } from "./steps/StepsInput";
import { StepPublish, UNDERTAKING_IDS } from "./steps/StepPublish";

export type WizardDraft = {
  device: WizardDevice;
  finish: WizardFinish;
  lidInches: number;
  mode: "own" | "fund";
  showcase: string[];
  audiences: string[];
  socials: { kind: string; url: string }[];
  pitch: string;
  layoutId: WizardLayoutId;
  goal: number | null;
  sale: WizardSale;
  days: number;
  auctionDays: number;
  auctionTerms: boolean;
  stickerMonths: number;
  title: string;
  slug: string;
  identity: { type: "individual" | "business"; country: string };
  undertakings: string[];
};

const DEFAULT_DRAFT: WizardDraft = {
  device: "mac",
  finish: "silver",
  lidInches: 14,
  mode: "own",
  showcase: [],
  audiences: [],
  socials: [],
  pitch: "",
  layoutId: "ten",
  goal: null,
  sale: null,
  days: 0,
  auctionDays: 6,
  auctionTerms: false,
  stickerMonths: 12,
  title: "",
  slug: "",
  identity: { type: "individual", country: "" },
  undertakings: [],
};

const STEPS = ["Machine", "Ownership", "Showcase", "Layout", "Prices", "Listing", "Sticker", "You", "Publish"];

const STRIPE_NOTE_KEY = "bml.sell.stripe-note";

function identityProblem(identity: WizardDraft["identity"]): string | null {
  if (!identity.country) {
    return identity.type === "business"
      ? "Say where the business is registered."
      : "Say which country you are a tax resident of.";
  }
  return null;
}

export function publishProblem(draft: WizardDraft): string | null {
  const title = draft.title.trim();
  if (title.length < 1 || title.length > 80) return "Give the listing a title, 80 characters or fewer.";
  if (!/^[a-z0-9][a-z0-9-]{0,40}$/.test(draft.slug)) {
    return "The address may use letters, digits and hyphens, and must start with one.";
  }
  const identity = identityProblem(draft.identity);
  if (identity) return identity;
  if (UNDERTAKING_IDS.some((id) => !draft.undertakings.includes(id))) {
    return "Tick all four to publish — they are what a buyer is trusting.";
  }
  if (draft.sale === "auction" && !draft.auctionTerms) {
    return "Tick the auction terms to publish: the 15% and the charge at the close.";
  }
  return null;
}

export function stepProblem(step: number, draft: WizardDraft): string | null {
  if (step === 2) {
    return draft.showcase.length === 0 ? "Pick at least one — where does this laptop actually go?" : null;
  }
  if (step === 4) {
    if (draft.goal !== null && (draft.goal < 100 || draft.goal > 20000)) {
      return "A goal has to be between 100 € and 20000 €.";
    }
    if (draft.sale !== "fixed" && draft.sale !== "auction") {
      return "Pick how brands buy: fixed prices, or an auction.";
    }
    return null;
  }
  if (step === 7) return identityProblem(draft.identity);
  if (step === 8) return publishProblem(draft);
  return null;
}

export function SellWizard() {
  const [draft, setDraft] = useState<WizardDraft>(DEFAULT_DRAFT);
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [stripeOpen, setStripeOpen] = useState(false);

  const update = useCallback((patch: Partial<WizardDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  useEffect(() => {
    let allowed = true;
    try {
      allowed = window.localStorage.getItem(STRIPE_NOTE_KEY) !== "1";
    } catch {
      allowed = true;
    }
    if (!allowed) return;
    const frame = requestAnimationFrame(() => setStripeOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const closeStripe = useCallback(() => {
    setStripeOpen(false);
    try {
      window.localStorage.setItem(STRIPE_NOTE_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (step === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [step]);

  const problem = stepProblem(step, draft);

  const goTo = (next: number) => {
    setStep(next);
    setMaxReached((current) => Math.max(current, next));
  };

  const goNext = () => {
    if (problem === null && step < STEPS.length - 1) goTo(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepMachine draft={draft} update={update} />;
      case 1:
        return <StepOwnership draft={draft} update={update} />;
      case 2:
        return <StepShowcase draft={draft} update={update} />;
      case 3:
        return <StepLayout draft={draft} update={update} />;
      case 4:
        return <StepPrices draft={draft} update={update} />;
      case 5:
        return <StepListing draft={draft} update={update} />;
      case 6:
        return <StepSticker draft={draft} update={update} />;
      case 7:
        return <StepYou draft={draft} update={update} />;
      default:
        return <StepPublish draft={draft} update={update} problem={publishProblem(draft)} />;
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.05em]">
          Put your lid up.
        </h1>
        <div className="mt-1 shrink-0">
          <CurrencySelect />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[13px] text-ink-2">
        <p>
          Publishing costs a one-off <strong className="font-medium text-ink">$19</strong>.{" "}
          <button
            type="button"
            onClick={() => setStripeOpen(true)}
            className="text-blue underline-offset-2 hover:underline"
          >
            You need a Stripe account to be paid
          </button>{" "}
          Once it&apos;s up, post it and tag <strong className="font-medium text-ink">@VynseDev</strong> so I can support
          you!
        </p>
        <p className="w-full sm:ml-auto sm:w-auto">
          Already put a lid up?{" "}
          <a className="text-blue hover:underline" href="/dashboard">
            Sign in to manage it
          </a>
          .
        </p>
      </div>
      <div className="mt-6 md:hidden">
        <div className="flex items-baseline justify-between text-[12px] text-ink-2">
          <span>
            Step {step + 1} of {STEPS.length} · <span className="font-medium text-ink">{STEPS[step]}</span>
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-hairline/60">
          <div
            className="h-full rounded-full bg-ink transition-[width]"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
      <ol className="mt-10 hidden flex-wrap items-center gap-1 text-[12px] md:flex">
        {STEPS.map((label, index) => {
          const current = index === step;
          const reached = index <= maxReached;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!reached}
                onClick={() => goTo(index)}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  current ? "bg-ink text-white" : reached ? "text-ink-2 hover:text-ink" : "text-hairline"
                )}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 grid grid-cols-1 gap-8 md:mt-10 md:gap-10 md:grid-cols-[1fr_minmax(0,1.1fr)] md:items-start">
        <div
          key={step}
          className="min-w-0 animate-rail-in md:min-h-[46rem]"
          style={{ opacity: 1, transform: "none" }}
        >
          {renderStep()}
          {step < STEPS.length - 1 && (
            <div className="sticky bottom-0 z-20 mt-8 flex flex-wrap items-center gap-3 border-t border-hairline/40 bg-background/90 py-4 backdrop-blur-sm">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-full border border-hairline px-6 py-3 text-[15px] font-medium transition-colors hover:border-ink/40"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={goNext}
                disabled={problem !== null}
                className="rounded-full bg-blue px-7 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover disabled:opacity-60"
              >
                Continue
              </button>
              {problem !== null && (
                <p role="alert" className="text-[13px] text-amber-deep">
                  {problem}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="min-w-0 md:sticky md:top-10">
          <SellPreview
            device={draft.device}
            finish={draft.finish}
            lidInches={draft.lidInches}
            layoutId={draft.layoutId}
            sale={draft.sale}
            days={draft.days}
            auctionDays={draft.auctionDays}
            stickerMonths={draft.stickerMonths}
            goal={draft.goal}
          />
        </div>
      </div>
      <StripeModal open={stripeOpen} onClose={closeStripe} />
    </div>
  );
}
