# Public API Documentation

This document describes the stable public API of ngxsmk-datepicker with comprehensive real-world examples. APIs marked as **stable** are guaranteed to remain backward-compatible within the same major version. APIs marked as **experimental** may change in future releases.

**Version**: 2.1.7+ | **Last updated**: February 20, 2026

## Versioning Policy

ngxsmk-datepicker follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

## Breaking Changes Policy

Breaking changes will only occur in major version releases. When breaking changes are introduced:

1. A migration guide will be provided in `MIGRATION.md`
2. Deprecated APIs will be marked with `@deprecated` JSDoc tags
3. Deprecated APIs will remain for at least one major version before removal
4. Clear upgrade instructions will be provided

## Exported Components

### NgxsmkDatepickerComponent

**Status**: Stable

The main datepicker component.

```typescript
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
```

#### Complete Inputs/Outputs Reference

##### Inputs

| Input | Type | Default | Status | Description | Example |
|-------|------|---------|--------|-------------|---------|
| `mode` | `'single' \| 'range' \| 'multiple'` | `'single'` | Stable | Selection mode | `mode="single"` or `[mode]="'range'"` |
| `value` | `DatepickerValue` | `null` | Stable | Current value (one-way binding) | `[value]="selectedDate"` |
| `field` | `SignalFormField \| SignalFormFieldConfig` | `null` | Stable | Signal form field (Angular 21+). Automatically tracks dirty state when using `[field]` binding. Supports direct signals, signals with properties, and resolution of nested signals. | `[field]="myForm.dateField"` |
| `placeholder` | `string \| null` | `'Select Date'` or `'Select Time'` | Stable | Input placeholder text | `placeholder="Choose a date"` |
| `inputId` | `string` | `''` | Stable | Custom ID for the input element | `inputId="my-date-input"` |
| `name` | `string` | `''` | Stable | Name attribute for the input element | `name="my-date-field"` |
| `autocomplete` | `string` | `'off'` | Stable | Autocomplete attribute for the input element | `autocomplete="on"` |
| `aria-invalid` | `boolean` | `false` | Stable | Sets aria-invalid attribute on the input | `[aria-invalid]="true"` |
| `disabledState` | `boolean` | `false` | Stable | Disable the datepicker | `[disabledState]="isDisabled"` |
| `minDate` | `DateInput \| null` | `null` | Stable | Minimum selectable date | `[minDate]="today"` |
| `maxDate` | `DateInput \| null` | `null` | Stable | Maximum selectable date | `[maxDate]="maxBookingDate"` |
| `disabledDates` | `(string \| Date)[]` | `[]` | Stable | Array of disabled dates | `[disabledDates]="['10/21/2025', new Date()]"` |
| `isInvalidDate` | `(date: Date) => boolean` | `() => false` | Stable | Custom date validation function | `[isInvalidDate]="isWeekend"` |
| `locale` | `string` | `'en-US'` | Stable | Locale for formatting | `locale="de-DE"` or `[locale]="'fr-FR'"` |
| `theme` | `'light' \| 'dark'` | `'light'` | Stable | Color theme | `[theme]="'dark'"` |
| `inline` | `boolean \| 'always' \| 'auto'` | `false` | Stable | Inline display mode | `[inline]="true"` or `inline="auto"` |
| `showTime` | `boolean` | `false` | Stable | Show time selection | `[showTime]="true"` |
| `timeOnly` | `boolean` | `false` | Stable | Display time picker only (no calendar). Automatically enables `showTime`. | `[timeOnly]="true"` |
| `allowTyping` | `boolean` | `false` | Stable | Enable manual typing in the input field. Required for native validation. | `[allowTyping]="true"` |
| `displayFormat` | `string` | `null` | Stable | Custom date format string (e.g., 'MM/DD/YYYY'). | `displayFormat="DD.MM.YYYY"` |
| `showCalendarButton` | `boolean` | `true` | Stable | Show/hide the calendar icon button. When `false`, users can still open calendar by clicking the input field. | `[showCalendarButton]="false"` |
| `minuteInterval` | `number` | `1` | Stable | Minute selection interval | `[minuteInterval]="15"` |
| `showSeconds` | `boolean` | `false` | Stable | Show seconds in time selection | `[showSeconds]="true"` |
| `secondInterval` | `number` | `1` | Stable | Second selection interval (e.g. 1, 5, 15) | `[secondInterval]="5"` |
| `use24Hour` | `boolean` | `false` | Stable | Use 24-hour time format (no AM/PM) | `[use24Hour]="true"` |
| `showRanges` | `boolean` | `true` | Stable | Show predefined ranges (range mode) | `[showRanges]="true"` |
| `ranges` | `DateRange` | `null` | Stable | Predefined date ranges | `[ranges]="quickRanges"` |
| `holidayProvider` | `HolidayProvider \| null` | `null` | Stable | Custom holiday provider | `[holidayProvider]="myHolidayProvider"` |
| `disableHolidays` | `boolean` | `false` | Stable | Disable holiday dates from selection | `[disableHolidays]="true"` |
| `startAt` | `DateInput \| null` | `null` | Stable | Initial calendar view date | `[startAt]="nextMonth"` |
| `weekStart` | `number \| null` | `null` | Stable | Override week start day (0=Sunday, 1=Monday, etc.) | `[weekStart]="1"` |
| `yearRange` | `number` | `10` | Stable | Years to show in year selector | `[yearRange]="20"` |
| `classes` | `DatepickerClasses \| null` | `null` | Stable | Custom CSS classes | `[classes]="{ inputGroup: 'custom-class' }"` |
| `hooks` | `DatepickerHooks \| null` | `null` | Stable | Extension points for customization | `[hooks]="customHooks"` |
| `enableKeyboardShortcuts` | `boolean` | `true` | Stable | Enable/disable keyboard shortcuts. Press '?' for help. | `[enableKeyboardShortcuts]="false"` |
| `customShortcuts` | `{ [key: string]: (context: KeyboardShortcutContext) => boolean } \| null` | `null` | Stable | Custom keyboard shortcuts map | `[customShortcuts]="myShortcuts"` |
| `autoApplyClose` | `boolean` | `false` | Stable | Auto-close calendar after selection | `[autoApplyClose]="true"` |
| `clearLabel` | `string` | `'Clear'` | Stable | Custom label for clear button | `clearLabel="Reset"` |
| `closeLabel` | `string` | `'Close'` | Stable | Custom label for close button | `closeLabel="Done"` |
| `prevMonthAriaLabel` | `string` | `'Previous month'` | Stable | ARIA label for previous month button | `prevMonthAriaLabel="Go to previous month"` |
| `nextMonthAriaLabel` | `string` | `'Next month'` | Stable | ARIA label for next month button | `nextMonthAriaLabel="Go to next month"` |
| `clearAriaLabel` | `string` | `'Clear selection'` | Stable | ARIA label for clear button | `clearAriaLabel="Clear selected date"` |
| `closeAriaLabel` | `string` | `'Close calendar'` | Stable | ARIA label for close button | `closeAriaLabel="Close date picker"` |
| `rtl` | `boolean \| null` | `null` | Stable | Right-to-left layout (auto-detects from locale or document.dir) | `[rtl]="true"` |
| `userAriaDescribedBy` | `string` | `''` | Stable | Aria describedby ID provided by the user or the parent form field. Required for seamless Angular Material integration. | `[userAriaDescribedBy]="'my-help-id'"` |
| `timeRangeMode` | `boolean` | `false` | Stable | In range mode with `showTime`, show separate start/end time pickers (from/to). | `[timeRangeMode]="true"` |
| `timezone` | `string` | `undefined` | Stable | IANA timezone name for display and value handling (e.g. `America/New_York`, `UTC`). | `timezone="Europe/London"` |
| `useNativePicker` | `boolean` | `false` | Stable | Use the browser native date/time input when supported (e.g. on mobile). | `[useNativePicker]="true"` |
| `autoDetectMobile` | `boolean` | `true` | Stable | When true, append popover to body and use mobile styles on small/touch devices. | `[autoDetectMobile]="false"` |
| `appendToBody` | `boolean` | `false` | Stable | Append calendar popover to `document.body` (e.g. to avoid overflow clipping). | `[appendToBody]="true"` |
| `mobileModalStyle` | `'bottom-sheet' \| 'center' \| 'fullscreen'` | `'bottom-sheet'` | Stable | How the calendar is shown on mobile (when detected). | `mobileModalStyle="fullscreen"` |
| `mobileTimePickerStyle` | `'wheel' \| 'slider' \| 'native'` | `'slider'` | Stable | Time picker style on mobile. | `mobileTimePickerStyle="wheel"` |
| `mobileTheme` | `'compact' \| 'comfortable' \| 'spacious'` | `'comfortable'` | Stable | Density of the calendar on mobile. | `mobileTheme="compact"` |
| `enableHapticFeedback` | `boolean` | `false` | Stable | Trigger haptic feedback on supported devices when selecting/clearing. | `[enableHapticFeedback]="true"` |
| `enablePullToRefresh` | `boolean` | `false` | Experimental | Reserve for future pull-to-refresh on mobile. | — |
| `enableVoiceInput` | `boolean` | `false` | Experimental | Reserve for future voice input. | — |

