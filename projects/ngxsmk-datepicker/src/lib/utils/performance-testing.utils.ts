/**
 * Performance Testing Utilities
 *
 * This module provides utilities for benchmarking and performance testing.
 * It helps measure calendar generation speed, rendering performance, and detect regressions.
 */

/**
 * Performance measurement result
 */
export interface PerformanceResult {
  /** Operation name */
  operation: string;
  /** Duration in milliseconds */
  duration: number;
  /** Timestamp when measurement started */
  startTime: number;
  /** Timestamp when measurement ended */
  endTime: number;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Performance benchmark configuration
 */
export interface BenchmarkConfig {
  /** Number of iterations to run */
  iterations?: number;
  /** Warmup iterations (not included in results) */
  warmupIterations?: number;
  /** Maximum allowed duration in milliseconds */
  maxDuration?: number;
  /** Minimum allowed duration in milliseconds (for validation) */
  minDuration?: number;
}

/**
 * Benchmark statistics
 */
export interface BenchmarkStats {
  /** Operation name */
  operation: string;
  /** Number of iterations */
  iterations: number;
  /** Average duration in milliseconds */
  average: number;
  /** Median duration in milliseconds */
  median: number;
  /** Minimum duration in milliseconds */
  min: number;
  /** Maximum duration in milliseconds */
  max: number;
  /** Standard deviation */
  stdDev: number;
  /** 95th percentile */
  p95: number;
  /** 99th percentile */
  p99: number;
  /** All raw measurements */
  measurements: number[];
}

/**
 * Measure the performance of a synchronous operation
 *
 * @param operation - Name of the operation
 * @param fn - Function to measure
 * @param metadata - Optional metadata to attach
 * @returns Performance result
 *
 * @example
 * ```typescript
 * const result = measureSync('calendar-generation', () => {
 *   component.generateCalendar();
 * });
 * expect(result.duration).toBeLessThan(100);
 * ```
 */
export function measureSync(
  operation: string,
  fn: () => void,
  metadata?: Record<string, unknown>,
): PerformanceResult {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();

  return {
    operation,
    duration: endTime - startTime,
    startTime,
    endTime,
    metadata,
  };
}

/**
 * Measure the performance of an asynchronous operation
 *
 * @param operation - Name of the operation
 * @param fn - Async function to measure
 * @param metadata - Optional metadata to attach
 * @returns Performance result
 *
 * @example
 * ```typescript
 * const result = await measureAsync('api-call', async () => {
 *   await service.loadData();
 * });
 * expect(result.duration).toBeLessThan(1000);
 * ```
 */
export async function measureAsync(
  operation: string,
  fn: () => Promise<void>,
  metadata?: Record<string, unknown>,
): Promise<PerformanceResult> {
  const startTime = performance.now();
  await fn();
  const endTime = performance.now();

  return {
    operation,
    duration: endTime - startTime,
    startTime,
    endTime,
    metadata,
  };
}

/**
 * Run a benchmark with multiple iterations
 *
 * @param operation - Name of the operation
 * @param fn - Function to benchmark
 * @param config - Benchmark configuration
 * @returns Benchmark statistics
 *
 * @example
 * ```typescript
 * const stats = benchmark('date-parsing', () => {
 *   service.parseDate('2024-01-15');
 * }, { iterations: 100 });
 *
 * console.log(`Average: ${stats.average}ms`);
 * expect(stats.p95).toBeLessThan(5);
 * ```
 */
export function benchmark(
  operation: string,
  fn: () => void,
  config: BenchmarkConfig = {},
): BenchmarkStats {
  const { iterations = 10, warmupIterations = 2 } = config;

  // Warmup phase (not measured)
  for (let i = 0; i < warmupIterations; i++) {
    fn();
  }

  // Measurement phase
  const measurements: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    measurements.push(end - start);
  }

  return calculateStats(operation, measurements, iterations);
}

/**
 * Run an async benchmark with multiple iterations
 *
 * @param operation - Name of the operation
 * @param fn - Async function to benchmark
 * @param config - Benchmark configuration
 * @returns Benchmark statistics
 */
export async function benchmarkAsync(
  operation: string,
  fn: () => Promise<void>,
  config: BenchmarkConfig = {},
): Promise<BenchmarkStats> {
  const { iterations = 10, warmupIterations = 2 } = config;

  // Warmup phase
  for (let i = 0; i < warmupIterations; i++) {
    await fn();
  }

  // Measurement phase
  const measurements: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    measurements.push(end - start);
  }

  return calculateStats(operation, measurements, iterations);
}

/**
 * Calculate statistics from measurements
 */
