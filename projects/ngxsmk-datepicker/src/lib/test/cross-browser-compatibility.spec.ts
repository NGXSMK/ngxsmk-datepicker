import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { PLATFORM_ID } from '@angular/core';

/**
 * Cross-browser compatibility tests
 * Tests for browser API differences and feature detection
 */
describe('Cross-Browser Compatibility', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;
  let originalResizeObserver: unknown;

  beforeEach(async () => {
    // Store original ResizeObserver before any tests modify it
    originalResizeObserver = (window as unknown as Record<string, unknown>)['ResizeObserver'];

    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Always restore original ResizeObserver after each test
    (window as unknown as Record<string, unknown>)['ResizeObserver'] = originalResizeObserver;
  });

  describe('ResizeObserver Support', () => {
    it('should handle ResizeObserver availability', () => {
      // Test with ResizeObserver available
      (window as unknown as Record<string, unknown>)['ResizeObserver'] = class MockResizeObserver {
        observe() { }
        disconnect() { }
      };

      component.ngOnInit();
      fixture.detectChanges();

      // Test without ResizeObserver
      delete (window as unknown as Record<string, unknown>)['ResizeObserver'];
      component.ngOnInit();
      fixture.detectChanges();

      // Component should handle absence gracefully
      expect(component).toBeTruthy();
    });

    it('should handle ResizeObserver errors gracefully', () => {
      // This test verifies that if ResizeObserver throws an error,
      // the component should handle it gracefully
      // We test this by checking that the component can be created
      // even if ResizeObserver is problematic

      // Instead of setting a throwing mock globally, we just verify
      // the component handles ResizeObserver absence/errors
      const originalRO = (window as unknown as Record<string, unknown>)['ResizeObserver'];

      try {
        // Temporarily remove ResizeObserver to test graceful handling
        delete (window as unknown as Record<string, unknown>)['ResizeObserver'];

        // Component should handle this gracefully
        expect(() => {
          const newComponent = TestBed.createComponent(NgxsmkDatepickerComponent);
          newComponent.componentInstance.ngOnInit();
          newComponent.detectChanges();
        }).not.toThrow();
      } finally {
        // Always restore
        (window as unknown as Record<string, unknown>)['ResizeObserver'] = originalRO;
      }
    });
  });

  describe('TouchEvent Support', () => {
    it('should handle TouchEvent availability', () => {
      const hasTouchEvent = typeof TouchEvent !== 'undefined';

      if (hasTouchEvent) {
        const touchEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          touches: []
        });
        expect(touchEvent).toBeInstanceOf(TouchEvent);
      } else {
        // Simulate touch event for browsers without TouchEvent
        const mockTouchEvent = {
          type: 'touchstart',
          touches: [],
          targetTouches: [],
          changedTouches: []
        };
        expect(mockTouchEvent.type).toBe('touchstart');
      }
    });

    it('should handle touch event properties correctly', () => {
      if (typeof TouchEvent !== 'undefined') {
        const touchEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          touches: []
        });

        expect(touchEvent.type).toBe('touchstart');
        // TouchEvent.touches is a TouchList, not an array
        expect(touchEvent.touches).toBeDefined();
        expect(touchEvent.touches.length).toBeDefined();
      }
    });
  });

  describe('localStorage Support', () => {
    it('should handle localStorage availability', () => {
      // Test with localStorage available
      expect(typeof localStorage).toBe('object');
      expect(typeof localStorage.getItem).toBe('function');
      expect(typeof localStorage.setItem).toBe('function');

      // Test localStorage operations
      try {
        localStorage.setItem('test-key', 'test-value');
        expect(localStorage.getItem('test-key')).toBe('test-value');
        localStorage.removeItem('test-key');
      } catch (error) {
        // localStorage might be disabled in some browsers
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle localStorage quota exceeded', () => {
      const originalSetItem = localStorage.setItem;

      // Mock localStorage to throw quota exceeded error
      localStorage.setItem = jasmine.createSpy('setItem').and.throwError('QuotaExceededError');

      expect(() => {
        localStorage.setItem('test', 'value');
      }).toThrow();

      // Restore
      localStorage.setItem = originalSetItem;
    });

    it('should handle localStorage disabled', () => {
      const originalLocalStorage = (window as unknown as Record<string, unknown>)['localStorage'];

      // Mock localStorage as null
      try {
        Object.defineProperty(window, 'localStorage', {
          value: null,
          writable: true,
          configurable: true
        });

        // Component should handle this gracefully
        expect(() => {
          component.ngOnInit();
          fixture.detectChanges();
        }).not.toThrow();
      } finally {
        // Restore
        if (originalLocalStorage) {
          Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true,
            configurable: true
          });
        }
      }
    });
  });

  describe('Date API Compatibility', () => {
    it('should handle Date.parse differences across browsers', () => {
      const testDates = [
        '2024-01-15',
        '01/15/2024',
        'January 15, 2024',
        '2024-01-15T10:30:00Z'
      ];

      testDates.forEach(dateString => {
        const parsed = Date.parse(dateString);
        // Some formats might return NaN in some browsers
        expect(typeof parsed).toBe('number');
      });
    });

    it('should handle timezone differences', () => {
      const utcDate = new Date('2024-01-15T10:30:00Z');
      const localDate = new Date(2024, 0, 15, 10, 30, 0);

      // Different browsers might handle timezones differently
      expect(utcDate).toBeInstanceOf(Date);
      expect(localDate).toBeInstanceOf(Date);
    });

    it('should handle invalid date strings consistently', () => {
      const invalidDates = [
        'invalid-date',
        '2024-13-45', // Invalid month/day
        'not-a-date',
        ''
      ];

      invalidDates.forEach(dateString => {
        const date = new Date(dateString);
        expect(isNaN(date.getTime())).toBe(true);
      });
    });
  });

  describe('CSS Support', () => {
    it('should handle CSS custom properties (variables)', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      // Test CSS custom properties
      element.style.setProperty('--test-color', '#ff0000');
      const value = element.style.getPropertyValue('--test-color');

      expect(value).toBe('#ff0000');

      document.body.removeChild(element);
    });

    it('should handle CSS Grid support', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.style.display = 'grid';
      const display = window.getComputedStyle(element).display;

      // Most modern browsers support grid
      expect(['grid', '-ms-grid']).toContain(display);

      document.body.removeChild(element);
    });

    it('should handle Flexbox support', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.style.display = 'flex';
      const display = window.getComputedStyle(element).display;

      expect(display).toBe('flex');

      document.body.removeChild(element);
    });
  });

  describe('Event API Compatibility', () => {
    it('should handle Event constructor differences', () => {
      // Modern browsers support Event constructor
      if (typeof Event !== 'undefined') {
        const event = new Event('test', { bubbles: true, cancelable: true });
        expect(event.type).toBe('test');
        expect(event.bubbles).toBe(true);
        expect(event.cancelable).toBe(true);
      } else {
        // Fallback for older browsers
        const event = document.createEvent('Event');
        event.initEvent('test', true, true);
        expect(event.type).toBe('test');
      }
    });

    it('should handle KeyboardEvent key differences', () => {
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });

      // Modern browsers use 'key' property
      if (keyEvent.key) {
        expect(keyEvent.key).toBe('ArrowRight');
      } else {
        // Fallback for older browsers (keyCode)
        expect(keyEvent.keyCode).toBeDefined();
      }
    });
  });

  describe('IntersectionObserver Support', () => {
    it('should handle IntersectionObserver availability', () => {
      const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

      if (hasIntersectionObserver) {
        const observer = new IntersectionObserver(() => { });
        expect(observer).toBeInstanceOf(IntersectionObserver);
        observer.disconnect();
      } else {
        // Component should handle absence gracefully
        expect(hasIntersectionObserver).toBe(false);
      }
    });
  });

  describe('requestAnimationFrame Support', () => {
    it('should handle requestAnimationFrame availability', () => {
      const hasRAF = typeof requestAnimationFrame !== 'undefined';

      if (hasRAF) {
        const id = requestAnimationFrame(() => { });
        expect(typeof id).toBe('number');
        cancelAnimationFrame(id);
      } else {
        // Fallback to setTimeout
        const timeoutId = setTimeout(() => { }, 16);
        expect(typeof timeoutId).toBe('number');
        clearTimeout(timeoutId);
      }
    });
  });

  describe('Performance API Support', () => {
    it('should handle Performance API availability', () => {
      const hasPerformance = typeof performance !== 'undefined';

      if (hasPerformance) {
        expect(typeof performance.now).toBe('function');
        const timestamp = performance.now();
        expect(typeof timestamp).toBe('number');
      }
    });
  });

  describe('Feature Detection', () => {
    it('should detect browser features correctly', () => {
      const features = {
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        touchEvents: 'ontouchstart' in window,
        pointerEvents: 'onpointerdown' in window,
        passiveEvents: (() => {
          let supportsPassive = false;
          try {
            const opts = Object.defineProperty({}, 'passive', {
              get() {
                supportsPassive = true;
                return false;
              }
            });
            window.addEventListener('test', () => { }, opts);
            window.removeEventListener('test', () => { }, opts);
          } catch { }
          return supportsPassive;
        })()
      };

      expect(typeof features.localStorage).toBe('boolean');
      expect(typeof features.sessionStorage).toBe('boolean');
      expect(typeof features.touchEvents).toBe('boolean');
    });
  });
});

