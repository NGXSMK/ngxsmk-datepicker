import { TestBed } from '@angular/core/testing';
import { LocaleRegistryService, LocaleData } from './locale-registry.service';

describe('LocaleRegistryService', () => {
  let service: LocaleRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocaleRegistryService]
    });
    
    service = TestBed.inject(LocaleRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register locale data', () => {
      const localeData: LocaleData = {
        calendar: 'gregorian',
        firstDayOfWeek: 1,
        dateFormat: 'DD/MM/YYYY',
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        weekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        weekdayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        isRtl: false
      };

      service.register('test-locale', localeData);
      const retrieved = service.getLocaleData('test-locale');
      
      expect(retrieved).toEqual(localeData);
    });

    it('should normalize locale to lowercase', () => {
      const localeData: LocaleData = {
        calendar: 'gregorian',
        firstDayOfWeek: 0,
        dateFormat: 'MM/DD/YYYY',
        monthNames: ['January'],
        monthNamesShort: ['Jan'],
        weekdayNames: ['Sunday'],
        weekdayNamesShort: ['Sun'],
        isRtl: false
      };

      service.register('TEST-LOCALE', localeData);
      const retrieved = service.getLocaleData('test-locale');
      
      expect(retrieved).toBeTruthy();
    });
  });

  describe('getLocaleData', () => {
    it('should return exact match locale', () => {
      const localeData = service.getLocaleData('en-US');
      expect(localeData).toBeTruthy();
      expect(localeData.calendar).toBe('gregorian');
    });

    it('should fallback to language code if exact match not found', () => {
      const localeData = service.getLocaleData('en-XX');
      expect(localeData).toBeTruthy();
      expect(localeData.calendar).toBe('gregorian');
    });

    it('should use fallback locale if specified', () => {
      const localeData = service.getLocaleData('en-GB');
      expect(localeData).toBeTruthy();
      expect(localeData.fallbackLocale).toBe('en-US');
    });

    it('should return default locale for unknown locale', () => {
      const localeData = service.getLocaleData('unknown-locale');
      expect(localeData).toBeTruthy();
      expect(localeData.calendar).toBe('gregorian');
    });

    it('should handle case-insensitive locale lookup', () => {
      const localeData1 = service.getLocaleData('EN-US');
      const localeData2 = service.getLocaleData('en-us');
      expect(localeData1).toEqual(localeData2);
    });
  });

  describe('getFallbackLocale', () => {
    it('should return explicit fallback locale', () => {
      const fallback = service.getFallbackLocale('en-GB');
      expect(fallback).toBe('en-US');
    });

    it('should return language code fallback', () => {
      const fallback = service.getFallbackLocale('en');
      // May return 'en' (language code) or 'en-US' (full locale) depending on implementation
      expect(fallback).toBeTruthy();
      if (fallback) {
        expect(['en', 'en-US']).toContain(fallback);
      }
    });

    it('should return default locale for unknown locale', () => {
      const fallback = service.getFallbackLocale('unknown');
      expect(fallback).toBe('en-US');
    });

    it('should handle locale with region', () => {
      const fallback = service.getFallbackLocale('fr-CA');
      // May return 'fr' (language code) or 'fr-FR' (full locale) depending on implementation
      expect(fallback).toBeTruthy();
      if (fallback) {
        expect(['fr', 'fr-FR']).toContain(fallback);
      }
    });
  });

  describe('isRtlLocale', () => {
    it('should return true for RTL locales', () => {
      expect(service.isRtlLocale('ar-SA')).toBe(true);
      expect(service.isRtlLocale('he-IL')).toBe(true);
      expect(service.isRtlLocale('fa-IR')).toBe(true);
      expect(service.isRtlLocale('ur-PK')).toBe(true);
    });

    it('should return false for LTR locales', () => {
      expect(service.isRtlLocale('en-US')).toBe(false);
      expect(service.isRtlLocale('fr-FR')).toBe(false);
      expect(service.isRtlLocale('de-DE')).toBe(false);
    });
  });

  describe('getCalendarSystem', () => {
    it('should return gregorian for most locales', () => {
      expect(service.getCalendarSystem('en-US')).toBe('gregorian');
      expect(service.getCalendarSystem('fr-FR')).toBe('gregorian');
    });

    it('should return islamic for Arabic', () => {
      expect(service.getCalendarSystem('ar-SA')).toBe('islamic');
    });

    it('should return hebrew for Hebrew', () => {
      expect(service.getCalendarSystem('he-IL')).toBe('hebrew');
    });

    it('should return persian for Persian', () => {
      expect(service.getCalendarSystem('fa-IR')).toBe('persian');
    });

    it('should return japanese for Japanese', () => {
      expect(service.getCalendarSystem('ja-JP')).toBe('japanese');
    });
  });

  describe('default locales', () => {
    it('should have en-US as default', () => {
      const localeData = service.getLocaleData('en-US');
      expect(localeData.firstDayOfWeek).toBe(0);
      expect(localeData.dateFormat).toBe('MM/DD/YYYY');
    });

    it('should have en-GB with Monday as first day', () => {
      const localeData = service.getLocaleData('en-GB');
      expect(localeData.firstDayOfWeek).toBe(1);
      expect(localeData.dateFormat).toBe('DD/MM/YYYY');
    });

    it('should have correct month names for en-US', () => {
      const localeData = service.getLocaleData('en-US');
      expect(localeData.monthNames.length).toBe(12);
      expect(localeData.monthNames[0]).toBe('January');
      expect(localeData.monthNames[11]).toBe('December');
    });

    it('should have correct weekday names', () => {
      const localeData = service.getLocaleData('en-US');
      expect(localeData.weekdayNames.length).toBe(7);
      expect(localeData.weekdayNames[0]).toBe('Sunday');
      expect(localeData.weekdayNames[6]).toBe('Saturday');
    });
  });

  describe('edge cases', () => {
    it('should handle empty locale string', () => {
      const localeData = service.getLocaleData('');
      expect(localeData).toBeTruthy();
    });

    it('should handle locale with only language code', () => {
      const localeData = service.getLocaleData('en');
      expect(localeData).toBeTruthy();
    });

    it('should handle locale with multiple dashes', () => {
      const localeData = service.getLocaleData('en-US-POSIX');
      expect(localeData).toBeTruthy();
    });
  });
});

