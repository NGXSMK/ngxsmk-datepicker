/**
 * Visual Regression Testing Utilities
 *
 * Provides utilities for screenshot-based visual regression testing across:
 * - Light/Dark themes
 * - Mobile/Desktop layouts
 * - Different component states
 * - Browser viewport variations
 */

/**
 * Configuration for visual regression testing
 */
export interface VisualRegressionConfig {
  /** Base directory for storing reference screenshots */
  baselineDir?: string;
  /** Directory for storing diff images */
  diffDir?: string;
  /** Threshold for pixel difference (0-1, where 0 is identical) */
  threshold?: number;
  /** Whether to update baseline images */
  updateBaseline?: boolean;
  /** Timeout for waiting for element to be ready */
  timeout?: number;
}

/**
 * Viewport configuration for different device types
 */
export interface ViewportConfig {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

/**
 * Theme configuration for testing
 */
export type ThemeMode = 'light' | 'dark' | 'high-contrast';

/**
 * Predefined viewport configurations
 */
export const VIEWPORTS = {
  mobile: {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  } as ViewportConfig,
  tablet: {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  } as ViewportConfig,
  desktop: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  } as ViewportConfig,
  desktopHD: {
    width: 2560,
    height: 1440,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  } as ViewportConfig,
} as const;

/**
 * Screenshot comparison result
 */
export interface ScreenshotComparisonResult {
  /** Whether the screenshots match within threshold */
  matches: boolean;
  /** Percentage of pixels that differ (0-100) */
  diffPercentage: number;
  /** Path to the diff image (if generated) */
  diffImagePath?: string;
  /** Dimensions of the screenshots */
  dimensions?: { width: number; height: number };
  /** Number of different pixels */
  diffPixelCount?: number;
}

/**
 * Visual test scenario configuration
 */
export interface VisualTestScenario {
  /** Name of the test scenario */
  name: string;
  /** Theme to apply */
  theme: ThemeMode;
  /** Viewport configuration */
  viewport: ViewportConfig;
  /** CSS selector for the element to capture */
  selector: string;
  /** Optional interactions before screenshot */
  beforeScreenshot?: () => Promise<void>;
  /** Optional cleanup after screenshot */
  afterScreenshot?: () => Promise<void>;
  /** Custom threshold for this scenario */
  threshold?: number;
}

/**
 * Default configuration for visual regression testing
 */
export const DEFAULT_VISUAL_CONFIG: Required<VisualRegressionConfig> = {
  baselineDir: 'visual-regression/baseline',
  diffDir: 'visual-regression/diff',
  threshold: 0.01, // 1% difference allowed
  updateBaseline: false,
  timeout: 5000,
};

/**
 * Generate a filename for a screenshot based on scenario details
 */
