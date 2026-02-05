export interface VirtualScrollItem<T = unknown> {
  index: number;
  data: T;
}

export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  itemsPerRow?: number; // For grid layouts (year/decade views)
}

export interface VirtualScrollResult<T = unknown> {
  startIndex: number;
  endIndex: number;
  visibleItems: VirtualScrollItem<T>[];
  totalHeight: number;
  offsetY: number;
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
}

/**
 * Calculate virtual scroll range for a list of items
 */
export function calculateVirtualScroll<T = unknown>(
  items: T[],
  scrollTop: number,
  config: VirtualScrollConfig,
): VirtualScrollResult<T> {
  const { itemHeight, containerHeight, overscan = 3, itemsPerRow = 1 } = config;
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const totalHeight = totalRows * itemHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleRowCount = Math.ceil(containerHeight / itemHeight);
  const endRow = Math.min(
    totalRows - 1,
    startRow + visibleRowCount + overscan * 2,
  );

  const startIndex = startRow * itemsPerRow;
  const endIndex = Math.min(items.length - 1, (endRow + 1) * itemsPerRow - 1);

  const visibleItems: VirtualScrollItem<T>[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const item = items[i];
    if (item !== undefined && item !== null) {
      visibleItems.push({
        index: i,
        data: item,
      });
    }
  }

  const offsetY = startRow * itemHeight;

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    hasMoreBefore: startIndex > 0,
    hasMoreAfter: endIndex < items.length - 1,
  };
}

/**
 * Get virtual scroll range (simplified version)
 */
export function getVirtualScrollRange(
  totalItems: number,
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3,
  itemsPerRow: number = 1,
): { start: number; end: number; offset: number } {
  const totalRows = Math.ceil(totalItems / itemsPerRow);
  const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleRowCount = Math.ceil(containerHeight / itemHeight);
  const endRow = Math.min(
    totalRows - 1,
    startRow + visibleRowCount + overscan * 2,
  );

  const start = startRow * itemsPerRow;
  const end = Math.min(totalItems - 1, (endRow + 1) * itemsPerRow - 1);
  const offset = startRow * itemHeight;

  return { start, end, offset };
}

/**
 * Generate a large year range for virtual scrolling
 */
export function generateLargeYearRange(
  centerYear: number,
  range: number = 100,
): number[] {
  const startYear = centerYear - Math.floor(range / 2);
  const years: number[] = [];
  for (let i = 0; i < range; i++) {
    years.push(startYear + i);
  }
  return years;
}

/**
 * Generate a large decade range for virtual scrolling
 */
export function generateLargeDecadeRange(
  centerDecade: number,
  range: number = 50,
): number[] {
  const startDecade = centerDecade - Math.floor(range / 2) * 10;
  const decades: number[] = [];
  for (let i = 0; i < range; i++) {
    decades.push(startDecade + i * 10);
  }
  return decades;
}

/**
 * Find the index of a target value in a sorted array (for scrolling to specific year/decade)
 */
export function findIndexInSortedArray<T>(
  items: T[],
  target: T,
  compareFn: (a: T, b: T) => number,
): number {
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midItem = items[mid];

    if (midItem === undefined) {
      return Math.max(0, Math.min(left, items.length - 1));
    }

    const comparison = compareFn(midItem, target);

    if (comparison === 0) {
      return mid;
    } else if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return Math.max(0, Math.min(left, items.length - 1));
}
