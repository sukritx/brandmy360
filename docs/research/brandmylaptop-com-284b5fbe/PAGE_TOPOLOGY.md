# PAGE_TOPOLOGY.md — brandmylaptop.com

Shared shell for `/`, `/brands`, `/briefs`, `/stats` (in order):

| # | Element | Position | Notes |
|---|---------|----------|-------|
| 0 | `<Nav>` | `sticky top-0 z-50` | 52px tall, blurred white |
| 1 | `<SponsorRail side="left">` | `fixed` z-30, `data-overlay` | top-20 bottom-4 |
| 2 | `<SponsorRail side="right">` | `fixed` z-30, `data-overlay` | top-20 bottom-4 |
| 3 | page `<main>` | flow | `footer { margin-top:auto }` pins footer down |
| 4 | `<Footer>` | flow | border-t, 4-col link groups + badges row |

`/sell` uses a different header (centered logo, 61px, not sticky), no rails, and the same Footer.

## `/` — root-7280be29 (total height ~9604px at 1440px)

| # | Section | y | h | Interaction model | Component file |
|---|---------|---|---|-------------------|----------------|
| 00 | Hero | 53 | 580 | static + marquee strip | `HeroSection.tsx`, `LatestActivity.tsx` |
| 01 | Featured now (dark carousel) | 633 | 559 | click-driven carousel (scroll-snap track + prev/next) | `FeaturedCarousel.tsx` |
| 02 | Laptops grid | 1216 | 3534 | click-driven filters + "show more" pagination | `LaptopsGrid.tsx`, `LaptopCard.tsx` |
| 03 | Just sold | 4750 | 509 | static list (fade-in on mount) | `JustSold.tsx` |
| 04 | Newsletter | 5259 | 572 | static form | `NewsletterCard.tsx` |
| 05 | Dark CTA band | 5855 | 519 | static, big chevron | `DarkCta.tsx` |
| 06 | Laptops fully branded | 6374 | 1084 | static showcase (2-col) | `BrandedShowcase.tsx` |
| 07 | How it works | 7458 | 704 | static 3 steps | `HowItWorks.tsx` |
| 08 | FAQ | 8186 | 853 | click-driven accordion | `Faq.tsx` |
| — | Footer | 9039+ | 565 | static | shared `Footer` |

Anchors: `#laptops` (section 02, `scroll-mt-20`), `#how` (section 07), `#faq` (section 08).

## `/brands` — brands-b0addea9 (total ~6126px, main `max-w-5xl pt-14 pb-24`)

| # | Section | y | h | Model | Notes |
|---|---------|---|---|-------|-------|
| 01 | Hero | 145 | 111 | static | "Get your logo on creators' laptops." |
| 02/03 | Two CTA cards | 343 | 183 | static | "Let creators come to you" / "Or pick a creator yourself" |
| 04 | Stats cards ×3 | 566 | 105 | static | 40 / $13,794 / $26 |
| 05/06 | Already on a lid | 756 | 390 | static | logo wall, 24 logos, cards |
| 07 | How it compares | 1193 | 171 | static | 3-column card (Months / Every time it opens / In the room) |
| 08/09 | What a spot is | 1581 | 313 | static | 2×2 bordered grid |
| 10 | Newsletter | 1958 | 272 | static | email only |
| 11 | Brands advertising here | 2294 | 3172 | click-driven list | 39 rows + filters; `sponsor` badge on 3 |

## `/briefs` — briefs-dc03d02e (total ~2014px, main `max-w-3xl`)

| # | Section | y | h | Model |
|---|---------|---|---|-------|
| 01 | Heading | 145 | 50 | static |
| 02–07 | Brief form | 212–598 | ~1140 | click-driven (pills multi-select max 4, currency, submit) |

## `/stats` — stats-d8625d36 (total ~5504px, main `max-w-5xl`)

| # | Section | y | h | Model |
|---|---------|---|---|-------|
| 01 | Heading "Everything this market has done." | 145 | 54 | static |
| 03 | Stat cards ×4 | 286 | 151 | static |
| 04 | Paid to creators bar chart | 460 | 419 | static bars |
| 05 | The board (4 cards) | 903 | 177 | static |
| 06 | Following → visitors bars | 1104 | 715 | static |
| 07 | The 40 brands that have bought | 1842 | 1493 | static 2-col grid |
| 08 | Price analysis ($187/$370) | 3359 | 650 | static |
| 09 | Conclusion line | 4034 | 183 | static |
| 10 | Browse by who carries it | 4265 | 215 | pills |
| 11 | Laptop grid slice | 4503 | 288 | static |

## `/sell` — sell-826541f7 (total ~1699px)

| # | Section | y | h | Model |
|---|---------|---|---|-------|
| — | Header (centered logo) | 0 | 61 | static |
| 03 | Wizard shell | 61 | 1073 | click-driven 9 steps |
| — | Footer | ~1134 | 565 | static |
| — | Stripe modal | fixed z-60 | 900 | shown on load, dismissible |

## Dependency notes

- `LidPreview` (shared) is used by: `LaptopCard`, `FeaturedCarousel`, `BrandedShowcase`, `/sell` preview. All read `lid` objects from `shared/data.ts` (laptops) or step state (sell).
- `Money` (shared, client) renders all prices; server sections pass numeric USD.
- Rails/nav/footer are shared; each page renders them itself (pages are independent route files).
- z-index layers: nav 50, mobile menu panel 40, rails 30, cards' stamps 10, sell modal 60.