##### Outputs

| Output | Type | Status | Description | Example |
|--------|------|--------|-------------|---------|
| `valueChange` | `EventEmitter<DatepickerValue>` | Stable | Emitted when value changes | `(valueChange)="onDateChange($event)"` |
| `action` | `EventEmitter<{ type: string; payload?: any }>` | Stable | Emitted on user actions (dateSelected, timeChanged, etc.) | `(action)="handleAction($event)"` |
| `validationError` | `EventEmitter<{ code: string; message: string }>` | Stable | Emitted when validation fails (e.g. invalid typed date, date before min, after max). Message is translated. | `(validationError)="onValidationError($event)"` |

#### Methods

| Method | Parameters | Return | Status | Description |
|--------|-----------|--------|--------|-------------|
| `writeValue` | `val: DatepickerValue` | `void` | Stable | ControlValueAccessor implementation |
| `registerOnChange` | `fn: (value: DatepickerValue) => void` | `void` | Stable | ControlValueAccessor implementation |
| `registerOnTouched` | `fn: () => void` | `void` | Stable | ControlValueAccessor implementation |
| `setDisabledState` | `isDisabled: boolean` | `void` | Stable | ControlValueAccessor implementation |

## Form Integration Examples

### Reactive Forms Integration

The datepicker implements `ControlValueAccessor`, making it fully compatible with Angular Reactive Forms.

#### Basic Reactive Forms Example

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Check-in Date</label>
        <ngxsmk-datepicker
          mode="single"
          placeholder="Select check-in date"
          formControlName="checkInDate">
        </ngxsmk-datepicker>
        
        @if (bookingForm.get('checkInDate')?.hasError('required') && 
             bookingForm.get('checkInDate')?.touched) {
          <div class="error">Check-in date is required</div>
        }
      </div>
      
      <div class="form-group">
        <label>Check-out Date</label>
        <ngxsmk-datepicker
          mode="single"
          placeholder="Select check-out date"
          formControlName="checkOutDate"
          [minDate]="bookingForm.get('checkInDate')?.value">
        </ngxsmk-datepicker>
        
        @if (bookingForm.get('checkOutDate')?.hasError('required') && 
             bookingForm.get('checkOutDate')?.touched) {
          <div class="error">Check-out date is required</div>
        }
      </div>
      
      <button type="submit" [disabled]="bookingForm.invalid">Book Now</button>
    </form>
  `
})
export class ReactiveFormComponent {
  bookingForm = new FormGroup({
    checkInDate: new FormControl<DatepickerValue>(null, [Validators.required]),
    checkOutDate: new FormControl<DatepickerValue>(null, [Validators.required])
  });
  
  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Form value:', this.bookingForm.value);
      // Submit to API
    }
  }
}
```

#### Reactive Forms with Date Range

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue, DateRange } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-range-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="rangeForm">
      <ngxsmk-datepicker
        mode="range"
        [showTime]="true"
        [minuteInterval]="15"
        [ranges]="quickRanges"
        [showRanges]="true"
        placeholder="Select date range"
        formControlName="dateRange">
      </ngxsmk-datepicker>
      
      @if (rangeForm.get('dateRange')?.value) {
        <p>Selected range: {{ rangeForm.get('dateRange')?.value | json }}</p>
      }
    </form>
  `
})
export class RangeFormComponent {
  today = new Date();
  
  quickRanges: DateRange = {
    'Today': [this.today, this.today],
    'Last 7 Days': [
      new Date(this.today.getTime() - 6 * 86400000),
      this.today
    ],
    'This Month': [
      new Date(this.today.getFullYear(), this.today.getMonth(), 1),
      new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0)
    ]
  };
  
  rangeForm = new FormGroup({
    dateRange: new FormControl<DatepickerValue>(null)
  });
}
```

#### Reactive Forms with Custom Validation

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-validated-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="validatedForm">
      <ngxsmk-datepicker
        mode="single"
        placeholder="Select appointment date"
        [minDate]="today"
        [isInvalidDate]="isWeekend"
        formControlName="appointmentDate">
      </ngxsmk-datepicker>
      
      @if (validatedForm.get('appointmentDate')?.hasError('required')) {
        <div class="error">Date is required</div>
      }
      @if (validatedForm.get('appointmentDate')?.hasError('minDate')) {
        <div class="error">Date must be in the future</div>
      }
    </form>
  `
})
export class ValidatedFormComponent {
  today = new Date();
  
  validatedForm = new FormGroup({
    appointmentDate: new FormControl<DatepickerValue>(null, [
      Validators.required,
      this.minDateValidator
    ])
  });
  
  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };
  
  minDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (value instanceof Date) {
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return { minDate: true };
      }
    }
    
    return null;
  }
}
```

