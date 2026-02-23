# Theme Tokens & CSS Custom Properties

**Last updated:** February 23, 2026 · **Current stable:** v2.1.7

Complete reference for all CSS custom properties (CSS variables) available in ngxsmk-datepicker.

## Overview

ngxsmk-datepicker uses CSS custom properties for theming, allowing you to customize the appearance without modifying the component's internal styles. All variables are prefixed with `--datepicker-` and can be overridden at any level in your CSS.

## Color Tokens

### Primary Colors

| Variable | Default (Light) | Default (Dark) | Description |
|----------|----------------|----------------|-------------|
| `--datepicker-primary-color` | `#6d28d9` | `#8b5cf6` | Primary brand color for selected dates, buttons, and focus states |
| `--datepicker-primary-contrast` | `#ffffff` | `#ffffff` | Text color on primary color background |

### Background Colors

| Variable | Default (Light) | Default (Dark) | Description |
|----------|----------------|----------------|-------------|
| `--datepicker-background` | `#ffffff` | `#1f2937` | Main background color for calendar container |
| `--datepicker-range-background` | `#f5f3ff` | `rgba(139, 92, 246, 0.15)` | Background color for date range selection |
| `--datepicker-hover-background` | `#f3f4f6` | `#374151` | Background color for hover states |

### Text Colors

| Variable | Default (Light) | Default (Dark) | Description |
|----------|----------------|----------------|-------------|
| `--datepicker-text-color` | `#1f2937` | `#f3f4f6` | Primary text color |
| `--datepicker-subtle-text-color` | `#6b7280` | `#9ca3af` | Secondary/subtle text color for labels and hints |

### Border Colors

| Variable | Default (Light) | Default (Dark) | Description |
|----------|----------------|----------------|-------------|
| `--datepicker-border-color` | `#e5e7eb` | `#374151` | Border color for inputs, calendar, and dividers |

## Shadow Tokens

| Variable | Default (Light) | Default (Dark) | Description |
|----------|----------------|----------------|-------------|
| `--datepicker-shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `0 1px 2px 0 rgba(0, 0, 0, 0.3)` | Small shadow for subtle elevation |
| `--datepicker-shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | `0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)` | Medium shadow for popover and elevated elements |
| `--datepicker-shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | `0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)` | Large shadow for modal overlays |
| `--datepicker-shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | Same as light | Extra large shadow (not used in dark theme) |

## Typography Tokens

| Variable | Default | Description |
|----------|---------|-------------|
| `--datepicker-font-size-base` | `14px` | Base font size for most text |
| `--datepicker-font-size-sm` | `12px` | Small font size for labels and hints |
| `--datepicker-font-size-lg` | `16px` | Large font size for headers |
| `--datepicker-font-size-xl` | `18px` | Extra large font size |
| `--datepicker-line-height` | `1.5` | Line height for text |

## Spacing Tokens

| Variable | Default | Description |
|----------|---------|-------------|
| `--datepicker-spacing-xs` | `4px` | Extra small spacing |
| `--datepicker-spacing-sm` | `8px` | Small spacing |
| `--datepicker-spacing-md` | `12px` | Medium spacing (default) |
| `--datepicker-spacing-lg` | `16px` | Large spacing |
| `--datepicker-spacing-xl` | `20px` | Extra large spacing |
| `--datepicker-spacing-2xl` | `24px` | 2X large spacing |

## Border Radius Tokens

| Variable | Default | Description |
|----------|---------|-------------|
| `--datepicker-radius-sm` | `6px` | Small border radius |
| `--datepicker-radius-md` | `8px` | Medium border radius (default) |
| `--datepicker-radius-lg` | `12px` | Large border radius |
| `--datepicker-radius-xl` | `16px` | Extra large border radius |

## Transition Tokens

| Variable | Default | Description |
|----------|---------|-------------|
| `--datepicker-transition` | `opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)` | Default transition for animations |

## Global CSS Variables Override

When CSS variables are defined in a global `:root` selector, the ThemeBuilderService will now properly override them with enhanced specificity and `!important` flags to ensure your theme values take precedence.

```css
/* When CSS variables are defined in global :root selector */
:root {
  --datepicker-primary-color: #ff0000;
  --datepicker-primary-contrast: #ffffff;
}

/* ThemeBuilderService will now properly override these global variables */
```

**Note**: If you have CSS variables defined in a global `:root` selector, ThemeBuilderService will now properly override them with enhanced specificity and `!important` flags to ensure your theme values take precedence.

## Usage Examples

### Basic Theme Override

```css
/* Override at component level */
ngxsmk-datepicker {
  --datepicker-primary-color: #3b82f6;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #dbeafe;
}
```

### Brand Color Theme

```css
/* Blue brand theme */
ngxsmk-datepicker {
  --datepicker-primary-color: #2563eb;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #dbeafe;
  --datepicker-border-color: #93c5fd;
  --datepicker-hover-background: #eff6ff;
}
```

### Green Brand Theme

```css
/* Green brand theme */
ngxsmk-datepicker {
  --datepicker-primary-color: #10b981;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #d1fae5;
  --datepicker-border-color: #6ee7b7;
  --datepicker-hover-background: #ecfdf5;
}
```

