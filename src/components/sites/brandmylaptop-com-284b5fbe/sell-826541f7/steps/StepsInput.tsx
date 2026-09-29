"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

import {
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "../../shared/icons";
import type { WizardDraft } from "../SellWizard";

type StepProps = {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
};

function Dropdown({
  label,
  placeholder,
  summary,
  children,
}: {
  label: string;
  placeholder: string;
  summary: ReactNode | null;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full min-w-0 max-w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2.5 text-left text-[15px] transition-colors",
          open ? "border-blue" : "border-hairline hover:border-ink/30"
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate", !summary && "text-ink-2")}>{summary ?? placeholder}</span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 text-ink-2 transition-transform", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-hairline bg-white py-1 shadow-[0_8px_28px_rgba(0,0,0,0.14)]">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function CheckOption({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={on}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[14px] transition-colors",
        on ? "bg-blue/[0.06] text-blue" : "hover:bg-surface"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          on ? "border-blue bg-blue text-white" : "border-hairline"
        )}
      >
        {on && (
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M2 6.4l2.6 2.6L10 3.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AR AT AU AW AZ BA BB BD BE BF BG BH BI BJ BM BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FO FR GA GB GD GE GH GI GL GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PF PG PH PK PL PR PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW".split(
    " "
  );

type CountryOption = { code: string; name: string };

const COUNTRIES: CountryOption[] = (() => {
  let nameOf: (code: string) => string;
  try {
    const display = new Intl.DisplayNames(["en"], { type: "region" });
    nameOf = (code) => display.of(code) ?? code;
  } catch {
    nameOf = (code) => code;
  }
  return COUNTRY_CODES.map((code) => ({ code, name: nameOf(code) })).sort((a, b) =>
    a.name.localeCompare(b.name, "en")
  );
})();

function flagFor(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((ch) => 127462 + ch.charCodeAt(0) - 65));
}

function CountryDropdown({
  label,
  value,
  onPick,
}: {
  label: string;
  value: string;
  onPick: (code: string) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = COUNTRIES.find((country) => country.code === value) ?? null;
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? COUNTRIES.filter(
        (country) => country.name.toLowerCase().includes(needle) || country.code.toLowerCase() === needle
      )
    : COUNTRIES;
  return (
    <Dropdown
      label={label}
      placeholder="Pick a country…"
      summary={selected ? `${flagFor(selected.code)} ${selected.name}` : null}
    >
      {(close) => (
        <>
          <div className="sticky top-0 border-b border-hairline bg-white px-2 pb-2 pt-1">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search"
              className="w-full rounded-lg border border-hairline px-2.5 py-1.5 text-[14px] outline-none focus:border-blue"
            />
          </div>
          {matches.length === 0 ? (
            <p className="px-3 py-3 text-[13px] text-ink-2">No country matches that.</p>
          ) : (
            matches.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onPick(country.code);
                  setQuery("");
                  close();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[14px] transition-colors",
                  country.code === value ? "bg-blue/[0.06] text-blue" : "hover:bg-surface"
                )}
              >
                <span aria-hidden="true" className="text-[16px] leading-none">
                  {flagFor(country.code)}
                </span>
                <span className="min-w-0 flex-1 truncate">{country.name}</span>
              </button>
            ))
          )}
        </>
      )}
    </Dropdown>
  );
}

const SHOWCASE_OPTIONS = [
  { id: "online", label: "Build in public — posts and videos" },
  { id: "coworking", label: "Coworking spaces and cafés" },
  { id: "events", label: "Conferences and meetups" },
  { id: "travel", label: "Business travel" },
  { id: "clients", label: "Client and investor meetings" },
  { id: "campus", label: "A campus or university" },
];

const AUDIENCE_OPTIONS = [
  { id: "developer", label: "Developer" },
  { id: "founder", label: "Indie hacker / founder" },
  { id: "designer", label: "Designer" },
  { id: "creator", label: "Content creator" },
  { id: "marketer", label: "Marketer / growth" },
  { id: "sales", label: "Sales / SDR" },
  { id: "freelancer", label: "Freelancer / consultant" },
  { id: "student", label: "Student" },
  { id: "teacher", label: "Teacher / researcher" },
  { id: "finance", label: "Finance" },
  { id: "gamer", label: "Gamer" },
  { id: "other", label: "Something else" },
];

const SOCIALS: { id: string; prefix: string; colour: string; Icon: typeof XIcon }[] = [
  { id: "x", prefix: "x.com/", colour: "#000000", Icon: XIcon },
  { id: "linkedin", prefix: "linkedin.com/in/", colour: "#0A66C2", Icon: LinkedInIcon },
  { id: "tiktok", prefix: "tiktok.com/@", colour: "#000000", Icon: TikTokIcon },
  { id: "instagram", prefix: "instagram.com/", colour: "#E4405F", Icon: InstagramIcon },
  { id: "youtube", prefix: "youtube.com/@", colour: "#FF0000", Icon: YouTubeIcon },
];

function socialStyle(colour: string): CSSProperties {
  return { "--social": colour } as CSSProperties;
}

