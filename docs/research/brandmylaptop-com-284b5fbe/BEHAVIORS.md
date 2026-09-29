# BEHAVIORS.md — brandmylaptop.com

Interaction model findings from the mandatory interaction sweep (scroll, click, hover, responsive) on all 5 pages.

## Global

- **Smooth scroll:** `html { scroll-behavior: smooth }` — native, no Lenis/Locomotive.
- **Body layout:** `body { display:flex; flex-direction:column; overflow-x: clip }`, `footer { margin-top:auto }`, `body > :not([data-overlay]) { width: stretch; flex-shrink: 0 }`.
- **Sponsor rails:** `body.has-ads` gets `padding-inline: 218px` at ≥1280px and ≥637px height; `230px` at ≥1536px; `270px` at ≥1800px. Rails are `position: fixed`, `top-20 bottom-4`, `z-30`, `data-overlay` (excluded from the body flex rule), `animate-rail-in` on load.
- **Currency:** `<select>` changes all displayed money. Persisted in `localStorage` key `bml.currency`. Measured: USD→EUR ≈ ×0.8547 (`11 790 €`, symbol after value, nbsp), USD→GBP ≈ ×0.7436 (`£10,257`). Default USD.
- **Selection color:** `::selection { background: #0071e32e }`.
- **Reduced motion:** all animations/transitions collapse to 0.01ms; smooth scroll off.
- **Focus:** `focus-visible` outlines per component (e.g. `focus-visible:outline-2 focus-visible:outline-offset-4`).

## Nav (all pages except /sell)

- `position: sticky; top: 0; z-50`, `border-b border-hairline/70`, `bg-white/70 backdrop-blur-xl`, row height 52px (`h-13`), inner `max-w-6xl px-6`.
- No scroll-triggered appearance change (stays identical at all scroll positions).
- Hover: nav links `text-ink-2 → text-ink` (`transition-colors`); "Sell your lid" pill `hover:opacity-85`.
- Mobile (<768px): hamburger toggles a collapsible panel `#mobile-menu` (`md:hidden`), closed by default. Panel: 5 stacked links (`border-b border-hairline/50 py-3.5`) + a "Currency" row with the same select. `aria-expanded` on the button flips.
- Currency select is hidden on mobile in the nav bar (`hidden md:block`), shown in the panel instead.

## /sell header

Different: not sticky, is a centered logo row (`h-[61px]`), no nav links, no currency in header (currency select sits inline with the H1 row instead).

## Sponsor rails

- Left rail: 3 sponsor cards (Azal.ai → x.com/ProjectAzal, RankControl → rctrl.com, TinyLaunch → tinylaunch.com) then placeholder slots `L4`,`L5`,`L6`.
- Right rail: 6 placeholders `R1`–`R6`.
- Items share available height equally (`flex-1 basis-0`), `gap-3`, width 190px (230px ≥1800px).
- Card hover: sponsor cards `hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]`; placeholders `hover:border-blue hover:text-blue`.
- `.sponsor-preview` height rule: `calc(16.6667vh - 30.0833px)`; at viewport height ≤804px it gets `gap:4px; padding-block:8px`, logo `max-width:80%; max-height:min(46px,46%)`, name `-webkit-line-clamp:1`, tagline `display:none`.
- Rails render **only** at `(min-width:1280px) and (min-height:637px)` — below that they are hidden and the body class switches from `has-ad-rails` to `has-ad-bar`.

## Mobile sponsor bar (<1280px width OR <637px height)

- `<aside aria-label="Sponsors" data-overlay style="bottom:0; padding-bottom:env(safe-area-inset-bottom)">`
  `pointer-events-none fixed inset-x-0 z-[55] animate-rail-in border-t border-hairline bg-white backdrop-blur-sm`, height 57px.
- Inner: horizontally scrollable strip (`overflow-x-auto overscroll-x-contain`, scrollbar hidden) containing a `div.flex.w-max` with **two** identical `ul`s (the second `aria-hidden="true"`); 12 items each: placeholder `L1`, RankControl, TinyLaunch, then placeholders `L4 L5 L6 R1 R2 R3 R4 R5 R6`.
- Sponsor item: `h-[44px] w-[168px] flex-row gap-2 rounded-xl border border-hairline bg-white px-2.5`, logo `h-7 w-7`, name `text-[12px]`, tagline `text-[10px] text-ink-2`.
- Placeholder item: same box with `border-dashed`, megaphone icon `h-4 w-4`, label `Your startup here` (`text-[12px]`).
- Body gets `has-ad-bar` → `padding-bottom: 3.5rem` (56px), included in the measured mobile page heights.
- The strip does **not** auto-scroll (no marquee animation); it is manually scrollable.

## Home —

