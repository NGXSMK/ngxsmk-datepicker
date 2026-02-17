# Server-Side Rendering (SSR) Example

**Last updated:** February 2026 · **Current stable:** v2.1.6

Complete example demonstrating ngxsmk-datepicker with Angular Universal (SSR).

## Overview

ngxsmk-datepicker is fully compatible with Angular Universal and server-side rendering. All browser APIs are properly guarded with platform checks, ensuring the component works seamlessly in both server and browser environments.

> **Note**: For setup instructions and best practices, see the [SSR Guide](./ssr.md).

## Basic SSR Setup

### 1. Install Angular Universal

```bash
ng add @nguniversal/express-engine
```

### 2. Configure App for SSR

```typescript
// app.config.ts
import { ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { provideDatepickerConfig } from 'ngxsmk-datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideDatepickerConfig({
      locale: 'en-US', // Explicitly set locale for SSR consistency
      weekStart: 1,
      minuteInterval: 15
    })
  ]
};
```

### 3. Component Example

```typescript
// datepicker-demo.component.ts
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-datepicker-demo',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="datepicker-container">
      <h2>Date Selection</h2>
      <ngxsmk-datepicker
        mode="single"
        [locale]="locale"
        placeholder="Select a date"
        (valueChange)="onDateChange($event)">
      </ngxsmk-datepicker>
      
      @if (selectedDate) {
        <p>Selected: {{ selectedDate | date:'fullDate' }}</p>
      }
    </div>
  `
})
export class DatepickerDemoComponent {
  private platformId = inject(PLATFORM_ID);
  
  selectedDate: Date | null = null;
  
  // Use explicit locale for SSR consistency
  locale = isPlatformBrowser(this.platformId) 
    ? navigator.language || 'en-US'
    : 'en-US';
  
  onDateChange(date: Date | null): void {
    this.selectedDate = date;
  }
}
```

## SSR-Specific Considerations

### 1. Locale Detection

Always provide an explicit locale for SSR consistency:

```typescript
// ❌ Bad - relies on browser API
locale = navigator.language;

// ✅ Good - platform-checked
locale = isPlatformBrowser(this.platformId) 
  ? navigator.language || 'en-US'
  : 'en-US';

// ✅ Better - use service or config
locale = this.localeService.getLocale(); // Returns 'en-US' on server
```

### 2. Date Initialization

Dates work the same on server and client:

```typescript
// ✅ Safe - Date works on both server and client
const today = new Date();
const minDate = new Date(2025, 0, 1); // January 1, 2025
```

### 3. Value Hydration

The component handles value hydration automatically:

```typescript
@Component({
  template: `
    <ngxsmk-datepicker
      [value]="serverDate"
      (valueChange)="onDateChange($event)">
    </ngxsmk-datepicker>
  `
})
export class MyComponent {
  // Value from server API
  serverDate: Date | null = null;
  
  ngOnInit(): void {
    // Fetch from API
    this.apiService.getDate().subscribe(date => {
      this.serverDate = new Date(date); // Works on both server and client
    });
  }
}
```

## Complete SSR Example

### Server-Side Component

```typescript
// server.component.ts
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { DateService } from './date.service';

