"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { AppleLogoLightIcon, InstagramIcon, LinkedInIcon } from "../shared/icons";
import { LID_STICKER, parseCss } from "../shared/LidPreview";
import {
  listingAuthor,
  listingMoney,
  listingSeoTitle,
  listingSpots,
  listingTitle,
  listingViews,
} from "./data";

type LidView = "for-sale" | "final-look";

const seoTitle = listingSeoTitle.replace(/\\u([0-9a-fA-F]{4})/g, (_, code: string) =>
  String.fromCharCode(parseInt(code, 16))
);

const LID_BODY_CSS =
  "aspect-ratio: 1.44 / 1; background: linear-gradient(172deg, rgb(236, 236, 237) 0%, rgb(220, 220, 223) 45%, rgb(200, 200, 205) 100%); box-shadow: rgba(255, 255, 255, 0.9) 0px 1px 0px inset, rgba(0, 0, 0, 0.18) 0px -1px 0px inset, rgba(0, 0, 0, 0.28) 0px 30px 60px -18px, rgba(0, 0, 0, 0.18) 0px 12px 24px -12px";

const LID_OVERLAY =
  "radial-gradient(120% 90% at 30% 0%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.12) 42%, transparent 70%)";

const BRAND_PILL_LOGO = "/sites/brandmylaptop-com-284b5fbe/shared/media/logo-small.1zmf4nfgeac61.png";
const FOUNDER_AVATAR = "/sites/brandmylaptop-com-284b5fbe/shared/media/vincent.2710md5e2w-ud.webp";

const TOGGLE_BASE = "rounded-full px-4 py-1.5 transition-colors";
const TOGGLE_ACTIVE = "bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.14)] ring-1 ring-black/10";
const TOGGLE_IDLE = "text-ink-2 hover:text-ink";

