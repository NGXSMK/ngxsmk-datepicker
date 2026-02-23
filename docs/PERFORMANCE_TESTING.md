# Performance Testing

**Last updated:** February 23, 2026 · **Current stable:** v2.1.8

This document outlines the performance testing infrastructure for the ngxsmk-datepicker library.

## Overview

The library includes comprehensive performance testing utilities for benchmarking calendar generation, rendering speed, and detecting performance regressions.

## Testing Utilities

### Location

`projects/ngxsmk-datepicker/src/lib/utils/performance-testing.utils.ts`

### Available Functions

#### `measureSync(operation, fn, metadata?)`

Measures the performance of a synchronous operation.

```typescript
const result = measureSync("calendar-generation", () => {
  component.generateCalendar();
});

console.log(`Duration: ${result.duration}ms`);
expect(result.duration).toBeLessThan(50);
```

**Returns:** `PerformanceResult` with duration, timestamps, and optional metadata.

#### `measureAsync(operation, fn, metadata?)`

Measures the performance of an asynchronous operation.

```typescript
const result = await measureAsync("api-call", async () => {
  await service.loadData();
});

expect(result.duration).toBeLessThan(1000);
```

#### `benchmark(operation, fn, config?)`

Runs a benchmark with multiple iterations and returns detailed statistics.

```typescript
const stats = benchmark(
  "date-parsing",
  () => {
    service.parseDate("2024-01-15");
  },
  {
    iterations: 100,
    warmupIterations: 5,
  },
);

console.log(`Average: ${stats.average}ms`);
console.log(`P95: ${stats.p95}ms`);
expect(stats.p95).toBeLessThan(10);
```

**Configuration Options:**

- `iterations` - Number of measurement iterations (default: 10)
- `warmupIterations` - Warmup runs not included in results (default: 2)
- `maxDuration` - Maximum allowed duration threshold
- `minDuration` - Minimum expected duration

**Returns:** `BenchmarkStats` with average, median, min, max, standard deviation, p95, p99, and raw measurements.

#### `benchmarkAsync(operation, fn, config?)`

Async version of benchmark for asynchronous operations.

```typescript
const stats = await benchmarkAsync(
  "async-operation",
  async () => {
    await someAsyncFunction();
  },
  { iterations: 50 },
);
```

#### `assertPerformance(result, maxDuration, metric?)`

Asserts that performance meets a threshold. Throws if exceeded.

```typescript
const result = measureSync("operation", fn);
assertPerformance(result, 100); // Throws if duration > 100ms

const stats = benchmark("operation", fn);
assertPerformance(stats, 50, "p95"); // Check 95th percentile
```

**Supported Metrics:**

- `duration` - For PerformanceResult (default)
- `average` - For BenchmarkStats
- `median` - For BenchmarkStats
- `p95` - 95th percentile
- `p99` - 99th percentile

#### `formatBenchmarkStats(stats)`

Formats benchmark statistics into a human-readable string.

```typescript
const stats = benchmark("operation", fn);
console.log(formatBenchmarkStats(stats));

// Output:
// Benchmark: operation (10 iterations)
//   Average: 45.23ms
//   Median:  43.12ms
//   Min:     38.45ms
//   Max:     52.67ms
//   P95:     50.12ms
//   P99:     51.34ms
//   StdDev:  4.23ms
```

#### `compareBenchmarks(baseline, current)`

Compares two benchmark results to detect improvements or regressions.

```typescript
const baseline = benchmark("operation", oldImplementation);
const current = benchmark("operation", newImplementation);
const comparison = compareBenchmarks(baseline, current);

console.log(comparison.summary);
// "Performance improved by 23.5% (45.2ms → 34.6ms)"

if (comparison.isRegression) {
  console.warn("Performance regression detected!");
}
```

**Returns:**

- `improvement` - Absolute improvement in milliseconds
- `percentChange` - Percentage change (positive = improvement)
- `summary` - Human-readable summary
- `isRegression` - Boolean indicating if performance regressed

#### `measureRender(operation, renderFn)`

Measures DOM rendering performance including layout recalculation.

