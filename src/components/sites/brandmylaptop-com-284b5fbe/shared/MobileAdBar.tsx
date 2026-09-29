"use client";

import { useEffect, useState } from "react";

const SITE = "brandmylaptop-com-284b5fbe";
const logo = (file: string) => `/sites/${SITE}/shared/logos/${file}`;

const SPONSORS = [
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

const SLOTS = ["L1", "L4", "L5", "L6", "R1", "R2", "R3", "R4", "R5", "R6"];

function MegaphoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 min-h-0 shrink"
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

function BarItem({ slot }: { slot: string | null }) {
  if (slot) {
    return (
      <li className="pointer-events-auto p-1.5">
        <a
          className="flex h-[44px] w-[168px] flex-row items-center gap-2 rounded-xl border px-2.5 text-left border-dashed border-hairline bg-white text-ink-2/70 transition-colors hover:border-blue hover:text-blue"
          href={`/sponsor?slot=${slot}`}
        >
          <MegaphoneIcon />
          <span className="text-[12px] shrink-0 font-medium">Your startup here</span>
        </a>
      </li>
    );
  }
  return null;
}

function SponsorItem({ sponsor }: { sponsor: (typeof SPONSORS)[number] }) {
  return (
    <li className="pointer-events-auto p-1.5">
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex h-[44px] w-[168px] flex-row items-center gap-2 rounded-xl border px-2.5 text-left border-hairline bg-white transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={sponsor.name} className="h-7 w-7 shrink-0 object-contain" src={sponsor.img} />
        <span className="flex min-w-0 flex-1 flex-col items-start justify-center text-left">
          <span className="line-clamp-1 w-full shrink-0 truncate text-[12px] font-medium leading-tight">
            {sponsor.name}
          </span>
          <span className="w-full shrink-0 truncate text-[10px] leading-tight text-ink-2">
            {sponsor.tagline}
          </span>
        </span>
      </a>
    </li>
  );
}

function ItemList({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden ? "true" : "false"} className="flex shrink-0">
      <BarItem slot="L1" />
      {SPONSORS.map((s) => (
        <SponsorItem key={s.name} sponsor={s} />
      ))}
      {SLOTS.map((slot) => (
        <BarItem key={slot} slot={slot} />
      ))}
    </ul>
  );
}

/**
 * Mobile-only bottom sponsor bar. Mirrors the live site: hidden once the fixed
 * side rails take over at >=1280px width and >=637px height, and toggles the
 * `has-ad-bar` / `has-ad-rails` body classes accordingly.
 */
export function MobileAdBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px) and (min-height: 637px)");
    const apply = () => {
      const desktop = mq.matches;
      setVisible(!desktop);
      document.body.classList.toggle("has-ad-rails", desktop);
      document.body.classList.toggle("has-ad-bar", !desktop);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Sponsors"
      data-overlay=""
      className="pointer-events-none fixed inset-x-0 z-[55] animate-rail-in border-t border-hairline bg-white backdrop-blur-sm"
      style={{ bottom: "0px", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="pointer-events-auto overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max">
          <ItemList />
          <ItemList hidden />
        </div>
      </div>
    </aside>
  );
}