export function ListingHero() {
  const [lidView, setLidView] = useState<LidView>("for-sale");

  return (
    <header className="mx-auto max-w-5xl px-6 pt-10 pb-16 text-center md:pt-14">
      <p className="flex items-center justify-center gap-2 text-[13px] text-ink-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-apple-green" />
        </span>
        <strong className="font-medium tabular-nums text-ink">{listingViews.toLocaleString("en-US")}</strong>{" "}
        views on this lid
      </p>
      <h1 className="sr-only">{seoTitle}</h1>
      <p className="mt-2 text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.06em]">
        {listingTitle}
      </p>
      <div className="mx-auto mt-8 max-w-[17rem] sm:max-w-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-semibold tabular-nums text-green sm:text-2xl">
            {"4\u00a0200\u00a0€"}
            <span className="ml-1.5 text-[13px] font-normal text-ink-2 sm:ml-2 sm:text-sm">sold</span>
          </span>
          <span className="text-[13px] text-ink-2 sm:text-sm">
            goal passed ·{" "}
            <strong className="font-medium tabular-nums text-green">{listingMoney.goalPct}%</strong>
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={listingMoney.goalPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Funding progress"
          className="mt-2 h-2 overflow-hidden rounded-full bg-hairline/60 ring-1 ring-inset ring-black/[0.06]"
        >
          <div className="h-full rounded-full bg-apple-green" style={{ width: `${listingMoney.goalPct}%` }} />
        </div>
      </div>
      <p className="mt-3 text-[12px] text-ink-2">This lid is no longer taking buyers.</p>
      <div className="mx-auto mt-7 max-w-[900px]">
        <div className="mb-6 flex items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listingAuthor.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 text-left">
            <p className="truncate text-[14px] font-medium leading-tight">
              {listingAuthor.name}{" "}
              <a
                href={listingAuthor.handleHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-blue hover:underline"
              >
                {listingAuthor.handle}
              </a>
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-2">
              <span>
                <span className="tabular-nums">{listingAuthor.followers}</span> followers
              </span>
              <span className="inline-flex items-center gap-1.5">
                {listingAuthor.socials.map((social) =>
                  social.label === "linkedin" || social.label === "instagram" ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline transition-colors hover:border-ink/30"
                    >
                      {social.label === "linkedin" ? (
                        <LinkedInIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <InstagramIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      )}
                    </a>
                  ) : null
                )}
              </span>
            </p>
          </div>
        </div>
        <div className="relative aspect-[1.44] w-full">
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-[860px]">
            <button
              type="button"
              className="pointer-events-auto absolute right-0 top-0 z-20 inline-flex -translate-y-[calc(100%+0.5rem)] items-center gap-1 rounded-full border border-hairline bg-white px-2.5 py-1 text-[11px] font-medium text-ink-2 transition-colors hover:text-ink disabled:opacity-60"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 10V2m0 0L5.5 4.5M8 2l2.5 2.5M3 8v5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" />
              </svg>
              Share
            </button>
          </div>
          <div
            className="absolute inset-0 m-auto flex w-full max-w-[860px] flex-col justify-center"
            style={{ containerType: "inline-size" }}
          >
            <div
              className="relative flex min-h-0 w-full shrink-0 rounded-[calc(var(--lidw,100cqw)*0.026000000000000002)] p-[calc(var(--lidw,100cqw)*0.012)]"
              style={parseCss(LID_BODY_CSS)}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ background: LID_OVERLAY }}
              />
              <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
                <Link
                  href="/"
                  className="inline-flex w-max max-w-[calc(100vw-2rem)] items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline bg-white px-2.5 py-1 text-[11px] text-ink-2 shadow-[0_2px_10px_rgba(0,0,0,0.10)] transition-colors hover:border-ink/40 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[12px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={BRAND_PILL_LOGO} alt="" loading="lazy" className="h-4 w-auto" />
                  <span className="font-medium text-ink">BrandMyLaptop</span>
                  <span aria-hidden="true">—</span>
                  <span>by</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FOUNDER_AVATAR}
                    alt=""
                    loading="lazy"
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <span className="font-medium text-ink">@VynseDev</span>
                </Link>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LID_STICKER}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[calc(var(--lidw,100cqw)*0.0155)] z-10 h-[calc(var(--lidw,100cqw)*0.024)] w-auto -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_0.6px_1px_rgba(0,0,0,0.3))]"
              />
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div aria-hidden="true" className="w-[15.6%]">
                  <AppleLogoLightIcon
                    aria-hidden="true"
                    className="w-full text-[#3b3b3f] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.6))]"
                  />
                </div>
              </div>
              <div
                className="relative flex-1 min-h-0 grid gap-[calc(var(--lidw,100cqw)*0.014)] p-[calc(var(--lidw,100cqw)*0.019)]"
                style={{
                  gridTemplateColumns: "repeat(6, minmax(0px, 1fr))",
                  gridTemplateRows: "minmax(0px, 1fr) minmax(0px, 0.9fr) minmax(0px, 1fr)",
                }}
              >
                {listingSpots.map((spot) => (
                  <div key={spot.n} style={{ gridArea: spot.area }}>
                    <div className="group relative h-full w-full">
                      <a
                        href={spot.brandHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        aria-label={`Spot ${spot.n}, ${spot.name}, ${spot.dims}. Taken by ${spot.brand}. Visit them.`}
                        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[calc(var(--lidw,100cqw)*0.014)] border border-dashed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue border-black/25 bg-black/[0.02] text-ink group-hover:border-black/45 group-hover:bg-black/[0.05]"
                      >
                        <span className="flex h-full w-full flex-col items-center justify-end gap-1 px-1.5 py-2 transition duration-200 group-hover:blur-[3px] group-focus-within:blur-[3px]">
                          <span className="relative flex min-h-0 w-full flex-1 items-center justify-center">
                            {spot.logo && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={spot.logo}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 m-auto max-h-[70%] max-w-[88%] object-contain"
                              />
                            )}
                          </span>
                          {spot.label && (
                            <span className="max-w-full shrink-0 truncate text-[10px] font-semibold leading-tight sm:text-[13px]">
                              {spot.label}
                            </span>
                          )}
                          <span className="shrink-0 text-[11px] font-medium tabular-nums leading-tight sm:text-[14px] text-ink-2">
                            {`${spot.price}\u00a0€`}
                          </span>
                        </span>
                      </a>
                      <span className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:gap-1.5 [@media(hover:hover)]:flex">
                        <a
                          href={spot.brandHref}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          aria-label={`Visit ${spot.brand}'s site`}
                          className="pointer-events-auto whitespace-nowrap rounded-full bg-white/90 px-[0.85em] py-[0.3em] text-[calc(var(--lidw,100cqw)*0.015)] font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-colors hover:bg-white"
                        >
                          {"Visit\u00a0↗"}
                        </a>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div aria-hidden="true" className="mx-auto mt-5 h-5 w-[85%] rounded-[50%] bg-black/12 blur-xl" />
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-col items-center gap-2">
        <div role="group" aria-label="Lid view" className="flex rounded-full bg-hairline/50 p-1 text-[13px] font-medium">
          <button
            type="button"
            aria-pressed={lidView === "for-sale"}
            onClick={() => setLidView("for-sale")}
            className={cn(TOGGLE_BASE, lidView === "for-sale" ? TOGGLE_ACTIVE : TOGGLE_IDLE)}
          >
            For sale
          </button>
          <button
            type="button"
            aria-pressed={lidView === "final-look"}
            onClick={() => setLidView("final-look")}
            className={cn(TOGGLE_BASE, lidView === "final-look" ? TOGGLE_ACTIVE : TOGGLE_IDLE)}
          >
            Final look
          </button>
        </div>
        <p aria-live="polite" className="text-[12px] text-ink-2">
          This lid is closed.
        </p>
      </div>
    </header>
  );
}
