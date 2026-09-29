# /briefs page Specification

**Source markup:** `docs/research/brandmylaptop-com-284b5fbe/briefs-dc03d02e/sections-html/*.html` (01 heading; form sections 02–07)
**Screenshot:** `docs/design-references/brandmylaptop-com-284b5fbe/briefs-dc03d02e/sections-desktop/07-y598-h755.png` and full page
**Target:** `src/app/briefs/page.tsx` + `src/components/sites/brandmylaptop-com-284b5fbe/briefs-dc03d02e/BriefForm.tsx`
**Interaction model:** click-driven form (multi-select pills, currency-aware budget), no backend

## Page shell

`<Nav />` + rails + `<main class="mx-auto max-w-3xl px-6 pb-24 pt-14">` + `<Footer />`.

## Content

- H1: `Let creators advertise for you.` (exact classes from `01-y145.html`).
- Sub copy: exact from source.
- Form fields (copy exact labels/placeholders from the form section HTML):
  1. `Brand` — text input
  2. `Website` — text input
  3. `Email` — email input
  4. Audience — **multi-select pills** (`aria-pressed`), max 4 selected. Selected state: `border-blue bg-blue/[0.06] text-blue`-style per source. Clicking a selected pill deselects; selecting a 5th is prevented (or replaces, matching source behaviour — check the source attributes/handler hints; default to "block beyond 4").
  5. `Budget per spot` — numeric input with a `€` prefix/suffix (copy layout from source; uses `inputmode="numeric"`).
  6. Notes — textarea.
  7. Submit button `Post the brief` (dark pill, full width per source).
- Below the form: any trust/explainer copy present in the source.

## States & behaviour

- Pills toggle on click (multi-select, stated maximum 4). Keyboard accessible (`button type="button"`).
- Submit: `preventDefault()`, no network. Optionally show the same inline success/alert copy if present in the source; otherwise no-op.
- Hover/focus states: copy from source classes (`focus:border-blue`, `hover:border-ink/40` etc.).

## Responsive

- Single column on mobile; two-column field rows at `sm` where present in the source.
- Pills wrap; max-w-3xl container keeps the form narrow on desktop.

## Rules

- Copy classes verbatim from source HTML; `BriefForm.tsx` is a client component.
- `npx tsc --noEmit` must pass; no `any`.