#### Reactive Forms with Multiple Date Selection

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-multiple-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule, CommonModule, DatePipe],
  template: `
    <form [formGroup]="multipleForm">
      <ngxsmk-datepicker
        mode="multiple"
        placeholder="Select available dates"
        formControlName="availableDates">
      </ngxsmk-datepicker>
      
      @if (selectedDates.length > 0) {
        <div class="selected-dates">
          <h4>Selected Dates ({{ selectedDates.length }}):</h4>
          <ul>
            @for (date of selectedDates; track date) {
              <li>{{ date | date:'short' }}</li>
            }
          </ul>
        </div>
      }
    </form>
  `
})
export class MultipleFormComponent {
  multipleForm = new FormGroup({
    availableDates: new FormControl<DatepickerValue>(null)
  });
  
  get selectedDates(): Date[] {
    const value = this.multipleForm.get('availableDates')?.value;
    return Array.isArray(value) ? value : [];
  }
}
```

### Template-Driven Forms Integration

The datepicker also works seamlessly with Angular Template-Driven Forms using `ngModel`.

#### Basic Template-Driven Forms Example

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, FormsModule, CommonModule],
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
      <div class="form-group">
        <label>Event Date</label>
        <ngxsmk-datepicker
          mode="single"
          placeholder="Select event date"
          [(ngModel)]="eventDate"
          name="eventDate"
          #dateField="ngModel"
          required>
        </ngxsmk-datepicker>
        
        @if (dateField.invalid && dateField.touched) {
          <div class="error">Event date is required</div>
        }
      </div>
      
      <button type="submit" [disabled]="myForm.invalid">Submit</button>
    </form>
    
    @if (eventDate) {
      <p>Selected: {{ eventDate | date:'medium' }}</p>
    }
  `
})
export class TemplateFormComponent {
  eventDate: DatepickerValue = null;
  
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form value:', form.value);
      console.log('Event date:', this.eventDate);
    }
  }
}
```

#### Template-Driven Forms with Date Range

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-template-range',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, FormsModule],
  template: `
    <form #rangeForm="ngForm">
      <ngxsmk-datepicker
        mode="range"
        [showTime]="true"
        placeholder="Select date range"
        [(ngModel)]="dateRange"
        name="dateRange">
      </ngxsmk-datepicker>
      
      @if (dateRange) {
        <p>
          From: {{ dateRange.start | date:'short' }} 
          To: {{ dateRange.end | date:'short' }}
        </p>
      }
    </form>
  `
})
export class TemplateRangeComponent {
  dateRange: DatepickerValue = null;
}
```

#### Template-Driven Forms with Validation

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-template-validated',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, FormsModule],
  template: `
    <form #validatedForm="ngForm">
      <ngxsmk-datepicker
        mode="single"
        placeholder="Select date"
        [(ngModel)]="selectedDate"
        name="selectedDate"
        #dateCtrl="ngModel"
        required
        [minDate]="today">
      </ngxsmk-datepicker>
      
      @if (dateCtrl.errors?.['required'] && dateCtrl.touched) {
        <div class="error">Date is required</div>
      }
      
      <button type="submit" [disabled]="validatedForm.invalid">Submit</button>
    </form>
  `
})
export class TemplateValidatedComponent {
  today = new Date();
  selectedDate: DatepickerValue = null;
}
```

### Ionic Framework Integration

The datepicker is fully compatible with Ionic Angular applications. Here are comprehensive examples for different Ionic use cases.

#### Basic Ionic Integration

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ionic-datepicker',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    FormsModule
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Date Picker</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Select Date</ion-label>
        <ngxsmk-datepicker
          mode="single"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </ion-item>
    </ion-content>
  `
})
export class IonicDatepickerComponent {}
```

#### Ionic with Reactive Forms

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonLabel,
  IonButton,
  IonList
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-reactive',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButton,
    IonList
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Booking Form</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Check-in Date</ion-label>
            <ngxsmk-datepicker
              mode="single"
              placeholder="Select check-in"
              formControlName="checkIn">
            </ngxsmk-datepicker>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Check-out Date</ion-label>
            <ngxsmk-datepicker
              mode="single"
              placeholder="Select check-out"
              formControlName="checkOut"
              [minDate]="bookingForm.get('checkIn')?.value">
            </ngxsmk-datepicker>
          </ion-item>
        </ion-list>
        
        <ion-button expand="block" type="submit" [disabled]="bookingForm.invalid">
          Book Now
        </ion-button>
      </form>
    </ion-content>
  `
})
export class IonicReactiveComponent {
  bookingForm = new FormGroup({
    checkIn: new FormControl<DatepickerValue>(null),
    checkOut: new FormControl<DatepickerValue>(null)
  });
  
  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Booking:', this.bookingForm.value);
    }
  }
}
```

#### Ionic with Date Range and Time

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue, DateRange } from 'ngxsmk-datepicker';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-range',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Event Range</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <form [formGroup]="eventForm">
        <ion-item>
          <ion-label position="stacked">Event Date & Time Range</ion-label>
          <ngxsmk-datepicker
            mode="range"
            [showTime]="true"
            [minuteInterval]="15"
            [ranges]="quickRanges"
            [showRanges]="true"
            placeholder="Select event period"
            formControlName="eventRange">
          </ngxsmk-datepicker>
        </ion-item>
      </form>
    </ion-content>
  `
})
export class IonicRangeComponent {
  today = new Date();
  
  quickRanges: DateRange = {
    'Today': [this.today, this.today],
    'This Week': [
      new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - this.today.getDay()),
      this.today
    ]
  };
  
  eventForm = new FormGroup({
    eventRange: new FormControl<DatepickerValue>(null)
  });
}
```

#### Ionic with Time-Only Picker

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-time',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Appointment Time</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <form [formGroup]="timeForm">
        <ion-item>
          <ion-label position="stacked">Select Time</ion-label>
          <ngxsmk-datepicker
            mode="single"
            [timeOnly]="true"
            [minuteInterval]="15"
            placeholder="Choose time"
            formControlName="appointmentTime">
          </ngxsmk-datepicker>
        </ion-item>
      </form>
    </ion-content>
  `
})
export class IonicTimeComponent {
  timeForm = new FormGroup({
    appointmentTime: new FormControl<DatepickerValue>(null)
  });
}
```

#### Ionic with Inline Calendar

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-inline',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Calendar View</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ngxsmk-datepicker
        mode="range"
        [inline]="true"
        placeholder="Select date range">
      </ngxsmk-datepicker>
    </ion-content>
  `
})
export class IonicInlineComponent {}
```

#### Ionic with Dark Theme

```typescript
import { Component, signal } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonItem,
  IonLabel,
  IonToggle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-theme',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonToggle
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Theme Toggle</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Dark Mode</ion-label>
        <ion-toggle 
          [checked]="isDark()" 
          (ionChange)="toggleTheme()">
        </ion-toggle>
      </ion-item>
      
      <ion-item>
        <ion-label position="stacked">Select Date</ion-label>
        <ngxsmk-datepicker
          mode="single"
          [theme]="isDark() ? 'dark' : 'light'"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </ion-item>
    </ion-content>
  `
})
export class IonicThemeComponent {
  isDark = signal(false);
  
  toggleTheme() {
    this.isDark.update(v => !v);
  }
}
```

