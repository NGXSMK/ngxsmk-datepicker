# Plugin Architecture

**Last updated:** February 2026 · **Current stable:** v2.1.6

ngxsmk-datepicker features a powerful **plugin architecture** that allows you to extend and customize the component's behavior without modifying its core code. This architecture is built on a **hook-based system** that provides extension points throughout the component's lifecycle.

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Plugin Types](#plugin-types)
- [Creating Plugins](#creating-plugins)
- [Plugin Lifecycle](#plugin-lifecycle)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)

## Overview

The plugin architecture in ngxsmk-datepicker is designed around the concept of **hooks** - functions that are called at specific points in the component's execution flow. These hooks allow you to:

- **Intercept** component behavior before it executes
- **Modify** data and UI rendering
- **Extend** functionality with custom logic
- **Validate** user input with custom rules
- **React** to component events and state changes

### Key Concepts

```
┌─────────────────────────────────────────────────────────────┐
│                    Datepicker Component                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Core Component Logic                     │  │
│  │                                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │  Render  │  │ Validate │  │  Events  │          │  │
│  │  │  Hooks   │  │  Hooks   │  │  Hooks   │          │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘          │  │
│  │       │             │             │                 │  │
│  │       └─────────────┼─────────────┘                 │  │
│  │                     │                               │  │
│  │              ┌──────▼──────┐                        │  │
│  │              │   Plugin    │                        │  │
│  │              │   Registry  │                        │  │
│  │              └──────┬──────┘                        │  │
│  │                     │                               │  │
│  └─────────────────────┼───────────────────────────────┘  │
│                        │                                   │
└────────────────────────┼───────────────────────────────────┘
                         │
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Plugin  │    │ Plugin  │    │ Plugin  │
    │    A    │    │    B    │    │    C    │
    └─────────┘    └─────────┘    └─────────┘
```

## Architecture Principles

### 1. **Non-Invasive Extension**

Plugins extend functionality without modifying core code:

```typescript
// ✅ Good: Plugin extends behavior
const myPlugin: DatepickerHooks = {
  validateDate: (date) => date.getDay() !== 0 // Disable Sundays
};

// ❌ Bad: Modifying core component (not possible, but conceptually wrong)
// Don't try to override internal methods
```

### 2. **Composable Architecture**

Multiple plugins can work together:

```typescript
// Combine multiple plugins
const weekendPlugin: DatepickerHooks = {
  validateDate: (date) => date.getDay() !== 0 && date.getDay() !== 6
};

const businessDaysPlugin: DatepickerHooks = {
  getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return ['weekend-day'];
    }
    return [];
  }
};

// Use both together
const combinedHooks: DatepickerHooks = {
  ...weekendPlugin,
  ...businessDaysPlugin
};
```

### 3. **Type-Safe Extensions**

All plugins are fully typed with TypeScript:

```typescript
import { DatepickerHooks } from 'ngxsmk-datepicker';

// TypeScript ensures type safety
const plugin: DatepickerHooks = {
  validateDate: (date: Date, currentValue: DatepickerValue, mode: string) => {
    // TypeScript knows the exact types
    return true;
  }
};
```

### 4. **Optional Execution**

Hooks are optional - the component works without them:

```typescript
// Component works fine without plugins
<ngxsmk-datepicker mode="single"></ngxsmk-datepicker>

// Plugins are optional enhancements
<ngxsmk-datepicker 
  [hooks]="myPlugin" 
  mode="single">
</ngxsmk-datepicker>
```

## Plugin Types

The plugin architecture consists of **5 main plugin types**, each serving a specific purpose:

### 1. **Rendering Plugins** (`DayCellRenderHook`)

Control how dates are rendered in the calendar:

```typescript
interface DayCellRenderHook {
  getDayCellClasses?(date: Date, isSelected: boolean, isDisabled: boolean, isToday: boolean, isHoliday: boolean): string[];
  getDayCellTooltip?(date: Date, holidayLabel: string | null): string | null;
  formatDayNumber?(date: Date): string;
}
```

**Use Cases:**
- Custom styling for specific dates
- Conditional CSS classes
- Custom tooltips
- Date number formatting

**Example:**
```typescript
const stylingPlugin: DatepickerHooks = {
  getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
    const classes: string[] = [];
    
    // Add custom classes based on date properties
    if (isToday) classes.push('custom-today');
    if (isHoliday) classes.push('custom-holiday');
    if (date.getDate() === 1) classes.push('first-of-month');
    
    return classes;
  },
  
  getDayCellTooltip: (date, holidayLabel) => {
    if (holidayLabel) {
      return `🎉 ${holidayLabel}`;
    }
    return `Date: ${date.toLocaleDateString()}`;
  }
};
```

### 2. **Validation Plugins** (`ValidationHook`)

Add custom validation rules:

```typescript
interface ValidationHook {
  validateDate?(date: Date, currentValue: DatepickerValue, mode: string): boolean;
  validateRange?(startDate: Date, endDate: Date): boolean;
  getValidationError?(date: Date): string | null;
}
```

**Use Cases:**
- Business rule validation
- Date range constraints
- Custom disabled date logic
- Error message customization

**Example:**
```typescript
const validationPlugin: DatepickerHooks = {
  validateDate: (date, currentValue, mode) => {
    // Prevent past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return false;
    }
    
    // Prevent weekends
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return false;
    }
    
    return true;
  },
  
  validateRange: (startDate, endDate) => {
    // Ensure minimum 3-day range
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 3;
  },
  
  getValidationError: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return 'Cannot select past dates';
    }
    return null;
  }
};
```

### 3. **Keyboard Shortcut Plugins** (`KeyboardShortcutHook`)

Add custom keyboard shortcuts:

```typescript
interface KeyboardShortcutHook {
  handleShortcut?(event: KeyboardEvent, context: KeyboardShortcutContext): boolean;
  getShortcutHelp?(): KeyboardShortcutHelp[];
}
```

**Use Cases:**
- Custom navigation shortcuts
- Application-specific shortcuts
- Power user features
- Accessibility enhancements

**Example:**
```typescript
const shortcutPlugin: DatepickerHooks = {
  handleShortcut: (event, context) => {
    // Custom shortcut: Ctrl+1 for first day of month
    if (event.ctrlKey && event.key === '1') {
      // Navigate to first day
      return true; // Handled
    }
    
    // Custom shortcut: Ctrl+L for last day of month
    if (event.ctrlKey && event.key === 'l') {
      // Navigate to last day
      return true; // Handled
    }
    
    return false; // Not handled, use default
  },
  
  getShortcutHelp: () => [
    { key: 'Ctrl+1', description: 'Go to first day of month' },
    { key: 'Ctrl+L', description: 'Go to last day of month' }
  ]
};
```

### 4. **Formatting Plugins** (`DateFormatHook`)

Customize date formatting:

```typescript
interface DateFormatHook {
  formatDisplayValue?(value: DatepickerValue, mode: string): string;
  formatAriaLabel?(date: Date): string;
}
```

**Use Cases:**
- Custom date display formats
- Localized formatting
- Accessibility labels
- Brand-specific formatting

**Example:**
```typescript
const formattingPlugin: DatepickerHooks = {
  formatDisplayValue: (value, mode) => {
    if (mode === 'single' && value instanceof Date) {
      // Custom format: "Monday, January 15, 2024"
      return value.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    if (mode === 'range' && typeof value === 'object' && 'start' in value) {
      const range = value as { start: Date; end: Date };
      return `${range.start.toLocaleDateString()} → ${range.end.toLocaleDateString()}`;
    }
    
    return ''; // Use default
  },
  
  formatAriaLabel: (date) => {
    return `Select ${date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}`;
  }
};
```

### 5. **Event Plugins** (`EventHook`)

React to component lifecycle events:

```typescript
interface EventHook {
  beforeDateSelect?(date: Date, currentValue: DatepickerValue): boolean;
  afterDateSelect?(date: Date, newValue: DatepickerValue): void;
  onCalendarOpen?(): void;
  onCalendarClose?(): void;
}
```

**Use Cases:**
- Analytics tracking
- Side effects (API calls, logging)
- Pre-selection validation
- Post-selection actions

**Example:**
```typescript
const eventPlugin: DatepickerHooks = {
  beforeDateSelect: (date, currentValue) => {
    // Log selection attempt
    console.log('Attempting to select:', date);
    
    // Prevent selection on specific dates
    if (date.getDate() === 13) {
      return false; // Prevent selection
    }
    
    return true; // Allow selection
  },
  
  afterDateSelect: (date, newValue) => {
    // Track analytics
    analytics.track('date_selected', {
      date: date.toISOString(),
      mode: 'single'
    });
    
    // Perform side effects
    this.updateRelatedComponents(newValue);
  },
  
  onCalendarOpen: () => {
    console.log('Calendar opened');
    analytics.track('calendar_opened');
  },
  
  onCalendarClose: () => {
    console.log('Calendar closed');
    analytics.track('calendar_closed');
  }
};
```

## Creating Plugins

### Basic Plugin Structure

A plugin is simply an object that implements one or more hook interfaces:

```typescript
import { DatepickerHooks } from 'ngxsmk-datepicker';

// Create a plugin
const myPlugin: DatepickerHooks = {
  // Implement any hooks you need
  validateDate: (date) => {
    // Your logic here
    return true;
  }
};

// Use the plugin
@Component({
  template: `
    <ngxsmk-datepicker
      [hooks]="myPlugin"
      mode="single">
    </ngxsmk-datepicker>
  `
})
export class MyComponent {
  myPlugin = myPlugin;
}
```

### Reusable Plugin Classes

Create reusable plugin classes for better organization:

```typescript
// plugins/weekend-blocker.plugin.ts
import { DatepickerHooks } from 'ngxsmk-datepicker';

export class WeekendBlockerPlugin implements DatepickerHooks {
  validateDate(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Block weekends
  }
  
  getDayCellClasses(date: Date, isSelected: boolean, isDisabled: boolean, isToday: boolean, isHoliday: boolean): string[] {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return ['weekend-disabled'];
    }
    return [];
  }
}

// Usage
@Component({
  template: `
    <ngxsmk-datepicker
      [hooks]="weekendPlugin"
      mode="single">
    </ngxsmk-datepicker>
  `
})
export class MyComponent {
  weekendPlugin = new WeekendBlockerPlugin();
}
```

### Plugin Factories

Create plugins with configuration:

```typescript
// plugins/business-days.plugin.ts
import { DatepickerHooks } from 'ngxsmk-datepicker';

export interface BusinessDaysConfig {
  allowedDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  customMessage?: string;
}

export function createBusinessDaysPlugin(config: BusinessDaysConfig): DatepickerHooks {
  return {
    validateDate: (date: Date) => {
      const day = date.getDay();
      return config.allowedDays.includes(day);
    },
    
    getValidationError: (date: Date) => {
      if (!config.allowedDays.includes(date.getDay())) {
        return config.customMessage || 'Only business days are allowed';
      }
      return null;
    }
  };
}

// Usage
@Component({
  template: `
    <ngxsmk-datepicker
      [hooks]="businessDaysPlugin"
      mode="single">
    </ngxsmk-datepicker>
  `
})
export class MyComponent {
  businessDaysPlugin = createBusinessDaysPlugin({
    allowedDays: [1, 2, 3, 4, 5], // Monday to Friday
    customMessage: 'Only weekdays are selectable'
  });
}
```

### Composing Multiple Plugins

Combine multiple plugins:

```typescript
// Combine plugins using object spread
const combinedPlugin: DatepickerHooks = {
  ...weekendBlockerPlugin,
  ...businessDaysPlugin,
  ...customStylingPlugin
};

// Or use a utility function
function combinePlugins(...plugins: DatepickerHooks[]): DatepickerHooks {
  return Object.assign({}, ...plugins);
}

const combined = combinePlugins(
  weekendBlockerPlugin,
  businessDaysPlugin,
  customStylingPlugin
);
```

## Plugin Lifecycle

Understanding when hooks are called helps you write effective plugins:

### 1. **Initialization Phase**

```
Component Init → Calendar Generation → Hook: getDayCellClasses (for each date)
```

### 2. **User Interaction Phase**

```
User Clicks Date
  ↓
Hook: beforeDateSelect (can prevent selection)
  ↓
Hook: validateDate (can prevent selection)
  ↓
Date Selected (if allowed)
  ↓
Hook: afterDateSelect
```

### 3. **Rendering Phase**

```
Calendar Render
  ↓
For each date:
  - Hook: getDayCellClasses
  - Hook: getDayCellTooltip
  - Hook: formatDayNumber
```

### 4. **Keyboard Interaction Phase**

```
Key Press
  ↓
Hook: handleShortcut (can handle custom shortcuts)
  ↓
Default Shortcut Handling (if not handled)
```

### 5. **Formatting Phase**

```
Value Change
  ↓
Hook: formatDisplayValue (for input display)
  ↓
Display Updated
```

## Advanced Patterns

### 1. **Plugin with State**

Plugins can maintain their own state:

```typescript
export class StatefulPlugin implements DatepickerHooks {
  private selectedDates: Date[] = [];
  
  validateDate(date: Date, currentValue: DatepickerValue): boolean {
    // Limit to 5 selections
    if (Array.isArray(currentValue)) {
      return currentValue.length < 5;
    }
    return true;
  }
  
  afterDateSelect(date: Date, newValue: DatepickerValue): void {
    // Track selections
    if (Array.isArray(newValue)) {
      this.selectedDates = newValue;
    }
  }
}
```

### 2. **Plugin with Dependencies**

Plugins can depend on services:

```typescript
import { Injectable } from '@angular/core';
import { DatepickerHooks } from 'ngxsmk-datepicker';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsPlugin implements DatepickerHooks {
  constructor(private analytics: AnalyticsService) {}
  
  afterDateSelect(date: Date, newValue: DatepickerValue): void {
    this.analytics.track('date_selected', {
      date: date.toISOString(),
      value: newValue
    });
  }
  
  onCalendarOpen(): void {
    this.analytics.track('calendar_opened');
  }
  
  onCalendarClose(): void {
    this.analytics.track('calendar_closed');
  }
}
```

### 3. **Conditional Plugin Application**

Apply plugins conditionally:

```typescript
@Component({
  template: `
    <ngxsmk-datepicker
      [hooks]="activePlugins"
      mode="single">
    </ngxsmk-datepicker>
  `
})
export class MyComponent {
  enableWeekendBlocking = true;
  enableAnalytics = false;
  
  get activePlugins(): DatepickerHooks {
    const plugins: DatepickerHooks = {};
    
    if (this.enableWeekendBlocking) {
      Object.assign(plugins, weekendBlockerPlugin);
    }
    
    if (this.enableAnalytics) {
      Object.assign(plugins, analyticsPlugin);
    }
    
    return plugins;
  }
}
```

### 4. **Plugin Middleware Pattern**

Create middleware-style plugins:

```typescript
function createValidationMiddleware(
  ...validators: Array<(date: Date) => boolean>
): DatepickerHooks {
  return {
    validateDate: (date: Date) => {
      // All validators must pass
      return validators.every(validator => validator(date));
    }
  };
}

// Usage
const validationPlugin = createValidationMiddleware(
  (date) => date.getDay() !== 0, // Not Sunday
  (date) => date.getDay() !== 6, // Not Saturday
  (date) => date >= new Date()   // Not in past
);
```

## Best Practices

### 1. **Keep Plugins Focused**

Each plugin should have a single responsibility:

```typescript
// ✅ Good: Focused plugin
const weekendBlocker: DatepickerHooks = {
  validateDate: (date) => date.getDay() !== 0 && date.getDay() !== 6
};

// ❌ Bad: Too many responsibilities
const megaPlugin: DatepickerHooks = {
  validateDate: (date) => { /* ... */ },
  getDayCellClasses: (date) => { /* ... */ },
  formatDisplayValue: (value) => { /* ... */ },
  handleShortcut: (event) => { /* ... */ },
  // ... too many things
};
```

### 2. **Make Plugins Reusable**

Design plugins to be reusable across projects:

```typescript
// ✅ Good: Configurable and reusable
export function createBusinessDaysPlugin(config: BusinessDaysConfig): DatepickerHooks {
  return {
    validateDate: (date) => config.allowedDays.includes(date.getDay())
  };
}

// ❌ Bad: Hard-coded and not reusable
const myBusinessDays: DatepickerHooks = {
  validateDate: (date) => [1, 2, 3, 4, 5].includes(date.getDay())
};
```

### 3. **Optimize Performance**

Keep hook functions lightweight:

```typescript
// ✅ Good: Lightweight and memoized
const memoizedValidation = new Map<string, boolean>();

const optimizedPlugin: DatepickerHooks = {
  validateDate: (date) => {
    const key = date.toISOString().split('T')[0];
    if (memoizedValidation.has(key)) {
      return memoizedValidation.get(key)!;
    }
    const result = /* expensive validation */;
    memoizedValidation.set(key, result);
    return result;
  }
};

// ❌ Bad: Expensive operation on every call
const slowPlugin: DatepickerHooks = {
  validateDate: (date) => {
    // Expensive API call on every validation
    return this.apiService.checkDate(date).toPromise();
  }
};
```

### 4. **Provide Clear Error Messages**

Use `getValidationError` for user-friendly messages:

```typescript
// ✅ Good: Clear error messages
const userFriendlyPlugin: DatepickerHooks = {
  validateDate: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  },
  
  getValidationError: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return 'Please select a date from today onwards';
    }
    return null;
  }
};
```

### 5. **Test Your Plugins**

Write tests for your plugins:

```typescript
describe('WeekendBlockerPlugin', () => {
  it('should block weekends', () => {
    const plugin = new WeekendBlockerPlugin();
    const saturday = new Date(2024, 0, 6); // Saturday
    const monday = new Date(2024, 0, 8);   // Monday
    
    expect(plugin.validateDate?.(saturday)).toBe(false);
    expect(plugin.validateDate?.(monday)).toBe(true);
  });
});
```

## Complete Example

Here's a complete example of a production-ready plugin:

```typescript
// plugins/business-calendar.plugin.ts
import { DatepickerHooks, DatepickerValue } from 'ngxsmk-datepicker';

export interface BusinessCalendarConfig {
  businessDays: number[];        // [1,2,3,4,5] for Mon-Fri
  holidays: Date[];              // Array of holiday dates
  minAdvanceDays: number;        // Minimum days in advance
  maxAdvanceDays: number;        // Maximum days in advance
}

export function createBusinessCalendarPlugin(
  config: BusinessCalendarConfig
): DatepickerHooks {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + config.minAdvanceDays);
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + config.maxAdvanceDays);
  
  const isHoliday = (date: Date): boolean => {
    return config.holidays.some(holiday => {
      return holiday.toDateString() === date.toDateString();
    });
  };
  
  const isBusinessDay = (date: Date): boolean => {
    const day = date.getDay();
    return config.businessDays.includes(day) && !isHoliday(date);
  };
  
  return {
    validateDate: (date: Date) => {
      // Check if within date range
      if (date < minDate || date > maxDate) {
        return false;
      }
      
      // Check if business day
      return isBusinessDay(date);
    },
    
    getValidationError: (date: Date) => {
      if (date < minDate) {
        return `Please select a date at least ${config.minAdvanceDays} days in advance`;
      }
      if (date > maxDate) {
        return `Please select a date within ${config.maxAdvanceDays} days`;
      }
      if (!isBusinessDay(date)) {
        return 'Please select a business day';
      }
      return null;
    },
    
    getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
      const classes: string[] = [];
      
      if (!isBusinessDay(date)) {
        classes.push('non-business-day');
      }
      
      if (isHoliday(date)) {
        classes.push('holiday');
      }
      
      return classes;
    },
    
    getDayCellTooltip: (date, holidayLabel) => {
      if (isHoliday(date)) {
        return holidayLabel || 'Holiday';
      }
      if (!isBusinessDay(date)) {
        return 'Not a business day';
      }
      return null;
    }
  };
}

// Usage
@Component({
  template: `
    <ngxsmk-datepicker
      [hooks]="businessCalendarPlugin"
      mode="single"
      placeholder="Select a business day">
    </ngxsmk-datepicker>
  `
})
export class BookingComponent {
  businessCalendarPlugin = createBusinessCalendarPlugin({
    businessDays: [1, 2, 3, 4, 5], // Monday to Friday
    holidays: [
      new Date(2024, 0, 1),  // New Year's Day
      new Date(2024, 6, 4),  // Independence Day
      new Date(2024, 11, 25) // Christmas
    ],
    minAdvanceDays: 1,
    maxAdvanceDays: 90
  });
}
```

## Summary

The plugin architecture in ngxsmk-datepicker provides:

- ✅ **Non-invasive extension** - Extend without modifying core code
- ✅ **Type safety** - Full TypeScript support
- ✅ **Composability** - Combine multiple plugins
- ✅ **Flexibility** - Optional and configurable
- ✅ **Performance** - Lightweight hook system
- ✅ **Maintainability** - Clear separation of concerns

For more examples and detailed hook documentation, see [Extension Points Guide](./extension-points.md).

