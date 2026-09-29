"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";

import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import {
  LidPreview,
  isDarkLid,
} from "@/components/sites/brandmylaptop-com-284b5fbe/shared/LidPreview";
import { laptops } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/data";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  TwitchIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/sites/brandmylaptop-com-284b5fbe/shared/icons";
import { cn } from "@/lib/utils";

const FEATURED = laptops.slice(0, 5);

const SOCIAL_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  x: XIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  twitch: TwitchIcon,
};

const SOLD_SPOTS = /^\$[\d,]+sold$/i;
const SPOT_LABEL = /^\d+\/\d+ (left|spots)$/;
const EXTERNAL_HREF = /^https?:\/\//i;

function parseSoldAmount(spots: string | null): number | null {
  const match = spots ? /^\$([\d,]+)sold$/i.exec(spots) : null;
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

function spotsLabel(laptopSpots: string | null, tags: string[], rightLabel?: string | null): string | null {
  if (rightLabel) return rightLabel;
  if (laptopSpots && !SOLD_SPOTS.test(laptopSpots)) return laptopSpots;
  return tags.find((tag) => SPOT_LABEL.test(tag)) ?? null;
}

function cardHref(slug: string | null): string {
  if (!slug) return "#";
  return EXTERNAL_HREF.test(slug) ? slug : `/${slug}`;
}

function cardStep(track: HTMLUListElement): number {
  const first = track.firstElementChild as HTMLElement | null;
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
  return (first ? first.getBoundingClientRect().width : track.clientWidth) + gap;
}

export function FeaturedCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft < max - 1);
    setActiveIndex(
      Math.max(0, Math.min(FEATURED.length - 1, Math.round(track.scrollLeft / cardStep(track))))
    );
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * cardStep(track), behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="featured-now"
      className="animate-featured mx-4 overflow-hidden rounded-3xl bg-ink py-6 text-white sm:mx-6 lg:mx-8"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id="featured-now" className="text-[24px] font-normal tracking-[-0.02em]">
            Featured now
          </h2>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul
          ref={trackRef}
          onScroll={sync}
          className="no-scrollbar mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:pb-0"
        >
          {FEATURED.map((laptop, i) => {
            const soldAmount = parseSoldAmount(laptop.spots);
            const raisedUsd = laptop.raised ?? soldAmount ?? 0;
            const sold = laptop.soldOnly || (laptop.raised === null && soldAmount !== null);
            const spots = spotsLabel(laptop.spots, laptop.tags, laptop.rightLabel);
            const external = EXTERNAL_HREF.test(laptop.slug ?? "");
            const dark = isDarkLid(laptop.lid);

            return (
              <li
                key={laptop.slug ?? i}
                className="animate-featured-card flex w-[76%] shrink-0 flex-col snap-start sm:w-[calc((100%-2rem)/3)]"
                style={{ animationDelay: `${120 + i * 60}ms` }}
              >
                <a
                  href={cardHref(laptop.slug)}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="relative flex h-full flex-col rounded-2xl border bg-white p-5 text-ink transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] border-hairline"
                >
                  <div className="relative aspect-[1.44] w-full overflow-hidden rounded-xl bg-surface">
                    <LidPreview lid={laptop.lid} variant={dark ? "dark" : "light"} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="min-w-0 font-medium">{laptop.title}</p>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-ink-2">
                    {laptop.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={laptop.avatar}
                        alt=""
                        loading="lazy"
                        className="h-5 w-5 shrink-0 rounded-full object-cover"
                      />
                    )}
                    {laptop.author && <span className="truncate">{laptop.author}</span>}
                    {(laptop.followers || laptop.socials.length > 0) && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                        <span aria-hidden="true">·</span>
                        {laptop.followers && (
                          <span title="Read from the platforms">{laptop.followers}</span>
                        )}
                        {laptop.socials.length > 0 && (
                          <span
                            className="inline-flex items-center gap-1"
                            aria-label="Where they post"
                          >
                            {laptop.socials.map((platform) => {
                              const Icon = SOCIAL_ICONS[platform];
                              return Icon ? (
                                <Icon
                                  key={platform}
                                  aria-hidden="true"
                                  className="h-3 w-3 shrink-0"
                                />
                              ) : null;
                            })}
                          </span>
                        )}
                      </span>
                    )}
                  </p>
                  <p className="mt-1.5 flex h-[18px] items-center gap-x-2.5 overflow-hidden whitespace-nowrap text-[12px] text-ink-2" />
                  <div className="mt-auto flex items-baseline justify-between gap-2 pt-4">
                    <span className="whitespace-nowrap text-lg font-semibold tabular-nums text-green">
                      <Money usd={raisedUsd} />
                      {laptop.leftSuffix ? (
                        <span className="ml-1.5 text-[12px] font-normal text-ink-2">{laptop.leftSuffix}</span>
                      ) : !sold && laptop.goal !== null ? (
                        <span className="ml-1.5 text-[12px] font-normal text-ink-2">
                          of <Money usd={laptop.goal} />
                        </span>
                      ) : null}
                    </span>
                    {spots && (
                      <span className="shrink-0 whitespace-nowrap text-[12px] text-ink-2">
                        {spots}
                      </span>
                    )}
                  </div>
                  {laptop.stamp && laptop.stampClass && (
                    <span className={laptop.stampClass}>{laptop.stamp}</span>
                  )}
                </a>
                {laptop.caption && (
                  <p className="mt-3 px-1 text-[13px] leading-relaxed text-white/70">
                    {laptop.caption}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <div aria-hidden="true" className="mt-4 flex justify-center gap-2">
          {FEATURED.map((laptop, i) => (
            <span
              key={laptop.slug ?? i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === activeIndex ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
