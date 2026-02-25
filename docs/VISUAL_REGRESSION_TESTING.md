# Visual Regression Testing Guide

**Last updated:** February 25, 2026 · **Current stable:** v2.1.9

This document describes the visual regression testing infrastructure for `ngxsmk-datepicker`, including screenshot-based testing for themes, layouts, and component states.

## Overview

Visual regression testing ensures that UI changes don't inadvertently break the visual appearance of the datepicker across different:

- **Themes**: Light, Dark, High-Contrast
- **Layouts**: Mobile, Tablet, Desktop, Desktop HD
- **States**: Default, Selected, Disabled, Readonly, Focused
- **Views**: Month, Year, Decade
- **Configurations**: Single date, Range, Multiple dates, With time

## Test Infrastructure

### Core Utilities

The visual regression utilities are located in `utils/visual-regression.utils.ts` and provide:

1. **Screenshot Capture**: Capture component screenshots
2. **Image Comparison**: Pixel-by-pixel comparison with configurable thresholds
3. **Theme Management**: Apply and switch themes
4. **Viewport Simulation**: Test different device sizes
5. **Element Preparation**: Wait for stable rendering

### Key Functions

#### `applyTheme(theme: ThemeMode)`

Applies a theme to the document:

```typescript
applyTheme("light"); // Apply light theme
applyTheme("dark"); // Apply dark theme
applyTheme("high-contrast"); // Apply high-contrast theme
```

#### `prepareElementForScreenshot(element, config)`

Prepares an element for screenshot by:

- Waiting for images to load
- Waiting for animations to complete
- Waiting for layout to stabilize
- Adding small delay for final render

```typescript
await prepareElementForScreenshot(element, {
  timeout: 5000,
  threshold: 0.01,
});
```

#### `compareImageData(data1, data2, threshold)`

Compares two images and returns comparison results:

```typescript
const result = compareImageData(baseline, current, 0.01);
console.log(`Match: ${result.matches}`);
console.log(`Diff: ${result.diffPercentage}%`);
```

#### `generateVisualTestScenarios(selector)`

Generates test scenarios for all theme/viewport combinations:

```typescript
const scenarios = generateVisualTestScenarios(".datepicker");
// Returns 4 scenarios: light/dark × mobile/desktop
```

## Predefined Viewports

```typescript
export const VIEWPORTS = {
  mobile: {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
  },
  tablet: {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
  },
  desktop: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
  },
  desktopHD: {
    width: 2560,
    height: 1440,
    deviceScaleFactor: 1,
    isMobile: false,
  },
};
```

## Running Visual Tests

### Unit Tests

Visual regression tests are integrated into the Jasmine/Karma test suite:

```bash
# Run all tests including visual regression
npm test

# Run only visual regression tests
npm test -- --include='**/visual-regression.spec.ts'
```

### Test Coverage

The visual regression test suite covers:

1. **Theme Variations** (4 tests)
   - Light theme application
   - Dark theme application
   - High-contrast theme
   - Theme switching

2. **Layout Variations** (3 tests)
   - Mobile viewport (375×667)
   - Tablet viewport (768×1024)
   - Desktop viewport (1920×1080)

3. **Calendar States** (8 tests)
   - Default state
   - Date selected
   - Range mode
   - With time selection
   - Disabled dates
   - Min/max dates
   - Multi-month
   - Week numbers

4. **View Modes** (3 tests)
   - Month view
   - Year view
   - Decade view

5. **Interactive States** (3 tests)
   - Disabled
   - Readonly
   - Focused

6. **Screenshot Utilities** (4 tests)
   - Image loading
   - Animation completion
   - Element stabilization
   - Filename generation

7. **Image Comparison** (4 tests)
   - Identical images
   - Different images
   - Threshold handling
   - Diff image creation

8. **Comprehensive Scenarios** (4 tests)
   - Light mobile
   - Dark mobile
   - Light desktop
   - Dark desktop

## Configuration

### Visual Regression Config

```typescript
interface VisualRegressionConfig {
  baselineDir?: string; // Reference images directory
  diffDir?: string; // Diff images directory
  threshold?: number; // Difference threshold (0-1)
  updateBaseline?: boolean; // Update baseline images
  timeout?: number; // Preparation timeout (ms)
}
```

