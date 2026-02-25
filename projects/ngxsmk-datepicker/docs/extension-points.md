# Extension Points and Hooks

**Last updated:** February 25, 2026 · **Current stable:** v2.2.0

ngxsmk-datepicker provides comprehensive extension points through the `hooks` input, allowing you to customize rendering, validation, keyboard shortcuts, formatting, and event handling.

> **📚 For a complete understanding of the plugin architecture, see the [Plugin Architecture Guide](./PLUGIN-ARCHITECTURE.md)** which covers architecture principles, plugin patterns, lifecycle, and advanced use cases.

## Overview

The `hooks` input accepts a `DatepickerHooks` object that implements various hook interfaces:

- **DayCellRenderHook**: Customize day cell rendering
- **ValidationHook**: Custom validation and range rules
- **KeyboardShortcutHook**: Custom keyboard shortcuts
- **DateFormatHook**: Custom date formatting
- **EventHook**: Event lifecycle hooks

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerHooks } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-custom',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      [hooks]="myHooks"
      mode="single">
    </ngxsmk-datepicker>
  `
})
export class CustomComponent {
  myHooks: DatepickerHooks = {
    // Implement hook methods here
  };
}
```

## Day Cell Rendering Hooks

### Custom CSS Classes

Add custom CSS classes to day cells:

```typescript
myHooks: DatepickerHooks = {
  getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
    const classes: string[] = [];
    
    // Add custom class for weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      classes.push('weekend-day');
    }
    
    // Add custom class for first of month
    if (date.getDate() === 1) {
      classes.push('first-of-month');
    }
    
    return classes;
  }
};
```

### Custom Tooltips

Customize tooltip text for day cells:

```typescript
myHooks: DatepickerHooks = {
  getDayCellTooltip: (date, holidayLabel) => {
    if (holidayLabel) {
      return `Holiday: ${holidayLabel}`;
    }
    
    // Add custom tooltip for specific dates
    if (date.getDate() === 15) {
      return 'Mid-month special';
    }
    
    return null; // Use default
  }
};
```

### Custom Day Number Formatting

Format the day number display:

