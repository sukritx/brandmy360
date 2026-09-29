# /stats page Specification

**Source markup:** `docs/research/brandmylaptop-com-284b5fbe/stats-d8625d36/sections-html/*.html`
(01 heading, 03 stat cards, 04 paid chart, 05 the board, 06 following chart, 07 brands that bought, 08 price analysis, 09 conclusion, 10 browse by, 11 grid slice)
**Screenshots:** `docs/design-references/brandmylaptop-com-284b5fbe/stats-d8625d36/sections-desktop/*.png`
**Target:** `src/app/stats/page.tsx` + components in `src/components/sites/brandmylaptop-com-284b5fbe/stats-d8625d36/`
**Interaction model:** static (bars are divs with widths; pills are links)

## Page shell

`<Nav />` + rails + `<main class="mx-auto max-w-5xl px-6 pb-24 pt-14">` + `<Footer />`, wrapped in `<CurrencyProvider>`.

## Sections

1. H1 `Everything this market has done.` + sub copy (exact strings in source).
2. **Stat cards ×4**: `Paid to creators $13,794` / `Combined following 11.9M` / `Laptops taking brands 166` / `Visits to the site 42,433` (exact labels/sub-labels from `03-y286.html`). Money via `<Money />`.
3. **Paid to creators chart**: 2 vertical bars — `$3,806 Aug 26`, `$13,794 Sept 26` (`bg-apple-green`/`bg-green` bars, `rounded-t-*`, explicit heights from source). Axis labels below. Copy exact markup/classes.
4. **The board**: 4 stat cards (exact labels/values in `05-y903.html`).
5. **Does a bigger following bring more visitors?**: 4 horizontal rows; each row = label + horizontal bar (`h-*` with `width:%`) + two numbers (visitors, following). Widths must be copied from the source inline styles.
6. **The 40 brands that have bought**: 2-column grid of brand cards (logo + name + meta + amount). Use `brandsList` from `data.ts` (39 entries) — same row anatomy as the /brands list but in a grid, per source markup.
7. **Price analysis**: rows for `Top`, `Middle $187`, `Bottom $370` with bar/row markup; conclusion line `A spot on the top row goes for about 4 times one in the middle.` (exact).
8. **Conclusion line** (09): big statement text (exact).
9. **Browse by who carries it**: pill links row (exact labels/hrefs from `10-y4265.html`).
10. **Laptop grid slice** (11): a few laptop cards (`LaptopCard` from `root-7280be29` may be imported if the markup matches; otherwise render per source). Prefer reusing `src/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/LaptopCard.tsx` if its props match the data; do not modify that file — if a change is needed, build a local variant.

## Notes

- All numbers are literal strings from the source (no computation).
- Bars: copy the exact `style="width: ...%"` / height classes.
- Money values rendered with `<Money />` where they are prices/amounts; raw counts (11.9M, 166, 42,433) stay plain text.

## Responsive

- Stat cards: 2 columns on mobile, 4 on desktop (per source).
- Charts stay full width; label/value rows wrap.

## Rules

- Copy classes verbatim; `npx tsc --noEmit` must pass; no `any`.