## Real-World Usage Examples

### 1. Basic Single Date Selection

**Scenario**: Simple date picker for selecting a single date.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      placeholder="Select a date"
      (valueChange)="onDateChange($event)">
    </ngxsmk-datepicker>
  `
})
export class BasicComponent {
  onDateChange(date: Date | null) {
    console.log('Selected date:', date);
  }
}
```

### 2. Reactive Forms Integration

**Scenario**: Using with Angular Reactive Forms for form validation and submission.

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
      <ngxsmk-datepicker
        mode="single"
        placeholder="Select check-in date"
        formControlName="checkInDate">
      </ngxsmk-datepicker>
      
      @if (bookingForm.get('checkInDate')?.hasError('required')) {
        <div>Check-in date is required</div>
      }
      
      <button type="submit" [disabled]="bookingForm.invalid">Book</button>
    </form>
  `
})
export class ReactiveFormComponent {
  bookingForm = new FormGroup({
    checkInDate: new FormControl<DatepickerValue>(null, [Validators.required])
  });
  
  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Form value:', this.bookingForm.value);
    }
  }
}
```

### 3. Signal Binding (Angular 17+)

**Scenario**: Using writable signals for reactive date selection.

```typescript
import { Component, signal } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-signal-binding',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [value]="selectedDate()"
      (valueChange)="selectedDate.set($event)">
    </ngxsmk-datepicker>
    
    <p>Selected: {{ selectedDate() | date:'medium' }}</p>
  `
})
export class SignalBindingComponent {
  selectedDate = signal<DatepickerValue>(null);
}
```

### 4. Signal Forms with Server Data (Angular 21+)

**Scenario**: Populating datepicker from server-side data using httpResource and Signal Forms.

```typescript
import { Component, inject, signal, linkedSignal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { form, objectSchema } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

interface BookingData {
  checkInDate: Date;
  checkOutDate: Date;
  guestName: string;
}

@Component({
  selector: 'app-server-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <form>
      <label>Check-in Date</label>
      <ngxsmk-datepicker
        [field]="bookingForm.checkInDate"
        mode="single"
        placeholder="Select check-in date">
      </ngxsmk-datepicker>
      
      <label>Check-out Date</label>
      <ngxsmk-datepicker
        [field]="bookingForm.checkOutDate"
        mode="single"
        placeholder="Select check-out date">
      </ngxsmk-datepicker>
      
      <button (click)="saveBooking()">Save Booking</button>
    </form>
  `
})
export class ServerFormComponent {
  private http = inject(HttpClient);
  
  // Fetch booking data from server
  resource = httpResource({
    request: () => this.http.get<BookingData>('/api/bookings/123'),
    loader: signal(false)
  });
  
  // Link server response to local signal
  localObject = linkedSignal(() => this.resource.response.value() || {
    checkInDate: new Date(),
    checkOutDate: new Date(),
    guestName: ''
  });
  
  // Create signal form
  bookingForm = form(this.localObject, objectSchema({
    checkInDate: objectSchema<Date>(),
    checkOutDate: objectSchema<Date>(),
    guestName: objectSchema<string>()
  }));
  
  saveBooking() {
    // Form automatically syncs with localObject signal
    this.http.put('/api/bookings/123', this.localObject()).subscribe();
  }
}
```

### 5. Signal Forms with Manual Binding (Stabilized Pattern)

**Scenario**: Using manual `[value]` and `(valueChange)` binding with Signal Forms to prevent stability issues. **Important**: To ensure dirty state tracking works correctly, use the field's `setValue()` or `updateValue()` methods instead of direct mutation.

```typescript
import { Component, signal, computed, form, objectSchema } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-stable-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      class="w-full border:none"
      [value]="myDate()"
      (valueChange)="onMyDateChange($any($event))"
      mode="single"
      placeholder="Select a date">
    </ngxsmk-datepicker>
  `
})
export class StableFormComponent {
  localObject = signal({ myDate: new Date() });
  
  myForm = form(this.localObject, objectSchema({
    myDate: objectSchema<Date>()
  }));
  
  // Get a computed signal reference to the date field value
  myDate = computed(() => this.myForm.value().myDate);
  
  onMyDateChange(newDate: Date): void {
    // Use setValue to ensure dirty state tracking works correctly
    if (typeof this.myForm.myDate.setValue === 'function') {
      this.myForm.myDate.setValue(newDate);
    } else if (typeof this.myForm.myDate.updateValue === 'function') {
      this.myForm.myDate.updateValue(() => newDate);
    } else {
      // Fallback: directly mutate (may not track dirty state)
      this.myForm.value().myDate = newDate;
    }
  }
}
```

**When to use this pattern:**
- When `[field]` binding causes stability issues or change detection loops
- When you need more explicit control over form updates
- When direct mutation is preferred over creating new object references

**Note:** The `$any($event)` cast may be needed if there's a type mismatch between `DatepickerValue` and your expected `Date` type.

**Important:** If you're using this pattern with server-side data and initial values aren't populating, update the underlying `localObject` signal instead of directly mutating the form value. This ensures the form stays in sync:

```typescript
export class ServerFormComponent {
  localObject = signal<{ myDate: Date | null }>({
    myDate: null
  });
  
  myForm = form(this.localObject, objectSchema({
    myDate: objectSchema<Date | null>()
  }));
  
  myDate = computed(() => this.myForm.value().myDate);
  
  onMyDateChange(newDate: DatepickerValue | null): void {
    this.localObject.update(obj => ({
      ...obj,
      myDate: newDate instanceof Date ? newDate : new Date(newDate.toLocaleString())
    }));
  }
  
  updateFromServer(serverDate: Date | string): void {
    const dateValue = serverDate instanceof Date ? serverDate : new Date(serverDate);
    this.localObject.update(obj => ({
      ...obj,
      myDate: dateValue
    }));
  }
}
```

### 6. Time-Only Picker

**Scenario**: Display only time selection without calendar. Perfect for time selection scenarios where date is not needed.

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-time-only',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="timeForm">
      <ngxsmk-datepicker
        mode="single"
        [timeOnly]="true"
        [minuteInterval]="15"
        formControlName="appointmentTime">
      </ngxsmk-datepicker>
      
      @if (timeForm.controls.appointmentTime.value) {
        <p>Selected time: {{ timeForm.controls.appointmentTime.value | date:'shortTime' }}</p>
      }
    </form>
  `
})
export class TimeOnlyComponent {
  timeForm = new FormGroup({
    appointmentTime: new FormControl<DatepickerValue>(null)
  });
}
```

**Key Features:**
- Hides calendar grid completely
- Shows only time selection controls (hour, minute, AM/PM)
- Value is still a Date object (uses today's date with selected time)
- Automatically enables `showTime` when `timeOnly` is true
- Placeholder defaults to "Select Time"

### 7. Date Range Selection with Time

**Scenario**: Booking system with check-in/check-out dates and times.

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DateRange, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="bookingForm">
      <ngxsmk-datepicker
        mode="range"
        [showTime]="true"
        [minuteInterval]="15"
        [ranges]="quickRanges"
        [showRanges]="true"
        [minDate]="today"
        placeholder="Select check-in and check-out dates"
        formControlName="dateRange">
      </ngxsmk-datepicker>
    </form>
  `
})
export class BookingComponent {
  today = new Date();
  