@Component({
  selector: 'app-server-demo',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="server-demo">
      <h1>SSR Datepicker Demo</h1>
      
      <section>
        <h2>Single Date Selection</h2>
        <ngxsmk-datepicker
          mode="single"
          [locale]="locale"
          [value]="initialDate"
          placeholder="Select a date"
          (valueChange)="onSingleDateChange($event)">
        </ngxsmk-datepicker>
        <p *ngIf="singleDate">Selected: {{ singleDate | date:'fullDate' }}</p>
      </section>
      
      <section>
        <h2>Date Range Selection</h2>
        <ngxsmk-datepicker
          mode="range"
          [locale]="locale"
          [value]="initialRange"
          placeholder="Select date range"
          (valueChange)="onRangeChange($event)">
        </ngxsmk-datepicker>
        <p *ngIf="dateRange">
          Range: {{ dateRange.start | date:'shortDate' }} - 
          {{ dateRange.end | date:'shortDate' }}
        </p>
      </section>
    </div>
  `
})
export class ServerDemoComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private dateService = inject(DateService);
  
  locale = 'en-US';
  initialDate: Date | null = null;
  initialRange: { start: Date; end: Date } | null = null;
  singleDate: Date | null = null;
  dateRange: { start: Date; end: Date } | null = null;
  
  ngOnInit(): void {
    // Set locale based on platform
    if (isPlatformBrowser(this.platformId)) {
      this.locale = navigator.language || 'en-US';
    }
    
    // Load initial data (works on both server and client)
    this.loadInitialData();
  }
  
  private loadInitialData(): void {
    // Simulate server-side data loading
    this.dateService.getInitialDate().subscribe(date => {
      this.initialDate = date ? new Date(date) : null;
    });
    
    this.dateService.getInitialRange().subscribe(range => {
      if (range) {
        this.initialRange = {
          start: new Date(range.start),
          end: new Date(range.end)
        };
      }
    });
  }
  
  onSingleDateChange(date: Date | null): void {
    this.singleDate = date;
    // Save to server
    if (date) {
      this.dateService.saveDate(date).subscribe();
    }
  }
  
  onRangeChange(range: { start: Date; end: Date } | null): void {
    this.dateRange = range;
    // Save to server
    if (range) {
      this.dateService.saveRange(range).subscribe();
    }
  }
}
```

### Service Example

```typescript
// date.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor(private http: HttpClient) {}
  
  getInitialDate(): Observable<string | null> {
    // Works on both server and client
    return this.http.get<string | null>('/api/initial-date');
  }
  
  getInitialRange(): Observable<{ start: string; end: string } | null> {
    return this.http.get<{ start: string; end: string } | null>('/api/initial-range');
  }
  
  saveDate(date: Date): Observable<void> {
    return this.http.post<void>('/api/date', { date: date.toISOString() });
  }
  
  saveRange(range: { start: Date; end: Date }): Observable<void> {
    return this.http.post<void>('/api/range', {
      start: range.start.toISOString(),
      end: range.end.toISOString()
    });
  }
}
```

## Hydration Notes

### Automatic Hydration

The component automatically handles hydration when values are set:

```typescript
// Value set on server
component.value = new Date('2025-01-15');

// Component automatically:
// 1. Initializes the selected date
// 2. Generates the calendar
// 3. Updates the display value
// 4. Works seamlessly after hydration
```

### Manual Hydration

If you need to manually trigger hydration:

```typescript
@Component({
  template: `
    <ngxsmk-datepicker
      #datepicker
      [value]="serverDate">
    </ngxsmk-datepicker>
  `
})
export class MyComponent implements AfterViewInit {
  @ViewChild('datepicker') datepicker!: NgxsmkDatepickerComponent;
  serverDate: Date | null = null;
  
  ngAfterViewInit(): void {
    // After view init, ensure component is hydrated
    if (this.serverDate) {
      // Component handles this automatically, but you can force update if needed
      this.datepicker.ngOnChanges({
        value: new SimpleChange(null, this.serverDate, true)
      });
    }
  }
}
```

## Common SSR Issues & Solutions

### Issue 1: Locale Not Set

**Problem**: Component uses browser locale on server, causing inconsistencies.

**Solution**: Always provide explicit locale:

```typescript
// ✅ Correct
<ngxsmk-datepicker [locale]="'en-US'"></ngxsmk-datepicker>

// Or use platform check
locale = isPlatformBrowser(this.platformId) 
  ? navigator.language 
  : 'en-US';
```

### Issue 2: Date Formatting Differences

**Problem**: Date formatting may differ between server and client.

**Solution**: Use consistent locale and timezone:

```typescript
// ✅ Correct
provideDatepickerConfig({
  locale: 'en-US',
  timezone: 'UTC' // Use UTC for consistency
})
```

### Issue 3: Window/Document Access

**Problem**: Component tries to access window/document on server.

**Solution**: Component already handles this with platform checks. No action needed.

## Testing SSR

### Unit Tests

```typescript
// datepicker-ssr.spec.ts
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

describe('SSR Compatibility', () => {
  it('should work on server platform', () => {
    TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    
    const fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
```

### E2E Tests

```typescript
// e2e/ssr.spec.ts
import { test, expect } from '@playwright/test';

test('datepicker works after SSR hydration', async ({ page }) => {
  await page.goto('/');
  
  // Wait for hydration
  await page.waitForSelector('ngxsmk-datepicker');
  
  // Click datepicker
  await page.click('.ngxsmk-input-group');
  
  // Select a date
  await page.click('.ngxsmk-day-cell:has-text("15")');
  
  // Verify value is set
  const value = await page.inputValue('.ngxsmk-display-input');
  expect(value).toBeTruthy();
});
```

## Best Practices

1. **Always Set Locale**: Provide explicit locale for SSR consistency
2. **Use Platform Checks**: Check `isPlatformBrowser` for browser-only code
3. **Test Both Platforms**: Test on both server and client
4. **Use UTC for Consistency**: Consider using UTC timezone for server/client consistency
5. **Handle Hydration**: Let the component handle hydration automatically

## Additional Resources

- [Angular Universal Guide](https://angular.io/guide/universal)
- [SSR Best Practices](https://angular.io/guide/universal#best-practices)
- [Platform Detection](https://angular.io/api/common/isPlatformBrowser)

