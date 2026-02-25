# Accessibility Testing

**Last updated:** February 25, 2026 · **Current stable:** v2.1.9

This document outlines the accessibility testing infrastructure integrated into the ngxsmk-datepicker library.

## Overview

The library now includes comprehensive accessibility testing utilities powered by axe-core, enabling automated detection of ARIA violations, keyboard navigation issues, and other accessibility concerns.

## Installation

Axe-core is included as an optional development dependency:

```bash
npm install --save-dev axe-core @axe-core/core
```

## Testing Utilities

### Location

`projects/ngxsmk-datepicker/src/lib/utils/accessibility-testing.utils.ts`

### Available Functions

#### `runAccessibilityScan(config?)`

Executes an axe-core accessibility scan on the current document or specified element.

```typescript
const results = await runAccessibilityScan({
  runOnly: {
    type: "tag",
    values: ["wcag2aa"], // WCAG 2.0 Level AA rules
  },
});
```

**Parameters:**

- `config.root` - CSS selector for the root element to scan
- `config.runOnly` - Specify rule tags to run (e.g., 'wcag2a', 'wcag2aa', 'wcag21aa')
- `config.rules` - Individual rule configuration

**Returns:** `AccessibilityCheckResult | null`

- Returns `null` if axe-core is not available
- Returns scan results with `violations`, `passes`, and `incomplete` arrays

#### `assertNoA11yViolations(results, severityLevel?)`

Assertion helper that throws if accessibility violations are found above a specified severity level.

```typescript
try {
  assertNoA11yViolations(results, "serious");
} catch (error) {
  console.error("Accessibility violations found!");
}
```

**Severity Levels:**

- `critical` - Only critical violations
- `serious` - Serious and critical violations
- `moderate` - Moderate, serious, and critical violations
- `minor` - All violations

#### `checkAriaAttributes(element, requiredAttributes)`

Verifies that an element has required ARIA attributes.

```typescript
const input = fixture.nativeElement.querySelector("input");
const result = checkAriaAttributes(input, ["aria-label", "aria-describedby"]);
// Returns: { 'aria-label': 'Select Date', 'aria-describedby': 'hint-123' }
```

#### `supportsKeyboardNavigation(element)`

Tests whether an element supports keyboard navigation.

```typescript
const button = fixture.nativeElement.querySelector("button");
const isAccessible = supportsKeyboardNavigation(button); // true
```

**Checks:**

- Native keyboard-accessible elements (button, a, input, etc.)
- Elements with `tabindex` attribute
- Elements with keyboard event listeners

#### `getInteractiveElements(container)`

Discovers all interactive elements within a container.

```typescript
const calendar = fixture.nativeElement.querySelector(".ngxsmk-calendar");
const interactiveElements = getInteractiveElements(calendar);
// Returns array of buttons, links, inputs, etc.
```

#### `canFocus(element)`

Tests whether an element can receive keyboard focus.

```typescript
const div = document.createElement("div");
div.setAttribute("tabindex", "0");
const focusable = canFocus(div); // true
```

#### `formatA11yViolations(results)`

Formats axe-core results into a human-readable string for logging.

```typescript
const formatted = formatA11yViolations(results);
console.log(formatted);
// Output:
// Critical Violations (2):
//   - color-contrast: Element has insufficient color contrast
//     <button class="btn">Click me</button>
```

## Integration Example

### In Test Files

```typescript
import { runAccessibilityScan, assertNoA11yViolations, checkAriaAttributes } from "../utils/accessibility-testing.utils";

describe("MyComponent Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const results = await runAccessibilityScan({
      runOnly: {
        type: "tag",
        values: ["wcag2aa"],
      },
    });

    if (results) {
      assertNoA11yViolations(results, "serious");
    } else {
      pending("axe-core not available");
    }
  });

  it("should have proper ARIA labels", () => {
    const input = fixture.nativeElement.querySelector("input");
    const attrs = checkAriaAttributes(input, ["aria-label"]);
    expect(attrs["aria-label"]).toBeTruthy();
  });
});
```

## Existing Tests

### `accessibility.spec.ts`

Located at `projects/ngxsmk-datepicker/src/lib/test/accessibility.spec.ts`

Contains comprehensive accessibility tests including:

**Manual Tests:**

- ARIA attribute verification
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Color contrast checking
- Semantic HTML validation
- Touch target sizing
- Live region updates

**Automated axe-core Tests:**

- Critical violations detection in initial state
- Violations detection when calendar is open
- ARIA attribute validation
- Keyboard navigation on interactive elements
- Focusability verification
- Role and label consistency
- Post-interaction accessibility maintenance
- Live region announcements
- Duplicate ID detection
- Descriptive link and button text

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in headless mode
npm run test:coverage
```

## Accessibility Compliance

The datepicker is tested against:

- **WCAG 2.0 Level A** - Basic accessibility
- **WCAG 2.0 Level AA** - Enhanced accessibility (recommended)
- **WCAG 2.1 Level AA** - Modern web accessibility

### Key Features

- ✅ Full keyboard navigation support
- ✅ Screen reader compatibility
- ✅ ARIA live regions for dynamic updates
- ✅ Proper focus management
- ✅ Color contrast compliance
- ✅ Touch target sizing (44x44px minimum)
- ✅ Semantic HTML structure
- ✅ High contrast mode support

## Troubleshooting

### "axe-core not available" in Tests

If you see tests being skipped with "axe-core not available":

1. Verify axe-core is installed:

   ```bash
   npm install --save-dev axe-core
   ```

2. Ensure it's loaded in your test environment
3. Check karma.conf.js includes axe-core files

### Test Failures

If accessibility tests fail:

1. Review the formatted violations output in the console
2. Fix reported issues in the component
3. Re-run tests to verify fixes
4. Consider temporarily lowering severity level during development:
   ```typescript
   assertNoA11yViolations(results, "moderate"); // Instead of 'critical'
   ```

## Best Practices

1. **Run Tests Frequently**: Accessibility regressions can be introduced easily. Run tests often.

2. **Test All States**: Test accessibility in all component states (open, closed, selected, disabled, etc.).

3. **Manual Testing**: Automated tests catch many issues but manual testing with screen readers is still essential.

4. **Keyboard Navigation**: Always verify keyboard navigation manually:
   - Tab through all interactive elements
   - Test arrow key navigation
   - Verify Escape closes overlays
   - Test Enter/Space activation

5. **Screen Reader Testing**: Test with actual screen readers:
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS/iOS)
   - TalkBack (Android)

## Resources

- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

## Contributing

When adding new features or components:

1. Add corresponding accessibility tests
2. Verify keyboard navigation works
3. Ensure proper ARIA attributes are present
4. Test with automated tools (axe-core)
5. Perform manual screen reader testing
6. Document any accessibility considerations

## License

Same as the parent project (MIT).
