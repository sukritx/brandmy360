# QA Report — brandmylaptop.com clone

Verification run against the live site and the local production build (`npm start` on :3000), 1440×900 and 390×844.

Final checks: `npx tsc --noEmit` clean, `npx eslint src` → **0 errors** (9 `<img>` warnings, intentional for pixel-exact rendering), `npm run build` → all 5 routes prerendered static.

> Live heights below are from the verification run moment; the live site's counters and grid order change continuously (it re-sorts auctions and appends listings), so small deltas vs an earlier run are expected on their side, not regressions in the clone.

## Desktop page-height parity (main sections compared one by one)

| Page | Live | Clone | Δ | Notes |
|------|------|-------|---|-------|
| `/` | 9625 | 9649 | +24 | Every section identical except the laptops grid (+24px, see below) |
| `/brands` | 6126 | 6126 | **0** | all 9 sections byte-equal in position and height |
| `/briefs` | 2111 | 2111 | **0** | all 7 sections identical |
| `/stats` | 5457 | 5457 | **0** | all 10 sections identical |
| `/sell` | 1699 | 1699 | **0** | header 61 / body 1073 / footer 565 / modal 1000 all identical |

Root grid note: the +24px comes from card ordering. The live grid re-sorts continuously ("Most raised" changes as bids land) and now reports 169 laptops / 44,008 visits vs the captured snapshot's 166 / 42,430. Same cards, same card heights, different order → different row heights.

## Section-by-section (desktop, selected)

- Hero, Featured carousel, Just sold, Newsletter, Dark CTA, Laptops fully branded, How it works, FAQ: **identical heights** and positions across home.
- Featured carousel internals: card heights 446px, track 446px, lid 170px, caption 21/42px — identical to live (captions and the `ends in 6d` stamp added after first QA pass).
- Stats: stat cards 151, Paid chart 419, board 177, following chart 715, brands grid 1493 (30 rows), price breakdown 650, conclusion 183, browse pills 168 (16 pills), newsletter 288 — all identical.
- Brands: hero 111, CTA cards 183, stats 105, logo wall 390, compare 171, browse 121, what-a-spot 313, newsletter 272, brands list 3172 — all identical.

## Mobile parity (390×844)

| Page | Live | Clone | Δ |
|------|------|-------|---|
| `/` | 17015 | 17076 | +61 (grid ordering) |
| `/brands` | 8192 | 8267 | +75 (logo wall + grid ordering) |
| `/briefs` | 3328 | 3328 | **0** |
| `/stats` | 8595 | 8548 | −47 |
| `/sell` | 2893 | 2893 | **0** |

Body chrome at mobile verified identical: `has-ads has-ad-bar`, `padding-bottom: 56px`, mobile sponsor bar at `top: 787`, `h: 57`; side rails hidden (`display:none`, height 0). Desktop rails verified visible (804px tall at x=8 / x=1242).

## Interactions (automated, 12/13 pass)

| Check | Result |
|-------|--------|
| Carousel prev/next scrolls the snap track and returns | PASS (0 → 303 → 0) |
| Grid filter dropdown opens, options listed, re-sorts | PASS (Most raised → Most followers reorders) |
| "Show 48 more of 172" appends cards | PASS (24 → 29) |
| FAQ accordion: 1 open on load, click switches, click again collapses | PASS (matches live exactly) |
| Currency select converts and persists (`bml.currency`) | PASS (`$0sold` → `0 €sold` → back) |
| `#laptops` / `#how` anchors exist and are linked | PASS |
| No runtime JS errors on `/` and `/sell` | PASS |
| Mobile menu toggle + 5 links + close | PASS |
| Stripe modal opens on load and dismisses | PASS |
| Sell wizard gated steps (alert + enable) | PASS (Showcase + Prices verified; You gated by country) |
| Briefs audience pills max 4, toggle off | PASS (4 → blocked 5th → 3 after deselect) |
| Stats bars use exact inline widths | PASS (7 bars) |
| Wizard advances all 9 steps in one automated pass | Not automatable (gates require field edits); gates verified individually |

