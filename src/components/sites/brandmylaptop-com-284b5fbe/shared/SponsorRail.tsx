import { cn } from "@/lib/utils";

const SITE = "brandmylaptop-com-284b5fbe";
const logo = (file: string) => `/sites/${SITE}/shared/logos/${file}`;

const SPONSORS = [
  {
    name: "Azal.ai",
    tagline: "Intelligence Software",
    href: "https://x.com/ProjectAzal",
    img: logo("e9348679-479b-47f4-a9a7-4eb3d4b3dede.svg"),
  },
  {
    name: "RankControl",
    tagline: "AI SEO Platform",
    href: "https://rctrl.com?ref=brandmylaptop",
    img: logo("cb023ec8-1b56-4a46-8735-5eee8a2b5537.png"),
  },
  {
    name: "TinyLaunch",
    tagline: "Grow your DR on autopilot!",
    href: "https://www.tinylaunch.com/submission-service?ref=brandmylaptop",
    img: logo("e0fb9007-b140-46dc-9637-d4f3eb3043f7.png"),
  },
];

function MegaphoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 min-h-0 shrink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11v2a1 1 0 0 0 1 1h2.6a2 2 0 0 1 .9.2l7 3.5a1 1 0 0 0 1.5-.9V7.2a1 1 0 0 0-1.5-.9l-7 3.5a2 2 0 0 1-.9.2H4a1 1 0 0 0-1 1Z" />
      <path d="M18 9.5a3 3 0 0 1 0 5" />
      <path d="M7.5 14.2V19a1 1 0 0 0 1 1h1.2a1 1 0 0 0 1-1v-3.3" />
    </svg>
  );
}

function PlaceholderCard({ slot }: { slot: string }) {
  return (
    <li className="pointer-events-auto flex min-h-0 flex-1 basis-0">
      <a
        className="flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border px-3 text-center gap-2 py-4 border-dashed border-hairline bg-white text-ink-2/70 transition-colors hover:border-blue hover:text-blue"
        href={`/sponsor?slot=${slot}`}
      >
        <MegaphoneIcon />
        <span className="text-[13px] shrink-0 font-medium">Your startup here</span>
      </a>
    </li>
  );
}

export function SponsorRail({ side }: { side: "left" | "right" }) {
  return (
    <aside
      aria-label="Sponsors"
      data-overlay=""
      className={cn(
        "pointer-events-none fixed bottom-4 top-20 z-30 hidden w-[190px] animate-rail-in flex-col min-[1800px]:w-[230px] [@media(min-width:1280px)_and_(min-height:637px)]:flex",
        side === "left" ? "left-2 2xl:left-5" : "right-2 2xl:right-5"
      )}
    >
      <p className="mb-2 shrink-0 text-[11px] uppercase tracking-wide text-ink-2/70">Sponsors</p>
      <ul className="flex min-h-0 flex-1 flex-col gap-3">
        {side === "left" &&
          SPONSORS.map((s) => (
            <li key={s.name} className="pointer-events-auto flex min-h-0 flex-1 basis-0">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border px-3 text-center gap-2 py-4 border-hairline bg-white transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={s.name}
                  className="min-h-0 max-h-[46px] w-auto flex-1 object-contain max-w-[70%]"
                  src={s.img}
                />
                <span className="contents">
                  <span className="line-clamp-2 min-[1800px]:text-[13px] w-full shrink-0 truncate text-[12px] font-medium leading-tight">
                    {s.name}
                  </span>
                  <span className="-mt-1 w-full shrink-0 truncate text-[10px] leading-tight text-ink-2">
                    {s.tagline}
                  </span>
                </span>
              </a>
            </li>
          ))}
        {(side === "left" ? ["L4", "L5", "L6"] : ["R1", "R2", "R3", "R4", "R5", "R6"]).map((slot) => (
          <PlaceholderCard key={slot} slot={slot} />
        ))}
      </ul>
    </aside>
  );
}
