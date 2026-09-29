# ListingDetails + ListingSpots + OtherLaptops Specification (brandmylaptop.com/giulia)

**Source markup (verbatim, one file per section):**
- Details → `docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html/18-y1199.html`
- Spots table → `.../19-y2126.html`
- Other laptops → `.../20-y3150.html`
**Screenshots:** `docs/design-references/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-desktop/18-*.png`, `19-*.png`, `20-*.png`
**Target files:**
- `src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/ListingDetails.tsx`
- `src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/ListingSpots.tsx`
- `src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/OtherLaptops.tsx`
**Data:** `.../giulia-96b78fb0/data.ts` (`listingSpots`, `listingOtherLaptops`, `listingAuthor`)
**Interaction model:** static (hover states only)

## 1. ListingDetails (section h=903)

- `<section id="details" className="scroll-mt-20 py-16 md:py-20">` > `div.mx-auto.max-w-4xl.px-6`
- `<h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">The details.</h2>`
- Grid `div.mt-8.grid.grid-cols-1.gap-4.md:grid-cols-2` with 4 cards. Card shell: `div.min-w-0.rounded-2xl.border.border-hairline.bg-white.p-6`; every card starts with `<h3 className="text-[15px] font-medium">`.

**Card A — "Who you are buying from"** (exact markup in 18-*.html):
- `div.mt-4.flex.items-start.gap-3` → avatar `img.h-12.w-12.shrink-0.rounded-full.object-cover` (giulia) + `div.min-w-0`:
  - `p.truncate.text-[15px].font-medium` → `giulia`
  - `p.mt-0.5.truncate.text-[13px].text-ink-2` → link `@giutheginger` (`text-blue hover:underline`) + `· 13.3k followers`
  - `ul.mt-2.5.flex.flex-wrap.items-center.gap-1.5` of social chips: `a.inline-flex.items-center.gap-1.5.rounded-full.border.border-hairline.py-1.pl-1.5.pr-2.5.text-[12px].transition-colors.hover:border-ink/30` containing the platform icon (`h-3.5 w-3.5`: X `#000000`, LinkedIn `#0A66C2`, Instagram `#E4405F` from `shared/icons.tsx`) + label (`Read from X`, `LinkedIn`, `Instagram`) — labels verbatim from source.
  - then `p` with `22K followers on LinkedIn and 20K on Instagram!`, a chip `LinkedIn Content`, and a verified row `Verified with X` with its icon — copy exactly from the source HTML.
- **All link hrefs verbatim from the source.**

**Card B — "Where your brand gets seen"**: list of chips (verbatim): `Build in public — posts and videos`, `Coworking spaces and cafés`, `Conferences and meetups`, `Business travel`, `Client and investor meetings`. Chip style: `inline-flex w-fit rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium` (verify in source).

**Card C — "What a spot gets you"**: rows `div.flex.justify-between.gap-4` (last row `border-t border-hairline pt-2.5`) inside `div.mt-4.grid.grid-cols-1.gap-4.md:grid-cols-2`:
- `4 spots` / `5.1 × 5.1 cm` / `from 210 €`
- `3 spots` / `10.8 × 4.6 cm` / `from 336 €`
- `3 spots` / `10.8 × 6.3 cm` / `from 672 €`
- `Stays on for` / `24 months` / `from purchase`
- `Listing closed` / `19 September 2026`
- Footnote `p.mt-4.text-[12px].leading-relaxed.text-ink-2` → `Printed as die-cut vinyl at the size shown, plus a listing on this page with a link to your site. The seller puts it on and photographs the lid once the machine has been bought and delivered.`

**Card D — "The machine"**: `dl.mt-4.space-y-2.5.text-[14px]` with 4 rows `div.flex.justify-between.gap-4` (`dt.text-ink-2`, `dd.text-right.font-medium`):
- `Laptop` / `Mac · 16″ lid`
- `Model` / `MacBook 16", Silver`
- `Owned by the seller` / `Being funded by these sales`
- `What it costs` / `4 200 €` (`tabular-nums`)

## 2. ListingSpots (section h=1000)

