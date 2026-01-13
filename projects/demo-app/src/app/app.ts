import { Component, HostBinding, OnInit, OnDestroy, AfterViewInit, HostListener, signal, inject, PLATFORM_ID, computed, ChangeDetectorRef, effect, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, DatePipe, JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  DateRange,
  NgxsmkDatepickerComponent,
  HolidayProvider,
  DatepickerValue,
  PartialDatepickerTranslations,
  DatepickerHooks,
} from "ngxsmk-datepicker";
import { CodePipe } from './code.pipe';
import { DemoTranslationsService, DemoTranslations } from './demo-translations.service';
import { SnowOverlayComponent } from './snow-overlay.component';
import { exportToJson, importFromJson, exportToCsv, importFromCsv, exportToIcs, importFromIcs } from 'ngxsmk-datepicker';
import { ThemeBuilderService, DatePresetsService, DatepickerTheme, DatePreset } from 'ngxsmk-datepicker';
import { AnimationConfig } from 'ngxsmk-datepicker';

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

interface NavItem {
  id: string;
  label: string;
  sub: boolean;
  keywords: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, ReactiveFormsModule, FormsModule, CodePipe, SnowOverlayComponent, DatePipe, JsonPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  private readonly today = new Date();
  public readonly JSON = JSON;
  public currentTheme: 'light' | 'dark' = 'light';
  private darkModeMediaQuery: MediaQueryList | null = null;
  private darkModeHandler: ((e: MediaQueryList | MediaQueryListEvent) => void) | null = null;
  private manualThemeOverride: boolean = false;
  public mobileMenuOpen: boolean = false;
  public selectedMobileSize: number = 375;
  public currentTime: string = '9:41';
  public searchQuery: string = '';
  public expandedSections = signal<Set<string>>(new Set(['architecture', 'examples']));
  public npmDownloads = signal<number | null>(null);
  public npmDownloadsLoading = signal<boolean>(false);

  public navigationItems = computed(() => {
    const t = this.t();
    const items: NavItem[] = [
      { id: 'getting-started', label: t.gettingStarted, sub: false, keywords: 'getting started introduction overview' },
      { id: 'installation', label: t.installation, sub: false, keywords: 'install setup npm package' },
      { id: 'basic-usage', label: t.basicUsage, sub: false, keywords: 'basic usage example simple' },
      { id: 'framework-integration', label: t.frameworkIntegration, sub: false, keywords: 'angular material ionic html input form field' },
      { id: 'api-reference', label: t.apiReference, sub: false, keywords: 'api reference documentation' },
      { id: 'theming', label: t.theming, sub: false, keywords: 'theme dark light styling css' },
      {
        id: 'architecture',
        label: t.architecture,
        sub: false,
        keywords: 'architecture plugin hooks extension points system design',
        children: [
          { id: 'plugin-architecture', label: t.pluginArchitecture, sub: true, keywords: 'plugin architecture hooks extension points validation rendering formatting events' },
        ]
      },
      {
        id: 'examples',
        label: t.examples,
        sub: false,
        keywords: 'examples demo showcase',
        children: [
          { id: 'signal-forms', label: t.signalForms, sub: true, keywords: 'signal forms angular 21 reactive' },
          { id: 'signal-forms-field', label: t.signalFormsField, sub: true, keywords: 'signal forms field input angular 21 FieldTree type compatibility' },
          { id: 'angular-21-features', label: t.angular21Features, sub: true, keywords: 'angular 21 zoneless vitest aria compatibility' },
          { id: 'single-date', label: t.singleDate, sub: true, keywords: 'single date picker selection' },
          { id: 'customization-a11y', label: t.customizationA11y, sub: true, keywords: 'customization accessibility a11y aria' },
          { id: 'date-range', label: t.dateRange, sub: true, keywords: 'date range selection start end' },
          { id: 'range-previous-month', label: t.rangePreviousMonth, sub: true, keywords: 'range previous month selection cross month boundaries null initial values' },
          { id: 'time-only', label: t.timeOnly, sub: true, keywords: 'time only picker time selection no calendar' },
          { id: 'allow-typing', label: t.editableInputTyping, sub: true, keywords: 'allow typing editable input type date keyboard input mask format' },
          { id: 'custom-format', label: t.customFormat, sub: true, keywords: 'custom format display format date format string MM DD YYYY hh mm' },
          { id: 'moment-js-integration', label: t.momentJsIntegration, sub: true, keywords: 'moment js integration custom format fix' },
          { id: 'rtl-support', label: t.rtlSupport, sub: true, keywords: 'rtl right to left arabic hebrew persian urdu mirror' },
          { id: 'translations-i18n', label: t.translationsI18n, sub: true, keywords: 'translations i18n internationalization locale language translation service' },
          { id: 'timezone-support', label: t.timezoneSupport, sub: true, keywords: 'timezone time zone utc iana formatting parsing' },
          { id: 'multiple-dates', label: t.multipleDates, sub: true, keywords: 'multiple dates selection array' },
          { id: 'programmatic-value', label: t.programmaticValue, sub: true, keywords: 'programmatic set value api' },
          { id: 'inline-calendar', label: t.inlineCalendar, sub: true, keywords: 'inline calendar always visible' },
          { id: 'min-max-date', label: t.minMaxDate, sub: true, keywords: 'min max date limit restriction' },
          { id: 'calendar-views', label: t.calendarViews, sub: true, keywords: 'year picker decade picker timeline time slider view mode' },
          { id: 'multi-calendar', label: t.multiCalendar, sub: true, keywords: 'multi calendar multiple months side by side calendar count' },
          { id: 'mobile-playground', label: t.mobilePlayground, sub: true, keywords: 'mobile responsive playground test' },
        ]
      },
      { id: 'inputs', label: t.inputs, sub: false, keywords: 'inputs properties @input parameters' },
      { id: 'outputs', label: t.outputs, sub: false, keywords: 'outputs events @output emitters' },
    ];
    return items;
  });

  public allNavigationItems = computed(() => {
    const items: NavItem[] = [];
    const flatten = (navItems: NavItem[]) => {
      for (const item of navItems) {
        items.push(item);
        if (item.children) {
          flatten(item.children);
        }
      }
    };
    flatten(this.navigationItems());
    return items;
  });

