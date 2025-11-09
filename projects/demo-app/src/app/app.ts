import {Component, HostBinding} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {
  DateRange,
  NgxsmkDatepickerComponent,
  HolidayProvider,
  DatepickerValue,
} from "ngxsmk-datepicker";
import {CodePipe} from './code.pipe';

function getStartOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function getEndOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function addMonths(d: Date, months: number): Date {
  const newDate = new Date(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}

function subtractDays(d: Date, days: number): Date {
  const newDate = new Date(d);
  newDate.setDate(d.getDate() - days);
  return newDate;
}

function getStartOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getEndOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

class SampleHolidayProvider implements HolidayProvider {
  private readonly holidays: { [key: string]: string } = {
    '2025-01-01': 'New Year\'s Day',
    '2025-01-20': 'MLK Jr. Day',
    '2025-02-17': 'Presidents\' Day',
    '2025-05-26': 'Memorial Day',
    '2025-07-04': 'Independence Day',
    '2025-09-01': 'Labor Day',
    '2025-10-13': 'Columbus Day',
    '2025-11-11': 'Veterans Day',
    '2025-11-27': 'Thanksgiving',
    '2025-12-25': 'Christmas Day',
  };

  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isHoliday(date: Date): boolean {
    const key = this.formatDateKey(date);
    return !!this.holidays[key];
  }

  getHolidayLabel(date: Date): string | null {
    const key = this.formatDateKey(date);
    return this.holidays[key] || null;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxsmkDatepickerComponent, ReactiveFormsModule, FormsModule, CodePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App {
  private readonly today = new Date();
  public readonly JSON = JSON;
  public currentTheme: 'light' | 'dark' = 'light';
  public mobileMenuOpen: boolean = false;

  public prevMonthLabel: string = 'Previous month';
  public nextMonthLabel: string = 'Next month';
  public showClearButton: boolean = true;
  public showCloseButton: boolean = true;

  public features = [
    { icon: '🚀', title: 'Zero Dependencies', description: 'No external dependencies, just Angular' },
    { icon: '⚡', title: 'High Performance', description: 'Optimized for fast rendering and selection' },
    { icon: '🎨', title: 'Customizable', description: 'Fully customizable themes and styles' },
    { icon: '📱', title: 'Responsive', description: 'Works great on all device sizes' },
    { icon: '🔧', title: 'Type Safe', description: 'Full TypeScript support with type definitions' },
    { icon: '♿', title: 'Accessible', description: 'Built with accessibility in mind' },
    { icon: '📦', title: 'Lightweight', description: 'Small bundle size, minimal overhead' },
    { icon: '🔄', title: 'Form Integration', description: 'Seamless integration with Angular forms' },
  ];

  public navigationItems = [
    { id: 'getting-started', label: 'Getting Started', sub: false },
    { id: 'installation', label: 'Installation', sub: false },
    { id: 'basic-usage', label: 'Basic Usage', sub: false },
    { id: 'api-reference', label: 'API Reference', sub: false },
    { id: 'inputs', label: 'Inputs', sub: true },
    { id: 'outputs', label: 'Outputs', sub: true },
    { id: 'examples', label: 'Examples', sub: false },
    { id: 'single-date', label: 'Single Date', sub: true },
    { id: 'date-range', label: 'Date Range', sub: true },
    { id: 'multiple-dates', label: 'Multiple Dates', sub: true },
    { id: 'programmatic-value', label: 'Programmatic Value', sub: true },
    { id: 'custom-labels', label: 'Customization', sub: true },
  ];

  public inputProperties = [
    { property: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", description: 'Selection mode' },
    { property: 'value', type: 'DatepickerValue', default: 'null', description: 'Programmatic value setting' },
    { property: 'placeholder', type: 'string', default: "'Select Date'", description: 'Input placeholder text' },
    { property: 'minDate', type: 'DateInput | null', default: 'null', description: 'Minimum selectable date' },
    { property: 'maxDate', type: 'DateInput | null', default: 'null', description: 'Maximum selectable date' },
    { property: 'showTime', type: 'boolean', default: 'false', description: 'Show time selection' },
    { property: 'inline', type: "boolean | 'always' | 'auto'", default: 'false', description: 'Inline calendar display' },
    { property: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Theme variant' },
    { property: 'prevMonthLabel', type: 'string', default: "'Previous month'", description: 'Aria-label for previous month button' },
    { property: 'nextMonthLabel', type: 'string', default: "'Next month'", description: 'Aria-label for next month button' },
    { property: 'showClearButton', type: 'boolean', default: 'true', description: 'Show the clear button in the footer' },
    { property: 'showCloseButton', type: 'boolean', default: 'true', description: 'Show the close button in the footer' },
  ];

  public outputProperties = [
    { event: 'valueChange', type: 'EventEmitter<DatepickerValue>', description: 'Emitted when value changes' },
    { event: 'action', type: 'EventEmitter<{ type: string; payload?: any }>', description: 'Emitted on user actions' },
  ];

  public programmaticActions = [
    { label: 'Set Single Date', action: () => this.setSingleDateFromApi() },
    { label: 'Set Date Range', action: () => this.setRangeFromApi() },
    { label: 'Set Multiple Dates', action: () => this.setMultipleDatesFromApi() },
    { label: 'Clear', action: () => this.clearProgrammaticValue() },
  ];

  public minDate: Date = getStartOfDay(this.today);
  public maxDate: Date = getEndOfDay(addMonths(this.today, 1));
  public lastAction: any = null;
  
  public holidayProvider: HolidayProvider = new SampleHolidayProvider();
  public disableHolidays: boolean = true;

  public hasMinDate: boolean = true;
  public minDateInput: string = this.today.toISOString().split('T')[0];

  public hasDisabledDates: boolean = false;
  public disabledDatesArray: string[] = ['10/21/2025', '08/21/2025', '10/15/2025', '10/8/2025', '10/3/2025'];

  public programmaticSingleDate: Date | null = null;
  public programmaticRange: { start: Date; end: Date } | null = null;
  public programmaticMultipleDates: Date[] | null = null;
  public lastProgrammaticChange: Date | null = null;

  public datepickerForm = new FormGroup({
    singleDate: new FormControl<DatepickerValue>(getStartOfDay(addMonths(this.today, 1))),
    singleDate2: new FormControl<DatepickerValue>(getStartOfDay(addMonths(this.today, 1))),
    inlineRange: new FormControl({
      value: {start: getStartOfDay(this.today), end: getEndOfDay(this.today)},
      disabled: true
    }),
    rangeWithTime: new FormControl(),
    multipleDates: new FormControl<Date[] | null>(null),
    minDateDemo: new FormControl(),
    disabledDatesDemo: new FormControl(),
  });

  public myRanges: DateRange = {
    'Today': [getStartOfDay(this.today), getEndOfDay(this.today)],
    'Yesterday': [getStartOfDay(subtractDays(this.today, 1)), getEndOfDay(subtractDays(this.today, 1))],
    'Last 7 Days': [getStartOfDay(subtractDays(this.today, 6)), getEndOfDay(this.today)],
    'This Month': [getStartOfMonth(this.today), getEndOfMonth(this.today)],
  };

  public basicUsageCode = `import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent]
})`;

  public basicTemplateCode = `import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export class MyComponent {
  myForm = new FormGroup({
    myDate: new FormControl<DatepickerValue>(null)
  });
}

<form [formGroup]="myForm">
  <ngxsmk-datepicker
    mode="single"
    placeholder="Select a date"
    formControlName="myDate">
  </ngxsmk-datepicker>
</form>`;

  public singleDateCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    placeholder="Select a date"
    formControlName="singleDate">
  </ngxsmk-datepicker>
</form>`;

  public rangeDateCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="range"
    [showTime]="true"
    [minuteInterval]="15"
    [ranges]="myRanges"
    formControlName="rangeWithTime">
  </ngxsmk-datepicker>
</form>`;

  public multipleDatesCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="multiple"
    (action)="handleDatepickerAction($event)"
    formControlName="multipleDates">
  </ngxsmk-datepicker>
</form>`;

  public programmaticCode = `setDateFromApi() {
  const apiDate = new Date();
  apiDate.setDate(apiDate.getDate() + 7);
  this.selectedDate = apiDate;
}

<ngxsmk-datepicker
  [value]="selectedDate"
  (valueChange)="onValueChange($event)">
</ngxsmk-datepicker>`;

  public inlineCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="range"
    [inline]="true"
    formControlName="inlineRange">
  </ngxsmk-datepicker>
</form>`;

  public minMaxCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [minDate]="minDate"
    [maxDate]="maxDate"
    placeholder="Select a date"
    formControlName="singleDate2">
  </ngxsmk-datepicker>
</form>`;

  public customLabelsCode = `<ngxsmk-datepicker
  [prevMonthLabel]="'Go Back'"
  [nextMonthLabel]="'Go Forward'">
</ngxsmk-datepicker>`;

  @HostBinding('class.dark-theme') get isDarkMode() {
    return this.currentTheme === 'dark';
  }

  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 20;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      console.log('Code copied to clipboard');
    });
  }


  handleDatepickerAction(event: { type: string; payload?: any }): void {
    console.log('Datepicker Action:', event);
    this.lastAction = event;
  }

  setSingleDateFromApi(): void {
    const apiDate = new Date();
    apiDate.setDate(apiDate.getDate() + 7);
    this.programmaticSingleDate = getStartOfDay(apiDate);
  }

  setRangeFromApi(): void {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);
    this.programmaticRange = {
      start: getStartOfDay(start),
      end: getEndOfDay(end)
    };
  }

  setMultipleDatesFromApi(): void {
    const dates: Date[] = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i * 7));
      dates.push(getStartOfDay(date));
    }
    this.programmaticMultipleDates = dates;
  }

  clearProgrammaticValue(): void {
    this.programmaticSingleDate = null;
    this.programmaticRange = null;
    this.programmaticMultipleDates = null;
    this.lastProgrammaticChange = null;
  }

  onProgrammaticValueChange(value: DatepickerValue): void {
    const dateValue = value instanceof Date ? value : null;
    this.lastProgrammaticChange = dateValue;
    this.programmaticSingleDate = dateValue;
    console.log('Programmatic single date changed:', value);
  }

  onProgrammaticRangeChange(value: DatepickerValue): void {
    if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.programmaticRange = value as { start: Date; end: Date };
    } else {
      this.programmaticRange = null;
    }
    console.log('Programmatic range changed:', value);
  }

  onProgrammaticMultipleChange(value: DatepickerValue): void {
    this.programmaticMultipleDates = Array.isArray(value) ? value : null;
    console.log('Programmatic multiple dates changed:', value);
  }
}
