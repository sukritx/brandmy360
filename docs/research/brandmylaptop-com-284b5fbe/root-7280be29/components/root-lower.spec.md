# Root lower sections Specification (JustSold, NewsletterCard, DarkCta, BrandedShowcase, HowItWorks, Faq)

**Source markup files (verbatim, one per section):**
- JustSold → `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/sections-html/03-y4750.html`
- Newsletter → `.../04-y5259.html`
- DarkCta → `.../05-y5855.html`
- BrandedShowcase → `.../06-y6374.html`
- HowItWorks → `.../07-y7458.html`
- Faq → `.../08-y8186.html` + answers in `.../faq-answers.json`

**Screenshots:** same page's `sections-desktop/03-*.png` … `08-*.png`
**Target files:** `.../root-7280be29/JustSold.tsx`, `NewsletterCard.tsx`, `DarkCta.tsx`, `BrandedShowcase.tsx`, `HowItWorks.tsx`, `Faq.tsx`

## 03 — JustSold

- `<section>` with heading `Just sold` + sub `Every spot bought on these lids` (verify exact copy in source).
- Rows: `ul` of `li` rows, each an avatar + `{Brand} took a spot on {Creator}'s lid` + amount (`$228`, `text-green`?) + time (`6d ago`). Exact row strings in `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/just-sold.json` (6 rows).
- Rows have a subtle mount fade (`style="opacity:1; transform:none"` in live DOM) — implement a light fade-in or render final state.
- Static; hover may underline links.

## 04 — NewsletterCard

- Card centered, `rounded-3xl border border-hairline` (confirm in source), heading `What sold this week, every week`, sub copy, then a form row: email input (`placeholder="you@brand.com"` — copy exact from source) + X handle input (prefix `x.com/` inside a bordered label group) + submit button `Send me the weekly`.
- Inputs: `rounded-xl border border-hairline px-3 py-2 text-[15px] outline-none focus:border-blue` style per source.
- Static form; on submit do nothing (prevent default) — no backend.

## 05 — DarkCta

- Full-bleed dark band `bg-ink` with white heading: `Everyone stares at laptop lids. Yours may as well get paid.` + a marquee/secondary line (copy exact).
- CTA pill (white on dark) → `/sell` or `/` per source (`Put your laptop up`).
- Includes a big `ChevronDownLargeIcon` (`h-8 w-8`, white/60) as a scroll affordance.
- Exact structure/classes in `05-y5855.html`; keep `text-wrap: balance` behavior of the h2.

## 06 — BrandedShowcase

- Heading `Laptops fully branded.` + sub with `<strong>$18,886</strong> of ad space bought by brands, across 3 laptops.` (use exact string from source, `$18,504` seen in a later capture — take the value from the source HTML file).
- `ul.mt-14.grid.gap-x-8.gap-y-14.sm:grid-cols-2` with 3 `li`, each `a.group.relative.block` (external links: brandmymac.com and 2 others — read hrefs from source).
- Each item: `span.relative.block.aspect-[1.44].w-full` wrapper + `<LidPreview lid={...} variant="light" />` built from the slot data in `docs/research/brandmylaptop-com-284b5fbe/root-7280be29/showcase.json` (3 items, each with 10 slots incl. `area`, `img`, `imgStyle`, `label`).
- Build `Lid` objects inline in the component from `showcase.json` data (already downloaded locally via the manifest), or add them to `data.ts` as `showcaseLaptops`.
- Hover: per source (`group-hover` classes) — check and copy.

## 07 — HowItWorks (`id="how"`, `scroll-mt-20`)

- Heading `How it works` + 3 numbered steps, each with number, title, body copy. Copy exact text/classes from `07-y7458.html`.
- Static; numbering may use circles with `bg-ink text-white`.

## 08 — Faq (`id="faq"`)

- Heading `Questions & Answers`.
- **Accordion (click-driven)**: each item is a `button` row with question + a plus/chevron indicator; clicking toggles the answer panel. First item is open on load. Backgrounds: `rounded-2xl border border-hairline bg-white` per source.
- All question/answer pairs verbatim in `faq-answers.json` (fields `q`, `html`). Use the plain answer text from the `html` (strip wrappers) — do not paraphrase.
- Transition: rotate the indicator and reveal the panel (height/opacity per source; if not present in source, use a simple `grid-rows-[0fr]/[1fr]` or max-height transition).

## Shared rules

- All money rendered through `<Money usd={n} />` from `shared/CurrencyProvider`.
- All images: map remote → local via `_asset-manifest.json`; use plain `<img>` with an eslint-disable comment.
- Copy classes verbatim from the section HTML files. Do not approximate spacing or colors.
- `npx tsc --noEmit` must pass; no `any`.
