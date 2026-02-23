# Locale Packs & i18n Contributor Guide

**Last updated:** February 23, 2026 · **Current stable:** v2.1.7

Guide for adding locale support and contributing translations to ngxsmk-datepicker.

## Overview

ngxsmk-datepicker uses the browser's native `Intl` API for localization, which means it automatically supports many locales out of the box. However, you can enhance locale support by providing custom locale data or contributing locale-specific improvements.

## How Localization Works

The component uses the `locale` input property to determine:
- Month names
- Weekday names
- Week start day
- Date formatting
- Number formatting

```typescript
<ngxsmk-datepicker [locale]="'en-US'"></ngxsmk-datepicker>
<ngxsmk-datepicker [locale]="'de-DE'"></ngxsmk-datepicker>
<ngxsmk-datepicker [locale]="'fr-FR'"></ngxsmk-datepicker>
```

## Supported Locales

The component automatically supports all locales supported by the browser's `Intl` API, including:

- **English**: `en-US`, `en-GB`, `en-CA`, etc.
- **German**: `de-DE`, `de-AT`, `de-CH`
- **French**: `fr-FR`, `fr-CA`, `fr-BE`
- **Spanish**: `es-ES`, `es-MX`, `es-AR`
- **Italian**: `it-IT`
- **Portuguese**: `pt-BR`, `pt-PT`
- **Japanese**: `ja-JP`
- **Chinese**: `zh-CN`, `zh-TW`
- **Korean**: `ko-KR`
- **Arabic**: `ar-SA`, `ar-EG`
- **Hebrew**: `he-IL`
- **Russian**: `ru-RU`
- And many more...

## Adding Custom Locale Data

If you need custom locale behavior, you can use the `weekStart` input to override the automatic detection:

```typescript
// Force Monday as first day of week for any locale
<ngxsmk-datepicker
  [locale]="'en-US'"
  [weekStart]="1">
</ngxsmk-datepicker>
```

## Contributing Locale Improvements

### 1. Testing Locale Support

Create a test file to verify locale behavior:

```typescript
// projects/ngxsmk-datepicker/src/lib/locales/locale-[code].spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('Locale Support: [Locale Code]', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.locale = '[locale-code]';
    component.inline = true;
    fixture.detectChanges();
  });

  it('should display month names correctly', () => {
    // Test month names
  });

  it('should display weekday names correctly', () => {
    // Test weekday names
  });

  it('should use correct week start day', () => {
    // Test week start
  });
});
```

### 2. Locale-Specific Configuration

Create a locale configuration file:

```typescript
// projects/ngxsmk-datepicker/src/lib/locales/[locale-code].config.ts
export const LOCALE_CONFIG = {
  code: '[locale-code]',
  weekStart: 1, // Monday
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  monthNames: [...],
  weekdayNames: [...]
};
```

### 3. RTL Locale Support

For RTL languages (Arabic, Hebrew, etc.), the component automatically detects RTL:

```typescript
// Automatically enabled for RTL locales
<ngxsmk-datepicker [locale]="'ar-SA'"></ngxsmk-datepicker>
<ngxsmk-datepicker [locale]="'he-IL'"></ngxsmk-datepicker>

// Or explicitly set
<ngxsmk-datepicker [locale]="'ar-SA'" [rtl]="true"></ngxsmk-datepicker>
```

## Locale Testing Checklist

When adding or testing a locale, verify:

- [ ] Month names display correctly
- [ ] Weekday names display correctly
- [ ] Week start day is correct for the locale
- [ ] Date formatting matches locale conventions
- [ ] RTL layout works (if applicable)
- [ ] Time formatting (12h/24h) matches locale
- [ ] Number formatting is correct
- [ ] Calendar navigation works correctly
- [ ] Keyboard navigation works in RTL mode (if applicable)

## Example: Adding French Locale Support

```typescript
// Test file
describe('French Locale (fr-FR)', () => {
  it('should display French month names', () => {
    component.locale = 'fr-FR';
    fixture.detectChanges();
    
    const monthSelect = fixture.debugElement.query(By.css('.month-select'));
    expect(monthSelect).toBeTruthy();
    // Verify French month names appear
  });

  it('should start week on Monday', () => {
    component.locale = 'fr-FR';
    component.weekStart = null; // Use locale default
    fixture.detectChanges();
    
    // Verify week starts on Monday (day 1)
    expect(component.firstDayOfWeek).toBe(1);
  });
});
```

## Locale-Specific Features

### Week Start Day

Different locales have different week start days:
- **Monday**: Most European countries (de, fr, es, it, etc.)
- **Sunday**: US, Canada, some Asian countries
- **Saturday**: Some Middle Eastern countries

The component auto-detects this, but you can override:

```typescript
provideDatepickerConfig({
  weekStart: 1 // Force Monday globally
})
```

### Date Format

Date formats vary by locale:
- **US**: `MM/DD/YYYY` (e.g., 12/25/2025)
- **Europe**: `DD/MM/YYYY` (e.g., 25/12/2025)
- **ISO**: `YYYY-MM-DD` (e.g., 2025-12-25)
- **Asia**: `YYYY年MM月DD日` (e.g., 2025年12月25日)

The component uses `Intl.DateTimeFormat` which handles this automatically.

## Contributing Process

1. **Fork the repository**
2. **Create a test file** for your locale
3. **Test the locale** thoroughly
4. **Document any issues** or special considerations
5. **Submit a pull request** with:
   - Test file
   - Documentation updates
   - Any locale-specific fixes

## Locale Test Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('Locale: [Your Locale]', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.locale = '[locale-code]';
    component.inline = true;
    fixture.detectChanges();
  });

  describe('Month Names', () => {
    it('should display correct month names', () => {
      // Your test
    });
  });

  describe('Weekday Names', () => {
    it('should display correct weekday names', () => {
      // Your test
    });
  });

  describe('Week Start', () => {
    it('should use correct week start day', () => {
      // Your test
    });
  });

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      // Your test
    });
  });

  @if (isRtlLocale) {
    describe('RTL Support', () => {
      it('should render in RTL mode', () => {
        // Your test
      });
    });
  }
});
```

## Common Locale Issues

### Issue: Week Start Day Incorrect

**Solution**: Use `weekStart` input to override:

```typescript
<ngxsmk-datepicker
  [locale]="'en-US'"
  [weekStart]="1">
</ngxsmk-datepicker>
```

### Issue: Date Format Not Matching Locale

**Solution**: The component uses `Intl.DateTimeFormat`. If you need custom formatting, use the `hooks.formatDisplayValue` hook.

### Issue: RTL Not Detected

**Solution**: Explicitly set `[rtl]="true"` or ensure `document.dir` is set correctly.

## Resources

- [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [BCP 47 Language Tags](https://en.wikipedia.org/wiki/IETF_language_tag)
- [Locale Data](https://github.com/unicode-org/cldr-json)

## Questions?

If you encounter issues with a specific locale or want to contribute improvements:

1. Open an issue with the locale code and description
2. Check existing issues for similar problems
3. Submit a PR with your locale improvements

---

**Thank you for contributing to ngxsmk-datepicker's internationalization!**