### Hero
- Static. Stat line has a pulsing green dot: inner span `bg-apple-green` (2×2 rounded-full) inside a relative wrapper.
- Buttons: "I'm a brand" (dark pill) → /brands, "I'm a creator" (light bordered pill) → /sell, "Or browse the laptops." link → /#laptops.
- Latest activity: a horizontal auto-scrolling **marquee** — `animate-marquee` = `32s linear infinite marquee`, keyframes `0% translate(0) → 100% translate(-50%)`; content duplicated so the loop is seamless. Pauses? No — continuous. Links inside are clickable.

### Featured now (dark carousel)
- Section is dark (`bg-ink`), heading white, with prev/next buttons and a horizontal snap track: `overflow-x-auto`, `snap-x snap-mandatory`, children `snap-start`, `overscroll-x-contain`, `no-scrollbar` (scrollbar hidden).
- Prev/next buttons (`ChevronLeft/RightIcon`, `h-4 w-4`, `rounded-full border-white/20 text-white/80 hover:border-white/50 hover:text-white`) call `scrollBy` by card width. First/last have disabled states.
- Cards are `li` with laptop lids, one is dark-lid (`.lid-dark-*`) or has an AUCTION stamp (`.auction-stamp`).
- Entry animation: section `animate-featured` (0.45s cubic-bezier(.16,1,.3,1) both), cards `animate-featured-card` (0.4s).
- "closing-soon" badge pulses: `animation: 2s ease-in-out infinite badge-pulse` (scale 1 → .96 → 1).
- Auction badge = `.auction-stamp` (blue gradient); sold badge = `.sold-stamp` (orange/red gradient); both `rotate`-ed in markup.

### Laptops grid (`#laptops`, id anchor; `scroll-mt-20`)
- Section wrapper: `mx-4 mt-4 rounded-3xl bg-surface pb-16 pt-8 sm:mx-6 sm:mt-6 md:pb-24 md:pt-10 lg:mx-8`; inner `mx-auto max-w-5xl px-6`.
- Header: live green dot + "166 laptops looking for brands" + filter bar (`sm:flex`, hidden on mobile behind a "Filters" button).
- **Filter dropdowns (click-driven):** pills `rounded-full border px-3 py-1.5 text-[13px]`; active state `border-blue bg-blue/[0.06] text-blue`, inactive `border-hairline bg-white text-ink-2 hover:border-ink/30 hover:text-ink`. Each opens an absolutely-positioned panel (`aria-expanded`).
  - "Most raised" options: Most raised, Most viewed, Most followers, Ending soon.
  - Other filters: Seen at (6 options), Ownership (3), How you buy (3), Who they are (13).
- **Pagination:** button "Show 48 more of 172" loads 48 more cards (24 → 73 rendered in test). Not infinite scroll.
- Cards: `li.min-w-0` on load animate in with `opacity:1; transform:none` (the element had inline `style="opacity: 1; transform: none;"` — entry is a fade/translate on mount).
- Card structure: `a.relative.flex.h-full.flex-col.rounded-2xl.border.bg-white` → lid area `div.relative.aspect-[1.44].w-full.overflow-hidden.rounded-xl.bg-surface` + info rows + price row + optional stamp `absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2`.
- Hover: card border darkens / shadow (see spec file for exact).

### Just sold
- Heading + rows list; rows reveal on mount (`opacity/transform` inline styles present).

### Newsletter card
- Card on `bg-surface`, email + X handle inputs, "Send me the weekly" button. Static form.

### Dark CTA ("Everyone stares at laptop lids…")
- `bg-ink` full-bleed band with big white text + CTA pill + a large `ChevronDownLargeIcon` (`h-8 w-8`) scroll affordance.

### Laptops fully branded (showcase)
- 3 laptop lids with real brand stickers (`sm:grid-cols-2`), each links out (brandmymac.com etc.), heading + `$18,886 of ad space bought by brands, across 3 laptops.`

### How it works (`#how`)
- 3 numbered steps, static.

### FAQ (`#faq`)
- **Click-driven accordion.** Buttons toggle an answer; first item open on load. Answered content extracted in `faq-answers.json`.

## /brands

- Hero H1 `text-[clamp(...)]`. Two CTA cards → /briefs and /.
- Stats row: 3 cards (Brands on laptops 40, Paid to creators $13,794, A spot from $26).
- "Already on a lid" logo wall (24 logos).
- "How it compares" 3-column card.
- "What a spot is" 2×2 bordered grid.
- Brands list (39 rows, `li` per brand, hover changes row background), each row: logo, name, meta ("N placements · Nd ago"), price, optional `sponsor` badge.
- Newsletter (email only).

## /briefs

- Form page. Audience pills are multi-select `aria-pressed` buttons (max 4 selected). Budget input in €. "Post the brief" submits.

## /stats

- Read-only dashboard. Stat cards, bar rows ("Paid to creators": $3,806 Aug 26 → $13,794 Sept 26), "Does a bigger following bring more visitors?" 4 bar rows, "The board" 4 cards, "The 40 brands that have bought" 2-col grid, price analysis ($187 middle / $370 bottom), "Browse by who carries it" pills, laptop grid slice.
- Bars are plain divs with explicit `width:%`; no JS needed.