  bookingForm = new FormGroup({
    dateRange: new FormControl<DatepickerValue>(null)
  });
  
  quickRanges: DateRange = {
    'Today': [this.today, this.today],
    'Tomorrow': [
      new Date(this.today.getTime() + 86400000),
      new Date(this.today.getTime() + 86400000)
    ],
    'This Week': [
      new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - this.today.getDay()),
      this.today
    ],
    'Next 7 Days': [
      this.today,
      new Date(this.today.getTime() + 7 * 86400000)
    ]
  };
}
```

### 8. Multiple Date Selection

**Scenario**: Event calendar where users can select multiple dates for availability.

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-calendar',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule, CommonModule, DatePipe],
  template: `
    <form [formGroup]="eventForm">
      <ngxsmk-datepicker
        mode="multiple"
        placeholder="Select available dates"
        formControlName="availableDates">
      </ngxsmk-datepicker>
      
      @if (selectedDates.length > 0) {
        <div>
          <p>Selected {{ selectedDates.length }} dates:</p>
          <ul>
            @for (date of selectedDates; track date) {
              <li>{{ date | date:'short' }}</li>
            }
          </ul>
        </div>
      }
    </form>
  `
})
export class EventCalendarComponent {
  eventForm = new FormGroup({
    availableDates: new FormControl<DatepickerValue>(null)
  });
  
  get selectedDates(): Date[] {
    const value = this.eventForm.get('availableDates')?.value;
    return Array.isArray(value) ? value : [];
  }
}
```

### 7. Disabled Dates and Custom Validation

**Scenario**: Appointment booking with business hours and blackout dates.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [minDate]="today"
      [maxDate]="maxBookingDate"
      [disabledDates]="blackoutDates"
      [isInvalidDate]="isWeekend"
      placeholder="Select appointment date">
    </ngxsmk-datepicker>
  `
})
export class AppointmentComponent {
  today = new Date();
  maxBookingDate = new Date(this.today.getTime() + 90 * 86400000); // 90 days ahead
  
  // Blackout dates (holidays, maintenance days)
  blackoutDates: Date[] = [
    new Date(2025, 0, 1),   // New Year's Day
    new Date(2025, 6, 4),   // Independence Day
    new Date(2025, 11, 25), // Christmas
  ];
  
  // Disable weekends
  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };
}
```

### 9. Auto-Close After Selection

**Scenario**: Automatically close the calendar after date selection for better UX.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-auto-close',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [autoApplyClose]="true"
      placeholder="Select a date">
    </ngxsmk-datepicker>
    
    <ngxsmk-datepicker
      mode="range"
      [autoApplyClose]="true"
      placeholder="Select date range">
    </ngxsmk-datepicker>
    
    <ngxsmk-datepicker
      mode="single"
      [showTime]="true"
      [autoApplyClose]="true"
      placeholder="Select date and time">
    </ngxsmk-datepicker>
  `
})
export class AutoCloseComponent {}
```

**Important Notes:**
- `autoApplyClose` is automatically disabled when `showTime` is `true` (users need time to select time)
- For single mode: closes immediately after date selection
- For range mode: closes after both start and end dates are selected
- Does not apply to inline mode calendars
- Also works with predefined range selections

### 9. Programmatic Value Setting

**Scenario**: Setting datepicker value from API response or user action.

```typescript
import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programmatic',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, CommonModule],
  template: `
    <button (click)="setToday()">Set Today</button>
    <button (click)="setNextWeek()">Set Next Week</button>
    <button (click)="loadFromApi()">Load from API</button>
    
    <ngxsmk-datepicker
      mode="single"
      [value]="selectedDate()"
      (valueChange)="selectedDate.set($event)">
    </ngxsmk-datepicker>
  `
})
export class ProgrammaticComponent {
  selectedDate = signal<DatepickerValue>(null);
  
  constructor(private http: HttpClient) {}
  
  setToday() {
    this.selectedDate.set(new Date());
  }
  
  setNextWeek() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    this.selectedDate.set(nextWeek);
  }
  
  loadFromApi() {
    this.http.get<{ date: string }>('/api/user-preferences').subscribe(response => {
      this.selectedDate.set(new Date(response.date));
    });
  }
}
```

### 9. Inline Calendar Display

**Scenario**: Always-visible calendar for dashboard or embedded views.

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
  template: `
    <div class="dashboard">
      <h2>Calendar View</h2>
      <ngxsmk-datepicker
        mode="range"
        [inline]="true"
        formControlName="dateRange">
      </ngxsmk-datepicker>
    </div>
  `
})
export class DashboardComponent {
  dateRangeForm = new FormGroup({
    dateRange: new FormControl(null)
  });
}
```

### 10. Custom Holiday Provider

**Scenario**: Displaying custom holidays or company-specific dates.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, HolidayProvider } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [holidayProvider]="customHolidays"
      placeholder="Select date">
    </ngxsmk-datepicker>
  `
})
export class HolidaysComponent {
  customHolidays: HolidayProvider = {
    getHolidays: (year: number, month: number): Date[] => {
      const holidays: Date[] = [];
      
      // New Year's Day
      if (month === 0) holidays.push(new Date(year, 0, 1));
      
      // Company Anniversary (June 15)
      if (month === 5) holidays.push(new Date(year, 5, 15));
      
      // Christmas
      if (month === 11) holidays.push(new Date(year, 11, 25));
      
      return holidays;
    },
    
    getHolidayLabel: (date: Date): string | null => {
      const month = date.getMonth();
      const day = date.getDate();
      
      if (month === 0 && day === 1) return 'New Year\'s Day';
      if (month === 5 && day === 15) return 'Company Anniversary';
      if (month === 11 && day === 25) return 'Christmas';
      
      return null;
    }
  };
}
```

### 11. Custom Styling with Classes

**Scenario**: Applying custom CSS classes for branding or theme integration.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerClasses } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-branded',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [classes]="customClasses"
      placeholder="Select date">
    </ngxsmk-datepicker>
  `
})
export class BrandedComponent {
  customClasses: DatepickerClasses = {
    wrapper: 'custom-wrapper',
    inputGroup: 'custom-input-group border-2 border-blue-500',
    input: 'custom-input px-4 py-3 text-lg',
    popover: 'custom-popover shadow-xl',
    container: 'custom-container bg-gradient-to-br from-blue-50 to-purple-50',
    calendar: 'custom-calendar p-4',
    header: 'custom-header mb-4',
    dayCell: 'custom-day-cell hover:bg-blue-100',
    footer: 'custom-footer flex justify-end gap-2',
    clearBtn: 'custom-clear-btn',
    calendarBtn: 'custom-calendar-btn',
    closeBtn: 'custom-close-btn bg-blue-600 text-white'
  };
}
```

### 12. Extension Points and Hooks

**Scenario**: Custom validation, formatting, and event handling.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerHooks, KeyboardShortcutContext } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-custom-hooks',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [hooks]="customHooks"
      [enableKeyboardShortcuts]="true"
      [customShortcuts]="customShortcuts"
      placeholder="Select date">
    </ngxsmk-datepicker>
  `
})
export class CustomHooksComponent {
  customHooks: DatepickerHooks = {
    // Custom CSS classes for day cells
    getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
      const classes: string[] = [];
      if (isToday) classes.push('highlight-today');
      if (isHoliday) classes.push('holiday-cell');
      if (date.getDay() === 5) classes.push('friday-cell'); // Highlight Fridays
      return classes;
    },
    
