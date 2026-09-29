"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LID_STICKER } from "../shared/LidPreview";

export type WizardDevice = "mac" | "pc";
export type WizardFinish = "silver" | "sky-blue" | "starlight" | "midnight" | "space-black" | "space-grey";
export type WizardLayoutId = "ten" | "six";
export type WizardSale = "fixed" | "auction" | null;
export type SpotSize = "L" | "M" | "S";

export const FINISHES: {
  id: WizardFinish;
  label: string;
  dark: boolean;
  stops: [string, string, string];
}[] = [
  { id: "silver", label: "Silver", dark: false, stops: ["#ececed", "#dcdcdf", "#c8c8cd"] },
  { id: "sky-blue", label: "Sky Blue", dark: false, stops: ["#dbe7f2", "#c9dae9", "#b7cbdd"] },
  { id: "starlight", label: "Starlight", dark: false, stops: ["#f2ead9", "#e9dcc4", "#ddceb2"] },
  { id: "midnight", label: "Midnight", dark: true, stops: ["#33404d", "#28323e", "#1e2630"] },
  { id: "space-black", label: "Space Black", dark: true, stops: ["#3b3b3d", "#2a2a2c", "#1b1b1d"] },
  { id: "space-grey", label: "Space Grey", dark: false, stops: ["#6b6c71", "#5a5b60", "#48494e"] },
];

type SpotSeed = {
  id: number;
  label: string;
  size: SpotSize;
  col: number;
  row: number;
  colSpan: number;
  multiplier: number;
};

export const LAYOUT_OPTIONS: { id: WizardLayoutId; name: string; description: string }[] = [
  {
    id: "ten",
    name: "Ten spots",
    description: "Three banners, four small marks around the logo, three strips. The most inventory, the lowest entry price.",
  },
  {
    id: "six",
    name: "Six spots",
    description: "Fewer, larger placements. Each sponsor gets more of the lid, and the whole thing sells in fewer deals.",
  },
];

const LAYOUTS: Record<WizardLayoutId, SpotSeed[]> = {
  ten: [
    { id: 1, label: "Top left banner", size: "L", col: 1, row: 1, colSpan: 2, multiplier: 1 },
    { id: 2, label: "Marquee — above the logo", size: "L", col: 3, row: 1, colSpan: 2, multiplier: 1.25 },
    { id: 3, label: "Top right banner", size: "L", col: 5, row: 1, colSpan: 2, multiplier: 1 },
    { id: 4, label: "Middle left", size: "S", col: 1, row: 2, colSpan: 1, multiplier: 1 },
    { id: 5, label: "Inner left — beside the logo", size: "S", col: 2, row: 2, colSpan: 1, multiplier: 1.2 },
    { id: 6, label: "Inner right — beside the logo", size: "S", col: 5, row: 2, colSpan: 1, multiplier: 1.2 },
    { id: 7, label: "Middle right", size: "S", col: 6, row: 2, colSpan: 1, multiplier: 1 },
    { id: 8, label: "Bottom left strip", size: "M", col: 1, row: 3, colSpan: 2, multiplier: 1 },
    { id: 9, label: "Bottom centre — under the logo", size: "M", col: 3, row: 3, colSpan: 2, multiplier: 1.25 },
    { id: 10, label: "Bottom right strip", size: "M", col: 5, row: 3, colSpan: 2, multiplier: 1 },
  ],
  six: [
    { id: 1, label: "Top left banner", size: "L", col: 1, row: 1, colSpan: 3, multiplier: 1 },
    { id: 2, label: "Top right banner", size: "L", col: 4, row: 1, colSpan: 3, multiplier: 1 },
    { id: 3, label: "Middle left — beside the logo", size: "S", col: 1, row: 2, colSpan: 1, multiplier: 1.2 },
    { id: 4, label: "Middle right — beside the logo", size: "S", col: 6, row: 2, colSpan: 1, multiplier: 1.2 },
    { id: 5, label: "Bottom left strip", size: "M", col: 1, row: 3, colSpan: 3, multiplier: 1 },
    { id: 6, label: "Bottom right strip", size: "M", col: 4, row: 3, colSpan: 3, multiplier: 1 },
  ],
};

const SIZE_DIMS: Record<SpotSize, [number, number]> = {
  L: [9.5, 5.5],
  M: [9.5, 4],
  S: [4.5, 4.5],
};

