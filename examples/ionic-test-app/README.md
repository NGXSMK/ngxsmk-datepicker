# Ionic + Capacitor example (`ngxsmk-datepicker`)

**Purpose:** Smoke-test the datepicker inside **Ionic Angular** and optional **Capacitor** shells.

## Supported matrix (indicative)

| Package line | Notes |
|--------------|--------|
| Angular `20.x` / `21.x` | Align `@angular/*` versions on a single minor |
| `@ionic/angular` `^8.x` | Match [Ionic’s Angular compatibility table](https://ionicframework.com/docs/reference/support) |
| `@capacitor/*` `^8.x` | Same major across `@capacitor/core`, `cli`, `android`, `ios` |

When Ionic’s declared peers are narrower than your Angular version, npm may report conflicts.

## Install

From this directory:

```bash
npm install --legacy-peer-deps
```

Use `--legacy-peer-deps` only when npm `ERESOLVE` blocks installation after aligning versions in `package.json`. Prefer tightening versions over ignoring peers long term.

## Scripts

```bash
npm start          # ionic serve
npm run build      # production build
```

## `tsconfig`

The example sets `"lib": ["es2022", "dom"]` so APIs such as `Array.prototype.at` match the library’s expectations.

## Linking a local library build

From the workspace root:

```bash
npm run build:optimized
npm pack ./dist/ngxsmk-datepicker
```

Then in this folder, point `ngxsmk-datepicker` at the tarball or `file:../../../dist/ngxsmk-datepicker` per npm link workflows.

See also [COMPATIBILITY.md](../../projects/ngxsmk-datepicker/docs/COMPATIBILITY.md) for Angular peer ranges.
