# /sell page Specification (9-step wizard)

**Source markup:** `docs/research/brandmylaptop-com-284b5fbe/sell-826541f7/wiz-1-machine.html` … `wiz-9-publish.html` (one file per step, captured live) + `stripe-modal.html`
**Screenshots:** `docs/design-references/brandmylaptop-com-284b5fbe/sell-826541f7/wiz-*.png`, `step-*.png`
**Dropdown data:** `.../sell-826541f7/wizard-dropdowns.json`
**Target:** `src/app/sell/page.tsx` + components in `src/components/sites/brandmylaptop-com-284b5fbe/sell-826541f7/`
**Interaction model:** click-driven wizard (9 steps), gated progression, live preview

## Page shell (differs from other pages)

- **No** `<Nav />`, **no rails**. Header: centered logo row — `<header class="...h-[61px]...">` containing the small laptop logo + `BrandMyLaptop` wordmark (copy exact markup/classes from any `wiz-*.html`).
- `<main class="mx-auto max-w-5xl px-5 pb-24 pt-10">` (verify in source).
- Shared `<Footer />` at the bottom.
- Wrap in `<CurrencyProvider>`.

## Head area

- H1 `Put your lid up.` (exact classes) with a currency select aligned to its right.
- Note line: `Publishing costs a one-off $19.` + link `You need a Stripe account to be paid` (opens the Stripe modal) + copy `Once it's up, post it and tag @VynseDev so I can support you!`
- Right-aligned link: `Already put a lid up? Sign in to manage it.` → `/dashboard` (per source href).

## Stripe modal (on load)

- `div.fixed.inset-0.z-[60]` with backdrop; card centered: title `You will need a Stripe account.`, body copy (exact from `stripe-modal.html`), buttons `Got it` (dismiss) and `Not available in my country` (secondary, dismiss or link per source).
- Markup: copy `stripe-modal.html` verbatim; implement as a client component with `open` state defaulting to `true` on first load (dismiss on backdrop click and `Got it`).

## Wizard shell

- Progress bar at top: a track with an inner `rounded-full bg-ink` whose `style="width: X%"` = step fraction (33.3333% at step 3 — i.e. `(stepIndex+1)/9`).
- Step nav `ol.mt-10.hidden.flex-wrap.items-center.gap-1.text-[12px].md:flex` with pills per step: visited/current = `text-ink-2 hover:text-ink`, current = `bg-ink text-white`, future = `text-hairline` + `disabled`.
- Content grid: `div.mt-6.grid.grid-cols-1.gap-8.md:mt-10.md:gap-10.md:grid-cols-[1fr_minmax(0,1.1fr)].md:items-start`.
  - Left column: `div.min-w-0.md:min-h-[46rem]` — the step form, animated in on step change (`opacity`/`transform` transition).
  - Right column: `div.min-w-0.md:sticky.md:top-10` — the **live preview**.
- Step footer (inside left column): `div.sticky.bottom-0.z-20.mt-8.flex.flex-wrap.items-center.gap-3.border-t.border-hairline/40.bg-background/90.py-4.backdrop-blur-sm` with:
  - `Back` button: `rounded-full border border-hairline px-6 py-3 text-[15px] font-medium transition-colors hover:border-ink/40`
  - `Continue` button: `rounded-full bg-blue px-7 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-hover disabled:opacity-60`
  - Validation message: `p[role=alert].text-[13px].text-amber-deep` with the exact step alert text.

## Step definitions (implement all 9)

1. **Machine** — `What are you selling space on?` two choosers (`aria-pressed`): **A Mac** ("The drawn lid wears the Apple mark, because yours does.") / **A PC** ("A bare lid. No maker's mark — it is not ours to print."). Then `How big is the screen?` pills `13" 14" 15" 16"` (selected `border-blue` ring), helper line `A large sticker prints at 9.5 × 5.5 cm on this one. Pick the nearest if yours is in between.` Then `Which colour is it?` pills with colour dots: Silver, Sky Blue, Starlight, Midnight, Space Black, Space Grey.
2. **Ownership** — copy exact fields/chips from `wiz-2-ownership.html`.
3. **Showcase** — `Where will it be seen?` (required dropdown, `Choose` placeholder), `And who are you?` (optional multi-select, `Pick up to three`), `Where do you post?` social inputs with brand icons and prefixes (`x.com/`, `linkedin.com/in/`, etc. — copy from source). Continue disabled until the required dropdown has a value; alert until then.
4. **Layout** — layout presets; copy from `wiz-4-layout.html` (choosers + preview markup).
5. **Prices** — `The money` legend; optional target input (€, min 100 max 20000, placeholder 2500) with note `A target for the bar on your page.`; then `How do brands buy?` chooser: **Fixed prices** / **Auction** (copy exact descriptions). Alert: `Pick how brands buy: fixed prices, or an auction.`
6. **Listing** — copy fields from `wiz-6-listing.html`.
7. **Sticker** — copy from `wiz-7-sticker.html`.
8. **You** — `Who is selling?` chooser **A person** / **A business**; `Country of residence` required dropdown (`Pick a country…`; alert `Say which country you are a tax resident of.`). Note under legend: `Not shown on your listing.`
9. **Publish** — final review; copy from `wiz-9-publish.html`.

Steps advance via `Continue`; `Back` goes back; step pills for reached steps are clickable (future steps disabled). State lives in a single `useState` object in the wizard client component.

## Live preview (right column)

- Laptop lid: reuse `<LidPreview />` with `variant` from the chosen colour (Silver/Sky Blue/Starlight/Space Grey → light; Midnight/Space Black → dark) and the lid's slot grid replaced by **price cells**:
  - 10 cells matching the lid grid areas (same `grid-template-columns/rows` as `LidPreview`), each cell `text-[calc(var(--lidw,100cqw)*...)]` with a dashed border and the price text (`395 €`, `495 €`, `245 €`, `195 €`, `125 €`, `145 €` pattern from step-4 screenshot).
  - When the buyer mode is Auction, cells show bid states instead (copy from source).
- Summary table below the lid: rows grouped `MONEY` (`If it all sells  2460 €`), `TERMS` (`Brands buy  —`, `Stickers stay  12 months`), `SPOTS` (`Count  10`, `Lowest  125 €`). Table styling: `rounded-2xl border border-hairline` with label column `text-[11px] uppercase tracking-wide text-ink-2`. Copy exact markup from the step files.
- **Prices in the preview are EUR and must stay EUR** (do not use the currency context here) — that matches the live site.

## Responsive

- Wizard single column below `md`, preview below the form; footer bar stays sticky.
- Header/logo centered at all widths.

## Rules

- Copy classes verbatim from the `wiz-*.html` files; keep `aria-pressed`, `aria-expanded`, `role="alert"` semantics.
- Client components: `SellWizard.tsx`, `StripeModal.tsx`; page can be a server component that renders them inside `<CurrencyProvider>`.
- `npx tsc --noEmit` must pass; no `any`.