export function generateScreenshotFilename(
  scenario: VisualTestScenario,
): string {
  const { name, theme, viewport } = scenario;
  const deviceType = viewport.isMobile ? 'mobile' : 'desktop';
  const resolution = `${viewport.width}x${viewport.height}`;

  // Sanitize name for filename
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${sanitizedName}-${theme}-${deviceType}-${resolution}.png`;
}

/**
 * Apply theme to the document
 */
export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;

  // Remove existing theme classes
  root.classList.remove('light-theme', 'dark-theme', 'high-contrast-theme');

  // Add new theme class
  root.classList.add(`${theme}-theme`);

  // Set color scheme
  if (theme === 'dark') {
    root.style.colorScheme = 'dark';
  } else if (theme === 'light') {
    root.style.colorScheme = 'light';
  }
}

/**
 * Wait for element to be stable (no more layout shifts)
 */
export async function waitForElementStable(
  element: HTMLElement,
  timeout: number = 5000,
): Promise<void> {
  const startTime = Date.now();
  let lastRect = element.getBoundingClientRect();
  let stableCount = 0;
  const requiredStableChecks = 3;
  const checkInterval = 50;

  return new Promise((resolve, reject) => {
    const checkStability = () => {
      if (Date.now() - startTime > timeout) {
        reject(new Error('Element did not stabilize within timeout'));
        return;
      }

      const currentRect = element.getBoundingClientRect();

      // Check if position and size are stable
      const isStable =
        currentRect.x === lastRect.x &&
        currentRect.y === lastRect.y &&
        currentRect.width === lastRect.width &&
        currentRect.height === lastRect.height;

      if (isStable) {
        stableCount++;
        if (stableCount >= requiredStableChecks) {
          resolve();
          return;
        }
      } else {
        stableCount = 0;
        lastRect = currentRect;
      }

      setTimeout(checkStability, checkInterval);
    };

    checkStability();
  });
}

/**
 * Wait for all images in element to load
 */
export async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));

  const loadPromises = images.map((img) => {
    if (img.complete) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      img.addEventListener('load', () => resolve());
      img.addEventListener('error', () =>
        reject(new Error(`Failed to load image: ${img.src}`)),
      );
    });
  });

  await Promise.all(loadPromises);
}

/**
 * Wait for animations to complete
 */
export async function waitForAnimations(element: HTMLElement): Promise<void> {
  const animations = element.getAnimations({ subtree: true });

  if (animations.length === 0) {
    return Promise.resolve();
  }

  await Promise.all(
    animations.map((animation) => animation.finished.catch(() => {})),
  );
}

/**
 * Prepare element for screenshot by ensuring it's ready
 */
export async function prepareElementForScreenshot(
  element: HTMLElement,
  config: VisualRegressionConfig = {},
): Promise<void> {
  const timeout = config.timeout || DEFAULT_VISUAL_CONFIG.timeout;

  // Wait for images to load
  await waitForImages(element);

  // Wait for animations to complete
  await waitForAnimations(element);

  // Wait for element to be stable
  await waitForElementStable(element, timeout);

  // Small delay to ensure everything is rendered
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Compare two image data arrays pixel by pixel
 * Returns percentage of different pixels
 */
export function compareImageData(
  data1: Uint8ClampedArray,
  data2: Uint8ClampedArray,
  threshold: number = 0.01,
): ScreenshotComparisonResult {
  if (data1.length !== data2.length) {
    return {
      matches: false,
      diffPercentage: 100,
      diffPixelCount: data1.length / 4,
    };
  }

  let diffPixels = 0;
  const totalPixels = data1.length / 4; // Each pixel has 4 values (RGBA)

  for (let i = 0; i < data1.length; i += 4) {
    const r1 = data1[i];
    const g1 = data1[i + 1];
    const b1 = data1[i + 2];
    const a1 = data1[i + 3];

    const r2 = data2[i];
    const g2 = data2[i + 1];
    const b2 = data2[i + 2];
    const a2 = data2[i + 3];

    // Calculate color difference using Euclidean distance
    const colorDiff = Math.sqrt(
      Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2) +
        Math.pow(a1 - a2, 2),
    );

    // Threshold for considering pixels different (0-441 for RGBA)
    const pixelThreshold = 10;

    if (colorDiff > pixelThreshold) {
      diffPixels++;
    }
  }

  const diffPercentage = (diffPixels / totalPixels) * 100;
  const thresholdPercentage = threshold * 100;

  return {
    matches: diffPercentage <= thresholdPercentage,
    diffPercentage,
    diffPixelCount: diffPixels,
  };
}

/**
 * Create a diff image highlighting differences between two images
 */
export function createDiffImage(
  data1: Uint8ClampedArray,
  data2: Uint8ClampedArray,
  width: number,
  height: number,
): ImageData {
  const diffData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    const r1 = data1[i];
    const g1 = data1[i + 1];
    const b1 = data1[i + 2];
    const a1 = data1[i + 3];

    const r2 = data2[i];
    const g2 = data2[i + 1];
    const b2 = data2[i + 2];
    const a2 = data2[i + 3];

    const colorDiff = Math.sqrt(
      Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2) +
        Math.pow(a1 - a2, 2),
    );

    if (colorDiff > 10) {
      // Highlight differences in red
      diffData[i] = 255; // R
      diffData[i + 1] = 0; // G
      diffData[i + 2] = 0; // B
      diffData[i + 3] = 255; // A
    } else {
      // Keep original pixels but desaturate
      const gray = (r1 + g1 + b1) / 3;
      diffData[i] = gray;
      diffData[i + 1] = gray;
      diffData[i + 2] = gray;
      diffData[i + 3] = a1;
    }
  }

  return new ImageData(diffData, width, height);
}

/**
 * Capture screenshot of an element as ImageData
 */
export async function captureElementScreenshot(
  element: HTMLElement,
): Promise<ImageData> {
  const rect = element.getBoundingClientRect();
  const canvas = document.createElement('canvas');
  canvas.width = rect.width;
  canvas.height = rect.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Create temporary clone to avoid modifying original
  const clone = element.cloneNode(true) as HTMLElement;
  const computedStyle = window.getComputedStyle(element);

  // Copy computed styles
  clone.style.cssText = computedStyle.cssText;
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';

  document.body.appendChild(clone);

  // Draw element to canvas
  // Note: This is a simplified version. In production, use html2canvas or similar
  ctx.fillStyle = computedStyle.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Clean up
  document.body.removeChild(clone);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Generate visual test scenarios for comprehensive coverage
 */
export function generateVisualTestScenarios(
  componentSelector: string,
): VisualTestScenario[] {
  const themes: ThemeMode[] = ['light', 'dark'];
  const viewportTypes = [VIEWPORTS.mobile, VIEWPORTS.desktop];
  const scenarios: VisualTestScenario[] = [];

  themes.forEach((theme) => {
    viewportTypes.forEach((viewport) => {
      const deviceType = viewport.isMobile ? 'mobile' : 'desktop';

      scenarios.push({
        name: `calendar-${theme}-${deviceType}`,
        theme,
        viewport,
        selector: componentSelector,
      });
    });
  });

  return scenarios;
}

/**
 * Disable animations for consistent screenshots
 */
export function disableAnimations(): void {
  const style = document.createElement('style');
  style.id = 'visual-regression-disable-animations';
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Re-enable animations
 */
export function enableAnimations(): void {
  const style = document.getElementById('visual-regression-disable-animations');
  if (style) {
    style.remove();
  }
}

/**
 * Format visual regression test results for reporting
 */
export function formatVisualRegressionResults(
  results: Array<{
    scenario: VisualTestScenario;
    result: ScreenshotComparisonResult;
  }>,
): string {
  const passed = results.filter((r) => r.result.matches).length;
  const failed = results.length - passed;

  let report = `Visual Regression Test Results\n`;
  report += `================================\n`;
  report += `Total: ${results.length} | Passed: ${passed} | Failed: ${failed}\n\n`;

  if (failed > 0) {
    report += `Failed Tests:\n`;
    report += `-------------\n`;
    results
      .filter((r) => !r.result.matches)
      .forEach(({ scenario, result }) => {
        report += `- ${scenario.name}: ${result.diffPercentage.toFixed(2)}% difference\n`;
        if (result.diffImagePath) {
          report += `  Diff: ${result.diffImagePath}\n`;
        }
      });
  }

  return report;
}
