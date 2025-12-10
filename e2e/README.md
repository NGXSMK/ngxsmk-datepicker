# E2E Testing with Playwright

This directory contains end-to-end tests for ngxsmk-datepicker using Playwright.

## Setup

Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

Run all tests:
```bash
npm run e2e
```

Run tests in headed mode (see browser):
```bash
npm run e2e:headed
```

Run tests for a specific browser:
```bash
npx playwright test --project=chromium
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

## Test Structure

- `datepicker.spec.ts` - Main E2E tests for datepicker functionality
  - Component display
  - Calendar opening/closing
  - Date selection
  - Navigation
  - Keyboard support
  - Range selection
  - Accessibility
  - Mobile viewport

## Writing New Tests

1. Create a new test file in the `e2e/` directory
2. Import test utilities from `@playwright/test`
3. Use page locators to interact with the datepicker
4. Use `expect` assertions to verify behavior

Example:
```typescript
import { test, expect } from '@playwright/test';

test('my new test', async ({ page }) => {
  await page.goto('/');
  // Your test code here
});
```

## CI/CD

Tests run automatically on CI. The configuration is in `playwright.config.ts`.

## Debugging

- Use `await page.pause()` to pause execution
- Use `--debug` flag for Playwright Inspector
- Check `test-results/` for screenshots and videos of failed tests