### Default Configuration

```typescript
const DEFAULT_VISUAL_CONFIG = {
  baselineDir: "visual-regression/baseline",
  diffDir: "visual-regression/diff",
  threshold: 0.01, // 1% difference allowed
  updateBaseline: false,
  timeout: 5000,
};
```

## Test Scenarios

### Example: Testing Light Theme Mobile

```typescript
it("should match light theme mobile layout", async () => {
  // Apply theme
  applyTheme("light");

  // Set viewport
  Object.defineProperty(window, "innerWidth", {
    value: VIEWPORTS.mobile.width,
  });

  // Configure component
  component.inline.set(true);
  fixture.detectChanges();

  // Prepare and capture
  await prepareElementForScreenshot(nativeElement);

  // Assertion or screenshot capture here
  expect(nativeElement).toBeTruthy();
});
```

### Example: Testing Range Selection

```typescript
it("should match range selection visual", async () => {
  component.selectionMode.set("range");
  component.startDate.set(new Date(2024, 5, 10));
  component.endDate.set(new Date(2024, 5, 20));
  fixture.detectChanges();

  await prepareElementForScreenshot(nativeElement);

  // Compare with baseline
  const current = await captureElementScreenshot(nativeElement);
  const baseline = loadBaselineImage("range-selection-light-desktop");
  const result = compareImageData(current.data, baseline.data);

  expect(result.matches).toBe(true);
});
```

## Best Practices

### 1. Disable Animations

Always disable animations before capturing screenshots:

```typescript
disableAnimations();
// ... capture screenshots
enableAnimations();
```

### 2. Wait for Stability

Ensure elements are stable before capture:

```typescript
await prepareElementForScreenshot(element, { timeout: 5000 });
```

### 3. Use Consistent Data

Use fixed dates and data for reproducible results:

```typescript
component.selectedDate.set(new Date(2024, 5, 15, 14, 30, 0));
```

### 4. Test Critical Paths

Focus on user-visible states:

- Default view
- Selected dates
- Range selection
- Disabled states
- Error states

### 5. Organize Baseline Images

Structure baseline images by:

```
visual-regression/
  baseline/
    light-mobile/
      calendar-default.png
      calendar-selected.png
    light-desktop/
      calendar-default.png
      calendar-selected.png
    dark-mobile/
    dark-desktop/
  diff/
```

## Troubleshooting

### Test Failures

**Problem**: Tests fail with high diff percentage

- **Solution**: Check for animation artifacts, font loading issues, or timing problems
- Use `prepareElementForScreenshot` with longer timeout

**Problem**: Inconsistent results across runs

- **Solution**: Ensure animations are disabled, use fixed dates, wait for fonts to load

**Problem**: Large diff images

- **Solution**: Increase threshold for minor pixel differences, check for anti-aliasing issues

### Performance Issues

**Problem**: Screenshot capture is slow

- **Solution**: Reduce number of scenarios, use smaller viewports, optimize DOM size

**Problem**: Memory issues with large test suites

- **Solution**: Run tests in smaller batches, clear DOM between tests

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run visual regression tests
        run: npm test -- --include='**/visual-regression.spec.ts'

      - name: Upload diff images
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-diffs
          path: visual-regression/diff/
```

## Future Enhancements

Potential improvements to the visual regression testing infrastructure:

1. **Playwright Integration**: Full browser automation with built-in screenshot comparison
2. **Percy/Chromatic Integration**: Cloud-based visual regression service
3. **Automated Baseline Updates**: Smart baseline update workflows
4. **Component Isolation**: Test individual components in isolation
5. **Animation Testing**: Test animation states and transitions
6. **Responsive Design Testing**: More viewport variations
7. **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
8. **PDF Report Generation**: Detailed visual diff reports

## Resources

- [Jasmine Testing Framework](https://jasmine.github.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Percy Visual Testing](https://percy.io/)
- [Chromatic](https://www.chromatic.com/)

## Support

For issues or questions about visual regression testing:

- Check existing test examples in `visual-regression.spec.ts`
- Review this documentation
- Open an issue on GitHub with screenshots and error messages