  public filteredNavigationItems = computed(() => {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return this.navigationItems();
    }
    const lowerQuery = this.searchQuery.toLowerCase().trim();
    const filterItems = (items: NavItem[]): NavItem[] => {
      return items.map(item => {
        const labelMatch = item.label.toLowerCase().includes(lowerQuery);
        const keywordMatch = (item.keywords || '').toLowerCase().includes(lowerQuery);

        if (item.children) {
          const filteredChildren = filterItems(item.children);
          const hasMatchingChildren = filteredChildren.length > 0;

          if (labelMatch || keywordMatch || hasMatchingChildren) {
            return {
              ...item,
              children: filteredChildren
            };
          }
          return null;
        } else {
          if (labelMatch || keywordMatch) {
            return item;
          }
          return null;
        }
      }).filter((item): item is NavItem => item !== null);
    };
    return filterItems(this.navigationItems());
  });

  toggleSubMenu(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.expandedSections.update(expanded => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      return newExpanded;
    });
  }

  isSectionExpanded(sectionId: string): boolean {
    return this.expandedSections().has(sectionId);
  }

  public features = computed(() => {
    const t = this.t();
    return [
      { icon: '🚀', title: t.zeroDependencies, description: 'No external dependencies, just Angular' },
      { icon: '⚡', title: t.highPerformance, description: 'GPU-accelerated animations with transform3d, optimized rendering' },
      { icon: '🎨', title: t.fullyCustomizable, description: '28+ CSS variables, built-in themes, and extension points' },
      { icon: '📱', title: t.responsive, description: 'Mobile-first design, works great on all device sizes' },
      { icon: '🔧', title: t.typeSafe, description: 'Full TypeScript support with comprehensive type definitions' },
      { icon: '♿', title: t.accessible, description: 'ARIA attributes, keyboard navigation, screen reader support' },
      { icon: '📦', title: t.lightweight, description: 'Small bundle size, minimal overhead, tree-shakeable' },
      { icon: '🔄', title: t.formIntegration, description: 'Reactive Forms, Signal Forms (Angular 21+), ControlValueAccessor' },
      { icon: '🎯', title: t.extensionPoints, description: 'Comprehensive hooks for customization, validation, and events' },
      { icon: '⌨️', title: t.keyboardShortcuts, description: 'Enhanced navigation with custom shortcuts (Y, N, W, T keys)' },
      { icon: '🌐', title: t.ssrReady, description: 'Fully compatible with Angular Universal, platform-safe' },
      { icon: '⚙️', title: t.zonelessSupport, description: 'Works with or without Zone.js, OnPush change detection' },
      { icon: '📤', title: t.exportImport, description: 'Export and import dates in JSON, CSV, and ICS formats' },
      { icon: '🎬', title: t.animationCustomization, description: 'Configure animations with custom transitions and easing functions' },
      { icon: '🎨', title: t.advancedStyling, description: 'CSS-in-JS support and theme builder for advanced customization' },
      { icon: '📋', title: t.datePresets, description: 'Create and save user-defined date presets with local storage persistence' },
    ];
  });

  public inputProperties = [
    { property: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", description: 'Selection mode' },
    { property: 'value', type: 'DatepickerValue', default: 'null', description: 'Programmatic value setting' },
    { property: 'placeholder', type: 'string', default: "'Select Date'", description: 'Input placeholder text' },
    { property: 'inputId', type: 'string', default: "''", description: 'Custom ID for the input element' },
    { property: 'name', type: 'string', default: "''", description: 'Name attribute for the input element' },
    { property: 'autocomplete', type: 'string', default: "'off'", description: 'Autocomplete attribute for the input element' },
    { property: 'aria-invalid', type: 'boolean', default: 'false', description: 'Sets aria-invalid attribute on the input' },
    { property: 'minDate', type: 'DateInput | null', default: 'null', description: 'Minimum selectable date' },
    { property: 'maxDate', type: 'DateInput | null', default: 'null', description: 'Maximum selectable date' },
    { property: 'showTime', type: 'boolean', default: 'false', description: 'Show time selection' },
    { property: 'timeOnly', type: 'boolean', default: 'false', description: 'Display time picker only (no calendar)' },
    { property: 'displayFormat', type: 'string', default: 'undefined', description: 'Custom date format string (e.g., "MM/DD/YYYY hh:mm A"). Works with date adapters or built-in simple formatter.' },
    { property: 'allowTyping', type: 'boolean', default: 'false', description: 'Enable typing directly into the input field. When enabled, users can type dates with automatic formatting and validation.' },
    { property: 'rtl', type: 'boolean | null', default: 'null', description: 'Right-to-left layout support (auto-detects from document.dir or locale)' },
    { property: 'locale', type: 'string', default: "'en-US'", description: 'Locale for date formatting and translations (e.g., "en-US", "es-ES", "fr-FR")' },
    { property: 'translations', type: 'PartialDatepickerTranslations', default: 'undefined', description: 'Custom translations object to override default translations' },
    { property: 'translationService', type: 'TranslationService', default: 'undefined', description: 'Custom translation service for integration with Angular i18n or other translation libraries' },
    { property: 'timezone', type: 'string', default: 'undefined', description: 'IANA timezone name for date formatting (e.g., "America/New_York", "UTC")' },
    { property: 'inline', type: "boolean | 'always' | 'auto'", default: 'false', description: 'Inline calendar display' },
    { property: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Theme variant' },
    { property: 'calendarViewMode', type: "'month' | 'year' | 'decade' | 'timeline' | 'time-slider'", default: "'month'", description: 'Calendar view mode (year picker, decade picker, timeline, or time slider)' },
  ];

  public outputProperties = [
    { event: 'valueChange', type: 'EventEmitter<DatepickerValue>', description: 'Emitted when value changes' },
    { event: 'action', type: 'EventEmitter<{ type: string; payload?: any }>', description: 'Emitted on user actions' },
  ];

  public programmaticActions = computed(() => {
    const t = this.t();
    return [
      { label: t.setSingleDate, action: () => this.setSingleDateFromApi() },
      { label: t.setDateRange, action: () => this.setRangeFromApi() },
      { label: t.setMultipleDates, action: () => this.setMultipleDatesFromApi() },
      { label: t.clearProgrammatic, action: () => this.clearProgrammaticValue() },
    ];
  });

  public minDate: Date = getStartOfDay(this.today);
  public maxDate: Date = getEndOfDay(addMonths(this.today, 1));
  public lastAction: { type: string; payload?: unknown } | null = null;

  public holidayProvider: HolidayProvider = new SampleHolidayProvider();
  public disableHolidays: boolean = true;

  public hasMinDate: boolean = true;
  public minDateInput: string = this.today.toISOString().split('T')[0];

  public hasDisabledDates: boolean = false;
  public disabledDatesArray: string[] = ['10/21/2025', '08/21/2025', '10/15/2025', '10/8/2025', '10/3/2025'];

  public yearPickerView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'year';
  public decadePickerView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'decade';
  public timelineView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'timeline';
  public timeSliderView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'time-slider';
  public yearPickerValue: DatepickerValue = null;
  public decadePickerValue: DatepickerValue = null;
  public timelineRange: DatepickerValue = null;
  public timeSliderRange: DatepickerValue = null;

  public programmaticSingleDate: Date | null = null;
  public programmaticRange: { start: Date; end: Date } | null = null;
  public programmaticMultipleDates: Date[] | null = null;
  public lastProgrammaticChange: Date | null = null;

  public multiCalendarVertical: DatepickerValue = null;
  public multiCalendarHorizontal: DatepickerValue = null;
  public multiCalendarAuto: DatepickerValue = null;
  public multiCalendarConfigurable: DatepickerValue = null;
  public calendarCountSlider: number = 2;
  public calendarLayoutSlider: 'horizontal' | 'vertical' | 'auto' = 'auto';

  public signalDate = signal<DatepickerValue>(null);

  /**
   * Mock Signal Form Field (v1.9.30+)
   * Demonstrates a signal that has field properties attached to it.
   */
  public mockSignalField = ((): any => {
    const s = signal<Date | null>(new Date());
    const field: any = s;
    field.value = s;
    field.disabled = signal(false);
    field.required = signal(true);
    field.errors = signal([]);
    field.setValue = (val: Date | null) => s.set(val);
    field.markAsDirty = () => console.log('Field marked as dirty');
    return field;
  })();

  public momentDateValue = signal<DatepickerValue>(null);
  public momentIntegrationTsCode = `import { Component, signal } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-moment-integration',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: \`
    <ngxsmk-datepicker
      mode="single"
      [displayFormat]="'MM/DD/YYYY hh:mm a'"
      [showTime]="true"
      [value]="dateValue()"
      (valueChange)="onDateChange($event)"
      placeholder="Select Date & Time">
    </ngxsmk-datepicker>
    
    <div class="controls">
      <button (click)="setCurrentDate()">Set Current Date</button>
      <button (click)="setFormattedDate()">Set Formatted Date</button>
      <button (click)="clearDate()">Clear</button>
    </div>
    
    <div class="result">
      <p>Date Value: {{ dateValue() | date:'medium' }}</p>
      <p>Formatted: {{ formatDate(dateValue()) }}</p>
    </div>
  \`
})
export class MomentIntegrationComponent {
  dateValue = signal<DatepickerValue>(null);
  
  onDateChange(newDate: Date) {
    console.log('Date changed:', newDate);
    this.dateValue.set(newDate);
  }
  
  setCurrentDate() {
    this.dateValue.set(new Date());
  }
  
  setFormattedDate() {
    this.dateValue.set('11/17/2025 09:30 am');
  }
  
  clearDate() {
    this.dateValue.set(null);
  }
  
  formatDate(date: DatepickerValue): string {
    if (!date || !(date instanceof Date)) return '';
    const d = date as Date;
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'pm' : 'am';
    return \`\${month}/\${day}/\${year} \${hours}:\${minutes} \${ampm}\`;
  }
}`;

  public momentIntegrationHtmlCode = `<ngxsmk-datepicker
  mode="single"
  [displayFormat]="'MM/DD/YYYY hh:mm a'"
  [showTime]="true"
  [value]="dateValue()"
  (valueChange)="onDateChange($event)"
  placeholder="Select Date & Time">
</ngxsmk-datepicker>

<!-- Control buttons -->
<button (click)="setCurrentDate()">Set Current Date</button>
<button (click)="setFormattedDate()">Set Formatted Date</button>
<button (click)="clearDate()">Clear</button>

<!-- Display values -->
<p>Date Value: {{ dateValue() | date:'medium' }}</p>
<p>Formatted: {{ formatDate(dateValue()) }}</p>`;

  public weekStartDemo: number = 1;
  public yearRangeDemo: number = 20;
  public clearLabelDemo: string = 'Clear';
  public closeLabelDemo: string = 'Close';
  public prevLabelDemo: string = 'Previous month';
  public nextLabelDemo: string = 'Next month';
  public datepickerClasses: { [key: string]: string } = {
    inputGroup: 'rounded-lg border border-purple-300 dark:border-purple-700',
    input: 'px-3 py-2 text-sm',
    popover: 'shadow-2xl',
    container: 'bg-white dark:bg-neutral-900',
    calendar: 'p-2',
    header: 'mb-2',
    navPrev: 'hover:bg-purple-50 dark:hover:bg-neutral-800 rounded-md',
    navNext: 'hover:bg-purple-50 dark:hover:bg-neutral-800 rounded-md',
    dayCell: 'hover:bg-purple-50 dark:hover:bg-neutral-800 rounded-md',
    footer: 'flex justify-end gap-2',
    clearBtn: 'btn btn-ghost',
    closeBtn: 'btn btn-primary'
  };

  public weekendBlockerPlugin: DatepickerHooks = {
    validateDate: (date: Date) => {
      const day = date.getDay();
      return day !== 0 && day !== 6; // Block weekends
    },
    getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return ['weekend-disabled'];
      }
      return [];
    },
    getValidationError: (date: Date) => {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return 'Weekends are not selectable';
      }
      return null;
    }
  };

  public businessDaysPlugin: DatepickerHooks = {
    validateDate: (date: Date) => {
      const day = date.getDay();
      return day >= 1 && day <= 5; // Monday to Friday
    },
    validateRange: (startDate: Date, endDate: Date) => {
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 3 && diffDays <= 30; // 3-30 days range
    },
    getValidationError: (date: Date) => {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return 'Only business days (Mon-Fri) are allowed';
      }
      return null;
    },
    getDayCellClasses: (date) => {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return ['non-business-day'];
      }
      return [];
    }
  };

  public formattingPlugin: DatepickerHooks = {
    formatDisplayValue: (value: DatepickerValue) => {
      if (value instanceof Date) {
        return value.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return '';
    },
    getDayCellTooltip: (date: Date) => {
      return `Select ${date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })}`;
    }
  };

  public eventTrackingPlugin: DatepickerHooks = {
    beforeDateSelect: (date: Date) => {
      console.log('🔍 About to select date:', date.toLocaleDateString());
      return true; // Allow selection
    },
    afterDateSelect: (date: Date, newValue: DatepickerValue) => {
      console.log('✅ Date selected:', date.toLocaleDateString());
      console.log('📊 New value:', newValue);
    },
    onCalendarOpen: () => {
      console.log('📅 Calendar opened');
    },
    onCalendarClose: () => {
      console.log('🔒 Calendar closed');
    }
  };

  public weekendBlockerPluginCode = `import { DatepickerHooks } from 'ngxsmk-datepicker';

const weekendBlockerPlugin: DatepickerHooks = {
  validateDate: (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Block weekends
  },
  getDayCellClasses: (date, isSelected, isDisabled, isToday, isHoliday) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return ['weekend-disabled'];
    }
    return [];
  },
  getValidationError: (date: Date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return 'Weekends are not selectable';
    }
    return null;
  }
};

<ngxsmk-datepicker
  [hooks]="weekendBlockerPlugin"
  mode="single">
</ngxsmk-datepicker>`;

  public businessDaysPluginCode = `import { DatepickerHooks } from 'ngxsmk-datepicker';

const businessDaysPlugin: DatepickerHooks = {
  validateDate: (date: Date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  },
  validateRange: (startDate: Date, endDate: Date) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 3 && diffDays <= 30; // 3-30 days range
  },
  getValidationError: (date: Date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return 'Only business days (Mon-Fri) are allowed';
    }
    return null;
  },
  getDayCellClasses: (date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return ['non-business-day'];
    }
    return [];
  }
};

<ngxsmk-datepicker
  [hooks]="businessDaysPlugin"
  mode="range">
</ngxsmk-datepicker>`;

  public formattingPluginCode = `import { DatepickerHooks, DatepickerValue } from 'ngxsmk-datepicker';

const formattingPlugin: DatepickerHooks = {
  formatDisplayValue: (value: DatepickerValue) => {
    if (value instanceof Date) {
      return value.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return '';
  },
  getDayCellTooltip: (date: Date) => {
    return \`Select \${date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}\`;
  }
};

<ngxsmk-datepicker
  [hooks]="formattingPlugin"
  mode="single">
</ngxsmk-datepicker>`;

  public eventTrackingPluginCode = `import { DatepickerHooks, DatepickerValue } from 'ngxsmk-datepicker';

const eventTrackingPlugin: DatepickerHooks = {
  beforeDateSelect: (date: Date) => {
    console.log('About to select date:', date.toLocaleDateString());
    return true; // Allow selection
  },
  afterDateSelect: (date: Date, newValue: DatepickerValue) => {
    console.log('Date selected:', date.toLocaleDateString());
    console.log('New value:', newValue);
    },
    onCalendarOpen: () => {
      console.log('Calendar opened');
    },
    onCalendarClose: () => {
      console.log('Calendar closed');
    }
};

<ngxsmk-datepicker
  [hooks]="eventTrackingPlugin"
  mode="single">
</ngxsmk-datepicker>`;

  public datepickerForm = new FormGroup({
    singleDate: new FormControl<DatepickerValue>(getStartOfDay(addMonths(this.today, 1))),
    singleDate2: new FormControl<DatepickerValue>(getStartOfDay(addMonths(this.today, 1))),
    inlineRange: new FormControl({
      value: { start: getStartOfDay(this.today), end: getEndOfDay(this.today) },
      disabled: true
    }),
    rangeWithTime: new FormControl(),
    rangePreviousMonth: new FormControl<{ start: Date | null; end: Date | null }>({ start: null, end: null }),
    timeOnly: new FormControl<DatepickerValue>(null),
    allowTypingDate: new FormControl<DatepickerValue>(null),
    allowTypingDateTime: new FormControl<DatepickerValue>(null),
    allowTypingAuto: new FormControl<DatepickerValue>(null),
    allowTypingISO: new FormControl<DatepickerValue>(null),
    rangeWithTyping: new FormControl<{ start: Date | null; end: Date | null }>({ start: null, end: null }),
    customFormat: new FormControl<DatepickerValue>(null),
    rtlDate: new FormControl<DatepickerValue>(null),
    multipleDates: new FormControl<Date[] | null>(null),
    minDateDemo: new FormControl(),
    disabledDatesDemo: new FormControl(),
    pluginWeekend: new FormControl<DatepickerValue>(null),
    pluginBusinessDays: new FormControl<{ start: Date | null; end: Date | null }>({ start: null, end: null }),
    pluginFormatting: new FormControl<DatepickerValue>(null),
    pluginEvents: new FormControl<DatepickerValue>(null),
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

  public materialFormCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxsmkDatepickerComponent
  ],
  template: \`
    <form [formGroup]="myForm">
      <mat-form-field appearance="outline">
        <mat-label>Select Date</mat-label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="date"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </mat-form-field>
    </form>
  \`
})
export class MaterialFormComponent {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null)
  });
}`;

  public ionicFormCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

// Add to your global.scss:
// @import 'ngxsmk-datepicker/styles/ionic-integration.css';

@Component({
  selector: 'app-ionic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    NgxsmkDatepickerComponent
  ],
  template: \`
    <form [formGroup]="myForm">
      <ion-item>
        <ion-label position="stacked">Appointment Date</ion-label>
        <ngxsmk-datepicker
          mode="single"
          [inline]="true"
          [disableFocusTrap]="true"
          formControlName="appointmentDate"
          placeholder="Select date">
        </ngxsmk-datepicker>
      </ion-item>
    </form>
  \`
})
export class IonicFormComponent {
  myForm = new FormGroup({
    appointmentDate: new FormControl<Date | null>(null)
  });
}`;

  public plainHtmlCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-plain-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgxsmkDatepickerComponent],
  template: \`
    <form [formGroup]="myForm">
      <label for="birthdate">Birth Date</label>
      <ngxsmk-datepicker
        id="birthdate"
        mode="single"
        formControlName="birthdate"
        placeholder="MM/DD/YYYY">
      </ngxsmk-datepicker>
      
      <button type="submit">Submit</button>
    </form>
  \`
})
export class PlainFormComponent {
  myForm = new FormGroup({
    birthdate: new FormControl<Date | null>(null)
  });
}`;

  public materialRangeCode = `<mat-form-field appearance="fill">
  <mat-label>Date Range</mat-label>
  <ngxsmk-datepicker
    mode="range"
    [showTime]="true"
    formControlName="dateRange">
  </ngxsmk-datepicker>
</mat-form-field>`;

  public ionicRangeCode = `<ion-item>
  <ion-label>Check-in / Check-out</ion-label>
  <ngxsmk-datepicker
    mode="range"
    [inline]="true"
    [disableFocusTrap]="true"
    formControlName="dateRange">
  </ngxsmk-datepicker>
</ion-item>`;

  public plainHtmlValidationCode = `<form [formGroup]="myForm">
  <div class="form-group">
    <label for="event-date">Event Date *</label>
    <ngxsmk-datepicker
      id="event-date"
      mode="single"
      formControlName="eventDate"
      [minDate]="today"
      required>
    </ngxsmk-datepicker>
  </div>
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

  public rangePreviousMonthCode = `public date = { start: null, end: null };

<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="range"
    formControlName="rangePreviousMonth"
    [theme]="currentTheme"
    [locale]="selectedLocale()"
    placeholder="Select date range (try clicking previous month dates)">
  </ngxsmk-datepicker>
</form>`;

  public timeOnlyCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [timeOnly]="true"
    [minuteInterval]="15"
    formControlName="timeOnly">
  </ngxsmk-datepicker>
</form>`;

  public allowTypingCode = `<form [formGroup]="datepickerForm">
  <!-- With custom format and input mask -->
  <ngxsmk-datepicker
    mode="single"
    [allowTyping]="true"
    [displayFormat]="'MM/DD/YYYY'"
    [showCalendarButton]="true"
    placeholder="MM/DD/YYYY"
    formControlName="myDate">
  </ngxsmk-datepicker>

  <!-- With date and time -->
  <ngxsmk-datepicker
    mode="single"
    [allowTyping]="true"
    [displayFormat]="'MM/DD/YYYY hh:mm A'"
    [showTime]="true"
    [showCalendarButton]="true"
    placeholder="MM/DD/YYYY hh:mm AM/PM"
    formControlName="myDateTime">
  </ngxsmk-datepicker>

  <!-- Without custom format (auto-detect common formats) -->
  <ngxsmk-datepicker
    mode="single"
    [allowTyping]="true"
    [showCalendarButton]="true"
    placeholder="Select a date">
  </ngxsmk-datepicker>

  <!-- Range mode with typing -->
  <ngxsmk-datepicker
    mode="range"
    [allowTyping]="true"
    [displayFormat]="'DD/MM/YYYY'"
    [showCalendarButton]="true"
    placeholder="DD/MM/YYYY - DD/MM/YYYY"
    formControlName="dateRange">
  </ngxsmk-datepicker>

  <!-- ISO format example -->
  <ngxsmk-datepicker
    mode="single"
    [allowTyping]="true"
    [displayFormat]="'YYYY-MM-DD'"
    [showCalendarButton]="true"
    placeholder="YYYY-MM-DD"
    formControlName="isoDate">
  </ngxsmk-datepicker>
</form>

`;

  public customFormatCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [displayFormat]="'MM/DD/YYYY hh:mm A'"
    [showTime]="true"
    placeholder="Select Date & Time"
    formControlName="customFormat">
  </ngxsmk-datepicker>
</form>

`;

  public rtlCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [rtl]="true"
    [locale]="'ar-SA'"
    placeholder="اختر تاريخ"
    formControlName="rtlDate">
  </ngxsmk-datepicker>
</form>`;

  public rtlAutoCode = `<ngxsmk-datepicker
  mode="single"
  [locale]="'ar-SA'">
</ngxsmk-datepicker>

`;

  public translationsCode = `import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, PartialDatepickerTranslations } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: \`
    <ngxsmk-datepicker
      [locale]="'es-ES'"
      [translations]="customTranslations">
    </ngxsmk-datepicker>
  \`
})
export class TranslationsComponent {
  customTranslations: PartialDatepickerTranslations = {
    selectDate: 'Seleccionar fecha',
    clear: 'Limpiar',
    close: 'Cerrar',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente'
  };
}`;

  public translationsAutoCode = `<!-- Automatic locale detection (demo app) -->
<ngxsmk-datepicker
  mode="single"
  [locale]="detectedLocale">
</ngxsmk-datepicker>

<!-- Manual locale setting -->
<ngxsmk-datepicker
  mode="single"
  [locale]="'es-ES'">
</ngxsmk-datepicker>

`;

  public translationServiceCode = `import { Component, inject } from '@angular/core';
import { NgxsmkDatepickerComponent, TranslationService } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-i18n',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: \`
    <ngxsmk-datepicker
      [translationService]="myTranslationService">
    </ngxsmk-datepicker>
  \`
})
export class I18nComponent {
  myTranslationService: TranslationService = inject(MyTranslationService);
}`;

  public availableLocales = [
    { code: 'en-US', name: 'English', nativeName: 'English' },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr-FR', name: 'French', nativeName: 'Français' },
    { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
    { code: 'ar-SA', name: 'Arabic (RTL)', nativeName: 'العربية' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko-KR', name: 'Korean', nativeName: '한국어' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
    { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
    { code: 'sv-SE', name: 'Swedish', nativeName: 'Svenska' },
  ];

  public selectedLocale = signal<string>('en-US');
  public detectedLocale = signal<string | null>(null);
  public isLocaleAutoDetected = signal<boolean>(false);
  public languageDropdownOpen = signal<boolean>(false);
  public customTranslations: PartialDatepickerTranslations = {};
  public translationDatepickerValue: DatepickerValue = null;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly demoTranslationsService = inject(DemoTranslationsService);
  private readonly cdr = inject(ChangeDetectorRef);

  public t = computed<DemoTranslations>(() => {
    return this.demoTranslationsService.getTranslations(this.selectedLocale());
  });

  private readonly themeBuilder = inject(ThemeBuilderService);
  private readonly datePresets = inject(DatePresetsService);

  public exportImportValue: DatepickerValue = null;
  public exportJsonResult: string = '';
  public exportCsvResult: string = '';
  public exportIcsResult: string = '';
  public importJsonInput: string = '';
  public importCsvInput: string = '';
  public importIcsInput: string = '';

  public customTheme: DatepickerTheme = {
    colors: {
      primary: '#6d28d9',
      background: '#ffffff',
      text: '#1f2937',
    },
    spacing: {
      md: '12px',
      lg: '16px',
    },
  };
  public themeApplied: boolean = false;

  public presetName: string = '';
  public presetCategory: string = '';
  public presetDescription: string = '';
  public savedPresets: DatePreset[] = [];
  public selectedPresetId: string | null = null;

  public animationConfig: AnimationConfig = {
    enabled: true,
    duration: 150,
    easing: 'ease-in-out',
    property: 'all',
    respectReducedMotion: true,
  };

  constructor() {
    effect(() => {
      this.selectedLocale();
      this.cdr.markForCheck();
    });

    this.loadPresets();
  }

  public globalConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideDatepickerConfig } from 'ngxsmk-datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDatepickerConfig({
      weekStart: 1,
      minuteInterval: 15,
      yearRange: 20,
      holidayProvider: myHolidayProvider,
      locale: 'en-US'
    })
  ]
};`;

  public timezoneCode = `<ngxsmk-datepicker
  mode="single"
  [timezone]="'America/New_York'"
  [showTime]="true"
  placeholder="New York Time">
