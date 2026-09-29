"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { LaptopCard } from "./LaptopCard";
import { laptops, type Laptop } from "@/components/sites/brandmylaptop-com-284b5fbe/shared/data";
import {
  ChevronDownSmallIcon,
  FilterIcon,
} from "@/components/sites/brandmylaptop-com-284b5fbe/shared/icons";
import { cn } from "@/lib/utils";

type SortKey = "Most raised" | "Most viewed" | "Most followers" | "Ending soon";
type PillKey = "sort" | "seen-at" | "ownership" | "buy" | "who";

type PillOption = { label: string; count?: number };

const PAGE_SIZE = 24;

const PILL_KEYS: PillKey[] = ["sort", "seen-at", "ownership", "buy", "who"];

const SORT_OPTIONS: SortKey[] = ["Most raised", "Most viewed", "Most followers", "Ending soon"];

const SEEN_AT_OPTIONS: PillOption[] = [
  { label: "Build in public", count: 168 },
  { label: "Coworking", count: 211 },
  { label: "Conferences", count: 177 },
  { label: "Travel", count: 164 },
  { label: "Client meetings", count: 123 },
  { label: "Campus", count: 74 },
];

const OWNERSHIP_OPTIONS = ["All laptops", "Being funded by the sales", "Already owned"];

const BUY_OPTIONS = ["Any", "Fixed prices — buy directly", "Auction — highest bid wins"];

const WHO_OPTIONS: PillOption[] = [
  { label: "Anyone" },
  { label: "Developer", count: 38 },
  { label: "Indie hacker / founder", count: 43 },
  { label: "Designer", count: 12 },
  { label: "Content creator", count: 39 },
  { label: "Marketer / growth", count: 30 },
  { label: "Sales / SDR", count: 3 },
  { label: "Freelancer / consultant", count: 42 },
  { label: "Student", count: 27 },
  { label: "Teacher / researcher", count: 3 },
  { label: "Finance", count: 6 },
  { label: "Gamer", count: 6 },
  { label: "Something else", count: 16 },
];

function followersCount(followers: string | null): number {
  if (!followers) return -1;
  const scaled = /~?([\d.]+)\s*k/i.exec(followers);
  if (scaled) return Math.round(Number.parseFloat(scaled[1]) * 1000);
  const plain = /~?(\d+)/.exec(followers);
  return plain ? Number(plain[1]) : -1;
}

function auctionDays(laptop: Laptop): number | null {
  const match = /ends in (\d+)d/i.exec(laptop.stamp ?? "");
  return match ? Number(match[1]) : null;
}

function raisedValue(laptop: Laptop): number {
  return laptop.raised ?? -1;
}

function sortLaptops(list: Laptop[], sort: SortKey): Laptop[] {
  const byRaised = (a: Laptop, b: Laptop) => raisedValue(b) - raisedValue(a);
  const byFollowers = (a: Laptop, b: Laptop) =>
    followersCount(b.followers) - followersCount(a.followers);
  const byEnding = (a: Laptop, b: Laptop) => {
    const daysA = auctionDays(a) ?? Number.POSITIVE_INFINITY;
    const daysB = auctionDays(b) ?? Number.POSITIVE_INFINITY;
    if (daysA !== daysB) return daysA - daysB;
    return byRaised(a, b);
  };
  const comparators: Record<SortKey, (a: Laptop, b: Laptop) => number> = {
    "Most raised": byRaised,
    "Most viewed": byFollowers,
    "Most followers": byFollowers,
    "Ending soon": byEnding,
  };
  const comparator = comparators[sort];
  return list
    .map((laptop, index) => ({ laptop, index }))
    .sort((a, b) => {
      const result = comparator(a.laptop, b.laptop);
      return result !== 0 ? result : a.index - b.index;
    })
    .map((entry) => entry.laptop);
}

function matchesOwnership(laptop: Laptop, ownership: string): boolean {
  if (ownership === "Being funded by the sales") return !laptop.soldOnly;
  if (ownership === "Already owned") return laptop.soldOnly;
  return true;
}

function matchesBuy(laptop: Laptop, buy: string): boolean {
  const auction = /auction/i.test(laptop.stamp ?? "");
  if (buy === "Auction — highest bid wins") return auction;
  if (buy === "Fixed prices — buy directly") return !auction;
  return true;
}