```typescript
myHooks: DatepickerHooks = {
  formatDayNumber: (date) => {
    // Add suffix (1st, 2nd, 3rd, etc.)
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix}`;
  }
};
```

## Validation Hooks

### Custom Date Validation

Add custom validation logic:

```typescript
myHooks: DatepickerHooks = {
  validateDate: (date, currentValue, mode) => {
    // Prevent selecting dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return false;
    }
    
    // Prevent selecting more than 5 dates in multiple mode
    if (mode === 'multiple' && Array.isArray(currentValue)) {
      if (currentValue.length >= 5) {
        return false;
      }
    }
    
    return true;
  }
};
```

### Custom Range Validation

Validate date ranges:

```typescript
myHooks: DatepickerHooks = {
  validateRange: (startDate, endDate) => {
    // Ensure range is at least 3 days
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays < 3) {
      return false; // Range too short
    }
    
    // Ensure range is not more than 30 days
    if (diffDays > 30) {
      return false; // Range too long
    }
    
    return true;
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

## Keyboard Shortcuts

### Custom Keyboard Shortcuts

Add custom keyboard shortcuts:

```typescript
myHooks: DatepickerHooks = {
  handleShortcut: (event, context) => {
    // Custom shortcut: Ctrl+1 for first day of month
    if (event.ctrlKey && event.key === '1') {
      const firstDay = new Date(context.currentDate);
      firstDay.setDate(1);
      // Navigate to first day
      return true; // Handled
    }
    
    // Custom shortcut: Ctrl+L for last day of month
    if (event.ctrlKey && event.key === 'l') {
      const lastDay = new Date(context.currentDate);
      lastDay.setMonth(lastDay.getMonth() + 1, 0);
      // Navigate to last day
      return true; // Handled
    }
    
    return false; // Not handled, use default
  }
};
```

### Using customShortcuts Input

Alternatively, use the `customShortcuts` input for simpler shortcuts:

```typescript
import { KeyboardShortcutContext } from 'ngxsmk-datepicker';

@Component({
  // ...
})
export class MyComponent {
  shortcuts = {
    'Ctrl+1': (context: KeyboardShortcutContext) => {
      // Handle Ctrl+1
      return true;
    },
    'Ctrl+L': (context: KeyboardShortcutContext) => {
      // Handle Ctrl+L
      return true;
    }
  };
}
```

```html
<ngxsmk-datepicker
  [customShortcuts]="shortcuts"
  mode="single">
</ngxsmk-datepicker>
```

## Date Formatting Hooks

### Custom Display Value Formatting

Format the input display value:

```typescript
myHooks: DatepickerHooks = {
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
    // Custom aria-label format
    return `Select ${date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}`;
  }
};
```

## Event Hooks

### Lifecycle Events

Hook into date selection lifecycle:

```typescript
myHooks: DatepickerHooks = {
  beforeDateSelect: (date, currentValue) => {
    // Called before date is selected
    // Return false to prevent selection
    console.log('About to select:', date);
    
    // Example: Prevent selection on weekends
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return false; // Prevent selection
    }
    
    return true; // Allow selection
  },
  
  afterDateSelect: (date, newValue) => {
    // Called after date is selected
    console.log('Date selected:', date);
    console.log('New value:', newValue);
    
    // Perform side effects (API calls, analytics, etc.)
  },
  
  onCalendarOpen: () => {
    console.log('Calendar opened');
    // Track analytics, etc.
  },
  
  onCalendarClose: () => {
    console.log('Calendar closed');
    // Cleanup, etc.
  }
};
```

## Complete Example

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerHooks } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      [hooks]="advancedHooks"
      [customShortcuts]="shortcuts"
      mode="range">
    </ngxsmk-datepicker>
  `
})
export class AdvancedComponent {
  advancedHooks: DatepickerHooks = {
    // Custom classes
    getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
      const classes: string[] = [];
      if (date.getDay() === 0 || date.getDay() === 6) {
        classes.push('weekend');
      }
      return classes;
    },
    
    // Custom validation
    validateRange: (start, end) => {
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return days >= 3 && days <= 30;
    },
    
    // Custom formatting
    formatDisplayValue: (value, mode) => {
      if (mode === 'range' && typeof value === 'object' && 'start' in value) {
        const r = value as { start: Date; end: Date };
        return `${r.start.toLocaleDateString()} - ${r.end.toLocaleDateString()}`;
      }
      return '';
    },
    
    // Event hooks
    beforeDateSelect: (date) => {
      return date.getDay() !== 0 && date.getDay() !== 6; // No weekends
    }
  };
  
  shortcuts = {
    'Ctrl+Home': (context) => {
      // Navigate to today
      return true;
    }
  };
}
```

## Built-in Keyboard Shortcuts

The datepicker includes these built-in shortcuts:

| Key | Action |
|-----|--------|
| `←` `→` `↑` `↓` | Navigate dates |
| `Page Up` | Previous month |
| `Page Down` | Next month |
| `Shift + Page Up` | Previous year |
| `Shift + Page Down` | Next year |
| `Home` | First day of month |
| `End` | Last day of month |
| `Enter` / `Space` | Select focused date |
| `Escape` | Close calendar |
| `T` | Select today |
| `Y` | Select yesterday |
| `N` | Select tomorrow |
| `W` | Select next week |

Disable shortcuts:
```html
<ngxsmk-datepicker
  [enableKeyboardShortcuts]="false"
  mode="single">
</ngxsmk-datepicker>
```

## Best Practices

1. **Performance**: Keep hook functions lightweight and memoize expensive operations
2. **Accessibility**: Ensure custom formatting maintains accessibility
3. **Validation**: Provide clear error messages via `getValidationError`
4. **Consistency**: Use consistent formatting across all hooks
5. **Testing**: Test hooks thoroughly, especially validation logic

## Type Safety

All hooks are fully typed with TypeScript interfaces. Use the exported types for better IDE support:

```typescript
import { 
  DatepickerHooks,
  KeyboardShortcutContext,
  KeyboardShortcutHelp
} from 'ngxsmk-datepicker';
```