## Assets

- 127 remote assets discovered; 125 downloaded first pass, then favicons (7), the Twitter avatar, and `/og/emma-pet.png` fetched → **all assets local**, 0 broken images on any page.
- Badge `brandmylaptop.com.png` was an SVG served under a `.png` name; renamed to `.svg` and reference updated.
- `site.webmanifest` icon paths rewritten to the namespaced `/sites/.../shared/seo/` paths.

## Known deviations / limitations

1. **Grid card ordering** — snapshot order vs live's continuously re-sorted order (see above). Data is a frozen capture.
2. **Out-of-scope links** — `/laptops/*`, `/brand/*`, `/campaign`, `/dashboard`, `/sponsor` are not cloned (only the 5 requested routes). Next.js RSC prefetch for these returns 404 in the console when the browser is idle on the page; no visual impact; clicking them lands on the Next 404 page.
3. **Currency rates** — measured from live: USD→EUR ≈ ×0.8547, USD→GBP ≈ ×0.7436, formatting matches (`11 790 €`, `£10,257`). Live converts per-record with its own rounding, so individual non-USD values can differ by ±1 unit.
4. **Sell wizard details** (documented by the builder): Space Grey renders the light lid (spec said "rest light"; current live build may treat it dark); PC mode keeps the colour chooser; auction preview cells keep the same visible cell contents with a bid pill on hover; slug-availability API is not cloned.
5. **`next dev` fails in this environment** (Turbopack cannot reach `fonts.googleapis.com` for `next/font/google`); `npm run build` + `npm start` are unaffected. `next/font/google` was kept because it is what the original uses and production builds work.
6. Dynamic live counters (visits, listing counts) show the captured snapshot values.

---

# QA addendum — `/giulia` listing page (run 2)

| Check | Result |
|-------|--------|
| Desktop total height 1440px | **live 4164 = clone 4164 (Δ0)** |
| Section heights | hero 1146 = 1146, details 903 = 903, spots 1000 = 1000, other laptops 449 = 449, footer 565 = 565 — all exact |
| Mobile total height 390px | live 6234 vs clone 6186 (Δ−48, see deviation 7) |
| Body chrome at mobile | `has-ads has-ad-bar` on both; rails hidden; mobile ad bar 57px at both; no horizontal overflow |
| Broken images | 0 on live and clone |
| Network/JS errors | 0 (non-prefetch requests) |
| Route regressions | none — `/`, `/brands`, `/briefs`, `/stats`, `/sell` heights unchanged (9649 / 6126 / 2111 / 5457 / 1699) |

**Interactions verified on the clone**
- `For sale` / `Final look` toggle group: initial `aria-pressed` `[true,false]` → after clicking the second pill `[false,true]` with the active styling (`bg-white text-ink shadow-…`) moving — matches live.
- 10 spot cells present with exact aria labels, e.g. `Spot 1, Top left banner, 10.8 × 6.3 cm. Taken by FullEnrich. Visit them.`
- Hover reveal on a spot cell: logo+price blur and the `Visit ↗` pill fades in (screenshot `_clone/giulia-lid-hover.png`).
- Funding progress bar: `role="progressbar"` `aria-valuenow="100"`, inner width `100%`.
- Desktop table + mobile card list both render (`sm:hidden` split), matching the live's dual markup.

**Additional deviation (7): the live `/giulia` route ships its own CSS chunk that is missing the `.truncate` utility rule.** On the live page the two longest spot names ("Inner right — beside the logo", "Bottom centre — under the logo") therefore wrap to two lines in the mobile card list (computed `white-space: normal`), adding 24px per card → the mobile spots section is 1777px live vs 1729px clone. The clone keeps the standard Tailwind `truncate` (used by the rest of the cloned site and by the desktop rendering of the same page, where heights match exactly), so this is a mobile-only 48px difference (0.8% of the page) caused by a live route-level CSS regression, not a clone defect. Reproducing it would require disabling `truncate` site-wide.
