import Link from "next/link";

import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import { brandsList } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/data";

const BRAND_HREFS: Record<string, string> = {
  "Pushup RPG": "/brand/pushup.quest",
  "Conscious Marketing Movement": "/brand/conscious-marketing-movement.com",
  "Dial A Geek": "/brand/dialageek.co.uk",
  "Sixtyfive Group": "/brand/sixtyfive.group",
  "Well Seasoned": "/brand/wellseasoned.work",
  Botpool: "/brand/botpool.ai",
  myMind: "/brand/mymind.com",
  eSIMDB: "/brand/esimdb.com",
  "Gi Studio NYC": "/brand/christiegi.com",
  Chapter: "/brand/thisischapter.co.uk",
  SocialDay: "/brand/socialday.live",
  Modash: "/brand/modash.io",
  "Creator Match": "/brand/creatormatch.com",
  "Your Social Media Sherpa": "/brand/yoursocialmediasherpa.com",
  "Love, your business Mom": "/brand/yourbusiness.mom",
  "Social Listening Lounge": "/brand/thedatazone.ai",
  MicroHalos: "/brand/microhalos.com",
  "Great Outdoors Foundatio": "/brand/greatoutdoorsfoundation.org",
  Slice: "/brand/slice-social.com",
  Giorgio: "/brand/linkedin.com",
  Emme: "/brand/emme.com",
  "Surf Office": "/brand/surfoffice.com",
  Conveo: "/brand/conveo.ai",
  Granola: "/brand/granola.ai",
  TheKiln: "/brand/thekiln.com",
  FullEnrich: "/brand/fullenrich.com",
  Lorikeet: "/brand/lorikeetcx.ai",
  "Sales Creator Collective": "/brand/salescreatorcollective.com",
  Creatorbuzz: "/brand/creatorbuzz.com",
  TinyLaunch: "/brand/tinylaunch.com",
  RankControl: "/brand/rctrl.com",
  Palette: "/brand/palette.team",
  Reelfolio: "/brand/reelfolio.io",
  SpacerAI: "/brand/spacerai.net",
  "Azal.ai": "/brand/x.com",
  orientino: "/brand/orientino.ch",
  "Go Nimbly": "/brand/gonimbly.com",
  Wildcall: "/brand/wildcall.gg",
  Afes: "/brand/afesdigital.com",
};

const SPONSOR_META: Record<string, string> = {
  TinyLaunch: "sponsor of the site · 22d ago",
  RankControl: "sponsor of the site · 22d ago",
  "Azal.ai": "sponsor of the site · 25d ago",
};

export function BrandsList() {
  return (
    <section className="mt-16 border-t border-hairline pt-10">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.025em]">
        Brands advertising here
      </h2>
      <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
        40 companies have put their logo on somebody’s laptop,{" "}
        <Money usd={13794} className="tabular-nums" /> paid straight to the people carrying them.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <select
          aria-label="Sort"
          defaultValue="recent"
          className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[13px] outline-none transition-colors hover:border-ink/30 focus:border-blue"
        >
          <option value="recent">Most recent</option>
          <option value="paid">Most paid</option>
          <option value="name">Name</option>
        </select>
        <select
          aria-label="When"
          defaultValue="all"
          className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[13px] outline-none transition-colors hover:border-ink/30 focus:border-blue"
        >
          <option value="all">Any time</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">This year</option>
        </select>
        <select
          aria-label="Spend"
          defaultValue="all"
          className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[13px] outline-none transition-colors hover:border-ink/30 focus:border-blue"
        >
          <option value="all">Any spend</option>
          <option value="low">Under €200</option>
          <option value="mid">€200 – €500</option>
          <option value="high">€500 and up</option>
        </select>
      </div>
      <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
        {brandsList.map((row) => (
          <li key={row.name}>
            <Link
              className="flex items-center gap-4 py-4 transition-opacity hover:opacity-70"
              href={BRAND_HREFS[row.name] ?? "#"}
            >
              {row.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.logo}
                  alt=""
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-xl border border-hairline bg-white object-contain p-1"
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{row.name}</span>
                <span className="block truncate text-[13px] text-ink-2">
                  {row.meta || SPONSOR_META[row.name] || ""}
                </span>
              </span>
              {row.sponsor ? (
                <span className="shrink-0 text-[13px] font-medium text-blue">sponsor</span>
              ) : row.amount !== null ? (
                <span className="shrink-0 text-[14px] font-medium tabular-nums text-green">
                  <Money usd={row.amount} className="tabular-nums" />
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
