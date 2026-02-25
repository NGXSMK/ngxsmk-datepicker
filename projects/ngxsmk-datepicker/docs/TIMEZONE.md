# Timezone Support

**Last updated:** February 25, 2026 · **Current stable:** v2.2.0

## Overview

The `ngxsmk-datepicker` library provides timezone-aware date formatting and parsing. This document explains how timezones work in the context of JavaScript Date objects and how to use the library's timezone features.

## Understanding JavaScript Date Objects

**Important**: JavaScript `Date` objects are **always stored in UTC internally**. When you create a `Date`, it represents a specific moment in time (a UTC timestamp). However, when you display or format a date, it is automatically converted to the user's local timezone.

### Key Concepts

1. **Storage**: All dates are stored as UTC timestamps (milliseconds since January 1, 1970 UTC)
2. **Display**: Dates are formatted in a specific timezone (defaults to user's local timezone)
3. **Parsing**: When parsing date strings, the interpretation depends on whether timezone information is included

### Example

```typescript
// Create a date (stored as UTC internally)
const date = new Date('2024-01-15T10:00:00Z'); // Z indicates UTC

// Display in different timezones
date.toLocaleString('en-US', { timeZone: 'America/New_York' }); // "1/15/2024, 5:00:00 AM"
date.toLocaleString('en-US', { timeZone: 'Europe/London' });    // "1/15/2024, 10:00:00 AM"
date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });      // "1/15/2024, 7:00:00 PM"
```

## Using Timezone Support

### Component-Level Timezone

Set the `timezone` input property on individual datepicker components:

```typescript
<ngxsmk-datepicker
  mode="single"
  [timezone]="'America/New_York'"
  [showTime]="true">
</ngxsmk-datepicker>
```

### Global Timezone Configuration

Set a default timezone for all datepicker instances using the configuration provider:

```typescript
import { provideDatepickerConfig } from 'ngxsmk-datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDatepickerConfig({
      timezone: 'America/New_York',
      // ... other config
    })
  ]
};
```

### Timezone Format

The timezone must be a valid IANA timezone name. Common examples:

- `'UTC'` - Coordinated Universal Time
- `'America/New_York'` - Eastern Time (US)
- `'America/Los_Angeles'` - Pacific Time (US)
- `'Europe/London'` - British Time
- `'Europe/Paris'` - Central European Time
- `'Asia/Tokyo'` - Japan Standard Time
- `'Australia/Sydney'` - Australian Eastern Time

You can find a complete list of IANA timezone names at: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

## How the Library Handles Timezones

### Date Storage

The library **always stores dates as JavaScript Date objects** (UTC internally). The timezone setting only affects:

1. **Display formatting**: How dates are shown to users
2. **Input parsing**: How date strings are interpreted (when timezone info is missing)

### Date Selection

When a user selects a date/time in the calendar:

1. The selected date/time is interpreted in the **specified timezone** (or local timezone if not specified)
2. It is converted to a JavaScript `Date` object (stored as UTC)
3. When displayed, it is formatted back to the specified timezone

### Example Flow

```typescript
// User selects: January 15, 2024 at 10:00 AM in 'America/New_York' timezone
// 1. Library creates: new Date('2024-01-15T10:00:00-05:00')
//    (Stored internally as UTC: 2024-01-15T15:00:00Z)
// 2. When displayed with timezone='America/New_York':
//    Shows: "Jan 15, 2024, 10:00 AM"
// 3. When displayed with timezone='Europe/London':
//    Shows: "Jan 15, 2024, 3:00 PM" (5 hours ahead)
```

## Best Practices

### 1. Always Store UTC Dates

When saving dates to a database or API, always send the UTC timestamp:

```typescript
const selectedDate: Date = datepicker.value; // Already UTC internally
const utcTimestamp = selectedDate.toISOString(); // "2024-01-15T15:00:00.000Z"
```

### 2. Use Timezone for Display Only

Set the timezone based on your user's location or preference, but remember that the underlying Date object is always UTC:

```typescript
// Display in user's preferred timezone
<ngxsmk-datepicker
  [timezone]="userTimezone"
  (valueChange)="onDateChange($event)">
</ngxsmk-datepicker>

onDateChange(date: Date) {
  // Date is UTC internally - send to API as-is
  this.apiService.saveDate(date.toISOString());
}
```

### 3. Handle Server Dates

When receiving dates from a server (usually UTC), create Date objects directly:

```typescript
// Server returns: "2024-01-15T15:00:00Z"
const serverDate = new Date("2024-01-15T15:00:00Z");

// Display in user's timezone
<ngxsmk-datepicker
  [value]="serverDate"
  [timezone]="userTimezone">
</ngxsmk-datepicker>
```

## Optional Adapters (date-fns / Luxon)

For advanced timezone operations, you may want to use specialized libraries:

### date-fns-tz

```typescript
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';

// Format in specific timezone
const formatted = formatInTimeZone(date, 'America/New_York', 'yyyy-MM-dd HH:mm');

// Convert zoned time to UTC
const utcDate = zonedTimeToUtc('2024-01-15 10:00', 'America/New_York');
```

### Luxon

```typescript
import { DateTime } from 'luxon';

// Create date in specific timezone
const dt = DateTime.fromObject(
  { year: 2024, month: 1, day: 15, hour: 10 },
  { zone: 'America/New_York' }
);

// Convert to UTC
const utc = dt.toUTC();

// Format
const formatted = dt.toFormat('yyyy-MM-dd HH:mm');
```

### Integration with ngxsmk-datepicker

You can use these libraries alongside ngxsmk-datepicker:

```typescript
import { formatInTimeZone } from 'date-fns-tz';

@Component({
  template: `
    <ngxsmk-datepicker
      [value]="date"
      (valueChange)="onDateChange($event)">
    </ngxsmk-datepicker>
    
    <p>Formatted: {{ formatDate(date) }}</p>
  `
})
export class MyComponent {
  date: Date | null = null;
  
  formatDate(date: Date | null): string {
    if (!date) return '';
    return formatInTimeZone(date, 'America/New_York', 'PPP p');
  }
  
  onDateChange(date: Date | null) {
    this.date = date;
    // Date is UTC - use with date-fns-tz or Luxon as needed
  }
}
```

## Common Issues and Solutions

### Issue: Dates appear in wrong timezone

**Solution**: Ensure you're setting the `timezone` property correctly:

```typescript
// ✅ Correct
<ngxsmk-datepicker [timezone]="'America/New_York'">

// ❌ Incorrect (missing quotes)
<ngxsmk-datepicker [timezone]="America/New_York">
```

### Issue: Dates shift when saving to server

**Solution**: JavaScript Date objects are already UTC. Send them directly:

```typescript
// ✅ Correct
const utcString = date.toISOString(); // Send this to server

// ❌ Incorrect (don't manually adjust)
const adjusted = new Date(date.getTime() - timezoneOffset); // Don't do this
```

### Issue: Parsing dates from server

**Solution**: Create Date objects from ISO strings:

```typescript
// ✅ Correct
const date = new Date(serverResponse.dateString); // "2024-01-15T15:00:00Z"

// ❌ Incorrect (may parse in wrong timezone)
const date = new Date(serverResponse.dateString.replace('Z', '')); // Don't remove Z
```

## API Reference

### Input: `timezone`

- **Type**: `string | undefined`
- **Default**: `undefined` (uses browser's local timezone)
- **Description**: IANA timezone name for date formatting
- **Example**: `'America/New_York'`, `'UTC'`, `'Europe/London'`

### Utility Functions

The library exports timezone utility functions:

```typescript
import { 
  formatDateWithTimezone,
  parseDateWithTimezone,
  isValidTimezone 
} from 'ngxsmk-datepicker';

// Format date with timezone
const formatted = formatDateWithTimezone(
  date,
  'en-US',
  { year: 'numeric', month: 'short', day: '2-digit' },
  'America/New_York'
);

// Check if timezone is valid
if (isValidTimezone('America/New_York')) {
  // Use timezone
}
```

## Summary

- JavaScript Date objects are **always UTC internally**
- The `timezone` property controls **display formatting only**
- Use IANA timezone names (e.g., `'America/New_York'`)
- For advanced operations, consider date-fns-tz or Luxon
- Always send UTC timestamps to servers/APIs

