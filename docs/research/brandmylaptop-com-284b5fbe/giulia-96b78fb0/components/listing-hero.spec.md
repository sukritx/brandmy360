# ListingHero Specification (brandmylaptop.com/giulia)

**Source markup (verbatim):** `docs/research/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-html/17-y53.html`
**Screenshot:** `docs/design-references/brandmylaptop-com-284b5fbe/giulia-96b78fb0/sections-desktop/17-y53-h1146.png` (and `desktop-1440-full.png`)
**Target file:** `src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/ListingHero.tsx`
**Data:** `src/components/sites/brandmylaptop-com-284b5fbe/giulia-96b78fb0/data.ts` (`listingTitle`, `listingViews`, `listingAuthor`, `listingMoney`, `listingSpots`)
**Interaction model:** static section + one click-driven toggle group (`For sale` / `Final look`) + per-cell hover reveal

## Section

- `<header className="mx-auto max-w-5xl px-6 pt-10 pb-16 text-center md:pt-14">` — measured height 1146px at 1440px, y=53 (under the sticky nav).
- Order (verbatim classes in the source file):
  1. Views line: `p.flex.items-center.justify-center.gap-2.text-[13px].text-ink-2` → green dot (`span.relative.flex.h-2.w-2.shrink-0` > `span.relative.inline-flex.h-2.w-2.rounded-full.bg-apple-green`) + `<strong className="font-medium tabular-nums text-ink">4,817</strong> views on this lid`.
  2. `<h1 className="sr-only">Ad space on Giulia's 16″ MacBook</h1>` (SEO title, visually hidden — keep it, the visible title is next).
  3. Title: `p.mt-2.text-[clamp(2rem,5vw,3.6rem)].font-medium.leading-[1.05].tracking-[-0.06em]` → `Want to sponsor my next season? 👀`
  4. Money block: `div.mx-auto.mt-8.max-w-[17rem].sm:max-w-sm` with
     - row `div.flex.items-baseline.justify-between`: left `span.text-xl.font-semibold.tabular-nums.text-green.sm:text-2xl` → `4 200 €` + `span.ml-1.5.text-[13px].font-normal.text-ink-2.sm:ml-2.sm:text-sm` → `sold`; right `span.text-[13px].text-ink-2.sm:text-sm` → `goal passed ·` + `<strong className="font-medium tabular-nums text-green">100%</strong>`
     - progress: `div[role=progressbar][aria-valuenow=100].mt-2.h-2.overflow-hidden.rounded-full.bg-hairline/60.ring-1.ring-inset.ring-black/[0.06]` > inner `div.h-full.rounded-full.bg-apple-green` with `style={{ width: "100%" }}`
  5. `p.mt-3.text-[12px].text-ink-2` → `This lid is no longer taking buyers.`
  6. **Lid block** `div.mx-auto.mt-7.max-w-[900px]` (measured 860px wide lid, y=416, h=625):
     - Author row `div.mb-6.flex.items-center.justify-center.gap-3`:
       avatar `img.h-11.w-11.shrink-0.rounded-full.object-cover` (`listingAuthor.avatar`), then `div.min-w-0.text-left`:
       - `p.truncate.text-[14px].font-medium.leading-tight` → `giulia ` + link `@giutheginger` (`className="font-normal text-blue hover:underline"`, href from data)
       - `p.mt-1.flex.flex-wrap.items-center.gap-x-2.gap-y-1.text-[12px].text-ink-2` → `13.3k followers` + social icon buttons (`a.flex.h-9.w-9.items-center.justify-center.rounded-full.border.border-hairline.transition-colors.hover:border-ink/30`, icons `h-3.5 w-3.5` — LinkedIn `#0A66C2`, Instagram `#E4405F` from `shared/icons.tsx`: `LinkedInIcon`, `InstagramIcon`; hrefs in `listingAuthor.socials`).
     - Share button (absolute, right of the lid): `button.pointer-events-auto.absolute.right-0.top-0.z-20.inline-flex.-translate-y-[calc(100%+0.5rem)].items-center.gap-1.rounded-full.border.border-hairline.bg-white.px-2.5.py-1.text-[11px].font-medium.text-ink-2.transition-colors.hover:text-ink` with a 16px upload SVG (`h-3.5 w-3.5`, path from source) + label `Share`. Click = no-op (no backend); keep enabled.
     - **Lid**: wrapper `div.pointer-events-none.absolute.inset-0.m-auto.flex.w-full.max-w-[860px].flex-col.justify-center` with `style={{ containerType: "inline-size" }}`; the lid body must match `shared/LidPreview`'s geometry exactly (copy the same inline background/box-shadow strings and `rounded-[calc(var(--lidw,100cqw)*0.026...)]` padding from the source), plus:
       - top-centre `brandmylaptop` sticker `img` (`/sites/brandmylaptop-com-284b5fbe/shared/stickers/brandmylaptop.png`, classes as in source)
       - the centred Apple logo `div.pointer-events-none.absolute.inset-0.z-10.flex.items-center.justify-center` > `div.w-[15.6%]` > `svg.text-[#3b3b3f]` (`AppleLogoLightIcon` path)
       - **spot grid**: `div.relative.flex-1.min-h-0.grid.gap-[calc(var(--lidw,100cqw)*0.014)].p-[calc(var(--lidw,100cqw)*0.019)]` with `gridTemplateColumns: repeat(6, minmax(0px, 1fr))`, `gridTemplateRows: minmax(0px, 1fr) minmax(0px, 0.9fr) minmax(0px, 1fr)`
     - **Spot cell** (one per `listingSpots` entry, `gridArea: spot.area`; measured 261×179 for L, 124×161 for S, ~261×? for M — the grid geometry produces these automatically):
       ```
       <div className="group relative h-full w-full">
         <a href={spot.brandHref} target="_blank" rel="noopener noreferrer sponsored"
            aria-label={`Spot ${n}, ${name}, ${dims}. Taken by ${brand}. Visit them.`}
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[calc(var(--lidw,100cqw)*0.014)] border border-dashed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue border-black/25 bg-black/[0.02] text-ink group-hover:border-black/45 group-hover:bg-black/[0.05]">
           <span className="flex h-full w-full flex-col items-center justify-end gap-1 px-1.5 py-2 transition duration-200 group-hover:blur-[3px] group-focus-within:blur-[3px]">
             <span className="relative flex min-h-0 w-full flex-1 items-center justify-center">
               <img src={spot.logo} alt="" loading="lazy" className="absolute inset-0 m-auto max-h-[70%] max-w-[88%] object-contain" />
             </span>
             <span className="shrink-0 text-[11px] font-medium tabular-nums leading-tight sm:text-[14px] text-ink-2">{price}</span>
           </span>
         </a>
         <span className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:gap-1.5 [@media(hover:hover)]:flex">
           <a href={spot.brandHref} target="_blank" rel="noopener noreferrer sponsored" aria-label={`Visit ${brand}'s site`}
              className="pointer-events-auto whitespace-nowrap rounded-full bg-white/90 px-[0.85em] py-[0.3em] text-[calc(var(--lidw,100cqw)*0.015)] font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-colors hover:bg-white">Visit ↗</a>
         </span>
       </div>
       ```
       **Hover behaviour (measured):** hovering a cell blurs the logo+price (`blur(3px)`, 200ms) and fades in the white `Visit ↗` pill (`opacity 0 → 1`, 200ms) — the pill is only rendered under `@media (hover:hover)`.
     - Under the lid: `div[aria-hidden].mx-auto.mt-5.h-5.w-[85%].rounded-[50%].bg-black/12.blur-xl` (soft floor shadow).
     - BrandMyLaptop pill (absolute, at the lid's bottom edge): `div.absolute.bottom-0.left-1/2.z-20.-translate-x-1/2.translate-y-1/2` > `a.inline-flex.w-max...rounded-full.border.border-hairline.bg-white.px-2.5.py-1.text-[11px].text-ink-2.shadow-[0_2px_10px_rgba(0,0,0,0.10)]...` href `/` containing the small laptop logo `img.h-4.w-auto` (`/sites/brandmylaptop-com-284b5fbe/shared/media/logo-small.1zmf4nfgeac61.png`), a dash, `by`, and `<span className="font-medium text-ink">@VynseDev</span>` (link → `https://x.com/VynseDev`, `target="_blank"`).
  7. Tags block `div.mt-7.flex.flex-col.items-center.gap-2`:
     - `div[role=group][aria-label="Lid view"].flex.rounded-full.bg-hairline/50.p-1.text-[13px].font-medium` with two buttons:
       - `For sale` → active classes `rounded-full px-4 py-1.5 transition-colors bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.14)] ring-1 ring-black/10`
       - `Final look` → inactive `rounded-full px-4 py-1.5 transition-colors text-ink-2 hover:text-ink`
       - **Behaviour:** click switches the active pill (`aria-pressed` true/false). The lid visual does not change in this closed-listing state (server-rendered); implement the toggle state faithfully.
     - `p[aria-live=polite].text-[12px].text-ink-2` → `This lid is closed.`

