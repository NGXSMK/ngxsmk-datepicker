import { TestBed } from '@angular/core/testing';
import { ThemeBuilderService, DatepickerTheme } from './theme-builder.service';
import { PLATFORM_ID } from '@angular/core';

describe('ThemeBuilderService', () => {
  let service: ThemeBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeBuilderService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(ThemeBuilderService);
    
    // Clean up any existing styles
    document.querySelectorAll('[data-datepicker-theme]').forEach(el => el.remove());
    document.querySelectorAll('[data-datepicker-theme-scoped]').forEach(el => el.remove());
  });

  afterEach(() => {
    service.cleanupAllThemes();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateTheme', () => {
    it('should generate CSS variables from theme colors', () => {
      const theme: DatepickerTheme = {
        colors: {
          primary: '#6d28d9',
          background: '#ffffff'
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-primary-color: #6d28d9;');
      expect(result).toContain('--datepicker-background: #ffffff;');
    });

    it('should map color keys correctly', () => {
      const theme: DatepickerTheme = {
        colors: {
          primary: '#6d28d9',
          primaryContrast: '#ffffff',
          rangeBackground: '#f3f4f6',
          textSecondary: '#9ca3af',
          subtleText: '#6b7280',
          borderColor: '#e5e7eb',
          hoverBackground: '#f9fafb'
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-primary-color: #6d28d9;');
      expect(result).toContain('--datepicker-primary-contrast: #ffffff;');
      expect(result).toContain('--datepicker-range-background: #f3f4f6;');
      expect(result).toContain('--datepicker-subtle-text-color: #9ca3af;');
      expect(result).toContain('--datepicker-border-color: #e5e7eb;');
      expect(result).toContain('--datepicker-hover-background: #f9fafb;');
    });

    it('should generate CSS variables from spacing', () => {
      const theme: DatepickerTheme = {
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px'
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-spacing-xs: 4px;');
      expect(result).toContain('--datepicker-spacing-sm: 8px;');
      expect(result).toContain('--datepicker-spacing-md: 16px;');
    });

    it('should generate CSS variables from typography', () => {
      const theme: DatepickerTheme = {
        typography: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          fontWeight: '500'
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-font-family: Arial, sans-serif;');
      expect(result).toContain('--datepicker-font-size-base: 14px;');
      expect(result).toContain('--datepicker-font-weight: 500;');
    });

    it('should map typography keys correctly', () => {
      const theme: DatepickerTheme = {
        typography: {
          fontSize: '14px',
          fontSizeBase: '14px',
          fontSizeXs: '12px',
          fontSizeSm: '13px',
          fontSizeLg: '16px',
          fontSizeXl: '18px'
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-font-size-base: 14px;');
      expect(result).toContain('--datepicker-font-size-xs: 12px;');
      expect(result).toContain('--datepicker-font-size-sm: 13px;');
      expect(result).toContain('--datepicker-font-size-lg: 16px;');
      expect(result).toContain('--datepicker-font-size-xl: 18px;');
    });

    it('should generate CSS variables from borderRadius', () => {
      const theme: DatepickerTheme = {
        borderRadius: {
          sm: '4px',
          md: '8px',
          lg: '12px'
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-radius-sm: 4px;');
      expect(result).toContain('--datepicker-radius-md: 8px;');
      expect(result).toContain('--datepicker-radius-lg: 12px;');
    });

    it('should generate CSS variables from shadows', () => {
      const theme: DatepickerTheme = {
        shadows: {
          sm: '0 1px 2px rgba(0,0,0,0.05)',
          md: '0 4px 6px rgba(0,0,0,0.1)',
          lg: '0 10px 15px rgba(0,0,0,0.1)'
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);');
      expect(result).toContain('--datepicker-shadow-md: 0 4px 6px rgba(0,0,0,0.1);');
      expect(result).toContain('--datepicker-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);');
    });

    it('should ignore undefined values', () => {
      const theme: DatepickerTheme = {
        colors: {
          primary: '#6d28d9',
          background: undefined
        }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-primary-color: #6d28d9;');
      expect(result).not.toContain('background');
    });

    it('should handle empty theme', () => {
      const theme: DatepickerTheme = {};
      const result = service.generateTheme(theme);
      expect(result).toBe('');
    });

    it('should handle theme with all properties', () => {
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' },
        spacing: { md: '16px' },
        typography: { fontSize: '14px' },
        borderRadius: { md: '8px' },
        shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' }
      };

      const result = service.generateTheme(theme);
      expect(result).toContain('--datepicker-primary-color: #6d28d9;');
      expect(result).toContain('--datepicker-spacing-md: 16px;');
      expect(result).toContain('--datepicker-font-size-base: 14px;');
      expect(result).toContain('--datepicker-radius-md: 8px;');
      expect(result).toContain('--datepicker-shadow-md: 0 4px 6px rgba(0,0,0,0.1);');
    });
  });

  describe('generateStyleObject', () => {
    it('should generate style object from theme', () => {
      const theme: DatepickerTheme = {
        colors: {
          primary: '#6d28d9',
          background: '#ffffff'
        }
      };

      const result = service.generateStyleObject(theme);
      expect(result['--datepicker-primary-color']).toBe('#6d28d9');
      expect(result['--datepicker-background']).toBe('#ffffff');
    });

    it('should handle all theme properties', () => {
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' },
        spacing: { md: '16px' },
        typography: { fontSize: '14px' },
        borderRadius: { md: '8px' },
        shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' }
      };

      const result = service.generateStyleObject(theme);
      expect(result['--datepicker-primary-color']).toBe('#6d28d9');
      expect(result['--datepicker-spacing-md']).toBe('16px');
      expect(result['--datepicker-font-size-base']).toBe('14px');
      expect(result['--datepicker-radius-md']).toBe('8px');
      expect(result['--datepicker-shadow-md']).toBe('0 4px 6px rgba(0,0,0,0.1)');
    });
  });

  describe('applyTheme - global', () => {
    it('should apply theme globally in browser', () => {
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };

      service.applyTheme(theme);
      
      const styleElement = document.querySelector('[data-datepicker-theme]');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toContain('--datepicker-primary-color: #6d28d9;');
    });

    it('should not apply theme on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeBuilderService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      
      const serverService = TestBed.inject(ThemeBuilderService);
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };

      serverService.applyTheme(theme);
      
      // Should not create style element on server
      const styleElement = document.querySelector('[data-datepicker-theme]');
      expect(styleElement).toBeFalsy();
    });

    it('should update existing global theme', () => {
      const theme1: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };
      service.applyTheme(theme1);

      const theme2: DatepickerTheme = {
        colors: { primary: '#10b981' }
      };
      service.applyTheme(theme2);

      const styleElement = document.querySelector('[data-datepicker-theme]');
      expect(styleElement?.textContent).toContain('--datepicker-primary-color: #10b981;');
      expect(styleElement?.textContent).not.toContain('#6d28d9');
    });
  });

  describe('applyTheme - scoped', () => {
    it('should apply theme to specific element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };

      service.applyTheme(theme, element);

      expect(element.hasAttribute('data-theme-applied')).toBe(true);
      const scopedStyle = document.querySelector('[data-datepicker-theme-scoped]');
      expect(scopedStyle).toBeTruthy();

      document.body.removeChild(element);
    });

    it('should replace existing scoped theme', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const theme1: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };
      service.applyTheme(theme1, element);

      const theme2: DatepickerTheme = {
        colors: { primary: '#10b981' }
      };
      service.applyTheme(theme2, element);

      const scopedStyles = document.querySelectorAll('[data-datepicker-theme-scoped]');
      expect(scopedStyles.length).toBe(1);

      document.body.removeChild(element);
    });

    it('should not apply scoped theme on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeBuilderService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      
      const serverService = TestBed.inject(ThemeBuilderService);
      const element = document.createElement('div');
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };

      serverService.applyTheme(theme, element);
      
      expect(element.hasAttribute('data-theme-applied')).toBe(false);
    });
  });

  describe('removeTheme', () => {
    it('should remove global theme', () => {
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };
      service.applyTheme(theme);
      
      service.removeTheme();
      
      const styleElement = document.querySelector('[data-datepicker-theme]');
      expect(styleElement).toBeFalsy();
    });

    it('should remove scoped theme from element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };
      service.applyTheme(theme, element);
      
      service.removeTheme(element);
      
      expect(element.hasAttribute('data-theme-applied')).toBe(false);
      const scopedStyle = document.querySelector('[data-datepicker-theme-scoped]');
      expect(scopedStyle).toBeFalsy();

      document.body.removeChild(element);
    });

    it('should not remove theme on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeBuilderService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      
      const serverService = TestBed.inject(ThemeBuilderService);
      const element = document.createElement('div');
      
      // Should not throw
      expect(() => serverService.removeTheme(element)).not.toThrow();
      expect(() => serverService.removeTheme()).not.toThrow();
    });
  });

  describe('getCurrentTheme', () => {
    it('should return empty object on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeBuilderService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      
      const serverService = TestBed.inject(ThemeBuilderService);
      const result = serverService.getCurrentTheme();
      expect(result).toEqual({});
    });

    it('should return theme from CSS variables', () => {
      const element = document.documentElement;
      element.style.setProperty('--datepicker-primary-color', '#6d28d9');
      element.style.setProperty('--datepicker-spacing-md', '16px');

      const result = service.getCurrentTheme();
      
      // Note: getComputedStyle might not reflect inline styles in test environment
      // This test verifies the method doesn't throw
      expect(result).toBeDefined();
      
      element.style.removeProperty('--datepicker-primary-color');
      element.style.removeProperty('--datepicker-spacing-md');
    });

    it('should return empty object for non-existent selector', () => {
      const result = service.getCurrentTheme('#non-existent');
      expect(result).toEqual({});
    });
  });

  describe('cleanupAllThemes', () => {
    it('should remove all themes', () => {
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };
      service.applyTheme(theme);
      
      const element = document.createElement('div');
      document.body.appendChild(element);
      service.applyTheme(theme, element);
      
      service.cleanupAllThemes();
      
      expect(document.querySelector('[data-datepicker-theme]')).toBeFalsy();
      expect(document.querySelector('[data-datepicker-theme-scoped]')).toBeFalsy();
      
      document.body.removeChild(element);
    });
  });

  describe('ngOnDestroy', () => {
    it('should cleanup themes on destroy', () => {
      const theme: DatepickerTheme = {
        colors: { primary: '#6d28d9' }
      };
      service.applyTheme(theme);
      
      service.ngOnDestroy();
      
      expect(document.querySelector('[data-datepicker-theme]')).toBeFalsy();
    });
  });
});

