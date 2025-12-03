import { memoize, debounce, throttle, createDateComparator, createFilteredArray, clearAllCaches } from './performance.utils';

describe('Performance Utils', () => {
  describe('memoize', () => {
    it('should cache function results', () => {
      let callCount = 0;
      const fn = (x: number) => {
        callCount++;
        return x * 2;
      };

      const memoized = memoize(fn as (...args: unknown[]) => unknown);

      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);

      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);

      expect(memoized(6)).toBe(12);
      expect(callCount).toBe(2);
    });

    it('should use custom key generator', () => {
      const fn = (a: number, b: number) => a + b;
      const keyGen = (a: number, b: number) => `${a}-${b}`;

      const memoized = memoize(fn as (...args: unknown[]) => unknown, keyGen as (...args: unknown[]) => string);

      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 2)).toBe(3);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should delay function execution', (done) => {
      let callCount = 0;
      const fn = () => callCount++;
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(callCount).toBe(0);

      jasmine.clock().tick(100);

      expect(callCount).toBe(1);
      done();
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should throttle function execution', (done) => {
      let callCount = 0;
      const fn = () => callCount++;
      const throttled = throttle(fn, 100);

      throttled();
      expect(callCount).toBe(1);

      throttled();
      throttled();
      expect(callCount).toBe(1);

      jasmine.clock().tick(100);
      throttled();
      expect(callCount).toBe(2);
      done();
    });
  });

  describe('createDateComparator', () => {
    it('should create comparator function', () => {
      const comparator = createDateComparator();

      const date1 = new Date(2025, 5, 15);
      const date2 = new Date(2025, 5, 15);
      const date3 = new Date(2025, 5, 16);

      expect(comparator(date1, date2)).toBe(true);
      expect(comparator(date1, date3)).toBe(false);
    });

    it('should handle null dates', () => {
      const comparator = createDateComparator();

      expect(comparator(null, null)).toBe(true);
      expect(comparator(new Date(), null)).toBe(false);
      expect(comparator(null, new Date())).toBe(false);
    });

    it('should cache comparison results', () => {
      const comparator = createDateComparator();
      const date1 = new Date(2025, 5, 15);
      const date2 = new Date(2025, 5, 15);

      const result1 = comparator(date1, date2);
      const result2 = comparator(date1, date2);

      expect(result1).toBe(result2);
    });
  });

  describe('createFilteredArray', () => {
    it('should filter array', () => {
      const source = [1, 2, 3, 4, 5];
      const filterFn = (x: number) => x % 2 === 0;

      const result = createFilteredArray(source, filterFn);

      expect(result).toEqual([2, 4]);
    });

    it('should cache filtered results', () => {
      const source = [1, 2, 3, 4, 5];
      const filterFn = (x: number) => x % 2 === 0;

      const result1 = createFilteredArray(source, filterFn, 'even');
      const result2 = createFilteredArray(source, filterFn, 'even');

      expect(result1).toEqual(result2);
    });
  });

  describe('clearAllCaches', () => {
    it('should clear all caches', () => {
      expect(() => clearAllCaches()).not.toThrow();
    });
  });
});

