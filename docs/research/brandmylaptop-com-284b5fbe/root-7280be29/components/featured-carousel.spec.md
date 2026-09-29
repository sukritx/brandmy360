# FeaturedCarousel Specification

**Source markup:** `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/sections-html/01-y633.html`
**Card data:** `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/cards-full.json` (first 5 entries = the 5 featured cards, in order)
**Screenshots:** `.../sections-desktop/01-y633-h559.png`, `.../featured-after-next.png`
**Target file:** `src/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/FeaturedCarousel.tsx`
**Interaction model:** click-driven carousel with scroll-snap track + prev/next buttons

## Section

- Wrapper `<section>` is **dark**: `bg-ink text-white` (confirm classes in source; the section is `mt-*` banded and the inner container is `mx-auto max-w-5xl px-6`).
- Heading row: "Featured now" (white, `text-2xl font-semibold`-ish) + subtitle in `text-white/60`, with prev/next buttons at the right.
- Prev/next: `rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:text-white`, icon `ChevronLeftIcon`/`ChevronRightIcon` at `h-4 w-4`. Disabled state = `opacity-*`/`disabled` per source.
- Entry animations: section `animate-featured`, each card `animate-featured-card` (both defined in `globals.css`).

## Track

- `ul` (or div) with: `flex gap-4 overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar scroll-px-6` (copy exact classes from source).
- Children: `li.snap-start shrink-0 w-[...]` — card width from source (e.g. `w-[85vw] sm:w-[420px]`).
- Prev/next behaviour: scroll by one card width using `scrollBy({ left: ±cardWidth, behavior: "smooth" })`; disable prev at start and next at end (track `scrollLeft` on scroll events).
- The track must not show scrollbars (`no-scrollbar` class exists in globals.css).

## Card anatomy (per card)

```
li (snap-start, entry animation)
  article/div.rounded-2xl.border.border-white/10.bg-white/[0.04] (dark card) → verify in source
    div.relative.aspect-[1.44].w-full.overflow-hidden.rounded-xl ← lid area
      <LidPreview lid={card.lid} variant={dark?} />
      badge (absolute top-right): AUCTION / SOLD stamp
    div ← title (white, font-medium, line-clamp)
    div ← avatar + name + followers + social icons (LicensedIcon set)
    div ← price row: raised `text-green`, goal `text-white/50`
    div ← tags row (small pills/links)
```

- Use `<LidPreview>` from `@/components/sites/brandmylaptop-com-284b5fbe/shared/LidPreview` — do NOT re-implement the lid.
- Stamps: `.auction-stamp` / `.sold-stamp` classes (already in globals.css). Stamp text verbatim from data (`stamp` field), e.g. `AUCTION · ENDS IN 23H 30M`. Rotate per source (`-rotate-*`).
- Card #1 has a **dark lid** (`isDarkLid(card.lid)` → `variant="dark"`); others light.
- The 5th visible card in the source is a "sponsor preview" card variant (`.sponsor-preview`) — copy its markup from the source HTML exactly (it is the last `li`).

## Per-card content (verbatim, from cards-full.json, same order)

1. "👀 Your Brand With Me: 450K+ Followers, Keynotes, Workshops, Embassies 🇪🇺" — author Marc Berthold · ~455k — `$0 of $4,914` — `10/10 left` — dark lid
2. "Digby+Fox is taking 11 brands into every room for the next 12 months." — Gary Digby — `$527 of $3,250` — `7/10 left`
3. "Sponsor EVERY second I use my laptop …" (full text in JSON) — `$0 …` — see JSON
4. see JSON
5. see JSON

Use the exact strings from `cards-full.json`; use the `lid` object for the sticker layout and `avatar` mapped to its local path.

## Assets

Local paths come from `_asset-manifest.json`. The lid sticker images already resolve to `/sites/brandmylaptop-com-284b5fbe/shared/logos/*`.

## Responsive

- Desktop: 3 cards visible (~420px each) in a 1152px container.
- Tablet/mobile: `w-[85vw]`-style cards, one to two visible; prev/next buttons remain functional.

## Rules

- `npx tsc --noEmit` must pass. No `any`.
- Copy classes verbatim from the source HTML section file.