### Compact Mode

```css
/* Compact spacing for dense UIs */
ngxsmk-datepicker {
  --datepicker-spacing-xs: 2px;
  --datepicker-spacing-sm: 4px;
  --datepicker-spacing-md: 6px;
  --datepicker-spacing-lg: 8px;
  --datepicker-spacing-xl: 12px;
  --datepicker-spacing-2xl: 16px;
  --datepicker-font-size-base: 12px;
  --datepicker-font-size-sm: 10px;
  --datepicker-radius-md: 4px;
  --datepicker-radius-sm: 2px;
}
```

### High Contrast Theme

```css
/* High contrast for accessibility */
ngxsmk-datepicker {
  --datepicker-primary-color: #000000;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-background: #ffffff;
  --datepicker-text-color: #000000;
  --datepicker-border-color: #000000;
  --datepicker-hover-background: #f0f0f0;
  --datepicker-range-background: #e0e0e0;
}
```

### Material Design Theme

```css
/* Material Design inspired */
ngxsmk-datepicker {
  --datepicker-primary-color: #6200ee;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #e1bee7;
  --datepicker-border-color: #b39ddb;
  --datepicker-hover-background: #f3e5f5;
  --datepicker-radius-md: 4px;
  --datepicker-shadow-md: 0 2px 4px rgba(0,0,0,0.2);
}
```

### Tailwind Integration

```css
/* Using Tailwind CSS variables */
ngxsmk-datepicker {
  --datepicker-primary-color: var(--tw-color-blue-600);
  --datepicker-primary-contrast: var(--tw-color-white);
  --datepicker-background: var(--tw-color-white);
  --datepicker-text-color: var(--tw-color-gray-900);
  --datepicker-border-color: var(--tw-color-gray-300);
  --datepicker-hover-background: var(--tw-color-gray-100);
}
```

### Design System Integration (TokiForge)

```css
/* TokiForge design tokens */
ngxsmk-datepicker {
  --datepicker-primary-color: var(--toki-color-primary);
  --datepicker-primary-contrast: var(--toki-color-on-primary);
  --datepicker-background: var(--toki-color-surface);
  --datepicker-text-color: var(--toki-color-on-surface);
  --datepicker-border-color: var(--toki-color-outline);
  --datepicker-hover-background: var(--toki-color-surface-variant);
  --datepicker-spacing-md: var(--toki-spacing-md);
  --datepicker-radius-md: var(--toki-radius-md);
}
```

## Scoped Theming

You can apply different themes to different datepicker instances:

```css
/* Theme for specific datepicker */
.my-custom-datepicker {
  --datepicker-primary-color: #ec4899;
  --datepicker-range-background: #fce7f3;
}

/* Another theme for different datepicker */
.my-other-datepicker {
  --datepicker-primary-color: #06b6d4;
  --datepicker-range-background: #cffafe;
}
```

```html
<ngxsmk-datepicker class="my-custom-datepicker" mode="single"></ngxsmk-datepicker>
<ngxsmk-datepicker class="my-other-datepicker" mode="range"></ngxsmk-datepicker>
```

## Dark Theme

The component automatically applies dark theme variables when `[theme]="'dark'"` is set:

```html
<ngxsmk-datepicker [theme]="'dark'"></ngxsmk-datepicker>
```

You can also override dark theme variables:

```css
ngxsmk-datepicker.dark-theme {
  --datepicker-primary-color: #a78bfa;
  --datepicker-background: #111827;
}
```

## Complete Variable List

For reference, here's the complete list of all CSS custom properties:

```css
/* Colors */
--datepicker-primary-color
--datepicker-primary-contrast
--datepicker-range-background
--datepicker-background
--datepicker-text-color
--datepicker-subtle-text-color
--datepicker-border-color
--datepicker-hover-background

/* Shadows */
--datepicker-shadow-sm
--datepicker-shadow-md
--datepicker-shadow-lg
--datepicker-shadow-xl

/* Typography */
--datepicker-font-size-base
--datepicker-font-size-sm
--datepicker-font-size-lg
--datepicker-font-size-xl
--datepicker-line-height

/* Spacing */
--datepicker-spacing-xs
--datepicker-spacing-sm
--datepicker-spacing-md
--datepicker-spacing-lg
--datepicker-spacing-xl
--datepicker-spacing-2xl

/* Border Radius */
--datepicker-radius-sm
--datepicker-radius-md
--datepicker-radius-lg
--datepicker-radius-xl

/* Transitions */
--datepicker-transition
```

## Best Practices

1. **Use CSS Variables**: Always use CSS custom properties for theming, not direct style overrides
2. **Scope Appropriately**: Apply theme variables at the appropriate scope (component, page, or global)
3. **Maintain Contrast**: Ensure sufficient contrast ratios for accessibility (WCAG AA minimum)
4. **Test Dark Mode**: Always test your custom themes in both light and dark modes
5. **Use Design Tokens**: Integrate with your design system's token system when available

## Browser Support

CSS custom properties are supported in all modern browsers:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

For older browsers, consider using a CSS custom properties polyfill or provide fallback values.