    // Custom tooltips
    getDayCellTooltip: (date, holidayLabel) => {
      if (holidayLabel) return holidayLabel;
      if (date.getDay() === 5) return 'TGIF!';
      return null;
    },
    
    // Custom date formatting
    formatDisplayValue: (value, mode) => {
      if (!value) return '';
      if (value instanceof Date) {
        return value.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return String(value);
    },
    
    // Custom validation
    validateDate: (date, currentValue, mode) => {
      // Prevent selecting dates more than 1 year in the future
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      return date <= oneYearFromNow;
    },
    
    // Event hooks
    beforeDateSelect: (date, currentValue) => {
      console.log('About to select:', date);
      return true; // Return false to prevent selection
    },
    
    afterDateSelect: (date, newValue) => {
      console.log('Date selected:', date, 'New value:', newValue);
    },
    
    onCalendarOpen: () => {
      console.log('Calendar opened');
    },
    
    onCalendarClose: () => {
      console.log('Calendar closed');
    }
  };
  
  customShortcuts = {
    'Q': (context: KeyboardShortcutContext) => {
      // Custom shortcut: 'Q' for quarter selection
      const today = new Date();
      const quarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), quarter * 3, 1);
      // Implementation would set the date
      return true;
    }
  };
}
```

### 13. Theming and Customization

The datepicker supports comprehensive theming through CSS custom properties (CSS variables) and the `theme` input. All styling can be customized to match your application's design system.

#### 13.1. Built-in Light/Dark Themes

**Scenario**: Switching between light and dark themes.

```typescript
import { Component, signal, computed } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <button (click)="toggleTheme()">
      Switch to {{ isDark() ? 'Light' : 'Dark' }} Mode
    </button>
    
    <ngxsmk-datepicker
      mode="single"
      [theme]="currentTheme()"
      placeholder="Select date">
    </ngxsmk-datepicker>
  `
})
export class ThemeSwitcherComponent {
  isDark = signal(false);
  
  currentTheme = computed(() => this.isDark() ? 'dark' : 'light');
  
  toggleTheme() {
    this.isDark.update(value => !value);
  }
}
```

#### 13.2. Custom CSS Variables Theming

**Scenario**: Customizing colors, spacing, and other design tokens using CSS custom properties.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-custom-theme',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="custom-datepicker-wrapper">
      <ngxsmk-datepicker
        mode="single"
        placeholder="Select date">
      </ngxsmk-datepicker>
    </div>
  `,
  styles: [`
    .custom-datepicker-wrapper {
      --datepicker-primary-color: #3b82f6;
      --datepicker-primary-contrast: #ffffff;
      --datepicker-range-background: #dbeafe;
      --datepicker-background: #ffffff;
      --datepicker-text-color: #111827;
      --datepicker-subtle-text-color: #6b7280;
      --datepicker-border-color: #d1d5db;
      --datepicker-hover-background: #f3f4f6;
      --datepicker-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --datepicker-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --datepicker-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --datepicker-font-size-base: 15px;
      --datepicker-spacing-md: 14px;
      --datepicker-radius-md: 10px;
    }
  `]
})
export class CustomThemeComponent {}
```

#### 13.3. Complete CSS Variables Reference

All available CSS custom properties for theming:

**Colors:**
- `--datepicker-primary-color`: Primary accent color (default: `#6d28d9`)
- `--datepicker-primary-contrast`: Text color on primary background (default: `#ffffff`)
- `--datepicker-range-background`: Background for date ranges (default: `#f5f3ff`)
- `--datepicker-background`: Main background color (default: `#ffffff`)
- `--datepicker-text-color`: Primary text color (default: `#1f2937`)
- `--datepicker-subtle-text-color`: Secondary/subtle text color (default: `#6b7280`)
- `--datepicker-border-color`: Border color (default: `#e5e7eb`)
- `--datepicker-hover-background`: Hover state background (default: `#f3f4f6`)

**Shadows:**
- `--datepicker-shadow-sm`: Small shadow (default: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`)
- `--datepicker-shadow-md`: Medium shadow (default: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`)
- `--datepicker-shadow-lg`: Large shadow (default: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`)
- `--datepicker-shadow-xl`: Extra large shadow (default: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`)

**Typography:**
- `--datepicker-font-size-base`: Base font size (default: `14px`)
- `--datepicker-font-size-sm`: Small font size (default: `12px`)
- `--datepicker-font-size-lg`: Large font size (default: `16px`)
- `--datepicker-font-size-xl`: Extra large font size (default: `18px`)
- `--datepicker-line-height`: Line height (default: `1.5`)

**Spacing:**
- `--datepicker-spacing-xs`: Extra small spacing (default: `4px`)
- `--datepicker-spacing-sm`: Small spacing (default: `8px`)
- `--datepicker-spacing-md`: Medium spacing (default: `12px`)
- `--datepicker-spacing-lg`: Large spacing (default: `16px`)
- `--datepicker-spacing-xl`: Extra large spacing (default: `20px`)
- `--datepicker-spacing-2xl`: 2X large spacing (default: `24px`)

**Border Radius:**
- `--datepicker-radius-sm`: Small border radius (default: `6px`)
- `--datepicker-radius-md`: Medium border radius (default: `8px`)
- `--datepicker-radius-lg`: Large border radius (default: `12px`)
- `--datepicker-radius-xl`: Extra large border radius (default: `16px`)

**Transitions:**
- `--datepicker-transition`: Default transition (default: `opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)`)

#### 13.4. Global Theme Application

**Scenario**: Applying theme to all datepickers in your application.