## /sell (wizard)

- Header: centered logo only.
- H1 "Put your lid up." + `$19` publishing note + currency select in the H1 row + "Sign in to manage it." link.
- Stripe modal on load: `div.fixed inset-0 z-[60]` with title "You will need a Stripe account to be paid.", body copy, buttons "Got it" and "Not available in my country". Backdrop dismissible.
- **9-step wizard**, click-driven, steps gated (future steps are `disabled` pills until reached):
  1. Machine — "What are you selling space on?" A Mac / A PC (`aria-pressed`); screen size pills 13/14/15/16"; colour pills (Silver, Sky Blue, Starlight, Midnight, Space Black, Space Grey).
  2. Ownership — chips/options for ownership + terms (Stickers stay 12 months etc.).
  3. Showcase — "Where will it be seen?" dropdown (required), "And who are you?" multi-select (optional, up to three), "Where do you post?" social inputs (x.com/, linkedin.com/in/…). Continue disabled until the required dropdown is answered (alert: "Pick where people will see it…").
  4. Layout — choose a layout preset (visual preview updates).
  5. Prices — "The money": optional raise target (€100–20000), then **"How do brands buy?"** Fixed prices / Auction (`aria-pressed` chooser). Alert: "Pick how brands buy: fixed prices, or an auction."
  6. Listing — title/description inputs.
  7. Sticker — sticker printing options.
  8. You — "Who is selling?" A person / A business; **Country of residence** dropdown (required; alert "Say which country you are a tax resident of.").
  9. Publish — final review + publish action.
- Every step shows a live right-hand preview: the laptop lid (light/dark per colour choice) with spot price cells (`395 €` etc.) arranged in the 10-slot grid, plus a summary table: MONEY "If it all sells" `2460 €`, TERMS (Brands buy —, Stickers stay 12 months), SPOTS (Count 10, Lowest `125 €`).
- Step transitions: content wrapper animates in with `style="opacity: 1; transform: none;"` (fade/slide-in on step change); each step's footer is `sticky bottom-0 z-20` with `border-t border-hairline/40 bg-background/90 py-4 backdrop-blur-sm`, "Back" ghost pill + "Continue" blue pill (disabled at `opacity-60`), and a `role="alert"` amber message (`text-amber-deep`) when validation fails.
- Sell page prices are shown in **EUR** (the wizard's own currency) regardless of the nav display currency.
- Mobile: the wizard grid collapses to one column (`md:grid-cols-[1fr_minmax(0,1.1fr)]`) and the preview moves below.

## /giulia (single-laptop listing, closed)

- **Header hero**: static apart from two interactive pieces.
- **Spot cells (10)**: each is a link to the brand (`target="_blank" rel="noopener noreferrer sponsored"`). Hover/focus-within blurs the logo+price (`blur(3px)`, 200ms) and fades in a white `Visit ↗` pill (`opacity 0→1`, 200ms); the pill layer is `hidden … [@media(hover:hover)]:flex` so touch devices never get it. Cell hover also darkens its dashed border (`border-black/25 → black/45`) and background (`black/[0.02] → black/[0.05]`).
- **`For sale` / `Final look` toggle** (`role="group" aria-label="Lid view"`): click switches the active pill via `aria-pressed`; active = `bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.14)] ring-1 ring-black/10`, inactive = `text-ink-2 hover:text-ink`. On this closed listing the lid visual does not change.
- **Funding progress**: `role="progressbar" aria-valuenow="100"`, bar `h-2 rounded-full bg-apple-green` at `width: 100%`; track `bg-hairline/60 ring-1 ring-inset ring-black/[0.06]`.
- **Share button** sits absolutely above the lid (`right-0 top-0 -translate-y-[calc(100%+0.5rem)]`), no backend action.
- **Spots section**: desktop `<table>` (`hidden … sm:block`) with struck-through EUR prices and `Sold` badges; below `sm` a card list (`ul.mt-8.space-y-3.sm:hidden`) with the same data, prices not struck through. Both markup trees ship; CSS decides which shows.
- **Other laptops**: 3 cards, hover shadow `0 4px 16px rgba(0,0,0,0.08)`; Gary Digby's price is GBP (`from £200`) — the live listing's own currency, not a conversion.
- Page prices are EUR/USD-verbatim from the live listing; they are NOT routed through the site currency selector.

## Responsive breakpoints (measured)

- `sm` 640px: grid/card layouts gain columns; nav keeps links hidden.
- `md` 768px: nav links + currency appear, hamburger disappears; two-column layouts start; `md:grid-cols-[1fr_minmax(0,1.1fr)]` wizard.
- `lg` 1024px: grid `lg:grid-cols-3`, section margins widen (`lg:mx-8`).
- 1280px+: body `padding-inline: 218px` (rails visible from ≥1280px width AND ≥637px height).
- 1536px `2xl`: rail offset `left-5/right-5`; 1800px: `padding-inline: 270px`, rail width 230px.