const SIZE_BASE: Record<SpotSize, number> = { L: 395, M: 195, S: 125 };
const SIZE_MM: Record<number, number> = { 13: 30.4, 14: 31.26, 15: 34.04, 16: 35.57 };

function sizeFactor(lidInches: number): number {
  return (SIZE_MM[lidInches] ?? SIZE_MM[14]) / SIZE_MM[14];
}

export function spotDims(size: SpotSize, lidInches: number): string {
  const [w, h] = SIZE_DIMS[size];
  const factor = sizeFactor(lidInches);
  const round = (value: number) => Math.round(value * factor * 10) / 10;
  return `${round(w)} × ${round(h)} cm`;
}

function roundPrice(value: number): number {
  return Math.min(4995, Math.max(25, 10 * Math.ceil((value - 5) / 10 - 0.5) + 5));
}

export type PreviewSpot = {
  id: number;
  label: string;
  size: SpotSize;
  dims: string;
  col: number;
  row: number;
  colSpan: number;
  priceEur: number;
};

export function previewSpots(layoutId: WizardLayoutId, lidInches: number): PreviewSpot[] {
  return LAYOUTS[layoutId].map((spot) => ({
    id: spot.id,
    label: spot.label,
    size: spot.size,
    dims: spotDims(spot.size, lidInches),
    col: spot.col,
    row: spot.row,
    colSpan: spot.colSpan,
    priceEur: roundPrice(SIZE_BASE[spot.size] * spot.multiplier),
  }));
}

export function spotsTotal(spots: PreviewSpot[]): number {
  return spots.reduce((sum, spot) => sum + spot.priceEur, 0);
}

export function formatEur(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")}\u00a0\u20ac`;
}

const APPLE_PATH =
  "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.033 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";

function PreviewCell({ spot, dark, sale }: { spot: PreviewSpot; dark: boolean; sale: WizardSale }) {
  const price = formatEur(spot.priceEur);
  return (
    <div className="group relative h-full w-full">
      <button
        type="button"
        aria-label={`Spot ${spot.id}, ${[spot.label, spot.dims].filter(Boolean).join(", ")}. ${price}. ${
          sale === "auction" ? "Bid this spot." : "Buy this spot."
        }`}
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-[calc(var(--lidw,100cqw)*0.014)] border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
          dark
            ? "border-dashed border-white/30 bg-white/[0.04] text-white group-hover:border-white/55 group-hover:bg-white/[0.09]"
            : "border-dashed border-black/25 bg-black/[0.02] text-ink group-hover:border-black/45 group-hover:bg-black/[0.05]"
        )}
        tabIndex={0}
      >
        <span
          className={cn(
            "text-[10px] tabular-nums transition-opacity duration-200 sm:text-[13px] [@media(hover:hover)]:group-hover:opacity-0",
            dark ? "text-white/60" : "text-ink-2"
          )}
        >
          {price}
        </span>
      </button>
      <span className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:gap-1.5 [@media(hover:hover)]:flex">
        <span
          aria-hidden="true"
          className="pointer-events-auto cursor-pointer whitespace-nowrap rounded-full bg-blue px-[0.7em] py-[0.35em] text-[calc(var(--lidw,100cqw)*0.017)] font-medium text-white transition-colors hover:bg-blue-hover"
        >
          {sale === "auction" ? `Bid – ${price}` : `Buy – ${price}`}
        </span>
      </span>
    </div>
  );
}