function calculateStats(
  operation: string,
  measurements: number[],
  iterations: number,
): BenchmarkStats {
  const sorted = [...measurements].sort((a, b) => a - b);
  const sum = measurements.reduce((acc, val) => acc + val, 0);
  const average = sum / iterations;

  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Calculate standard deviation
  const squaredDiffs = measurements.map((val) => Math.pow(val - average, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / iterations;
  const stdDev = Math.sqrt(variance);

  // Calculate percentiles
  const p95Index = Math.ceil(sorted.length * 0.95) - 1;
  const p99Index = Math.ceil(sorted.length * 0.99) - 1;
  const p95 = sorted[p95Index];
  const p99 = sorted[p99Index];

  return {
    operation,
    iterations,
    average,
    median,
    min,
    max,
    stdDev,
    p95,
    p99,
    measurements,
  };
}

/**
 * Assert that performance meets threshold
 *
 * @param result - Performance result or benchmark stats
 * @param maxDuration - Maximum allowed duration in milliseconds
 * @param metric - Metric to check (duration, average, p95, etc.)
 *
 * @example
 * ```typescript
 * const result = measureSync('operation', fn);
 * assertPerformance(result, 100); // Throws if duration > 100ms
 *
 * const stats = benchmark('operation', fn);
 * assertPerformance(stats, 50, 'p95'); // Check 95th percentile
 * ```
 */
export function assertPerformance(
  result: PerformanceResult | BenchmarkStats,
  maxDuration: number,
  metric: 'duration' | 'average' | 'median' | 'p95' | 'p99' = 'duration',
): void {
  let actualDuration: number;

  if ('duration' in result) {
    actualDuration = result.duration;
  } else {
    actualDuration = result[metric as keyof BenchmarkStats] as number;
  }

  if (actualDuration > maxDuration) {
    throw new Error(
      `Performance assertion failed: ${result.operation} took ${actualDuration.toFixed(2)}ms ` +
        `(expected < ${maxDuration}ms for ${metric})`,
    );
  }
}

/**
 * Format benchmark stats for readable output
 *
 * @param stats - Benchmark statistics
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * const stats = benchmark('operation', fn);
 * console.log(formatBenchmarkStats(stats));
 * // Output:
 * // Benchmark: operation (10 iterations)
 * //   Average: 45.23ms
 * //   Median:  43.12ms
 * //   Min:     38.45ms
 * //   Max:     52.67ms
 * //   P95:     50.12ms
 * //   StdDev:  4.23ms
 * ```
 */
export function formatBenchmarkStats(stats: BenchmarkStats): string {
  const lines = [
    `Benchmark: ${stats.operation} (${stats.iterations} iterations)`,
    `  Average: ${stats.average.toFixed(2)}ms`,
    `  Median:  ${stats.median.toFixed(2)}ms`,
    `  Min:     ${stats.min.toFixed(2)}ms`,
    `  Max:     ${stats.max.toFixed(2)}ms`,
    `  P95:     ${stats.p95.toFixed(2)}ms`,
    `  P99:     ${stats.p99.toFixed(2)}ms`,
    `  StdDev:  ${stats.stdDev.toFixed(2)}ms`,
  ];

  return lines.join('\n');
}

/**
 * Compare two benchmark results
 *
 * @param baseline - Baseline benchmark stats
 * @param current - Current benchmark stats
 * @returns Comparison summary
 *
 * @example
 * ```typescript
 * const baseline = benchmark('operation', oldImplementation);
 * const current = benchmark('operation', newImplementation);
 * const comparison = compareBenchmarks(baseline, current);
 *
 * console.log(comparison.summary);
 * // "Performance improved by 23.5% (45.2ms → 34.6ms)"
 * ```
 */
export function compareBenchmarks(
  baseline: BenchmarkStats,
  current: BenchmarkStats,
): {
  improvement: number;
  percentChange: number;
  summary: string;
  isRegression: boolean;
} {
  const improvement = baseline.average - current.average;
  const percentChange = (improvement / baseline.average) * 100;
  const isRegression = improvement < 0;

  const summary = isRegression
    ? `Performance regressed by ${Math.abs(percentChange).toFixed(1)}% ` +
      `(${baseline.average.toFixed(2)}ms → ${current.average.toFixed(2)}ms)`
    : `Performance improved by ${percentChange.toFixed(1)}% ` +
      `(${baseline.average.toFixed(2)}ms → ${current.average.toFixed(2)}ms)`;

  return {
    improvement,
    percentChange,
    summary,
    isRegression,
  };
}

/**
 * Measure DOM rendering performance
 *
 * @param operation - Name of the operation
 * @param renderFn - Function that triggers rendering
 * @returns Performance result including paint timing
 *
 * @example
 * ```typescript
 * const result = measureRender('calendar-render', () => {
 *   fixture.detectChanges();
 * });
 * expect(result.duration).toBeLessThan(16); // < 1 frame at 60fps
 * ```
 */
export function measureRender(
  operation: string,
  renderFn: () => void,
): PerformanceResult {
  const startTime = performance.now();

  renderFn();

  // Force layout recalculation
  void document.body.offsetHeight;

  const endTime = performance.now();

  return {
    operation: `${operation} (render)`,
    duration: endTime - startTime,
    startTime,
    endTime,
    metadata: {
      type: 'render',
    },
  };
}

/**
 * Measure memory usage (if available)
 *
 * @returns Memory info or null if not available
 */
export function measureMemory(): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  if ('memory' in performance) {
    const memory = (
      performance as unknown as {
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

/**
 * Create a performance marker for profiling
 *
 * @param name - Marker name
 *
 * @example
 * ```typescript
 * mark('calendar-start');
 * generateCalendar();
 * mark('calendar-end');
 * const duration = measure('calendar-generation', 'calendar-start', 'calendar-end');
 * ```
 */
export function mark(name: string): void {
  if ('mark' in performance) {
    performance.mark(name);
  }
}

/**
 * Measure duration between two markers
 *
 * @param name - Measure name
 * @param startMark - Start marker name
 * @param endMark - End marker name
 * @returns Duration in milliseconds
 */
export function measure(
  name: string,
  startMark: string,
  endMark: string,
): number {
  if ('measure' in performance && 'getEntriesByName' in performance) {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name);
    if (entries.length > 0) {
      return entries[entries.length - 1].duration;
    }
  }
  return 0;
}

/**
 * Clear all performance marks and measures
 */
export function clearPerformanceMarks(): void {
  if ('clearMarks' in performance) {
    performance.clearMarks();
  }
  if ('clearMeasures' in performance) {
    performance.clearMeasures();
  }
}
