"use client";

import { LinkedInBrandIcon, XIcon } from "../../shared/icons";
import { formatEur, previewSpots, spotsTotal } from "../SellPreview";
import type { WizardDraft } from "../SellWizard";

const UNDERTAKINGS = [
  { id: "review", text: "I will review every logo myself before it goes on my lid." },
  {
    id: "keep",
    text: "I will put each approved sticker on within 14 days — or when the machine arrives, if the spots are paying for it — and keep it on for the full period I chose.",
  },
  {
    id: "refund",
    text: "Buyers pay me directly. Refusing a logo charges nobody; if I take a sticker off early, I refund that buyer myself.",
  },
  { id: "print", text: "I print and apply the stickers myself — nothing is shipped to me." },
];

export const UNDERTAKING_IDS = UNDERTAKINGS.map((entry) => entry.id);

export function StepPublish({
  draft,
  update,
  problem,
}: {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
  problem: string | null;
}) {
  const spots = previewSpots(draft.layoutId, draft.lidInches);
  const total = spotsTotal(spots);
  const auction = draft.sale === "auction";
  const rows: [string, string][] = [
    ["Machine", `${draft.device === "mac" ? "Mac" : "PC"} · ${draft.lidInches}″`],
    [
      "Ownership",
      draft.mode === "own"
        ? draft.goal
          ? `You own it · goal ${formatEur(draft.goal)}`
          : "You own it"
        : `Funding it · goal ${formatEur(draft.goal ?? 0)}`,
    ],
    ["Layout", `${spots.length} spots`],
    [auction ? "At opening bids" : "If it all sells", formatEur(total)],
    auction
      ? ["Bidding", `${draft.auctionDays} day${draft.auctionDays === 1 ? "" : "s"} · highest bid wins`]
      : ["Runs for", draft.days ? `${draft.days} days` : "until it sells"],
    ["Stickers stay", `${draft.stickerMonths} months`],
  ];
  const slugValid = /^[a-z0-9][a-z0-9-]{0,40}$/.test(draft.slug);
  return (
    <div>
      <h2 className="text-xl font-medium tracking-[-0.02em]">Name it, and put it up.</h2>
      <label className="mt-5 block">
        <span className="flex items-baseline justify-between text-[13px] font-medium">
          Title<span className="text-[11px] font-normal tabular-nums text-ink-2">{draft.title.length}/80</span>
        </span>
        <input
          maxLength={80}
          value={draft.title}
          onChange={(event) => update({ title: event.target.value })}
          placeholder={`${spots.length} spots on my ${draft.device === "mac" ? "MacBook" : "laptop"}`}
          className="mt-1 w-full rounded-xl border border-hairline px-3 py-2.5 text-[15px] outline-none focus:border-blue"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-[13px] font-medium">Address</span>
        <span className="mt-1 flex items-center rounded-xl border border-hairline px-3 focus-within:border-blue">
          <span className="text-[15px] text-ink-2">brandmylaptop.com/</span>
          <input
            maxLength={41}
            value={draft.slug}
            onChange={(event) => update({ slug: event.target.value.toLowerCase() })}
            placeholder="your-name"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] outline-none"
          />
        </span>
        <span aria-live="polite" className="mt-1.5 block text-[12px] text-ink-2">
          {slugValid ? " " : "Letters, digits and hyphens, starting with one."}
        </span>
      </label>
      <dl className="mt-6 grid gap-2 rounded-2xl border border-hairline bg-white p-5 text-[13px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-ink-2">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 space-y-2.5 rounded-2xl border border-hairline bg-white p-5">
        {UNDERTAKINGS.map((entry) => {
          const checked = draft.undertakings.includes(entry.id);
          return (
            <label
              key={entry.id}
              className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  update({
                    undertakings: checked
                      ? draft.undertakings.filter((id) => id !== entry.id)
                      : [...draft.undertakings, entry.id],
                  })
                }
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--blue)]"
              />
              <span>{entry.text}</span>
            </label>
          );
        })}
        {auction && (
          <label className="flex cursor-pointer items-start gap-2.5 border-t border-hairline pt-3 text-[13px] leading-relaxed">
            <input
              type="checkbox"
              checked={draft.auctionTerms}
              onChange={() => update({ auctionTerms: !draft.auctionTerms })}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--blue)]"
            />
            <span>
              Bids are card holds. At the close, the highest bid I approved on each spot is charged by itself; a bid I
              have not reviewed is released. BrandMyLaptop takes 15% on auction lids.
            </span>
          </label>
        )}
        <p className="pt-1 text-[12px] leading-relaxed text-ink-2">
          The money lands in your own Stripe account, minus the {auction ? "15" : "10"}% platform fee and Stripe&apos;s
          processing fees. Publishing accepts the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">
            terms
          </a>
          .
        </p>
      </div>
      <div className="sticky bottom-0 z-20 mt-6 border-t border-hairline/40 bg-background/90 py-4 backdrop-blur-sm">
        <button
          type="button"
          disabled={problem !== null}
          className="flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium text-white transition-colors disabled:opacity-60 bg-black hover:bg-black/85"
        >
          <XIcon className="h-4 w-4 shrink-0" />
          Sign in with X and publish
        </button>
        <button
          type="button"
          disabled={problem !== null}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-7 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <LinkedInBrandIcon className="h-4 w-4 shrink-0" />
          Sign in with LinkedIn and publish
        </button>
        <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-2">
          Everything above is kept while you sign in; you land back here.
        </p>
        {problem !== null && (
          <p role="alert" className="mt-3 text-center text-[13px] text-amber-deep">
            {problem}
          </p>
        )}
      </div>
    </div>
  );
}
