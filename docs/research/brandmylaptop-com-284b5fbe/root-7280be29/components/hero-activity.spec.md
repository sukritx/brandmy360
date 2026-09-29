# HeroSection + LatestActivity Specification

**Source of truth markup (verbatim, extracted from live DOM):** `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/sections-html/00-y53.html`
**Screenshot:** `docs/design-references/brandmylaptop-com-284b5fbe/root-7280be29/sections-desktop/00-y53-h580.png`
**Target files:** `src/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/HeroSection.tsx`, `src/components/sites/brandmylaptop-com-284b5fbe/root-7280be29/LatestActivity.tsx`
**Interaction model:** static section + one continuous CSS marquee (Latest activity)

## DOM structure (top → bottom)

```
<section class="relative overflow-hidden">            ← hero
  <div class="mx-auto max-w-5xl px-6 pt-14 pb-10 md:pt-20 md:pb-14">   ← verify exact classes in source
    <p>  ← live stats line: green pulsing dot + "$13,794 of ad space sold · 42,407 visits"
    <h1> ← "The marketplace for ads on laptops."
    <p>  ← sub copy (if present in source)
    <div> ← CTA row: "I'm a brand" | "I'm a creator"
    <p/a> ← "Or browse the laptops."
  </div>
  <div>  ← Latest activity strip (marquee)
</section>
```

## Exact copy (verbatim)

- Stats line: `$13,794` of ad space sold `·` `42,407` visits — the numbers are separate spans; middle dot separator with `aria-hidden` dot span in the live DOM.
- H1: `The marketplace for ads on laptops.`
- Buttons: `I'm a brand` → `/brands`; `I'm a creator` → `/sell`.
- Link: `Or browse the laptops.` → `/#laptops`.
- Latest activity heading (if in source): see section HTML.

## Computed styles (measured at 1440px)

- H1: `font-size: clamp(2.25rem, 6vw, 4rem)` — **read the exact class from source HTML** (`text-[clamp(...)]`). `font-weight: 600`, `letter-spacing: -0.02em`, `line-height: 1.05`, `color: var(--ink)`, `text-wrap: balance`.
- Stats line: `text-[15px] text-ink-2` (verify in source), numbers `font-semibold text-ink`.
- Green dot: outer `span.relative.flex.h-2.w-2.shrink-0`, inner `span.relative.inline-flex.h-2.w-2.rounded-full.bg-apple-green`.
- Primary button ("I'm a brand"): `rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85`.
- Secondary button ("I'm a creator"): `rounded-full border border-hairline bg-white px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:border-ink/40`.
- Section container: `mx-auto max-w-5xl px-6` with vertical padding from source (`pt-14 pb-10 md:pt-20 md:pb-14`-ish).

## LatestActivity (marquee)

- Wrapper: `border-y border-hairline bg-white` (verify in source), inner `.no-scrollbar` overflow-hidden row.
- Track: `flex w-max animate-marquee` with the item list rendered **twice** (duplicate set) so `translate(-50%)` loops seamlessly.
- Animation: `@keyframes marquee { 0% { transform: translate(0) } to { transform: translate(-50%) } }`, `animation: 32s linear infinite`.
- Each item: small row with avatar (`h-5 w-5 rounded-full object-cover`), text like `RankControl took a spot on …`, and a time (`2d ago`), separator dot between items. Extract exact item markup from the section HTML.
- Item text must be static strings from the source; the marquee duplicates them for the loop.

## Assets

- Avatars/logos: use local paths `/sites/brandmylaptop-com-284b5fbe/shared/avatars/...` and `.../shared/logos/...` — map each remote URL in the source HTML to its local path via `docs/research/brandmylaptop-com-284b5fbe/_asset-manifest.json` (key = remote URL, value = `.local`).

## Responsive

- Desktop 1440: H1 ~64px, CTA row inline.
- Tablet 768: H1 ~48px.
- Mobile 390: H1 clamps down (~36px), CTA buttons stack full-width or wrap (check `flex-col sm:flex-row` in source), activity strip keeps marquee.

## Rules

- Copy classes verbatim from the source HTML; do not invent styles.
- Use plain `<img>` with a `// eslint-disable-next-line @next/next/no-img-element` comment above it (project convention) or `next/image` — plain `<img>` is preferred for exact rendering.
- No `any` types; `npx tsc --noEmit` must pass.