```typescript
// styles.scss (global styles)
:root {
  --datepicker-primary-color: #3b82f6;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #dbeafe;
  --datepicker-background: #ffffff;
  --datepicker-text-color: #111827;
  --datepicker-subtle-text-color: #6b7280;
  --datepicker-border-color: #d1d5db;
  --datepicker-hover-background: #f3f4f6;
}

[data-theme="dark"] {
  --datepicker-primary-color: #60a5fa;
  --datepicker-primary-contrast: #1e293b;
  --datepicker-range-background: rgba(96, 165, 250, 0.15);
  --datepicker-background: #1e293b;
  --datepicker-text-color: #f1f5f9;
  --datepicker-subtle-text-color: #94a3b8;
  --datepicker-border-color: #334155;
  --datepicker-hover-background: #334155;
}
```

#### 13.5. Component-Level Theming

**Scenario**: Different themes for different datepickers in the same application.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-multi-theme',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="blue-theme">
      <h3>Blue Theme</h3>
      <ngxsmk-datepicker mode="single" placeholder="Select date"></ngxsmk-datepicker>
    </div>
    
    <div class="green-theme">
      <h3>Green Theme</h3>
      <ngxsmk-datepicker mode="single" placeholder="Select date"></ngxsmk-datepicker>
    </div>
  `,
  styles: [`
    .blue-theme {
      --datepicker-primary-color: #3b82f6;
      --datepicker-range-background: #dbeafe;
    }
    
    .green-theme {
      --datepicker-primary-color: #10b981;
      --datepicker-range-background: #d1fae5;
    }
  `]
})
export class MultiThemeComponent {}
```

#### 13.6. Integration with Design Systems

