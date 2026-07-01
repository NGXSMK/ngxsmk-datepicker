# Ranking ngxsmk-datepicker in the world — growth playbook

Goal: become a **top-3 result** for "angular datepicker" / "angular date range picker" on npm and
Google, and a default recommendation in the Angular community. npm search ranking is driven mostly by
**weekly downloads + quality/maintenance score + keyword relevance**; Google by **backlinks + fresh
content**; adoption by **DX + docs + trust signals**. Work the three together.

Priorities are P0 (do first, highest leverage), P1, P2.

## 1. npm discoverability (the search-result itself)
- **P0 — Keywords: focused, not stuffed.** The published `projects/ngxsmk-datepicker/package.json`
  should keep ~15–20 *high-intent* keywords (`angular-datepicker`, `date-range-picker`, `angular-calendar`,
  `timezone`, `signals`, `standalone`, `zoneless`, `ssr`, `accessibility`). Avoid the long tail of
  country names — npm relevance rewards precision, and stuffing can hurt the quality score.
- **P0 — Description = the pitch.** One line, keyword-rich, benefit-first (already good). Keep it in sync
  across README H1, GitHub "About", and package `description`.
- **P1 — Maintenance signals npm scores:** recent publishes, resolved issues, populated `repository`,
  `homepage`, `bugs`, `funding`, and a green CI badge. All present — keep the cadence steady.

## 2. Trust & quality signals (conversion once found)
- **P0 — Live playground link at the very top** (StackBlitz/CodeSandbox "Edit in StackBlitz"). A one-click
  demo is the single biggest conversion + backlink driver for a UI library.
- **P0 — Comparison table** vs `@angular/material`, `ngx-bootstrap`, `ng-pick-datetime` (unmaintained),
  `angular-calendar`. People search "best angular datepicker" — a table wins the click. (Added to README.)
- **P1 — Badges that matter:** npm weekly downloads, bundlephobia (real gzip size), CI status, test count,
  Angular version support matrix. Keep the bundle badge accurate (measured ~139 KB gzip FESM).
- **P1 — `FUNDING`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, issue/PR templates** → GitHub "Community" 100%.

## 3. Content & backlinks (Google ranking)
- **P0 — Docs site on a real domain** (GitHub Pages/Netlify from the existing `demo-app`), with
  per-feature pages (range, timezone, i18n, natural language, a11y). Each indexable page = a ranking surface.
- **P1 — Tutorials** ("Angular date range picker in 5 minutes", "Timezone-aware dates in Angular"),
  published on dev.to / Medium / Hashnode with canonical links back to the docs.
- **P1 — Get listed** in `awesome-angular`, `made-with-angular`, `openbase`, `npm trends` comparisons.
- **P2 — Answer existing demand:** StackOverflow "angular date range picker" questions and the Angular
  subreddit/Discord, linking the playground where genuinely helpful.

## 4. Adoption drivers (product = retention = downloads)
- **P0 — Zero-config first render:** the copy-paste snippet in the README must "just work" (it does).
- **P1 — Framework reach is a differentiator** — this ships React/Vue/Web-Component wrappers already;
  surface that prominently (few Angular datepickers do).
- **P1 — Migration ease:** an `ng update`/schematic and a v2→v3 guide (see [V3-ROADMAP.md](./V3-ROADMAP.md)).
- **P2 — SSR/zoneless-ready** is a real, marketable edge for Angular 17+ apps — lead with it.

## First two weeks (concrete)
1. Add a StackBlitz demo + link it at the README top. (P0, ~1h)
2. Ship the comparison table (done) and a downloads + bundlephobia badge. (P0, ~1h)
3. Publish the docs site from `demo-app` to a domain and submit to `awesome-angular`. (P0, ~½ day)
4. Write one "date range picker in Angular" tutorial with a canonical backlink. (P1, ~½ day)
5. Keep a steady publish cadence; respond to issues within 48h (maintenance score). (ongoing)

Downloads compound: discoverability → trial → the docs/DX convert → recommendations → more downloads →
higher npm rank. The product is already strong; the gap to "world rank" is **distribution**, not features.
