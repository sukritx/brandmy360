# /brands page Specification

**Source markup:** `docs/research/brandmylaptop-com-284b5fbe/brands-b0addea9/sections-html/*.html`
(01-y145 hero, 03-y343 CTA cards, 04-y566 stats, 06-y756 logo wall, 07-y1193 compare, 09-y1581 what-a-spot, 10-y1958 newsletter, 11-y2294 brands list)
**Data:** `docs/research/brandmylaptop-com-284b5fbe/brands-b0addea9/brands-list.json` (39 rows) and `.../logo-wall.json` (24 logos) — normalized exports `brandsList`, `logoWall` in `src/components/sites/brandmylaptop-com-284b5fbe/shared/data.ts`
**Screenshots:** `docs/design-references/brandmylaptop-com-284b5fbe/brands-b0addea9/sections-desktop/*.png`
**Target:** `src/app/brands/page.tsx` + components in `src/components/sites/brandmylaptop-com-284b5fbe/brands-b0addea9/`
**Interaction model:** mostly static; brand list is a click-driven list (filters/hover), newsletter static form

## Page shell

`<Nav />` + `<SponsorRail side="left" />` + `<SponsorRail side="right" />` then
`<main class="mx-auto max-w-5xl px-6 pb-24 pt-14">` … then shared `<Footer />`.
Wrap this page in `<CurrencyProvider>` (client) because prices use `<Money />`.

## Sections (copy classes verbatim from the source files)

1. **Hero** — h1 `Get your logo on creators' laptops.` (`text-[clamp(...)] font-semibold tracking-[-0.02em]`), sub paragraph. Static.
2. **CTA cards** — 2 cards side by side (`sm:grid-cols-2`):
   - "Let creators come to you" + body + `Post a brief` → `/briefs`
   - "Or pick a creator yourself" + body + `Browse the laptops` → `/`
   Cards: `rounded-2xl border border-hairline bg-white p-6` + hover per source.
3. **Stats cards ×3** — `Brands on laptops 40`, `Paid to creators $13,794`, `A spot from $26` (exact markup/labels in `04-y566.html`). Money via `<Money />`.
4. **Already on a lid** — heading + grid of logo cards. Grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`-ish per source; each card `flex aspect-[...] items-center justify-center rounded-2xl border border-hairline bg-white` with the brand logo (`object-contain`, max sizes per source). 24 logos from `logoWall`.
5. **How it compares** — card with 3 columns: `Months` / `Every time it opens` / `In the room`; copy exact text.
6. **What a spot is** — 2×2 bordered grid of definition cells (exact copy from `09-y1581.html`).
7. **Newsletter** — email-only variant of the newsletter card (heading + input + `Send me the numbers` button). Copy exact.
8. **Brands advertising here** (big one) — the list of 39 brands:
   - Each row `li`: logo tile (`h-*` `rounded-xl` `border`), name (`font-medium`), meta line (`2 placements · 6d ago`, `text-[13px] text-ink-2`), price (`text-green` `tabular-nums` or `text-ink`), and a `sponsor` badge for the 3 sponsored brands (TinyLaunch, RankControl, Azal.ai).
   - Row container: `rounded-2xl border border-hairline bg-white` with hover (`hover:border-ink/30` per source) — copy exact.
   - Data from `brandsList` in `data.ts` (`name`, `meta`, `amount`, `sponsor`, `logo`).
   - Keep any filter chips present in the source markup for this section (check `11-y2294.html`).

## Responsive

- Cards stack on mobile (`grid-cols-1`), 2–3 columns at `sm`/`lg`. List stays single column.
- Rails only render visually ≥1280px (body padding handles it) — no extra work needed.

## Rules

- Copy classes verbatim from source HTML; map every remote image to its local path via `_asset-manifest.json`.
- `npx tsc --noEmit` must pass; no `any`. Plain `<img>` preferred (with eslint-disable comment).
