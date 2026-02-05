import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { ThemeBuilderService } from '../services/theme-builder.service';
import { PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

/**
 * Async operation tests
 * Tests setTimeout, requestAnimationFrame, Promise chains, and timing-dependent code
 */
describe('Async Operations Tests', () => {
  describe('setTimeout Operations', () => {
    it('should handle setTimeout in theme application', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxsmkDatepickerComponent, ReactiveFormsModule],
        providers: [
          ThemeBuilderService,
          DatePipe,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });

      const service = TestBed.inject(ThemeBuilderService);
      const element = document.createElement('div');
      document.body.appendChild(element);

      const theme = {
        colors: { primary: '#6d28d9' },
      };

      service.applyTheme(theme, element);

      // requestAnimationFrame is used in applyTheme
      tick(0); // Advance past requestAnimationFrame

      expect(element.hasAttribute('data-theme-applied')).toBe(true);

      document.body.removeChild(element);
    }));

    it('should handle multiple setTimeout calls', fakeAsync(() => {
      let callCount = 0;

      setTimeout(() => callCount++, 10);
      setTimeout(() => callCount++, 20);
      setTimeout(() => callCount++, 30);

      expect(callCount).toBe(0);
      tick(10);
      expect(callCount).toBe(1);
      tick(10);
      expect(callCount).toBe(2);
      tick(10);
      expect(callCount).toBe(3);
    }));

    it('should handle setTimeout with 0 delay', fakeAsync(() => {
      let called = false;

      setTimeout(() => {
        called = true;
      }, 0);

      expect(called).toBe(false);
      tick(0);
      expect(called).toBe(true);
    }));

    it('should handle setTimeout cancellation', fakeAsync(() => {
      let called = false;

      const timeoutId = setTimeout(() => {
        called = true;
      }, 100);

      clearTimeout(timeoutId);
      tick(100);

      expect(called).toBe(false);
    }));
  });

  describe('requestAnimationFrame Operations', () => {
    it('should handle requestAnimationFrame in browser', (done) => {
      let frameCalled = false;

      requestAnimationFrame(() => {
        frameCalled = true;
        expect(frameCalled).toBe(true);
        done();
      });

      expect(frameCalled).toBe(false);
    });

    it('should handle multiple requestAnimationFrame calls', (done) => {
      let callCount = 0;
      const expectedCalls = 3;
      let doneCalled = false;

      const checkDone = () => {
        callCount++;
        if (callCount === expectedCalls && !doneCalled) {
          doneCalled = true;
          expect(callCount).toBe(3);
          done();
        }
      };

      requestAnimationFrame(checkDone);
      requestAnimationFrame(checkDone);
      requestAnimationFrame(checkDone);

      expect(callCount).toBe(0);
    });

    it('should handle requestAnimationFrame cancellation', fakeAsync(() => {
      let called = false;

      const frameId = requestAnimationFrame(() => {
        called = true;
      });

      cancelAnimationFrame(frameId);
      tick(0);

      expect(called).toBe(false);
    }));
  });

  describe('Promise Chains', () => {
    it('should handle Promise.resolve chains', async () => {
      const result = await Promise.resolve(42)
        .then((value) => value * 2)
        .then((value) => value + 1);

      expect(result).toBe(85);
    });

    it('should handle Promise.reject chains', async () => {
      let errorCaught = false;

      try {
        await Promise.reject(new Error('Test error'))
          .then(() => 42)
          .catch((err) => {
            throw err;
          });
      } catch (error) {
        errorCaught = true;
        expect((error as Error).message).toBe('Test error');
      }

      expect(errorCaught).toBe(true);
    });

    it('should handle Promise.all', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ];

      const results = await Promise.all(promises);
      expect(results).toEqual([1, 2, 3]);
    });

    it('should handle Promise.all with rejection', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.reject(new Error('Error')),
        Promise.resolve(3),
      ];

      let errorCaught = false;
      try {
        await Promise.all(promises);
      } catch (error) {
        errorCaught = true;
        expect(error).toBeDefined();
      }

      expect(errorCaught).toBe(true);
    });

    it('should handle Promise.race', async () => {
      const fast = new Promise((resolve) =>
        setTimeout(() => resolve('fast'), 10),
      );
      const slow = new Promise((resolve) =>
        setTimeout(() => resolve('slow'), 100),
      );

      const result = await Promise.race([fast, slow]);
      expect(result).toBe('fast');
    });
  });

  describe('Async/Await Patterns', () => {
    it('should handle async function with await', async () => {
      const asyncFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'done';
      };

      const result = await asyncFunction();
      expect(result).toBe('done');
    });

    it('should handle async function with error', async () => {
      const asyncFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error('Async error');
      };

      let errorCaught = false;
      try {
        await asyncFunction();
      } catch (error) {
        errorCaught = true;
        expect((error as Error).message).toBe('Async error');
      }

      expect(errorCaught).toBe(true);
    });

    it('should handle multiple async operations', async () => {
      const results: number[] = [];

      const op1 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(1);
      };

      const op2 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        results.push(2);
      };

      const op3 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        results.push(3);
      };

      await Promise.all([op1(), op2(), op3()]);

      expect(results.length).toBe(3);
      expect(results).toContain(1);
      expect(results).toContain(2);
      expect(results).toContain(3);
    });
  });

  describe('Timing-Dependent Code', () => {
    it('should handle debounced operations', fakeAsync(() => {
      let callCount = 0;
      let timeoutId: unknown;

      const debounce = (fn: () => void, delay: number) => {
        clearTimeout(timeoutId as number);
        timeoutId = setTimeout(fn, delay);
      };

      debounce(() => callCount++, 100);
      debounce(() => callCount++, 100);
      debounce(() => callCount++, 100);

      expect(callCount).toBe(0);
      tick(100);
      expect(callCount).toBe(1); // Only last call should execute
    }));

    it('should handle throttled operations', fakeAsync(() => {
      let callCount = 0;
      let lastCall = 0;

      const throttle = (fn: () => void, delay: number) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          fn();
          lastCall = now;
        }
      };

      throttle(() => callCount++, 100);
      throttle(() => callCount++, 100);
      throttle(() => callCount++, 100);

      expect(callCount).toBe(1); // First call executes

      tick(100);
      throttle(() => callCount++, 100);
      expect(callCount).toBe(2); // Second call after delay
    }));

    it('should handle delayed state updates', fakeAsync(() => {
      let state = 'initial';

      setTimeout(() => {
        state = 'updated';
      }, 50);

      expect(state).toBe('initial');
      tick(50);
      expect(state).toBe('updated');
    }));
  });

  describe('Race Conditions', () => {
    it('should handle concurrent async operations', async () => {
      let counter = 0;

      const increment = async () => {
        const current = counter;
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10));
        counter = current + 1;
      };

      await Promise.all([increment(), increment(), increment()]);

      // Note: This test demonstrates a race condition
      // In real code, you'd use locks or atomic operations
      expect(counter).toBeGreaterThanOrEqual(1);
      expect(counter).toBeLessThanOrEqual(3);
    });

    it('should handle sequential async operations', async () => {
      let counter = 0;

      const increment = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        counter++;
      };

      await increment();
      await increment();
      await increment();

      expect(counter).toBe(3);
    });
  });
});