export function LaptopsGrid() {
  const [sort, setSort] = useState<SortKey>("Most raised");
  const [openPill, setOpenPill] = useState<PillKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [seenAt, setSeenAt] = useState<string | null>(null);
  const [ownership, setOwnership] = useState<string>("All laptops");
  const [buy, setBuy] = useState<string>("Any");
  const [who, setWho] = useState<string>("Anyone");
  const [page, setPage] = useState<{ key: string; count: number }>({
    key: "init",
    count: PAGE_SIZE,
  });
  const [mounted, setMounted] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (openPill === null) return;
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (barRef.current && target instanceof Node && !barRef.current.contains(target)) {
        setOpenPill(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openPill]);

  const filterKey = [sort, ownership, buy].join("|");
  const visibleCount = page.key === filterKey ? page.count : PAGE_SIZE;

  const sorted = useMemo(() => {
    const narrowed = laptops.filter(
      (laptop) => matchesOwnership(laptop, ownership) && matchesBuy(laptop, buy)
    );
    return sortLaptops(narrowed, sort);
  }, [sort, ownership, buy]);

  const shown = sorted.slice(0, visibleCount);

  const cardStyle: CSSProperties = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateY(8px)",
    transition: "opacity 400ms ease, transform 400ms ease",
  };

  const pillClass = (active: boolean) =>
    cn(
      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
      active
        ? "border-blue bg-blue/[0.06] text-blue"
        : "border-hairline bg-white text-ink-2 hover:border-ink/30 hover:text-ink"
    );

  const blockOptionClass = (selected: boolean) =>
    cn(
      "block w-full rounded-xl px-3 py-2 text-left text-[13px] transition-colors hover:bg-surface",
      selected ? "font-medium text-blue" : ""
    );

  const countedOptionClass =
    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[13px] transition-colors hover:bg-surface";

  const panelClass = (width: string) =>
    cn(
      "absolute left-0 top-full z-30 mt-2 rounded-2xl border border-hairline bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
      width
    );

  function renderPill(key: PillKey): ReactNode {
    let label = "";
    let hasSelection = false;
    let panel: ReactNode = null;

    if (key === "sort") {
      label = sort;
      hasSelection = true;
      panel = (
        <div className={panelClass("w-56")}>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={sort === option}
              onClick={() => {
                setSort(option);
                setOpenPill(null);
              }}
              className={blockOptionClass(sort === option)}
            >
              {option}
            </button>
          ))}
        </div>
      );
    } else if (key === "seen-at") {
      label = seenAt ?? "Seen at";
      hasSelection = seenAt !== null;
      panel = (
        <div className={panelClass("w-64")}>
          {SEEN_AT_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={seenAt === option.label}
              onClick={() => {
                setSeenAt(option.label);
                setOpenPill(null);
              }}
              className={countedOptionClass}
            >
              <span className={seenAt === option.label ? "font-medium text-blue" : ""}>
                {option.label}
              </span>
              <span className="tabular-nums text-ink-2/70">{option.count}</span>
            </button>
          ))}
        </div>
      );
    } else if (key === "ownership") {
      label = ownership === "All laptops" ? "Ownership" : ownership;
      hasSelection = ownership !== "All laptops";
      panel = (
        <div className={panelClass("w-56")}>
          {OWNERSHIP_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={ownership === option}
              onClick={() => {
                setOwnership(option);
                setOpenPill(null);
              }}
              className={blockOptionClass(ownership === option)}
            >
              {option}
            </button>
          ))}
        </div>
      );
    } else if (key === "buy") {
      label = buy === "Any" ? "How you buy" : buy;
      hasSelection = buy !== "Any";
      panel = (
        <div className={panelClass("w-56")}>
          {BUY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={buy === option}
              onClick={() => {
                setBuy(option);
                setOpenPill(null);
              }}
              className={blockOptionClass(buy === option)}
            >
              {option}
            </button>
          ))}
        </div>
      );
    } else {
      label = who === "Anyone" ? "Who they are" : who;
      hasSelection = who !== "Anyone";
      panel = (
        <div className={panelClass("w-64")}>
          {WHO_OPTIONS.map((option) =>
            option.count === undefined ? (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setWho(option.label);
                  setOpenPill(null);
                }}
                className={blockOptionClass(who === option.label)}
              >
                {option.label}
              </button>
            ) : (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setWho(option.label);
                  setOpenPill(null);
                }}
                className={countedOptionClass}
              >
                <span className={who === option.label ? "font-medium text-blue" : ""}>
                  {option.label}
                </span>
                <span className="tabular-nums text-ink-2/70">{option.count}</span>
              </button>
            )
          )}
        </div>
      );
    }

    return (
      <div key={key} className="relative">
        <button
          type="button"
          aria-expanded={openPill === key}
          onClick={() => setOpenPill((current) => (current === key ? null : key))}
          className={pillClass(openPill === key || hasSelection)}
        >
          {label}
          <ChevronDownSmallIcon className="h-3 w-3" />
        </button>
        {openPill === key && panel}
      </div>
    );
  }

  return (
    <section
      id="laptops"
      className="mx-4 mt-4 scroll-mt-20 rounded-3xl bg-surface pb-16 pt-8 sm:mx-6 sm:mt-6 md:pb-24 md:pt-10 lg:mx-8"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div ref={barRef} className="relative z-40 mb-5">
          <div className="flex items-center gap-2 text-[14px] text-ink-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-apple-green" />
            </span>
            <span>166 laptops looking for brands</span>
            <button
              type="button"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors sm:hidden border-hairline bg-white text-ink-2"
            >
              <FilterIcon className="h-3.5 w-3.5" />
              Filters
            </button>
          </div>
          <div className="mt-4 hidden flex-wrap items-center gap-2 sm:flex">
            {PILL_KEYS.map((key) => renderPill(key))}
          </div>
          {mobileOpen && (
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
              {PILL_KEYS.map((key) => renderPill(key))}
            </div>
          )}
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((laptop, index) => (
            <LaptopCard
              key={laptop.slug ?? `${index}-${laptop.title}`}
              laptop={laptop}
              style={cardStyle}
            />
          ))}
        </ul>
        {visibleCount < sorted.length && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setPage({ key: filterKey, count: sorted.length })}
              className="rounded-full border border-hairline bg-white px-6 py-3 text-[14px] font-medium transition-colors hover:border-ink/40"
            >
              Show 48 more
              <span className="ml-1.5 font-normal text-ink-2">of 172</span>
            </button>
          </div>
        )}
        <p className="mt-8 text-center text-[14px] text-ink-2">
          Rather not browse?{" "}
          <Link className="font-medium text-blue hover:underline" href="/briefs">
            Post a brief
          </Link>{" "}
          and creators who fit apply to you.
        </p>
      </div>
    </section>
  );
}
