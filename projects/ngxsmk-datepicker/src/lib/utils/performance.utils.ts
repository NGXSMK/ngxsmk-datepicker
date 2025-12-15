export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    if (typeof setTimeout !== 'undefined') {
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    }
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      if (typeof setTimeout !== 'undefined') {
        setTimeout(() => (inThrottle = false), limit);
      } else {
        inThrottle = false;
      }
    }
  };
}

export function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) {
    return false;
  }
  
  for (const key of keysA) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  
  return true;
}

export function createDateComparator() {
  const cache = new Map<string, boolean>();
  const MAX_CACHE_SIZE = 1000;
  
  return (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return date1 === date2;
    
    const key = `${date1.getTime()}-${date2.getTime()}`;
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
    
    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    cache.set(key, result);
    return result;
  };
}

// Module-level cache for createFilteredArray
const filteredArrayCache = new Map<string, unknown[]>();
const MAX_FILTERED_ARRAY_CACHE_SIZE = 100;

export function createFilteredArray<T>(
  source: T[],
  filterFn: (item: T) => boolean,
  cacheKey?: string
): T[] {
  const key = cacheKey || JSON.stringify(source);
  
  if (filteredArrayCache.has(key)) {
    return filteredArrayCache.get(key) as T[];
  }
  
  const result = source.filter(filterFn);
  
  // Limit cache size to prevent memory leaks
  if (filteredArrayCache.size >= MAX_FILTERED_ARRAY_CACHE_SIZE) {
    const firstKey = filteredArrayCache.keys().next().value;
    if (firstKey !== undefined) {
      filteredArrayCache.delete(firstKey);
    }
  }
  
  filteredArrayCache.set(key, result);
  return result;
}

export function clearAllCaches(): void {
  filteredArrayCache.clear();
}