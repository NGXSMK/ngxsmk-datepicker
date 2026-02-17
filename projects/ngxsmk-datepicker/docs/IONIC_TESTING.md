# Ionic Integration Testing Guide

**Last updated:** February 2026 · **Current stable:** v2.1.6

This document provides comprehensive testing instructions for verifying ngxsmk-datepicker compatibility with Ionic Framework.

## Automated Tests

### E2E Tests

Run the Ionic integration E2E tests:

```bash
npm run e2e -- e2e/ionic-integration.spec.ts
```

### Test Coverage

The E2E tests cover:
- Focus management
- Keyboard behavior
- ion-modal integration
- ion-popover integration
- Scroll behavior
- SSR compatibility
- Safe area insets

## Manual Testing

See `e2e/ionic-test-manual.md` for detailed manual testing instructions.

## Test Components

### Using the Test Component

1. **Add to your Ionic app**:
   ```typescript
   import { IonicTestComponent } from './ionic-test/ionic-test.component';
   
   @Component({
     imports: [IonicTestComponent],
     template: '<app-ionic-test></app-ionic-test>'
   })
   ```

2. **Add route**:
   ```typescript
   { path: 'ionic-test', component: IonicTestComponent }
   ```

3. **Navigate to test page** and follow manual testing guide

## Test Scenarios Summary

### ✅ Focus Management
- **Test**: Verify focus trapping doesn't conflict with Ionic
- **Status**: Automated + Manual testing required
- **Files**: `e2e/ionic-integration.spec.ts` (Focus Management section)

### ✅ Keyboard Behavior
- **Test**: Verify keyboard show/hide on iOS and Android
- **Status**: Automated + Manual testing required
- **Files**: `e2e/ionic-integration.spec.ts` (Keyboard Behavior section)

### ✅ ion-modal Integration
- **Test**: Verify datepicker works inside Ionic modals
- **Status**: Automated + Manual testing required
- **Files**: `e2e/ionic-integration.spec.ts` (ion-modal Integration section)

### ✅ ion-popover Integration
- **Test**: Verify datepicker works inside Ionic popovers
- **Status**: Automated + Manual testing required
- **Files**: `e2e/ionic-integration.spec.ts` (ion-popover Integration section)

### ✅ Scroll Behavior
- **Test**: Verify scrolling works correctly in ion-content
- **Status**: Automated + Manual testing required
- **Files**: `e2e/ionic-integration.spec.ts` (Scroll Behavior section)

### ✅ SSR Compatibility
- **Test**: Verify server-side rendering works with Ionic
- **Status**: Automated + Manual testing required
- **Files**: `e2e/ionic-integration.spec.ts` (SSR Compatibility section)

## Running Tests

### All Tests
```bash
npm run e2e
```

### Specific Test File
```bash
npx playwright test e2e/ionic-integration.spec.ts
```

### Specific Test
```bash
npx playwright test e2e/ionic-integration.spec.ts -g "Focus Management"
```

### Mobile Viewport
```bash
npx playwright test e2e/ionic-integration.spec.ts --project="Mobile Chrome"
```

### iOS Safari
```bash
npx playwright test e2e/ionic-integration.spec.ts --project="Mobile Safari"
```

## Test Results

After running tests, check:
- Test report: `test-results/`
- Screenshots: `test-results/` (on failure)
- Videos: `test-results/` (on failure)
- HTML report: `playwright-report/`

## Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test-ionic.yml
name: Ionic Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run e2e -- e2e/ionic-integration.spec.ts
```

## Next Steps

1. **Run automated tests** to verify basic functionality
2. **Perform manual testing** on real devices
3. **Test in your Ionic app** with real use cases
4. **Report issues** with detailed information

