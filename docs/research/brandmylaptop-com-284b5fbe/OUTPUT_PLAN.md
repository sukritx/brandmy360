# Output Plan — brandmylaptop.com

**App root:** `.` (repository root)
**Site key:** `brandmylaptop-com-284b5fbe`
**Origins:** single origin `https://brandmylaptop.com` — single Next.js app, shared foundation.

## Targets

| # | Source URL | Page key | Destination route | Artifact root | Screenshot root | Component root | Asset root |
|---|-----------|----------|-------------------|---------------|-----------------|----------------|------------|
| 1 | https://brandmylaptop.com/ | `root-7280be29` | `src/app/page.tsx` (replaces untouched scaffold) | `docs/research/<site>/root-7280be29/` | `docs/design-references/<site>/root-7280be29/` | `src/components/sites/<site>/root-7280be29/` | `public/sites/<site>/root-7280be29/` |
| 2 | https://brandmylaptop.com/brands | `brands-b0addea9` | `src/app/brands/page.tsx` | `docs/research/<site>/brands-b0addea9/` | `docs/design-references/<site>/brands-b0addea9/` | `src/components/sites/<site>/brands-b0addea9/` | `public/sites/<site>/brands-b0addea9/` |
| 3 | https://brandmylaptop.com/briefs | `briefs-dc03d02e` | `src/app/briefs/page.tsx` | `docs/research/<site>/briefs-dc03d02e/` | `docs/design-references/<site>/briefs-dc03d02e/` | `src/components/sites/<site>/briefs-dc03d02e/` | `public/sites/<site>/briefs-dc03d02e/` |
| 4 | https://brandmylaptop.com/stats | `stats-d8625d36` | `src/app/stats/page.tsx` | `docs/research/<site>/stats-d8625d36/` | `docs/design-references/<site>/stats-d8625d36/` | `src/components/sites/<site>/stats-d8625d36/` | `public/sites/<site>/stats-d8625d36/` |
| 5 | https://brandmylaptop.com/sell | `sell-826541f7` | `src/app/sell/page.tsx` | `docs/research/<site>/sell-826541f7/` | `docs/design-references/<site>/sell-826541f7/` | `src/components/sites/<site>/sell-826541f7/` | `public/sites/<site>/sell-826541f7/` |
| 6 | https://brandmylaptop.com/giulia | `giulia-96b78fb0` | `src/app/giulia/page.tsx` | `docs/research/<site>/giulia-96b78fb0/` | `docs/design-references/<site>/giulia-96b78fb0/` | `src/components/sites/<site>/giulia-96b78fb0/` | `public/sites/<site>/giulia-96b78fb0/` (assets deduped into `shared/`) |

Shared same-site artifacts: `components/sites/<site>/shared/`, `public/sites/<site>/shared/`.

## Existing work

- Only the untouched template scaffold exists: `src/app/page.tsx` (explicit "Clone target not yet built" placeholder). Safe to replace per skill defaults.
- No existing `docs/research`, `docs/design-references`, `public/sites`, or `src/components/sites`.
- No collisions: all 5 routes and all namespaces are new and distinct.

## Shared foundation changes

- `src/app/layout.tsx` — site fonts (system stack, see FOUNDATION spec), shared nav/footer are page-level so kept per page or in a route group layout.
- `src/app/globals.css` — merge target design tokens (colors, radii, keyframes) additively.
- `src/components/sites/<site>/shared/icons.tsx` — deduplicated same-site icons.
- `public/sites/<site>/shared/` — logo, favicons, fonts if any, shared images.

## Query/fragment behavior

None of the five targets carry stateful query strings or fragments; no shared-pathname state resolution needed.

## Download scripts

- `scripts/download-assets-brandmylaptop-com-284b5fbe.mjs` (single shared downloader for all 5 pages, namespaced output dirs per page).

## Parallelization

Foundation first (sequential, by foreman). Then page extraction + builders. Pages share the same nav/footer components, which are extracted once into `shared/` and reused.

---

# Completion status

| Item | Result |
|------|--------|
| Routes built | `src/app/page.tsx`, `brands/page.tsx`, `briefs/page.tsx`, `stats/page.tsx`, `sell/page.tsx`, `giulia/page.tsx` |
| Existing routes replaced | Only the untouched template scaffold `src/app/page.tsx` (explicitly allowed by skill defaults) |
| Existing routes preserved | `/`, `/brands`, `/briefs`, `/stats`, `/sell` untouched by the `/giulia` run (verified: identical heights after) |
| Site components | 48 `.tsx` files under `src/components/sites/brandmylaptop-com-284b5fbe/` (shared + 6 page namespaces) |
| Spec files | 10 (`components/*.spec.md` under each page's artifact root) |
| Research artifacts | 165 files (section HTML dumps, topology, behaviors, data JSON, CSS/class maps, screenshots, manifest) |
| Assets | 106 files under `public/sites/brandmylaptop-com-284b5fbe/` (logos, avatars, stickers, og images, badges, favicons; giulia's 5 new assets deduped into `shared/`) |
| Build | `npm run build` clean; all 6 routes prerendered static |
| Types/lint | `npx tsc --noEmit` clean; `npx eslint src` 0 errors |
| Visual parity | `/brands`, `/briefs`, `/stats`, `/sell`, `/giulia` pixel-identical section heights at 1440px; `/` identical except grid ordering (+24px) |
| Docs | `BEHAVIORS.md`, `PAGE_TOPOLOGY.md`, `QA_REPORT.md` |

Deviations and known gaps: see `QA_REPORT.md` → "Known deviations / limitations".

## `/giulia` run (added after the first five pages)

- Page key `giulia-96b78fb0`; target is a closed single-laptop listing ("Ad space on Giulia's 16″ MacBook — listing closed").
- Sections: `ListingHero` (views line, title, funding progress, author row, 860px lid with 10 sold spot cells + hover "Visit ↗" reveal, BrandMyLaptop pill, `For sale`/`Final look` toggle), `ListingDetails` (4 cards), `ListingSpots` (desktop table + mobile card list), `OtherLaptops` (3 cards).
- Data generated into `src/components/sites/<site>/giulia-96b78fb0/data.ts` (10 spots with brand/href/logo/area/label, 3 other listings, author, money).
- 5 new assets downloaded (giulia avatar + new brand logos); everything else reused from `shared/`.
- Download script: `scripts/download-assets-brandmylaptop-com-284b5fbe-giulia.mjs` (does not overwrite the first run's downloader).
