import { TestBed } from '@angular/core/testing';
import { DefaultTranslationService } from './translation.service';
import { TranslationRegistryService } from './translation-registry.service';
import { DatepickerTranslations } from '../interfaces/datepicker-translations.interface';

// Helper to create minimal translation object
function createMinimalTranslations(
  overrides: Partial<DatepickerTranslations> = {},
): DatepickerTranslations {
  const defaults: DatepickerTranslations = {
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    clear: 'Clear',
    close: 'Close',
    today: 'Today',
    selectEndDate: 'Select End Date',
    day: 'Day',
    days: 'Days',
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    previousYear: 'Previous Year',
    nextYear: 'Next Year',
    previousYears: 'Previous Years',
    nextYears: 'Next Years',
    previousDecade: 'Previous Decade',
    nextDecade: 'Next Decade',
    clearSelection: 'Clear Selection',
    closeCalendar: 'Close Calendar',
    closeCalendarOverlay: 'Close Calendar Overlay',
    calendarFor: 'Calendar for {{month}} {{year}}',
    selectYear: 'Select year {{year}}',
    selectDecade: 'Select decade {{start}} - {{end}}',
    datesSelected: '{{count}} dates selected',
    timesSelected: '{{count}} times selected',
    time: 'Time',
    startTime: 'Start Time',
    endTime: 'End Time',
    holiday: 'Holiday',
    month: 'Month',
    year: 'Year',
    decade: 'Decade',
    timeline: 'Timeline',
    timeSlider: 'Time Slider',
    calendarOpened: 'Calendar opened for {{month}} {{year}}',
    calendarClosed: 'Calendar closed',
    dateSelected: 'Date selected: {{date}}',
    rangeSelected: 'Range selected: {{start}} to {{end}}',
    monthChanged: 'Changed to {{month}} {{year}}',
    yearChanged: 'Changed to year {{year}}',
    calendarLoading: 'Loading calendar...',
    calendarReady: 'Calendar ready',
    keyboardShortcuts: 'Keyboard shortcuts',
    from: 'From',
    to: 'To',
    invalidDateFormat: 'Please enter a valid date.',
    dateBeforeMin: 'Date must be on or after {{minDate}}.',
    dateAfterMax: 'Date must be on or before {{maxDate}}.',
    invalidDate: 'Invalid date.',
  };
  return { ...defaults, ...overrides };
}

describe('DefaultTranslationService', () => {
  let service: DefaultTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaultTranslationService, TranslationRegistryService],
    });

    service = TestBed.inject(DefaultTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    it('should initialize with provided translations', () => {
      const translations = createMinimalTranslations({
        selectDate: 'Test Select Date',
      });

      service.initialize(translations, 'test-locale');

      expect(service.getCurrentLocale()).toBe('test-locale');
      expect(service.translate('selectDate')).toBe('Test Select Date');
    });

    it('should use default locale if not provided', () => {
      const translations = createMinimalTranslations();

      service.initialize(translations);

      expect(service.getCurrentLocale()).toBe('en');
    });
  });

  describe('initializeFromLocale', () => {
    it('should initialize from locale', () => {
      service.initializeFromLocale('es');

      expect(service.getCurrentLocale()).toBe('es');
      expect(service.translate('selectDate')).toBeTruthy();
    });

    it('should load translations from registry', () => {
      service.initializeFromLocale('en');

      const translation = service.translate('selectDate');
      expect(translation).toBeTruthy();
      expect(translation).not.toBe('selectDate'); // Should be translated
    });
  });

  describe('translate', () => {
    it('should translate simple key', () => {
      const translations = createMinimalTranslations({
        selectDate: 'Select Date',
      });

      service.initialize(translations);

      expect(service.translate('selectDate')).toBe('Select Date');
    });

    it('should return key if translation not found', () => {
      const translations = createMinimalTranslations();
      service.initialize(translations);

      expect(service.translate('nonExistentKey')).toBe('nonExistentKey');
    });

    it('should replace parameters in translation', () => {
      const translations = createMinimalTranslations({
        calendarFor: 'Calendar for {{month}} {{year}}',
      });

      service.initialize(translations);

      const result = service.translate('calendarFor', {
        month: 'January',
        year: '2024',
      });
      expect(result).toBe('Calendar for January 2024');
    });

    it('should handle multiple parameter replacements', () => {
      const translations = createMinimalTranslations({
        selectDecade: 'Select decade {{start}} - {{end}}',
      });

      service.initialize(translations);

      const result = service.translate('selectDecade', {
        start: '2020',
        end: '2029',
      });
      expect(result).toBe('Select decade 2020 - 2029');
    });

    it('should handle function translations', () => {
      const translations = createMinimalTranslations({
        datesSelected: ((params?: Record<string, string | number>) => {
          const count = params?.['count'] || 0;
          return `${count} dates selected`;
        }) as unknown as string,
      });

      service.initialize(translations);

      const result = service.translate('datesSelected', { count: 5 });
      expect(result).toBe('5 dates selected');
    });

    it('should handle function translations without params', () => {
      const translations = createMinimalTranslations({
        today: (() => 'Today') as unknown as string,
      });

      service.initialize(translations);

      const result = service.translate('today');
      expect(result).toBe('Today');
    });

    it('should handle numeric parameters', () => {
      const translations = createMinimalTranslations({
        datesSelected: '{{count}} dates selected',
      });

      service.initialize(translations);

      const result = service.translate('datesSelected', { count: 10 });
      expect(result).toBe('10 dates selected');
    });
  });

  describe('getCurrentLocale', () => {
    it('should return current locale', () => {
      const translations = createMinimalTranslations();
      service.initialize(translations, 'fr');
      expect(service.getCurrentLocale()).toBe('fr');
    });

    it('should return default locale if not initialized', () => {
      expect(service.getCurrentLocale()).toBe('en');
    });
  });

  describe('edge cases', () => {
    it('should handle translation with no parameters needed', () => {
      const translations = createMinimalTranslations({
        selectDate: 'Select Date',
      });

      service.initialize(translations);

      const result = service.translate('selectDate', {});
      expect(result).toBe('Select Date');
    });

    it('should handle missing parameters in translation', () => {
      const translations = createMinimalTranslations({
        calendarFor: 'Calendar for {{month}} {{year}}',
      });

      service.initialize(translations);

      const result = service.translate('calendarFor', { month: 'January' });
      expect(result).toBe('Calendar for January {{year}}');
    });
  });
});
