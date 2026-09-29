# LaptopsGrid + LaptopCard Specification

**Source markup:** `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/sections-html/02-y1216.html`
**Single card markup:** `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/grid-card-full.html`
**Card data:** `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/cards-full.json` (29 laptops with lid slots), normalized version in `src/components/sites/brandmylaptop-com-284b5fbe/shared/data.ts` → `laptops`
**Filter options:** `.../root-7280be29/filters.json`, `.../sort-behavior.json`, `.../show-more-behavior.json`
**Screenshots:** `.../sections-desktop/02-y1216-h3534.png`
**Target files:** `.../root-7280be29/LaptopsGrid.tsx` (client), `.../root-7280be29/LaptopCard.tsx` (server-safe presentational)
**Interaction model:** click-driven filters (dropdown panels) + "Show 48 more of 172" pagination

## Section wrapper

`<section id="laptops" class="mx-4 mt-4 scroll-mt-20 rounded-3xl bg-surface pb-16 pt-8 sm:mx-6 sm:mt-6 md:pb-24 md:pt-10 lg:mx-8">` → inner `div.mx-auto.max-w-5xl.px-6`.

### Header row
- `div.relative.z-40.mb-5` → row: green live dot (same construction as hero) + `span` "166 laptops looking for brands" (`text-[14px] text-ink-2`), then on `sm:hidden` a "Filters" pill (`FilterIcon h-3.5 w-3.5`).
- Filter bar: `div.mt-4.hidden.flex-wrap.items-center.gap-2.sm:flex` with 5 pills. Each pill: `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors` + chevron (`ChevronDownSmallIcon h-3 w-3`).
  - Active pill: `border-blue bg-blue/[0.06] text-blue`
  - Inactive: `border-hairline bg-white text-ink-2 hover:border-ink/30 hover:text-ink`
- Dropdown panels: absolutely positioned white cards (`rounded-xl border border-hairline bg-white shadow-...`) listing options as buttons (hover `bg-surface`). Copy panel markup from the source HTML (`filters.json` holds each panel's captured HTML).

### Filter options (verbatim)
- **Most raised** (default active): Most raised, Most viewed, Most followers, Ending soon
- **Seen at**: 6 options — read from `filters.json` (`Seen at` → opts)
- **Ownership**: 3 options — read from `filters.json`
- **How you buy**: 3 options — read from `filters.json`
- **Who they are**: 13 options — read from `filters.json`

Behaviour: clicking a pill opens its panel (only one open at a time; outside click closes). Selecting an option re-sorts/filters the rendered list **client-side** (sort by raised/viewed/followers/ending; filters narrow by matching fields present in the data). Keep the interaction faithful: pill label updates, panel closes, active pill styling moves.

### Grid
- `ul.mt-* grid gap-x-* gap-y-* sm:grid-cols-2 lg:grid-cols-3` — copy exact classes from source.
- Renders `laptops` from `data.ts`. Initial render 24 cards (or all 29 available); "Show 48 more of 172" button below appends the rest (in the clone, appending the remaining data is acceptable; keep the label text exact: `Show 48 more` + `of 172` where "of 172" is dimmed — check `show-more-behavior.json` / source).
- Cards animate in on mount with an inline `style="opacity:1; transform:none"` transition — implement as a small fade/translate-in on mount (client component) or simply render final state (acceptable; prefer the animation).

## LaptopCard anatomy (exact classes in `grid-card-full.html`)

```
li.min-w-0
  a.relative.flex.h-full.flex-col.rounded-2xl.border.bg-white  (+ hover classes from source)
    div.relative.aspect-[1.44].w-full.overflow-hidden.rounded-xl.bg-surface
      <LidPreview lid={laptop.lid} variant={isDarkLid(laptop.lid) ? "dark" : "light"} />
      optional stamp span.sold-stamp|auction-stamp (absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2)
    div.mt-4.flex.items-center.justify-between.gap-3
      p.min-w-0.font-medium  ← title (line-clamp per source)
    p.mt-1.flex.items-center.gap-1.5.truncate.text-[13px].text-ink-2
      img.h-5.w-5.shrink-0.rounded-full.object-cover  ← avatar
      span.truncate  ← author
      span.inline-flex.shrink-0.items-center.gap-1.5.whitespace-nowrap  ← "·" + followers + social icons
    p.mt-1.5.flex.h-[18px].items-center.gap-x-2.5.overflow-hidden.whitespace-nowrap  ← tags row
    div.mt-auto.flex.items-baseline.justify-between.gap-2.pt-4
      span.whitespace-nowrap.text-lg.font-semibold.tabular-nums.text-green  ← raised ($0)
        span.ml-1.5.text-[12px].font-normal.text-ink-2  ← "of $4,914" (hidden when soldOnly)
      span.shrink-0.whitespace-nowrap.text-[12px].text-ink-2  ← "10/10 left"
```

- Money must render through the shared `<Money usd={n} />` component so currency switching works. `raised`/`goal` numbers are in `data.ts`.
- Social icons: map platform strings (`x`, `linkedin`, `tiktok`, `instagram`, `youtube`, `twitch`) to the matching icon components from `shared/icons.tsx` at `h-3 w-3 shrink-0`.
- Tags row: small `text-[11px]` chips/links — copy from source markup.

## Responsive

- ≥1024px: 3 columns; 640–1023px: 2 columns; <640px: 1 column.
- Filter bar hidden below `sm`; the "Filters" pill toggles the same pills stacked (copy the mobile panel markup from source if present).

## Rules

- `LaptopsGrid` is a client component (`"use client"`), `LaptopCard` can be a child (also client if it needs handlers).
- `npx tsc --noEmit` must pass.
- Copy classes verbatim; do not approximate.