</ngxsmk-datepicker>

<!-- Global timezone via config provider -->
provideDatepickerConfig({
  timezone: 'America/New_York'
})`;

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

  public signalFormsTsCode = `import { signal } from '@angular/core';
import { DatepickerValue } from 'ngxsmk-datepicker';

export class MyComponent {
  dateSig = signal<DatepickerValue>(null);
}`;

  public signalFormsHtmlCode = `<ngxsmk-datepicker
  mode="single"
  [value]="dateSig()"
  (valueChange)="dateSig.set($event)">
</ngxsmk-datepicker>

<p>Signal value: {{ dateSig() | json }}</p>`;

  public signalFormsFieldTsCode = `import { Component, signal, form, objectSchema } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: \`
    <form>
      <ngxsmk-datepicker
        [field]="myForm.myDate"
        mode="single"
        placeholder="Select a date">
      </ngxsmk-datepicker>
      
      <button [disabled]="!myForm().dirty()">Save Changes</button>
    </form>
  \`
})
export class FormComponent {
  localObject = signal({ myDate: new Date() });
  
  myForm = form(this.localObject, objectSchema({
    myDate: objectSchema<Date>()
  }));
  
}`;

  public signalFormsFieldHtmlCode = `<form>
  <ngxsmk-datepicker
    [field]="myForm.myDate"
    mode="single"
    placeholder="Select a date">
  </ngxsmk-datepicker>
  
  <button [disabled]="!myForm().dirty()">Save Changes</button>
</form>

`;

  public signalFormsFieldExampleCode = `// Example: Using with validation and dirty state tracking
import { Component, signal, form, objectSchema, validators } from '@angular/core';

export class ValidatedFormComponent {
  localObject = signal({ 
    myDate: null as Date | null 
  });
  
  myForm = form(this.localObject, objectSchema({
    myDate: objectSchema<Date | null>({
      validators: [
        validators.required()
      ]
    })
  }));
  
  submitForm() {
    if (!this.myForm().dirty()) {
      console.log('No changes to save');
      return;
    }
  }
}

export class RangeFormComponent {
  localObject = signal({
    startDate: new Date(),
    endDate: new Date()
  });
  
  myForm = form(this.localObject, objectSchema({
    startDate: objectSchema<Date>(),
    endDate: objectSchema<Date>()
  }));
}

<!-- In template -->
<ngxsmk-datepicker
  [field]="myForm.startDate"
  mode="single"
  placeholder="Start date">
</ngxsmk-datepicker>

<ngxsmk-datepicker
  [field]="myForm.endDate"
  mode="single"
  placeholder="End date">
</ngxsmk-datepicker>

<!-- Or use a single range picker -->
<ngxsmk-datepicker
  [field]="myForm.dateRange"
  mode="range">
</ngxsmk-datepicker>

<button [disabled]="!myForm().dirty()">Save</button>`;

  public angular21FeaturesCode = `import { Component, signal, form, objectSchema } from '@angular/core';

@Component({
  selector: 'app-date-form',
  standalone: true,
  template: \`
    <form>
      <ngxsmk-datepicker
        [field]="myForm.date"
        mode="single">
      </ngxsmk-datepicker>
    </form>
  \`
})
export class DateFormComponent {
  localObject = signal({ date: new Date() });
  myForm = form(this.localObject, objectSchema({
    date: objectSchema<Date>()
  }));
}`;

  public calendarViewsCode = `
<!-- Year Picker -->
<ngxsmk-datepicker
  mode="single"
  calendarViewMode="year"
  placeholder="Select birth year">
</ngxsmk-datepicker>

<!-- Decade Picker -->
<ngxsmk-datepicker
  mode="single"
  calendarViewMode="decade"
  placeholder="Select decade">
</ngxsmk-datepicker>

<!-- Timeline View (Range Mode) -->
<ngxsmk-datepicker
  mode="range"
  calendarViewMode="timeline"
  placeholder="Select date range">
</ngxsmk-datepicker>

<!-- Time Slider View (Range Mode with Time) -->
<ngxsmk-datepicker
  mode="range"
  calendarViewMode="time-slider"
  [showTime]="true"
  placeholder="Select time range">
</ngxsmk-datepicker>
`;

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

  public customizationCode = `<ngxsmk-datepicker
  mode="single"
  [weekStart]="1"
  [yearRange]="20"
  [clearLabel]="'Clear'"
  [closeLabel]="'Close'"
  [prevMonthAriaLabel]="'Previous month'"
  [nextMonthAriaLabel]="'Next month'"
  [classes]="{
    inputGroup: 'rounded-lg border',
    input: 'px-3 py-2 text-sm',
    popover: 'shadow-2xl',
    dayCell: 'hover:bg-indigo-50',
    footer: 'flex justify-end gap-2',
    clearBtn: 'btn btn-ghost',
    closeBtn: 'btn btn-primary'
  }">
</ngxsmk-datepicker>`;

  public themingCssCode = `.custom-datepicker-wrapper {
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
}`;

  public themingCssVarsCode = `<div style="
  --datepicker-primary-color: #ec4899;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #fce7f3;
">
  <ngxsmk-datepicker mode="single"></ngxsmk-datepicker>
</div>`;

  public designSystemCode = `:host {
  --datepicker-primary-color: var(--toki-color-primary, #6d28d9);
  --datepicker-primary-contrast: var(--toki-color-on-primary, #ffffff);
  --datepicker-background: var(--toki-color-surface, #ffffff);
  --datepicker-text-color: var(--toki-color-on-surface, #1f2937);
  --datepicker-border-color: var(--toki-color-outline, #e5e7eb);
  
  --datepicker-spacing-sm: var(--toki-spacing-sm, 8px);
  --datepicker-spacing-md: var(--toki-spacing-md, 12px);
  --datepicker-spacing-lg: var(--toki-spacing-lg, 16px);
  --datepicker-radius-md: var(--toki-radius-md, 8px);
  --datepicker-radius-lg: var(--toki-radius-lg, 12px);
}`;

  public themingClassesCode = `<ngxsmk-datepicker
  mode="single"
  [classes]="{
    inputGroup: 'rounded-lg border',
    input: 'px-3 py-2 text-sm',
    popover: 'shadow-2xl',
    dayCell: 'hover:bg-indigo-50',
    footer: 'flex justify-end gap-2',
    clearBtn: 'btn btn-ghost',
    closeBtn: 'btn btn-primary'
  }">
</ngxsmk-datepicker>`;

  @HostBinding('class.dark-theme') get isDarkMode() {
    return this.currentTheme === 'dark';
  }

  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  toggleTheme(): void {
    this.manualThemeOverride = true;
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }

  private detectSystemTheme(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.darkModeHandler = (e: MediaQueryList | MediaQueryListEvent) => {
      if (!this.manualThemeOverride) {
        this.currentTheme = e.matches ? 'dark' : 'light';
      }
    };

    if (this.darkModeHandler) {
      this.darkModeHandler(this.darkModeMediaQuery);
    }

    if (this.darkModeMediaQuery.addEventListener) {
      this.darkModeMediaQuery.addEventListener('change', this.darkModeHandler);
    } else {
      this.darkModeMediaQuery.addListener(this.darkModeHandler as any);
    }
  }

  private cleanupThemeListener(): void {
    if (this.darkModeMediaQuery && this.darkModeHandler) {
      if (this.darkModeMediaQuery.removeEventListener) {
        this.darkModeMediaQuery.removeEventListener('change', this.darkModeHandler);
      } else {
        this.darkModeMediaQuery.removeListener(this.darkModeHandler as any);
      }
      this.darkModeMediaQuery = null;
      this.darkModeHandler = null;
    }
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
    navigator.clipboard.writeText(code);
  }


  handleDatepickerAction(event: { type: string; payload?: unknown }): void {
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
  }

  onProgrammaticRangeChange(value: DatepickerValue): void {
    if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.programmaticRange = value as { start: Date; end: Date };
    } else {
      this.programmaticRange = null;
    }
  }

  onProgrammaticMultipleChange(value: DatepickerValue): void {
    this.programmaticMultipleDates = Array.isArray(value) ? value : null;
  }

  public mobileSizes = [
    { label: 'iPhone SE', width: 375 },
    { label: 'iPhone 12/13', width: 390 },
    { label: 'iPhone 14 Pro', width: 393 },
    { label: 'iPhone 14 Pro Max', width: 430 },
    { label: 'Samsung Galaxy', width: 360 },
    { label: 'Pixel 5', width: 393 },
    { label: 'iPad Mini', width: 768 },
    { label: 'iPad', width: 820 },
  ];

  selectMobileSize(width: number): void {
    this.selectedMobileSize = width;
  }

  getPreviewWidth(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return this.selectedMobileSize;
    }

    const viewportWidth = window.innerWidth;
    const maxWidth = viewportWidth <= 480
      ? viewportWidth - 24 // 1.5rem padding
      : viewportWidth <= 768
        ? viewportWidth - 32 // 2rem padding
        : this.selectedMobileSize;

    return Math.min(this.selectedMobileSize, maxWidth);
  }

  public mobilePlaygroundCode = `<div class="mobile-preview-container" style="width: 375px;">
  <div class="mobile-preview-frame">
    <div class="mobile-preview-content">
      <ngxsmk-datepicker
        mode="range"
        [inline]="true">
      </ngxsmk-datepicker>
    </div>
  </div>
</div>`;

  private timeInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    this.detectAndSetLocale();
    this.fetchNpmDownloads();
  }

  /**
   * Fetches npm download count for the package
   */
  private async fetchNpmDownloads(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.npmDownloadsLoading.set(true);
    try {
      const response = await fetch('https://api.npmjs.org/downloads/point/last-month/ngxsmk-datepicker');
      if (response.ok) {
        const data = await response.json();
        if (data.downloads !== undefined) {
          this.npmDownloads.set(data.downloads);
        }
      }
    } catch (error) {
      console.warn('Failed to fetch npm download count:', error);
    } finally {
      this.npmDownloadsLoading.set(false);
    }
  }

  /**
   * Formats download count for display
   */
  public formatDownloads(count: number | null): string {
    if (count === null) return '';

    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }

  /**
   * Detects the user's browser locale and maps it to a supported locale
   */
  private detectAndSetLocale(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.selectedLocale.set('en-US');
      return;
    }

    let browserLocale: string | null = null;

    if (typeof navigator !== 'undefined' && navigator.language) {
      browserLocale = navigator.language;
    }

    if (!browserLocale && typeof Intl !== 'undefined') {
      try {
        browserLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      } catch {
      }
    }

    if (!browserLocale && typeof navigator !== 'undefined' && navigator.languages && navigator.languages.length > 0) {
      browserLocale = navigator.languages[0];
    }

    if (browserLocale) {
      const mappedLocale = this.mapBrowserLocaleToSupported(browserLocale);
      this.detectedLocale.set(browserLocale);
      this.selectedLocale.set(mappedLocale);
      this.isLocaleAutoDetected.set(true);
    } else {
      this.selectedLocale.set('en-US');
      this.isLocaleAutoDetected.set(false);
    }
  }

  /**
   * Maps a browser locale to one of the supported locales
   * Uses fallback logic: exact match -> language code match -> default
   */
  private mapBrowserLocaleToSupported(browserLocale: string): string {
    const normalized = browserLocale.toLowerCase();

    const exactMatch = this.availableLocales.find(locale =>
      locale.code.toLowerCase() === normalized
    );
    if (exactMatch) {
      return exactMatch.code;
    }

    const languageCode = normalized.split('-')[0];
    const languageMatch = this.availableLocales.find(locale => {
      const localeLang = locale.code.toLowerCase().split('-')[0];
      return localeLang === languageCode;
    });
    if (languageMatch) {
      return languageMatch.code;
    }

    const localeMappings: { [key: string]: string } = {
      'en-ca': 'en-US',
      'en-au': 'en-GB',
      'en-nz': 'en-GB',
      'en-ie': 'en-GB',
      'es-mx': 'es-ES',
      'es-ar': 'es-ES',
      'es-co': 'es-ES',
      'es-cl': 'es-ES',
      'fr-ca': 'fr-FR',
      'fr-be': 'fr-FR',
      'fr-ch': 'fr-FR',
      'de-at': 'de-DE',
      'de-ch': 'de-DE',
      'pt-pt': 'pt-BR',
      'zh-hk': 'zh-TW',
      'zh-sg': 'zh-CN',
      'ar-eg': 'ar-SA',
      'ar-ae': 'ar-SA',
      'ar-jo': 'ar-SA',
      'ru-by': 'ru-RU',
      'ru-kz': 'ru-RU',
      'sv-fi': 'sv-SE',
      'ko-kp': 'ko-KR',
      'ja-jp': 'ja-JP',
    };

    const mapped = localeMappings[normalized];
    if (mapped) {
      return mapped;
    }

    return 'en-US';
  }

  ngOnDestroy(): void {
    this.cleanupThemeListener();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  /**
   * Handles locale change from header selector
   */
  onLocaleChange(locale: string): void {
    this.selectedLocale.set(locale);
    this.isLocaleAutoDetected.set(false);
    this.languageDropdownOpen.set(false);
  }

  toggleLanguageDropdown(): void {
    this.languageDropdownOpen.update(open => !open);
  }

  closeLanguageDropdown(): void {
    this.languageDropdownOpen.set(false);
  }

  getSelectedLocaleName(): string {
    const locale = this.availableLocales.find(l => l.code === this.selectedLocale());
    return locale ? locale.nativeName : 'English';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.language-selector-wrapper')) {
      this.languageDropdownOpen.set(false);
    }
  }

  /**
   * Gets a short display name for the locale (e.g., "EN" for "en-US", "ES" for "es-ES")
   */
  getLocaleDisplayName(localeCode: string): string {
    const locale = this.availableLocales.find(l => l.code === localeCode);
    if (locale) {
      const langCode = localeCode.split('-')[0].toUpperCase();
      return langCode;
    }
    return localeCode.split('-')[0].toUpperCase();
  }

  @HostListener('window:resize')
  onResize(): void {
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  isDate(value: any): value is Date {
    return value instanceof Date;
  }

  formatDate(value: Date | null | undefined, format: 'short' | 'medium' | 'shortTime' = 'short'): string {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      return '';
    }

    const date = value as Date;

    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        });
      case 'medium':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
      case 'shortTime':
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
      default:
        return date.toLocaleString('en-US');
    }
  }

  setCurrentDate(): void {
    this.momentDateValue.set(new Date());
  }

  setFormattedDate(): void {
    const date = new Date();
    date.setHours(9, 30); // 9:30 AM
    this.momentDateValue.set(date);
  }

  clearDate(): void {
    this.momentDateValue.set(null);
  }

  onDateChange(newDate: DatepickerValue): void {
    console.log('Date changed:', newDate);
    this.momentDateValue.set(newDate);
  }

  formatMomentDateValue(): string {
    const value = this.momentDateValue();
    if (!value) return 'Not set';
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return JSON.stringify(value);
  }

  exportAsJson(): void {
    if (this.exportImportValue) {
      this.exportJsonResult = exportToJson(this.exportImportValue, { includeTime: true });
    }
  }

  exportAsCsv(): void {
    if (this.exportImportValue) {
      this.exportCsvResult = exportToCsv(this.exportImportValue, { includeTime: true });
    }
  }

  exportAsIcs(): void {
    if (this.exportImportValue) {
      this.exportIcsResult = exportToIcs(this.exportImportValue, {
        includeTime: true,
        summary: 'Date Selection',
        description: 'Exported from ngxsmk-datepicker',
      });
    }
  }

  importFromJsonString(): void {
    try {
      this.exportImportValue = importFromJson(this.importJsonInput);
      this.importJsonInput = '';
    } catch (error) {
      alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  importFromCsvString(): void {
    try {
      this.exportImportValue = importFromCsv(this.importCsvInput);
      this.importCsvInput = '';
    } catch (error) {
      alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  importFromIcsString(): void {
    try {
      this.exportImportValue = importFromIcs(this.importIcsInput);
      this.importIcsInput = '';
    } catch (error) {
      alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  downloadJson(): void {
    if (this.exportJsonResult) {
      const blob = new Blob([this.exportJsonResult], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'datepicker-export.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  downloadCsv(): void {
    if (this.exportCsvResult) {
      const blob = new Blob([this.exportCsvResult], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'datepicker-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  downloadIcs(): void {
    if (this.exportIcsResult) {
      const blob = new Blob([this.exportIcsResult], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'datepicker-export.ics';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  @ViewChild('themeBuilderDatepicker', { static: false, read: ElementRef }) themeBuilderDatepickerEl?: ElementRef<HTMLElement>;
  @ViewChild('animationDatepicker', { static: false, read: ElementRef }) animationDatepickerEl?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.applyCustomTheme();
      this.applyAnimationConfig();
    }, 100);
  }

  applyCustomTheme(): void {
    setTimeout(() => {
      if (this.themeBuilderDatepickerEl?.nativeElement) {
        const datepickerElement = this.themeBuilderDatepickerEl.nativeElement;
        this.themeBuilder.removeTheme(datepickerElement);
        this.themeBuilder.applyTheme(this.customTheme, datepickerElement);
        this.themeApplied = true;
      }
    }, 0);
  }

  removeCustomTheme(): void {
    setTimeout(() => {
      if (this.themeBuilderDatepickerEl?.nativeElement) {
        this.themeBuilder.removeTheme(this.themeBuilderDatepickerEl.nativeElement);
        this.themeApplied = false;
      }
    }, 0);
  }

  onColorChange(): void {
    this.applyCustomTheme();
  }

  generateStyleObject(): Record<string, string> {
    return this.themeBuilder.generateStyleObject(this.customTheme);
  }

  onAnimationConfigChange(): void {
    this.applyAnimationConfig();
  }

  applyAnimationConfig(): void {
    setTimeout(() => {
      if (this.animationDatepickerEl?.nativeElement) {
        const element = this.animationDatepickerEl.nativeElement;
        const prefersReducedMotion = this.animationConfig.respectReducedMotion &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!this.animationConfig.enabled || prefersReducedMotion) {
          element.style.setProperty('--datepicker-transition-duration', '0ms', 'important');
          element.style.setProperty('--datepicker-transition', 'none', 'important');
          return;
        }

        const duration = `${this.animationConfig.duration || 150}ms`;
        const easing = this.animationConfig.easing || 'ease-in-out';
        const property = this.animationConfig.property || 'all';

        element.style.setProperty('--datepicker-transition-duration', duration, 'important');
        element.style.setProperty('--datepicker-transition-easing', easing, 'important');
        element.style.setProperty('--datepicker-transition-property', property, 'important');
        element.style.setProperty(
          '--datepicker-transition',
          `${property} ${duration} ${easing}`,
          'important'
        );
      }
    }, 0);
  }

  onCalendarCountChange(count: number): void {
    this.calendarCountSlider = count;
  }

  savePreset(): void {
    if (!this.presetName || !this.exportImportValue) {
      alert('Please provide a preset name and select a date value');
      return;
    }

    this.datePresets.savePreset({
      name: this.presetName,
      value: this.exportImportValue,
      category: this.presetCategory || undefined,
      description: this.presetDescription || undefined,
    });

    this.presetName = '';
    this.presetCategory = '';
    this.presetDescription = '';
    this.loadPresets();
  }

  loadPresets(): void {
    this.savedPresets = this.datePresets.getAllPresets();
  }

  applyPreset(presetId: string): void {
    const value = this.datePresets.applyPreset(presetId);
    if (value) {
      this.exportImportValue = value;
      this.selectedPresetId = presetId;
    }
  }

  deletePreset(presetId: string): void {
    if (confirm('Are you sure you want to delete this preset?')) {
      this.datePresets.deletePreset(presetId);
      this.loadPresets();
      if (this.selectedPresetId === presetId) {
        this.selectedPresetId = null;
      }
    }
  }

  exportPresets(): void {
    const json = this.datePresets.exportPresets();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datepicker-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importPresets(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = this.datePresets.importPresets(e.target?.result as string, true);
        alert(`Imported ${result.imported} presets. ${result.errors} errors.`);
        this.loadPresets();
      } catch (error) {
        alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  }

  public exportImportCode = `import { exportToJson, exportToCsv, exportToIcs, importFromJson, importFromCsv, importFromIcs } from 'ngxsmk-datepicker';

const json = exportToJson(dateValue, { includeTime: true });
const csv = exportToCsv(dateValue, { includeTime: true });
const ics = exportToIcs(dateValue, { 
  includeTime: true,
  summary: 'Event Title',
  description: 'Event Description'
});

const importedValue = importFromJson(jsonString);
const importedValue = importFromCsv(csvString);
const importedValue = importFromIcs(icsString);`;

  public animationConfigCode = `import { provideDatepickerConfig, AnimationConfig } from 'ngxsmk-datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDatepickerConfig({
      animations: {
        enabled: true,
        duration: 200, // milliseconds
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        property: 'all',
        respectReducedMotion: true, // Respects prefers-reduced-motion
      }
    })
  ]
};`;

  public themeBuilderCode = `import { ThemeBuilderService, DatepickerTheme } from 'ngxsmk-datepicker';

@Component({...})
export class MyComponent {
  private themeBuilder = inject(ThemeBuilderService);

  applyTheme() {
    const theme: DatepickerTheme = {
      colors: {
        primary: '#6d28d9',
        background: '#ffffff',
        text: '#1f2937',
      },
      spacing: {
        md: '12px',
        lg: '16px',
      },
    };

    this.themeBuilder.applyTheme(theme);
    const styles = this.themeBuilder.generateStyleObject(theme);
  }
}`;

  public datePresetsCode = `import { DatePresetsService } from 'ngxsmk-datepicker';

@Component({...})
export class MyComponent {
  private presets = inject(DatePresetsService);

  savePreset() {
    this.presets.savePreset({
      name: 'Next Week',
      value: nextWeekDate,
      category: 'Quick Select',
      description: 'Selects next week'
    });
  }

  loadPreset(id: string) {
    const value = this.presets.applyPreset(id);
  }

  getAllPresets() {
    return this.presets.getAllPresets();
  }
}`;

  public multiCalendarCode = `<!-- Horizontal layout (one by one right) -->
<ngxsmk-datepicker
  mode="range"
  [calendarCount]="2"
  calendarLayout="horizontal"
  [value]="dateRange"
  (valueChange)="dateRange = $event"
  placeholder="Select date range">
</ngxsmk-datepicker>

<!-- Vertical layout (one by one down) -->
<ngxsmk-datepicker
  mode="single"
  [calendarCount]="3"
  calendarLayout="vertical"
  [value]="selectedDate"
  (valueChange)="selectedDate = $event"
  placeholder="Select a date">
</ngxsmk-datepicker>

<!-- Auto layout (responsive - horizontal on desktop, vertical on mobile) -->
<ngxsmk-datepicker
  mode="single"
  [calendarCount]="3"
  calendarLayout="auto"
  [value]="selectedDate"
  (valueChange)="selectedDate = $event"
  placeholder="Select a date">
</ngxsmk-datepicker>

<!-- Configurable calendar count and layout -->
<ngxsmk-datepicker
  mode="single"
  [calendarCount]="calendarCount"
  [calendarLayout]="layout"
  [value]="selectedDate"
  (valueChange)="selectedDate = $event"
  placeholder="Select a date">
</ngxsmk-datepicker>`;

  public multiCalendarTsCode = `import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, DatepickerValue } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-multi-calendar',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: \`
    <!-- Horizontal layout: calendars side-by-side (one by one right) -->
    <ngxsmk-datepicker
      mode="range"
      [calendarCount]="2"
      calendarLayout="horizontal"
      [value]="dateRange"
      (valueChange)="dateRange = $event"
      placeholder="Select date range">
    </ngxsmk-datepicker>

    <!-- Vertical layout: calendars stacked (one by one down) -->
    <ngxsmk-datepicker
      mode="single"
      [calendarCount]="3"
      calendarLayout="vertical"
      [value]="selectedDate"
      (valueChange)="selectedDate = $event"
      placeholder="Select a date">
    </ngxsmk-datepicker>

    <!-- Auto layout: responsive (horizontal on desktop, vertical on mobile) -->
    <ngxsmk-datepicker
      mode="single"
      [calendarCount]="3"
      calendarLayout="auto"
      [value]="selectedDate"
      (valueChange)="selectedDate = $event"
      placeholder="Select a date">
    </ngxsmk-datepicker>

    <!-- Dynamic calendar count and layout -->
    <div>
      <label>
        Calendar Count:
        <input type="range" min="1" max="12" [(ngModel)]="calendarCount">
        <span>{{ calendarCount }}</span>
      </label>
      <label>
        Layout:
        <select [(ngModel)]="layout">
          <option value="auto">Auto (Responsive)</option>
          <option value="horizontal">Horizontal (Right)</option>
          <option value="vertical">Vertical (Down)</option>
        </select>
      </label>
      <ngxsmk-datepicker
        mode="single"
        [calendarCount]="calendarCount"
        [calendarLayout]="layout"
        [value]="selectedDate"
        (valueChange)="selectedDate = $event">
      </ngxsmk-datepicker>
    </div>
  \`
})
export class MultiCalendarComponent {
  dateRange: { start: Date; end: Date } | null = null;
  selectedDate: Date | null = null;
  calendarCount: number = 2;
  layout: 'horizontal' | 'vertical' | 'auto' = 'auto';
}`;
}
