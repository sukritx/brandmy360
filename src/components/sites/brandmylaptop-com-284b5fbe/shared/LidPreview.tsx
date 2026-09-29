import { cn } from "@/lib/utils";
import type { Lid } from "./data";

export type LidVariant = "light" | "dark" | "pc";

const APPLE_PATH =
  "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.033 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";

/** The standard 10-slot lid layout, in DOM order. */
const LID_LAYOUT = [
  "1 / 1 / auto / span 2",
  "1 / 3 / auto / span 2",
  "1 / 5 / auto / span 2",
  "2 / 1 / auto / span 1",
  "2 / 2 / auto / span 1",
  "2 / 5 / auto / span 1",
  "2 / 6 / auto / span 1",
  "3 / 1 / auto / span 2",
  "3 / 3 / auto / span 2",
  "3 / 5 / auto / span 2",
];

const normArea = (a: string | null) => (a ? a.replace(/\s+/g, " ").trim() : "");

export const LID_STICKER = "/sites/brandmylaptop-com-284b5fbe/shared/stickers/brandmylaptop.png";

const STICKER_IMG_CLASS =
  "w-auto shrink-0 object-contain [filter:drop-shadow(0_0_0.6px_#fff)_drop-shadow(0_0_0.6px_#fff)_drop-shadow(0_0_0.6px_#fff)_drop-shadow(0_0.6px_0.8px_rgba(0,0,0,0.28))]";

export function LidPreview({
  lid,
  variant = "light",
  className,
}: {
  lid: Lid;
  variant?: LidVariant;
  className?: string;
}) {
  const dark = variant === "dark";
  const byArea = new Map<string, (typeof lid.slots)[number]>();
  for (const slot of lid.slots) byArea.set(normArea(slot.area), slot);
  const extraAreas = lid.slots
    .map((s) => s.area)
    .filter((a): a is string => !!a && !LID_LAYOUT.includes(normArea(a)))
    .map((a) => normArea(a));
  const cells = [...LID_LAYOUT, ...Array.from(new Set(extraAreas))];
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 m-auto flex w-full max-w-[860px] flex-col justify-center",
        className
      )}
      style={{ containerType: "inline-size" }}
      aria-hidden="true"
    >
      <div
        className="relative flex min-h-0 w-full shrink-0 rounded-[calc(var(--lidw,100cqw)*0.026000000000000002)] p-[calc(var(--lidw,100cqw)*0.012)]"
        style={lid.lidBg ? parseCss(lid.lidBg) : undefined}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: dark
              ? "radial-gradient(120% 90% at 30% 0%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 42%, transparent 70%)"
              : "radial-gradient(120% 90% at 30% 0%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.12) 42%, transparent 70%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LID_STICKER}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[calc(var(--lidw,100cqw)*0.0155)] z-10 h-[calc(var(--lidw,100cqw)*0.024)] w-auto -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_0.6px_1px_rgba(0,0,0,0.3))]"
        />
        {variant !== "pc" && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div aria-hidden="true" className="w-[15.6%]">
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
            gridTemplateColumns: "repeat(6, minmax(0px, 1fr))",
            gridTemplateRows: "minmax(0px, 1fr) minmax(0px, 0.9fr) minmax(0px, 1fr)",
          }}
        >
          {cells.map((cell, i) => {
            const slot = byArea.get(normArea(cell));
            if (!slot || (!slot.img && !slot.label)) {
              return (
                <div key={`${cell}-${i}`} style={cell ? { gridArea: cell } : undefined}>
                  <div className="h-full w-full rounded-[calc(var(--lidw,100cqw)*0.014)] border border-dashed border-black/15" />
                </div>
              );
            }
            return (
              <div key={`${cell}-${i}`} style={cell ? { gridArea: cell } : undefined}>
                <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                  {slot.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slot.img}
                      alt=""
                      loading="lazy"
                      className={STICKER_IMG_CLASS}
                      style={slot.imgStyle ? parseCss(slot.imgStyle) : undefined}
                    />
                  )}
                  {slot.label && (
                    <span
                      className={cn(
                        "max-w-full text-center text-[calc(var(--lidw,100cqw)*0.016)] font-semibold leading-tight [overflow-wrap:anywhere]",
                        dark ? "text-white/80" : "text-ink"
                      )}
                    >
                      {slot.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function parseCss(style: string | null): React.CSSProperties {
  if (!style) return {};
  const out: Record<string, string> = {};
  style.split(";").forEach((decl) => {
    const idx = decl.indexOf(":");
    if (idx === -1) return;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop || !val) return;
    const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = val;
  });
  return out as React.CSSProperties;
}

export function isDarkLid(lid: Lid): boolean {
  const s = lid.lidBg || "";
  return /59,\s*59,\s*61|--lid-dark-1|2E2E33|2e2e33/i.test(s);
}