```typescript
const result = measureRender("calendar-render", () => {
  fixture.detectChanges();
});

// Should render in less than one frame at 60fps (16.67ms)
expect(result.duration).toBeLessThan(17);
```

#### `measureMemory()`

Returns current JavaScript heap memory usage (if available in browser).

```typescript
const memory = measureMemory();
if (memory) {
  console.log(`Used: ${memory.usedJSHeapSize / 1024 / 1024}MB`);
  console.log(`Total: ${memory.totalJSHeapSize / 1024 / 1024}MB`);
}
```

#### `mark(name)` and `measure(name, startMark, endMark)`

Create performance markers for profiling.

```typescript
mark("calendar-start");
generateCalendar();
mark("calendar-end");

const duration = measure("calendar-generation", "calendar-start", "calendar-end");
console.log(`Duration: ${duration}ms`);
```

#### `clearPerformanceMarks()`

Clears all performance marks and measures.

```typescript
clearPerformanceMarks();
```

## Performance Tests

### Location

`projects/ngxsmk-datepicker/src/lib/test/performance.spec.ts`

### Test Categories

#### Calendar Generation Performance

Tests calendar generation speed for various configurations:

- **Single Month Generation** - Baseline performance < 50ms
- **Multi-Month Generation** - 3 months < 100ms
- **Large Date Ranges** - 10-year span < 100ms
- **Benchmarked with Statistics** - P95 < 60ms

#### Rendering Performance

Tests DOM rendering and change detection:

- **Initial Render** - Single calendar < 100ms
- **Multi-Calendar Render** - 3 calendars < 150ms
- **Render Benchmarks** - Average < 100ms

#### Navigation Performance

Tests month/year navigation speed:

- **Next/Previous Month** - < 50ms each
- **Go To Specific Month** - < 75ms
- **Navigation Benchmark** - P95 < 60ms

#### Date Selection Performance

Tests date picking and range selection:

- **Single Date Selection** - < 50ms
- **Range Selection** - < 75ms (2 clicks)
- **Selection Benchmark** - Average < 50ms

#### View Mode Switching

Tests switching between month/year/decade views:

- **Switch to Year View** - < 75ms
- **Switch to Decade View** - < 75ms
- **Switch Back to Month** - < 75ms
- **Round-trip Benchmark** - < 100ms

#### Time Selection Performance

Tests time picker interactions:

- **Time Update** - < 50ms
- **Time Selection Benchmark** - Average < 50ms

#### Input Parsing Performance

Tests date string and object parsing:

- **Date String Parsing** - < 25ms
- **Date Object Parsing** - < 25ms
- **Parsing Benchmark** - Average < 30ms

#### Popup Performance

Tests calendar opening and closing:

- **Calendar Open** - < 100ms
- **Calendar Close** - < 75ms

#### Regression Detection

Automated tests to detect performance regressions:

- Compares baseline vs current implementation
- Allows 20% variance for test stability
- Logs performance changes

#### Memory Efficiency

Tests for memory leaks:

- Performs 50 repeated operations
- Verifies component stability
- Checks for memory growth

## Running Tests

```bash
# Run all tests including performance
npm test

# Run with coverage
npm run test:coverage

# Run in headless mode
npm run test:coverage
```

## Performance Benchmarks

### Expected Performance

| Operation                  | Target  | P95 Target |
| -------------------------- | ------- | ---------- |
| Single Month Generation    | < 50ms  | < 60ms     |
| Multi-Month (3) Generation | < 100ms | < 120ms    |
| Single Calendar Render     | < 100ms | < 120ms    |
| Month Navigation           | < 50ms  | < 60ms     |
| Date Selection             | < 50ms  | < 60ms     |
| View Switching             | < 75ms  | < 90ms     |
| Time Selection             | < 50ms  | < 60ms     |
| Date Parsing               | < 25ms  | < 30ms     |

### Real-World Performance

Tested on typical development machine (2024):

- Calendar generation: ~15-25ms
- Rendering: ~30-50ms
- Navigation: ~10-20ms
- Date selection: ~15-25ms

**Note:** Actual performance varies based on:

- Browser engine (Chrome, Firefox, Safari)
- Device capabilities
- Number of months displayed
- Enabled features (time picker, holidays, etc.)

