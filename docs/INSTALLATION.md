# Installation options for ngxsmk-datepicker

**Last updated:** February 23, 2026 · **Current stable:** v2.1.7

This document lists all supported ways to install `ngxsmk-datepicker` in your Angular project. The package is published to the npm registry and can also be installed via other package managers, from Git, from a local path, or via CDN (ESM).

## Package managers (npm registry)

All of these resolve the package from the npm registry. Use the same version (e.g. `2.1.7`) or `@latest`.

| Method | Command |
|--------|--------|
| **npm** | `npm install ngxsmk-datepicker@2.1.7` |
| **Yarn** | `yarn add ngxsmk-datepicker@2.1.7` |
| **pnpm** | `pnpm add ngxsmk-datepicker@2.1.7` |
| **Bun** | `bun add ngxsmk-datepicker@2.1.7` |

## Install from Git

You can install from the GitHub repository using a tag or branch:

```bash
npm install github:NGXSMK/ngxsmk-datepicker#v2.1.7
# or
yarn add github:NGXSMK/ngxsmk-datepicker#v2.1.7
pnpm add github:NGXSMK/ngxsmk-datepicker#v2.1.7
```

**Caveat:** This requires that the ref (e.g. `v2.1.7`) exists and that the built output is available (e.g. the tag includes a built `dist` or you have a postinstall that builds). If the repo does not ship built artifacts for that ref, clone the repo, run `npx ng build ngxsmk-datepicker` in the repo root, then use the [Local path](#local-path) method pointing at the built output.

## Local path

Useful for local development or offline use:

1. Clone the repository and build the library from the repo root:
   ```bash
   git clone https://github.com/NGXSMK/ngxsmk-datepicker.git
   cd ngxsmk-datepicker
   npx ng build ngxsmk-datepicker --configuration=production
   ```
2. Install from the built output in your app:
   ```bash
   npm install /absolute/path/to/ngxsmk-datepicker/dist/ngxsmk-datepicker
   ```
   Or with Yarn/pnpm: `yarn add /path/...` / `pnpm add /path/...`.

## CDN (ESM)

The package is ESM-only (FESM). You can point your bundler or import map at a CDN URL. Peer dependencies (Angular, etc.) must still be installed in your application.

- **unpkg:** `https://unpkg.com/ngxsmk-datepicker@2.1.7/fesm2022/ngxsmk-datepicker.mjs`
- **jsDelivr:** `https://cdn.jsdelivr.net/npm/ngxsmk-datepicker@2.1.7/fesm2022/ngxsmk-datepicker.mjs`

Use with ESM-aware setups (e.g. Vite, import maps). Not for classic `<script>` tags.

## Tarball

If a tarball is attached to a [GitHub Release](https://github.com/NGXSMK/ngxsmk-datepicker/releases), you can install it with:

```bash
npm install https://github.com/NGXSMK/ngxsmk-datepicker/releases/download/v2.1.7/ngxsmk-datepicker-2.1.7.tgz
```

(Replace the version and URL with the actual release asset if provided.)

## Caveats

- **Peer dependencies:** Regardless of install method, your app must have the required peer dependencies: `@angular/common`, `@angular/core`, `@angular/forms` (and optionally `luxon`). See [package.json](https://github.com/NGXSMK/ngxsmk-datepicker/blob/main/package.json) for versions.
- **Git or local path:** The library must be built before use (`npx ng build ngxsmk-datepicker`) unless the ref or folder already contains the built output.