export function StepShowcase({ draft, update }: StepProps) {
  const chosen = SHOWCASE_OPTIONS.filter((option) => draft.showcase.includes(option.id));
  const showcaseSummary =
    chosen.length === 0 ? null : chosen.length === 1 ? (
      chosen[0].label
    ) : (
      <>
        {chosen[0].label} <span className="font-medium text-blue">+{chosen.length - 1}</span>
      </>
    );
  const audienceSummary =
    draft.audiences.length === 0 ? null : (
      <>
        {AUDIENCE_OPTIONS.find((option) => option.id === draft.audiences[0])?.label}
        {draft.audiences.length > 1 && (
          <span className="font-medium text-blue"> +{draft.audiences.length - 1}</span>
        )}
      </>
    );
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">Where will it be seen?</legend>
      <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
        Pick everything true — it is shown to buyers on your listing.
      </p>
      <div className="mt-5">
        <Dropdown label="Where will it be seen?" placeholder="Choose" summary={showcaseSummary}>
          {() =>
            SHOWCASE_OPTIONS.map((option) => {
              const on = draft.showcase.includes(option.id);
              return (
                <CheckOption
                  key={option.id}
                  on={on}
                  onClick={() =>
                    update({
                      showcase: on
                        ? draft.showcase.filter((id) => id !== option.id)
                        : [...draft.showcase, option.id],
                    })
                  }
                >
                  {option.label}
                </CheckOption>
              );
            })
          }
        </Dropdown>
      </div>
      <fieldset className="mt-6">
        <legend className="text-[13px] font-medium">
          And who are you? <span className="font-normal text-ink-2">Optional</span>
        </legend>
        <p className="mt-1 max-w-[46ch] text-[12px] leading-relaxed text-ink-2">
          Brands search for the audience, not the laptop. This is how one looking for developers, or students, finds
          you.
        </p>
        <div className="mt-3">
          <Dropdown label="And who are you?" placeholder="Pick up to three" summary={audienceSummary}>
            {() =>
              AUDIENCE_OPTIONS.map((option) => {
                const on = draft.audiences.includes(option.id);
                const locked = !on && draft.audiences.length >= 3;
                return (
                  <CheckOption
                    key={option.id}
                    on={on}
                    onClick={() => {
                      if (locked) return;
                      const audiences = on
                        ? draft.audiences.filter((id) => id !== option.id)
                        : [...draft.audiences, option.id];
                      update({ audiences });
                    }}
                  >
                    {option.label}
                  </CheckOption>
                );
              })
            }
          </Dropdown>
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="text-[13px] font-medium">
          Where do you post? <span className="font-normal text-ink-2">Optional</span>
        </legend>
        <p className="mt-1 max-w-[46ch] text-[12px] leading-relaxed text-ink-2">
          Your audience is what a brand is paying for.
        </p>
        <div className="mt-3 grid gap-2">
          {SOCIALS.map((social) => {
            const value = draft.socials.find((entry) => entry.kind === social.id)?.url ?? "";
            return (
              <div key={social.id} className="grid gap-1.5">
                <label
                  className="flex items-center rounded-xl border border-hairline pl-2.5 focus-within:border-[var(--social)]"
                  style={socialStyle(social.colour)}
                >
                  <social.Icon className="h-4 w-4 shrink-0" />
                  <span className="w-[8.5rem] shrink-0 pl-2 text-[13px] text-ink-2">{social.prefix}</span>
                  <input
                    maxLength={200}
                    inputMode="url"
                    autoComplete="off"
                    placeholder="you"
                    value={value}
                    onChange={(event) => {
                      const url = event.target.value;
                      const others = draft.socials.filter((entry) => entry.kind !== social.id);
                      update({ socials: url ? [...others, { kind: social.id, url }] : others });
                    }}
                    className="min-w-0 flex-1 rounded-r-xl bg-transparent py-2 pr-3 text-[14px] outline-none"
                  />
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <label className="mt-6 block">
        <span className="text-[13px] font-medium">
          Anything else buyers should know? <span className="font-normal text-ink-2">Optional</span>
        </span>
        <textarea
          maxLength={400}
          rows={3}
          value={draft.pitch}
          onChange={(event) => update({ pitch: event.target.value })}
          placeholder="Everything this raises goes to a cancer charity."
          className="mt-1.5 w-full resize-none rounded-xl border border-hairline bg-white px-3 py-2.5 text-[15px] leading-relaxed outline-none transition-shadow placeholder:text-ink-2/70 focus:border-blue focus:ring-4 focus:ring-blue/15"
        />
        <span className="mt-1 block text-right text-[12px] tabular-nums text-ink-2">{draft.pitch.length}/400</span>
      </label>
    </fieldset>
  );
}

export function StepPrices({ draft, update }: StepProps) {
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">The money</legend>
      <label className="mt-4 block">
        <span className="text-[13px] font-medium">
          What are you raising it for?<span className="ml-1.5 font-normal text-ink-2">Optional</span>
        </span>
        <span className="mt-1 flex items-center gap-2">
          <span className="relative block">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[15px] text-ink-2"
            >
              €
            </span>
            <input
              inputMode="numeric"
              min={100}
              max={20000}
              placeholder="2500"
              type="number"
              value={draft.goal === null ? "" : String(draft.goal)}
              onChange={(event) => {
                const raw = event.target.value;
                const next = raw === "" ? null : Math.round(Number(raw));
                update({ goal: next === null || Number.isFinite(next) ? next : null });
              }}
              className="pl-7 w-36 rounded-xl border border-hairline px-3 py-2 text-[15px] tabular-nums outline-none focus:border-blue"
            />
          </span>
          <span className="text-[15px] text-ink-2">€</span>
        </span>
        <span className="mt-1.5 block text-[12px] leading-relaxed text-ink-2">A target for the bar on your page.</span>
      </label>
      <h3 className="mt-7 text-[15px] font-medium">How do brands buy?</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={draft.sale === "fixed"}
          onClick={() => update({ sale: "fixed" })}
          className={cn(
            "flex flex-col items-start justify-start rounded-2xl border p-5 text-left transition-colors",
            draft.sale === "fixed"
              ? "border-blue bg-blue/[0.04] ring-1 ring-blue"
              : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">Fixed prices</span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">
            Each spot has one price. A brand&apos;s card is held at it; you approve the logo and the money lands in your
            Stripe.
          </span>
        </button>
        <button
          type="button"
          aria-pressed={draft.sale === "auction"}
          onClick={() => update({ sale: "auction" })}
          className={cn(
            "flex flex-col items-start justify-start rounded-2xl border p-5 text-left transition-colors",
            draft.sale === "auction"
              ? "border-blue bg-blue/[0.04] ring-1 ring-blue"
              : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">Auction</span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">
            Brands bid and outbid. The highest bid on each spot wins and is charged at the end.
          </span>
        </button>
      </div>
    </fieldset>
  );
}

const DURATIONS = [0, 7, 14, 21, 30];
const AUCTION_DAYS = [1, 3, 6];

export function StepListing({ draft, update }: StepProps) {
  const auction = draft.sale === "auction";
  const options = auction ? AUCTION_DAYS : DURATIONS;
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">
        {auction ? "How long does the bidding run?" : "How long is the sale open for?"}
      </legend>
      <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
        {auction
          ? "It starts when you press Start on your dashboard, and closes by itself. A bid in the last 10 minutes adds 10 minutes."
          : "With no end date the lid stays up until every spot sells, and each sticker goes on as it is bought. Pick a date only if you have a reason for one."}
      </p>
      <div className={cn("mt-5 grid gap-2.5 sm:gap-3", auction ? "grid-cols-3" : "grid-cols-5")}>
        {options.map((value) => {
          const selected = auction ? draft.auctionDays === value : draft.days === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              onClick={() => update(auction ? { auctionDays: value } : { days: value })}
              className={cn(
                "rounded-2xl border px-2 py-2.5 text-center transition-colors sm:px-4 sm:py-4",
                selected ? "border-blue bg-blue/[0.04] ring-1 ring-blue" : "border-hairline bg-white hover:border-ink/30"
              )}
            >
              <span className="block text-[16px] font-medium tabular-nums sm:text-[17px]">
                {value === 0 ? "No end" : value}
              </span>
              <span className="block text-[11px] text-ink-2 sm:mt-0.5 sm:text-[12px]">
                {value === 0 ? "date" : value === 1 ? "day" : "days"}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function StepYou({ draft, update }: StepProps) {
  const person = draft.identity.type === "individual";
  const countryLabel = person ? "Country of residence" : "Where is the business registered?";
  return (
    <fieldset>
      <legend className="text-xl font-medium tracking-[-0.02em]">Who is selling?</legend>
      <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">Not shown on your listing.</p>
      <div className="mt-5 flex gap-2 sm:gap-3">
        <button
          type="button"
          aria-pressed={person}
          onClick={() => update({ identity: { ...draft.identity, type: "individual" } })}
          className={cn(
            "flex-1 rounded-2xl border px-3 py-4 text-left transition-colors",
            person
              ? "border-blue bg-blue/[0.04] ring-1 ring-blue"
              : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">A person</span>
          <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-2">Selling as yourself</span>
        </button>
        <button
          type="button"
          aria-pressed={!person}
          onClick={() => update({ identity: { ...draft.identity, type: "business" } })}
          className={cn(
            "flex-1 rounded-2xl border px-3 py-4 text-left transition-colors",
            !person
              ? "border-blue bg-blue/[0.04] ring-1 ring-blue"
              : "border-hairline bg-white hover:border-ink/30"
          )}
        >
          <span className="block text-[15px] font-medium">A business</span>
          <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-2">
            A company, or a registered sole trader
          </span>
        </button>
      </div>
      <label className="mt-4 block">
        <span className="text-[13px] font-medium">{countryLabel}</span>
        {person && <span className="mt-0.5 block text-[12px] text-ink-2">The country where you pay your taxes.</span>}
        <div className="mt-1">
          <CountryDropdown
            label={countryLabel}
            value={draft.identity.country}
            onPick={(code) => update({ identity: { ...draft.identity, country: code } })}
          />
        </div>
      </label>
    </fieldset>
  );
}
