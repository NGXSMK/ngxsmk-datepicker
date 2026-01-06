import { TestBed } from '@angular/core/testing';
import { TranslationRegistryService } from './translation-registry.service';
import { DatepickerTranslations } from '../interfaces/datepicker-translations.interface';

// Helper to create minimal translation object
function createMinimalTranslations(overrides: Partial<DatepickerTranslations> = {}): DatepickerTranslations {
  const defaults: DatepickerTranslations = {
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    clear: 'Clear',
    close: 'Close',
    today: 'Today',
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
    calendarReady: 'Calendar ready'
  };
  return { ...defaults, ...overrides };
}

describe('TranslationRegistryService', () => {
  let service: TranslationRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationRegistryService]
    });
    
    service = TestBed.inject(TranslationRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register translations for a locale', () => {
      const translations = createMinimalTranslations({
        selectDate: 'Test Select Date'
      });

      service.register('test-locale', translations);
      const retrieved = service.getTranslations('test-locale');
      
      expect(retrieved.selectDate).toBe('Test Select Date');
    });

    it('should normalize locale to lowercase', () => {
      const translations = createMinimalTranslations({
        selectDate: 'Test'
      });

      service.register('TEST-LOCALE', translations);
      const retrieved = service.getTranslations('test-locale');
      
      expect(retrieved.selectDate).toBe('Test');
    });
  });

  describe('getTranslations', () => {
    it('should return exact match translations', () => {
      const translations = service.getTranslations('en');
      expect(translations).toBeTruthy();
      expect(translations.selectDate).toBeTruthy();
    });

    it('should return English translations for unknown locale', () => {
      const translations = service.getTranslations('unknown-locale');
      expect(translations).toBeTruthy();
      expect(translations.selectDate).toBeTruthy();
    });

    it('should fallback to language code', () => {
      const translations = service.getTranslations('en-XX');
      expect(translations).toBeTruthy();
    });

    it('should handle Chinese Traditional locales', () => {
      const translations = service.getTranslations('zh-TW');
      expect(translations).toBeTruthy();
    });

    it('should handle Chinese Simplified locales', () => {
      const translations = service.getTranslations('zh-CN');
      expect(translations).toBeTruthy();
    });

    it('should handle empty locale string', () => {
      const translations = service.getTranslations('');
      expect(translations).toBeTruthy();
      expect(translations.selectDate).toBeTruthy();
    });

    it('should handle case-insensitive lookup', () => {
      const translations1 = service.getTranslations('EN');
      const translations2 = service.getTranslations('en');
      expect(translations1).toEqual(translations2);
    });
  });

  describe('default translations', () => {
    it('should have English translations registered', () => {
      const translations = service.getTranslations('en');
      expect(translations.selectDate).toBeTruthy();
      expect(translations.today).toBeTruthy();
    });

    it('should have Spanish translations registered', () => {
      const translations = service.getTranslations('es');
      expect(translations.selectDate).toBeTruthy();
      expect(translations.selectDate).toBe('Seleccionar fecha');
    });

    it('should have French translations registered', () => {
      const translations = service.getTranslations('fr');
      expect(translations.selectDate).toBeTruthy();
    });

    it('should have German translations registered', () => {
      const translations = service.getTranslations('de');
      expect(translations.selectDate).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle locale with multiple dashes', () => {
      const translations = service.getTranslations('en-US-POSIX');
      expect(translations).toBeTruthy();
    });

    it('should handle locale with only language code', () => {
      const translations = service.getTranslations('en');
      expect(translations).toBeTruthy();
    });

    it('should return English for null locale', () => {
      const translations = service.getTranslations(null as any);
      expect(translations).toBeTruthy();
    });
  });
});