## Best Practices

### 1. Run Benchmarks, Not Single Measurements

```typescript
// ❌ Don't rely on single measurements
const result = measureSync("operation", fn);

// ✅ Use benchmarks for reliable data
const stats = benchmark("operation", fn, { iterations: 20 });
expect(stats.p95).toBeLessThan(threshold);
```

### 2. Include Warmup Iterations

```typescript
const stats = benchmark("operation", fn, {
  iterations: 50,
  warmupIterations: 5, // Warm up JIT compiler
});
```

### 3. Check Percentiles, Not Just Average

```typescript
// P95 is more meaningful than average
expect(stats.p95).toBeLessThan(100);
```

### 4. Compare Against Baseline

```typescript
const baseline = loadBaselineBenchmark();
const current = benchmark("operation", fn);
const comparison = compareBenchmarks(baseline, current);

expect(comparison.isRegression).toBe(false);
```

### 5. Test Real-World Scenarios

```typescript
// Test with realistic data
component.numberOfMonths = 3;
component.showTime = true;
component.selectionMode = "range";

const stats = benchmark("realistic-scenario", () => {
  component.generateCalendar();
  fixture.detectChanges();
});
```

## Troubleshooting

### High Variance in Results

If you see high standard deviation:

1. **Increase iterations**: More samples = more stable results

   ```typescript
   {
     iterations: 100;
   } // Instead of 10
   ```

2. **Add warmup**: Let JIT compiler optimize

   ```typescript
   {
     warmupIterations: 10;
   }
   ```

3. **Close other apps**: Reduce system load

### Flaky Performance Tests

If tests sometimes fail:

1. **Use percentiles instead of max**:

   ```typescript
   expect(stats.p95).toBeLessThan(threshold);
   // Instead of: expect(stats.max).toBeLessThan(threshold);
   ```

2. **Add tolerance**: Allow reasonable variance

   ```typescript
   const tolerance = 1.2; // 20% tolerance
   expect(stats.average).toBeLessThan(threshold * tolerance);
   ```

3. **Skip in CI if unstable**: Mark as optional
   ```typescript
   if (isCI()) {
     pending("Unstable in CI environment");
   }
   ```

## Continuous Performance Monitoring

### Store Baseline Results

Save benchmark results for comparison:

```typescript
const stats = benchmark("operation", fn);
localStorage.setItem("baseline-operation", JSON.stringify(stats));
```

### Detect Regressions

Compare against stored baseline:

```typescript
const baseline = JSON.parse(localStorage.getItem("baseline-operation"));
const current = benchmark("operation", fn);
const comparison = compareBenchmarks(baseline, current);

if (comparison.isRegression && Math.abs(comparison.percentChange) > 10) {
  console.error("⚠️ Performance regression > 10%");
}
```

### Log Performance Trends

Track performance over time:

```typescript
const history = getPerformanceHistory();
history.push({
  timestamp: Date.now(),
  operation: "calendar-generation",
  average: stats.average,
  p95: stats.p95,
});
savePerformanceHistory(history);
```

## Contributing

When optimizing performance:

1. **Measure before optimizing**: Get baseline measurements
2. **Make incremental changes**: One optimization at a time
3. **Measure after changes**: Verify improvement
4. **Add performance tests**: Prevent future regressions
5. **Document changes**: Explain optimization strategy

### Example Workflow

```typescript
// 1. Baseline
const baseline = benchmark("operation", currentImplementation);
console.log(formatBenchmarkStats(baseline));

// 2. Optimize
function optimizedImplementation() {
  // Your improvements
}

// 3. Compare
const optimized = benchmark("operation", optimizedImplementation);
const comparison = compareBenchmarks(baseline, optimized);
console.log(comparison.summary);

// 4. Add regression test
it("should maintain optimization", () => {
  const stats = benchmark("operation", optimizedImplementation);
  assertPerformance(stats, baseline.average, "average");
});
```

## Resources

- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Performance Testing Best Practices](https://web.dev/vitals/)
- [Angular Performance Guide](https://angular.io/guide/performance-best-practices)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

## License

Same as the parent project (MIT).