## Text content (verbatim)

- `4,817` `views on this lid`
- `Want to sponsor my next season? 👀`
- `4 200 €` `sold` / `goal passed ·` `100%`
- `This lid is no longer taking buyers.`
- `giulia` `@giutheginger` / `13.3k followers`
- `Share`
- spot prices: 672 €, 840 €, 672 €, 210 €, 252 €, 252 €, 210 €, 336 €, 420 €, 336 € (render EUR verbatim via the `€` glyph + `&nbsp;`, do NOT route spot prices through the currency context — they are EUR on the live page)
- `For sale`, `Final look`, `This lid is closed.`
- `@VynseDev`

## Assets

- giulia avatar: `/sites/brandmylaptop-com-284b5fbe/shared/avatars/9d4978f7-2dd4-482b-ab44-40888685c319.jpg`
- 10 spot logos: paths in `data.ts` (`listingSpots[].logo`), all local.
- Small laptop logo: `/sites/brandmylaptop-com-284b5fbe/shared/media/logo-small.1zmf4nfgeac61.png`
- Lid sticker: `/sites/brandmylaptop-com-284b5fbe/shared/stickers/brandmylaptop.png`

## Responsive

- Desktop 1440: lid 860px wide inside `max-w-[900px]`; author row centred above it.
- Tablet 768: lid scales with the container (`100cqw` drives every internal size); money block `max-w-sm`.
- Mobile 390: title clamps down (`clamp(2rem,5vw,3.6rem)`); lid full width; spot prices `text-[11px]`; the `Visit ↗` hover pill is not rendered (no hover).
- Content wrapper is the shared page `<main>` — do NOT add another max-width wrapper beyond `mx-auto max-w-5xl px-6`.

## Rules

- Copy classes verbatim from the source HTML. Plain `<img>` + `// eslint-disable-next-line @next/next/no-img-element` (project convention).
- Client component (`"use client"`) only because of the toggle group; keep everything else static.
- `npx tsc --noEmit` must pass; no `any`.
