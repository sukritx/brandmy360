import type { ComponentType, CSSProperties, SVGProps } from "react";

import { Money } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/CurrencyProvider";
import {
  LidPreview,
  isDarkLid,
} from "@/components/sites/brandmylaptop-com-284b5fbe/shared/LidPreview";
import type { Laptop } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/data";
import {
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  TwitchIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/sites/brandmylaptop-com-284b5fbe/shared/icons";

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
const WHO_LABELS = new Set([
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
]);

function parseSoldAmount(spots: string | null): number | null {
  const match = spots ? /^\$([\d,]+)sold$/i.exec(spots) : null;
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

function spotsLabel(laptop: Laptop): string | null {
  if (laptop.rightLabel) return laptop.rightLabel;
  if (laptop.spots && !SOLD_SPOTS.test(laptop.spots)) return laptop.spots;
  return laptop.tags.find((tag) => SPOT_LABEL.test(tag)) ?? null;
}

function cardHref(slug: string | null): string {
  if (!slug) return "#";
  return EXTERNAL_HREF.test(slug) ? slug : `/${slug}`;
}

export function LaptopCard({ laptop, style }: { laptop: Laptop; style?: CSSProperties }) {
  const soldAmount = parseSoldAmount(laptop.spots);
  const raisedUsd = laptop.raised ?? soldAmount ?? 0;
  const sold = laptop.soldOnly || (laptop.raised === null && soldAmount !== null);
  const spots = spotsLabel(laptop);
  const tags = Array.from(new Set(laptop.tags.filter((tag) => WHO_LABELS.has(tag))));
  const external = EXTERNAL_HREF.test(laptop.slug ?? "");
  const dark = isDarkLid(laptop.lid);

  return (
    <li className="min-w-0" style={style}>
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
              {laptop.followers && <span title="Read from the platforms">{laptop.followers}</span>}
              {laptop.socials.length > 0 && (
                <span className="inline-flex items-center gap-1" aria-label="Where they post">
                  {laptop.socials.map((platform) => {
                    const Icon = SOCIAL_ICONS[platform];
                    return Icon ? (
                      <Icon key={platform} aria-hidden="true" className="h-3 w-3 shrink-0" />
                    ) : null;
                  })}
                </span>
              )}
            </span>
          )}
        </p>
        <p className="mt-1.5 flex h-[18px] items-center gap-x-2.5 overflow-hidden whitespace-nowrap text-[12px] text-ink-2">
          {tags.map((tag) => (
            <span key={tag} title={tag}>
              {tag}
            </span>
          ))}
        </p>
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
            <span className="shrink-0 whitespace-nowrap text-[12px] text-ink-2">{spots}</span>
          )}
        </div>
        {laptop.stamp && laptop.stampClass && (
          <span className={laptop.stampClass}>{laptop.stamp}</span>
        )}
      </a>
    </li>
  );
}
