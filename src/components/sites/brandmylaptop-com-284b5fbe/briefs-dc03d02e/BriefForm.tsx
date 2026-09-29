"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const AUDIENCES = [
  "Developer",
  "Indie hacker / founder",
  "Designer",
  "Content creator",
  "Marketer / growth",
  "Sales / SDR",
  "Freelancer / consultant",
  "Student",
  "Teacher / researcher",
  "Finance",
  "Gamer",
  "Something else",
] as const;

const MAX_AUDIENCES = 4;

const EVENTS = [
  { value: "", label: "No particular event" },
  { value: "sf-tech-week-2026", label: "SF Tech Week — San Francisco, 5–11 Oct" },
  { value: "la-tech-week-2026", label: "LA Tech Week — Los Angeles, 12–18 Oct" },
  { value: "techcrunch-disrupt-2026", label: "TechCrunch Disrupt — San Francisco, 13–15 Oct" },
  { value: "money2020-usa-2026", label: "Money20/20 USA — Las Vegas, 18–21 Oct" },
  { value: "web-summit-2026", label: "Web Summit — Lisbon, 9–12 Nov" },
  { value: "adobe-max-2026", label: "Adobe MAX — Miami Beach, 10–12 Nov" },
  { value: "slush-2026", label: "Slush — Helsinki, 18–19 Nov" },
  { value: "aws-reinvent-2026", label: "AWS re:Invent — Las Vegas, 30 Nov – 4 Dec" },
  { value: "gitex-global-2026", label: "GITEX Global — Dubai, 7–11 Dec" },
  { value: "ces-2027", label: "CES — Las Vegas, 6–9 Jan" },
  { value: "web-summit-qatar-2027", label: "Web Summit Qatar — Doha, 31 Jan – 3 Feb" },
  { value: "gdc-2027", label: "GDC — San Francisco, 1–5 Mar" },
  { value: "mwc-barcelona-2027", label: "MWC Barcelona — Barcelona, 1–4 Mar" },
  { value: "sxsw-2027", label: "SXSW — Austin, 15–21 Mar" },
  { value: "web-summit-vancouver-2027", label: "Web Summit Vancouver — Vancouver, 25–28 May" },
  { value: "london-tech-week-2027", label: "London Tech Week — London, 7–11 Jun" },
  { value: "web-summit-rio-2027", label: "Web Summit Rio — Rio de Janeiro, 14–17 Jun" },
  { value: "vivatech-2027", label: "VivaTech — Paris, 16–19 Jun" },
  { value: "cannes-lions-2027", label: "Cannes Lions — Cannes, 21–25 Jun" },
  { value: "vidcon-2027", label: "VidCon — Anaheim, 8–10 Jul" },
] as const;

const INPUT_CLASS =
  "mt-1.5 w-full rounded-xl border border-hairline bg-white px-4 py-3 text-[15px] outline-none transition-shadow placeholder:text-ink-2/70 focus:border-blue focus:ring-4 focus:ring-blue/15";

export function BriefForm() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAudience = (audience: string) => {
    setSelected((current) => {
      if (current.includes(audience)) {
        return current.filter((item) => item !== audience);
      }
      if (current.length >= MAX_AUDIENCES) {
        return current;
      }
      return [...current, audience];
    });
  };

  return (
    <div className="mt-4">
      <form
        className="rounded-2xl border border-hairline bg-white p-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-medium text-ink" htmlFor="brief-brand">
              Brand
            </label>
            <input
              className={INPUT_CLASS}
              id="brief-brand"
              maxLength={80}
              placeholder="Acme"
              required
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-ink" htmlFor="brief-url">
              Website
            </label>
            <input
              className={INPUT_CLASS}
              id="brief-url"
              maxLength={200}
              placeholder="https://acme.com"
              required
              type="url"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[13px] font-medium text-ink" htmlFor="brief-contact">
              Email
            </label>
            <input
              className={INPUT_CLASS}
              id="brief-contact"
              maxLength={200}
              placeholder="you@acme.com"
              required
              type="email"
            />
          </div>
        </div>
        <div className="mt-5">
          <label className="text-[13px] font-medium text-ink" htmlFor="brief-event">
            At an event? <span className="font-normal text-ink-2">(optional)</span>
          </label>
          <select className={INPUT_CLASS} defaultValue="" id="brief-event">
            {EVENTS.map((event) => (
              <option key={event.value} value={event.value}>
                {event.label}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-5 text-[13px] font-medium text-ink">
          Who should carry your logo? <span className="font-normal text-ink-2">Up to four.</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AUDIENCES.map((audience) => {
            const isSelected = selected.includes(audience);
            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
                  isSelected
                    ? "border-blue bg-blue text-white"
                    : "border-hairline bg-white hover:border-ink/40"
                )}
                key={audience}
                onClick={() => toggleAudience(audience)}
                type="button"
              >
                {audience}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-medium text-ink" htmlFor="brief-budget">
              Budget per spot, €
            </label>
            <input
              className={INPUT_CLASS}
              defaultValue="200"
              id="brief-budget"
              inputMode="numeric"
              max={20000}
              min={25}
              required
              type="number"
            />
            <p className="mt-1 text-[12px] text-ink-2">Most spots sell between 125 € and 400 €.</p>
          </div>
        </div>
        <div className="mt-5">
          <label className="text-[13px] font-medium text-ink" htmlFor="brief-note">
            What you are after <span className="font-normal text-ink-2">(optional)</span>
          </label>
          <textarea
            className={INPUT_CLASS}
            id="brief-note"
            maxLength={300}
            placeholder="Developers in Europe who post about their tooling. We ship in Q4."
            rows={3}
          />
        </div>
        <button
          className="mt-5 rounded-full bg-blue px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover disabled:opacity-60"
          type="submit"
        >
          Post the brief
        </button>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-2">
          Free. Creators apply with their laptop and a link to buy the spot; you pay each creator
          directly, only if you say yes.
        </p>
      </form>
    </div>
  );
}