- `<section id="spots" className="mx-4 mt-4 scroll-mt-20 rounded-3xl bg-surface py-16 sm:mx-6 sm:mt-6 md:py-24 lg:mx-8">` > `div.mx-auto.max-w-4xl.px-6`
- `<h2 className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">The spots.</h2>`
- `p.mt-3.max-w-[60ch].text-ink-2` → `This listing has closed. What sold stays on the lid for 24 months.`
- Table wrapper: `div.mt-8.overflow-hidden.rounded-2xl.border.border-hairline.bg-white` > `table.w-full.text-left.text-[14px]` (check exact classes in source).
- `<thead>`: `tr.border-b.border-hairline` with `th.px-3.py-3.5.font-medium.sm:px-5`: `Spot`, `Size` (`hidden sm:table-cell`), `Taken by`, `Price` (`text-right`), and `Action` (`sr-only`).
- `<tbody>`: one `tr.border-b.border-hairline.last:border-0` per spot from `listingSpots` (10 rows), each:
  - cell 1 `td.px-3.py-4.sm:px-5`: `span.mr-3.inline-flex.h-7.w-7.items-center.justify-center.rounded-lg.bg-hairline/80.text-[12px].font-semibold.tabular-nums.text-ink-2` → number, then `span.font-medium` → spot name.
  - cell 2: `span.mr-2.inline-flex.h-5.w-5.items-center.justify-center.rounded-md.bg-hairline/80.text-[11px].font-bold.text-ink-2` → size letter; then `span.text-[12px].text-ink-2` → dims.
  - cell 3: logo link `a.group/link.inline-flex.min-w-0.items-center.gap-2.5.hover:text-blue` → `span.flex.h-6.shrink-0.items-center.overflow-visible` > `img.max-h-9.w-auto.max-w-24.object-contain` (spot logo, `alt` = brand name).
  - cell 4 `td.px-3.py-4.text-right.sm:px-5`: `span.tabular-nums.text-ink-2.line-through` → `672 €` (**struck through** because the listing closed).
  - cell 5 `td.px-3.py-4.text-right.sm:px-5`: `span.shrink-0.rounded-full.px-4.py-1.5.text-[13px].font-medium.bg-hairline/60.text-ink-2` → `Sold`.
- Prices shown here are EUR (`{price} €` with a non-breaking space), NOT routed through the currency context.

## 3. OtherLaptops (section h=449)

- `<section className="mx-4 mt-4 scroll-mt-20 rounded-3xl py-16 sm:mx-6 sm:mt-6 md:py-20 lg:mx-8 bg-surface" aria-labelledby="other-lids">` > `div.mx-auto.max-w-4xl.px-6`
- `<h2 id="other-lids" className="text-3xl font-semibold tracking-[-0.015em] md:text-4xl">Other laptops looking for brands.</h2>`
- `p.mt-3.max-w-[60ch].text-ink-2` → `This one has closed, but these are still taking brands.`
- `ul.mt-8.grid.grid-cols-1.gap-4.sm:grid-cols-3` with one `li` per `listingOtherLaptops` entry (3):
  ```
  <a className="flex h-full flex-col rounded-2xl border border-hairline bg-white p-5 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]" href={item.href}>
    <span className="flex items-center gap-2.5">
      <img className="h-9 w-9 shrink-0 rounded-full object-cover" src={item.avatar} alt="" />
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-medium">{item.name}</span>
        {item.sub && <span className="block truncate text-[12px] text-ink-2">{item.sub}</span>}
      </span>
    </span>
    <span className="mt-3 inline-flex w-fit rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium">{item.role}</span>
    <span className="mt-2 block text-[12px] leading-relaxed text-ink-2">{item.seen}</span>
    <span className="mt-auto flex items-baseline justify-between gap-2 pt-4 text-[12px] text-ink-2">
      <span className="whitespace-nowrap">{item.spotsLeft}</span>
      <span className="whitespace-nowrap font-medium text-ink">{fromLabel}</span>
    </span>
  </a>
  ```
  where `fromLabel` = `from ${amount} €` for EUR items and `from £${amount}` for the GBP item (see `fromCurrency` in the data — Gary Digby is `GBP`, verbatim from the live page).
- Hover: card shadow `0 4px 16px rgba(0,0,0,0.08)`.

## Responsive

- All three sections: content `max-w-4xl px-6`; cards stack to 1 column below `md` (details) / `sm` (others 3-col → 1-col).
- Table `Size` column hidden below `sm`.
- Section shells keep `mx-4 sm:mx-6 lg:mx-8` rounded bands.

## Rules

- Copy classes verbatim from the section HTML files; plain `<img>` with an eslint-disable comment.
- No currency-context conversion anywhere on this page (prices are EUR as on the live listing).
- `npx tsc --noEmit` must pass; no `any`.