**Scenario**: Using with design token systems like TokiForge, Tailwind CSS, or Material Design.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      placeholder="Select date">
    </ngxsmk-datepicker>
  `,
  styles: [`
    :host {
      /* TokiForge integration example */
      --datepicker-primary-color: var(--toki-color-primary, #6d28d9);
      --datepicker-primary-contrast: var(--toki-color-on-primary, #ffffff);
      --datepicker-background: var(--toki-color-surface, #ffffff);
      --datepicker-text-color: var(--toki-color-on-surface, #1f2937);
      --datepicker-border-color: var(--toki-color-outline, #e5e7eb);
      
      /* Spacing from design system */
      --datepicker-spacing-sm: var(--toki-spacing-sm, 8px);
      --datepicker-spacing-md: var(--toki-spacing-md, 12px);
      --datepicker-spacing-lg: var(--toki-spacing-lg, 16px);
      
      /* Border radius from design system */
      --datepicker-radius-md: var(--toki-radius-md, 8px);
      --datepicker-radius-lg: var(--toki-radius-lg, 12px);
    }
  `]
})
export class DesignSystemComponent {}
```

#### 13.7. Dark Theme Customization

**Scenario**: Customizing dark theme beyond the default.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-custom-dark',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      theme="dark"
      placeholder="Select date">
    </ngxsmk-datepicker>
  `,
  styles: [`
    :host ::ng-deep ngxsmk-datepicker.dark-theme {
      --datepicker-primary-color: #8b5cf6;
      --datepicker-range-background: rgba(139, 92, 246, 0.2);
      --datepicker-background: #0f172a;
      --datepicker-text-color: #f8fafc;
      --datepicker-border-color: #1e293b;
    }
  `]
})
export class CustomDarkComponent {}
```

#### 13.8. Responsive Theming

**Scenario**: Adjusting theme variables based on screen size.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-responsive-theme',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker mode="single" placeholder="Select date"></ngxsmk-datepicker>
  `,
  styles: [`
    :host {
      --datepicker-font-size-base: 14px;
      --datepicker-spacing-md: 12px;
    }
    
    @media (min-width: 768px) {
      :host {
        --datepicker-font-size-base: 16px;
        --datepicker-spacing-md: 16px;
      }
    }
  `]
})
export class ResponsiveThemeComponent {}
```

#### 13.9. Animation Customization

**Scenario**: Customizing transition speeds and easing functions.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-animation-theme',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker mode="single" placeholder="Select date"></ngxsmk-datepicker>
  `,
  styles: [`
    :host {
      --datepicker-transition: all 0.2s ease-in-out;
    }
    
    /* For reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      :host {
        --datepicker-transition: none;
      }
    }
  `]
})
export class AnimationThemeComponent {}
```

### 14. Locale and Internationalization

**Scenario**: Multi-language support with different date formats.

```typescript
import { Component, signal } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-i18n',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <select [value]="currentLocale()" (change)="changeLocale($event)">
      <option value="en-US">English (US)</option>
      <option value="fr-FR">Français</option>
      <option value="de-DE">Deutsch</option>
      <option value="ja-JP">日本語</option>
    </select>
    
    <ngxsmk-datepicker
      mode="single"
      [locale]="currentLocale()"
      placeholder="Select date">
    </ngxsmk-datepicker>
  `
})
export class I18nComponent {
  currentLocale = signal('en-US');
  
  changeLocale(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.currentLocale.set(select.value);
  }
}
```

### 15. SSR-Compatible Implementation

**Scenario**: Server-side rendering with platform detection.

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-ssr',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      mode="single"
      [value]="selectedDate"
      (valueChange)="onDateChange($event)">
    </ngxsmk-datepicker>
  `
})
export class SSRComponent {
  private platformId = inject(PLATFORM_ID);
  selectedDate: Date | null = null;
  
  onDateChange(date: Date | null) {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only logic (e.g., localStorage)
      localStorage.setItem('selectedDate', date?.toISOString() || '');
    }
    this.selectedDate = date;
  }
}
```

### 16. Ionic Framework Integration

**Scenario**: Using datepicker in Ionic Angular app.

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-datepicker',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Date Picker</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ngxsmk-datepicker
        mode="single"
        placeholder="Select date">
      </ngxsmk-datepicker>
    </ion-content>
  `
})
export class IonicDatepickerComponent {}
```

### 17. Complex Form with Multiple Datepickers

**Scenario**: Multi-step form with validation and conditional datepickers.

```typescript
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complex-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="complexForm">
      <div>
        <label>Start Date</label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="startDate"
          [minDate]="today">
        </ngxsmk-datepicker>
      </div>
      
      <div>
        <label>End Date</label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="endDate"
          [minDate]="startDateValue()">
        </ngxsmk-datepicker>
      </div>
      
      @if (complexForm.get('endDate')?.value && startDateValue()) {
        <div>
          <p>Duration: {{ calculateDuration() }} days</p>
        </div>
      }
      
      <button type="submit" [disabled]="complexForm.invalid">Submit</button>
    </form>
  `
})
export class ComplexFormComponent {
  today = new Date();
  
  complexForm = new FormGroup({
    startDate: new FormControl<DatepickerValue>(null, [Validators.required]),
    endDate: new FormControl<DatepickerValue>(null, [Validators.required])
  }, {
    validators: this.dateRangeValidator
  });
  
  startDateValue = signal<Date | null>(null);
  
  constructor() {
    this.complexForm.get('startDate')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        this.startDateValue.set(value);
      }
    });
  }
  
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const formGroup = group as FormGroup;
    const start = formGroup.get('startDate')?.value;
    const end = formGroup.get('endDate')?.value;
    
    if (start && end && start instanceof Date && end instanceof Date) {
      if (end < start) {
        return { dateRange: true };
      }
    }
    return null;
  }
  
  calculateDuration(): number {
    const start = this.complexForm.get('startDate')?.value;
    const end = this.complexForm.get('endDate')?.value;
    
    if (start instanceof Date && end instanceof Date) {
      const diff = end.getTime() - start.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  }
}
```

### 18. Computed Signal with Datepicker

**Scenario**: Deriving values from selected dates using computed signals.

```typescript
import { Component, signal, computed } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-computed',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, CommonModule, CurrencyPipe],
  template: `
    <ngxsmk-datepicker
      mode="range"
      [value]="dateRange()"
      (valueChange)="dateRange.set($event)">
    </ngxsmk-datepicker>
    
    @if (dateRange() && isRange(dateRange())) {
      <div>
        <p>Start: {{ formattedStart() }}</p>
        <p>End: {{ formattedEnd() }}</p>
        <p>Duration: {{ duration() }} days</p>
        <p>Total Cost: {{ totalCost() | currency }}</p>
      </div>
    }
  `
})
export class ComputedComponent {
  dateRange = signal<DatepickerValue>(null);
  dailyRate = signal(100); // $100 per day
  
  isRange(value: DatepickerValue): value is { start: Date; end: Date } {
    return value !== null && typeof value === 'object' && 'start' in value;
  }
  
  formattedStart = computed(() => {
    const range = this.dateRange();
    if (this.isRange(range)) {
      return range.start.toLocaleDateString();
    }
    return '';
  });
  
  formattedEnd = computed(() => {
    const range = this.dateRange();
    if (this.isRange(range)) {
      return range.end.toLocaleDateString();
    }
    return '';
  });
  
  duration = computed(() => {
    const range = this.dateRange();
    if (this.isRange(range)) {
      const diff = range.end.getTime() - range.start.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  });
  
  totalCost = computed(() => {
    return this.duration() * this.dailyRate();
  });
}
```

## Exported Types

### DatepickerValue

**Status**: Stable

```typescript
type DatepickerValue = 
  | Date                    // Single mode
  | { start: Date; end: Date }  // Range mode
  | Date[]                 // Multiple mode
  | null;
```

### DateInput

**Status**: Stable

```typescript
type DateInput = 
  | Date 
  | string 
  | { toDate: () => Date; _isAMomentObject?: boolean; $d?: Date };
```


### SignalFormField (v2.0.5+)

**Status**: Stable

Type representing a signal-based form field.

```typescript
type SignalFormField = any; // Compatible with Angular 21 FieldTree
```

### SignalFormFieldConfig (v2.0.5+)

**Status**: Stable

Interface for a resolved or direct signal form field configuration.

```typescript
interface SignalFormFieldConfig {
  value: Signal<DatepickerValue> | WritableSignal<DatepickerValue> | (() => DatepickerValue);
  disabled: Signal<boolean> | (() => boolean) | boolean;
  required?: Signal<boolean> | (() => boolean) | boolean;
  setValue?: (value: DatepickerValue) => void;
  updateValue?: (updater: (prev: DatepickerValue) => DatepickerValue) => void;
  markAsDirty?: () => void;
  errors?: Signal<ValidationError[]> | (() => ValidationError[]);
}

### DatepickerHooks

**Status**: Stable (v1.9.22+)

Comprehensive hook interface for customizing datepicker behavior.

```typescript
interface DatepickerHooks {
  getDayCellClasses?: (date: Date, isSelected: boolean, isDisabled: boolean, isToday: boolean, isHoliday: boolean) => string[];
  getDayCellTooltip?: (date: Date, holidayLabel: string | null) => string | null;
  formatDayNumber?: (date: Date) => string;
  validateDate?: (date: Date, currentValue: DatepickerValue, mode: 'single' | 'range' | 'multiple') => boolean;
  validateRange?: (startDate: Date, endDate: Date) => boolean;
  getValidationError?: (date: Date) => string | null;
  handleShortcut?: (event: KeyboardEvent, context: KeyboardShortcutContext) => boolean;
  formatDisplayValue?: (value: DatepickerValue, mode: 'single' | 'range' | 'multiple') => string;
  formatAriaLabel?: (date: Date) => string;
  beforeDateSelect?: (date: Date, currentValue: DatepickerValue) => boolean;
  afterDateSelect?: (date: Date, newValue: DatepickerValue) => void;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
}
```

### KeyboardShortcutContext

**Status**: Stable (v1.9.22+)

Context object provided to keyboard shortcut handlers.

```typescript
interface KeyboardShortcutContext {
  currentDate: Date;
  selectedDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  selectedDates: Date[];
  mode: 'single' | 'range' | 'multiple';
  focusedDate: Date | null;
  isCalendarOpen: boolean;
}
```

### DateRange

**Status**: Stable

```typescript
type DateRange = {
  [key: string]: [Date, Date];
};
```

### HolidayProvider

**Status**: Stable

```typescript
interface HolidayProvider {
  getHolidays(year: number, month: number): Date[];
  getHolidayLabel(date: Date): string | null;
}
```

### DatepickerClasses

**Status**: Stable

```typescript
interface DatepickerClasses {
  wrapper?: string;
  inputGroup?: string;
  input?: string;
  popover?: string;
  container?: string;
  calendar?: string;
  header?: string;
  dayCell?: string;
  footer?: string;
  clearBtn?: string;
  calendarBtn?: string;
  closeBtn?: string;
  navPrev?: string;
  navNext?: string;
}
```

## Exported Utilities

### Date Utilities

**Status**: Stable

```typescript
// From './lib/utils/date.utils'
export function isSameDay(d1: Date | null, d2: Date | null): boolean;
export function normalizeDate(date: DateInput | null): Date | null;
```

### Calendar Utilities

**Status**: Stable

```typescript
// From './lib/utils/calendar.utils'
export function getDaysInMonth(year: number, month: number): number;
export function getFirstDayOfMonth(year: number, month: number): number;
```

## Keyboard Support
 
The datepicker comes with comprehensive keyboard support:
 
 - **Navigation**: Arrow keys to navigate dates.
 - **Selection**: Enter/Space to select.
 - **Views**: Page Up/Down for months, Shift + Page Up/Down for years.
 - **Shortcuts**:
   - `T`: Today
   - `Y`: Yesterday
   - `N`: Tomorrow
   - `W`: Next Week
   - `?` or `Shift + /`: **Toggle Keyboard Help Dialog**
   - `Esc`: Close calendar
 
 ## Experimental APIs

The following APIs are experimental and may change:

- None currently

## Deprecated APIs

The following APIs are deprecated and will be removed in the next major version:

- None currently

## Migration Guides

When upgrading between major versions, see `MIGRATION.md` for detailed migration instructions.

## Support

For questions about the API:

- Check the [README.md](../../README.md) for usage examples
- Review the [documentation](./) for detailed guides
- Open an issue on GitHub for questions