export function SellPreview({
  device,
  finish,
  lidInches,
  layoutId,
  sale,
  days,
  auctionDays,
  stickerMonths,
  goal,
}: {
  device: WizardDevice;
  finish: WizardFinish;
  lidInches: number;
  layoutId: WizardLayoutId;
  sale: WizardSale;
  days: number;
  auctionDays: number;
  stickerMonths: number;
  goal: number | null;
}) {
  const lidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lidRef.current;
    if (!el) return;
    const setWidth = () => el.style.setProperty("--lidw", `${el.getBoundingClientRect().width}px`);
    setWidth();
    const observer = new ResizeObserver(setWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const look = FINISHES.find((entry) => entry.id === finish) ?? FINISHES[0];
  const dark = look.dark;
  const spots = previewSpots(layoutId, lidInches);
  const total = spotsTotal(spots);
  const lowest = Math.min(...spots.map((spot) => spot.priceEur));

  const groups: { head: string; rows: [string, string, string][] }[] = [
    {
      head: "Money",
      rows: [
        [sale === "auction" ? "Opening bids, all spots" : "If it all sells", formatEur(total), ""],
        ...(goal !== null
          ? ([["Goal", formatEur(goal), total >= goal ? "text-green" : ""]] as [string, string, string][])
          : []),
      ],
    },
    {
      head: "Terms",
      rows: [
        [
          "Brands buy",
          sale === "auction"
            ? `Auction · ${auctionDays} day${auctionDays === 1 ? "" : "s"}`
            : sale === "fixed"
              ? `Fixed prices · ${days ? `${days} days` : "no end date"}`
              : "—",
          "",
        ],
        ["Stickers stay", `${stickerMonths} months`, ""],
      ],
    },
    {
      head: "Spots",
      rows: [
        ["Count", String(spots.length), ""],
        ["Lowest", formatEur(lowest), ""],
      ],
    },
  ];

  return (
    <div>
      <div className="relative mx-auto aspect-[1.44] w-full max-w-[560px]">
        <div
          ref={lidRef}
          className="absolute inset-0 m-auto flex w-full max-w-[860px] flex-col justify-center "
          style={{ containerType: "inline-size" }}
        >
          <div
            className="relative flex min-h-0 w-full shrink-0 rounded-[calc(var(--lidw,100cqw)*0.026000000000000002)] p-[calc(var(--lidw,100cqw)*0.012)]"
            style={{
              aspectRatio: "1.44",
              background: `linear-gradient(172deg, ${look.stops[0]} 0%, ${look.stops[1]} 45%, ${look.stops[2]} 100%)`,
              boxShadow: dark
                ? "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.5), 0 30px 60px -18px rgba(0,0,0,0.38), 0 12px 24px -12px rgba(0,0,0,0.26)"
                : "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.18), 0 30px 60px -18px rgba(0,0,0,0.28), 0 12px 24px -12px rgba(0,0,0,0.18)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                background: dark
                  ? "radial-gradient(120% 90% at 30% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 42%, transparent 70%)"
                  : "radial-gradient(120% 90% at 30% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 42%, transparent 70%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LID_STICKER}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[calc(var(--lidw,100cqw)*0.0155)] z-10 h-[calc(var(--lidw,100cqw)*0.024)] w-auto -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_0.6px_1px_rgba(0,0,0,0.3))]"
            />
            {device === "mac" && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div aria-hidden="true" className="w-[15.6%]" style={{ opacity: 1, transform: "none" }}>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={cn(
                      "w-full",
                      dark
                        ? "text-black/55 [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.18))]"
                        : "text-[#3b3b3f] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.6))]"
                    )}
                  >
                    <path fill="currentColor" d={APPLE_PATH} />
                  </svg>
                </div>
              </div>
            )}
            <div
              className="relative flex-1 min-h-0 grid gap-[calc(var(--lidw,100cqw)*0.014)] p-[calc(var(--lidw,100cqw)*0.019)]"
              style={{
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gridTemplateRows: "minmax(0, 1fr) minmax(0, 0.9fr) minmax(0, 1fr)",
              }}
            >
              {spots.map((spot) => (
                <div key={spot.id} style={{ gridColumn: `${spot.col} / span ${spot.colSpan}`, gridRow: spot.row }}>
                  <PreviewCell spot={spot} dark={dark} sale={sale} />
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden="true" className="mx-auto mt-5 h-5 w-[85%] rounded-[50%] bg-black/12 blur-xl" />
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-[560px] divide-y divide-hairline rounded-2xl border border-hairline bg-white text-[13px]">
        {groups.map((group) => (
          <dl
            key={group.head}
            className="grid grid-cols-[6rem_1fr] gap-x-4 px-4 py-3 sm:grid-cols-[7rem_1fr]"
          >
            <dt className="pt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-2">{group.head}</dt>
            <dd className="space-y-1">
              {group.rows.map(([label, value, extra]) => (
                <div key={label} className="flex items-baseline justify-between gap-4">
                  <span className="text-ink-2">{label}</span>
                  <span className={cn("font-medium tabular-nums", extra)}>{value}</span>
                </div>
              ))}
            </dd>
          </dl>
        ))}
      </div>
    </div>
  );
}
