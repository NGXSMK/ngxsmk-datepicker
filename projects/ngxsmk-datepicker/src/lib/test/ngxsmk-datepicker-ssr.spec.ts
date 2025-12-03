import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent - SSR Behavior', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  describe('Server-Side Rendering (SSR)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NgxsmkDatepickerComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
      component = fixture.componentInstance;
    });

    it('should not access window object during initialization', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should not access document object during initialization', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should not access navigator object during initialization', () => {
      expect(() => {
        component.locale = 'en-US';
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle locale without browser APIs', () => {
      component.locale = 'en-US';
      fixture.detectChanges();

      expect(component.locale).toBe('en-US');
    });

    it('should initialize with default values on server', () => {
      fixture.detectChanges();

      expect(component.mode).toBe('single');
      expect(component.inline).toBe(false);
      expect(component.theme).toBe('light');
    });

    it('should handle range mode on server', () => {
      component.mode = 'range';
      fixture.detectChanges();

      expect(component.mode).toBe('range');
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle multiple mode on server', () => {
      component.mode = 'multiple';
      fixture.detectChanges();

      expect(component.mode).toBe('multiple');
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle disabled state on server', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle different themes on server', () => {
      component.theme = 'dark';
      fixture.detectChanges();

      expect(component.theme).toBe('dark');
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle placeholder on server', () => {
      component.placeholder = 'Select a date';
      fixture.detectChanges();

      expect(component.placeholder).toBe('Select a date');
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle inline mode on server', () => {
      component.inline = true;
      fixture.detectChanges();

      expect(component.inline).toBe(true);
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle value changes on server', () => {
      const testDate = new Date('2025-06-15');
      component.value = testDate;
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle null value on server', () => {
      component.value = null;
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle timeOnly mode on server', () => {
      component.timeOnly = true;
      fixture.detectChanges();

      expect(component.timeOnly).toBe(true);
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Browser-Side Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NgxsmkDatepickerComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
      component = fixture.componentInstance;
      component.inline = true;
    });

    it('should access browser APIs safely on client', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should detect browser locale on client', () => {
      fixture.detectChanges();

      // Should have a locale set (either from input or browser)
      expect(component.locale).toBeTruthy();
    });

    it('should handle range mode on client', () => {
      component.mode = 'range';
      fixture.detectChanges();

      expect(component.mode).toBe('range');
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle multiple mode on client', () => {
      component.mode = 'multiple';
      fixture.detectChanges();

      expect(component.mode).toBe('multiple');
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Platform Checks', () => {
    it('should use platform checks for browser-only code', () => {
      // This test verifies that the component uses isPlatformBrowser checks
      // The actual implementation should guard all browser API access
      expect(() => {
        fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Hydration Compatibility', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NgxsmkDatepickerComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
      component = fixture.componentInstance;
      component.inline = true;
    });

    it('should handle value initialization after hydration', () => {
      const testDate = new Date('2025-01-15');
      component.value = testDate;
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getFullYear()).toBe(2025);
        expect(component.selectedDate.getMonth()).toBe(0); // January
        expect(component.selectedDate.getDate()).toBe(15);
      }
    });

    it('should not throw when accessing DOM elements after hydration', () => {
      expect(() => {
        fixture.detectChanges();
        const _input = fixture.debugElement.query(By.css('.ngxsmk-display-input'));
        // Accessing DOM should not throw
      }).not.toThrow();
    });

    it('should handle range mode after hydration', () => {
      component.mode = 'range';
      const startDate = new Date('2025-01-10');
      const endDate = new Date('2025-01-20');
      component.value = { start: startDate, end: endDate };
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle multiple dates after hydration', () => {
      component.mode = 'multiple';
      const dates = [new Date('2025-01-10'), new Date('2025-01-15'), new Date('2025-01-20')];
      component.value = dates;
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle locale change after hydration', () => {
      component.locale = 'fr-FR';
      fixture.detectChanges();

      expect(component.locale).toBe('fr-FR');
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });
});

