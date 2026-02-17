# ngxsmk-datepicker – Issue reproduction app

**Last updated:** February 2026 · **Current stable:** v2.1.6

Minimal Angular app used to manually verify fixes for filed issues in `ngxsmk-datepicker`. The app consumes the library from the workspace (same as the main demo-app).

## Prerequisites

- Build the library once (from the repo root):

  ```bash
  npx ng build ngxsmk-datepicker --configuration=development
  ```

  The app uses the workspace path mapping to the library source, so a full library build is not strictly required for development; the dev server will use the source.

## Serve the app

From the **repository root**:

```bash
npx ng serve angular-issue-test
```

Open `http://localhost:4200`.

## Pages and which issue they cover

| Route | Filed issue | What to verify |
|-------|-------------|----------------|
| `/` | (Home) | Links to the two reproduction pages. |
| `/month-navigation` | **Month navigation** | Range mode: select Jan 31, go to February, select Feb 3. The view should stay on February (no snap back to January). Next month should go to March. |
| `/range-reselection` | **Range reselection** | Range mode with pre-filled range (e.g. Jan 10–20). Click start → end clears; click end → it becomes new start, end clears; click inside range → that date becomes new start, end clears. |

## Build for production

From the repo root:

```bash
npx ng build angular-issue-test --configuration=production
```

Output is in `dist/angular-issue-test`.
