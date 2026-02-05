/**
 * Accessibility Testing Utilities
 *
 * This module provides utilities for automated accessibility testing using axe-core.
 * It helps detect ARIA violations, keyboard navigation issues, and other a11y problems.
 *
 * Note: axe-core is an optional dependency. Tests using these utilities should gracefully
 * skip if axe-core is not available.
 */

/**
 * Interface for axe accessibility check results
 */
export interface AccessibilityCheckResult {
  violations: Array<{
    id: string;
    impact: string;
    message: string;
    nodes: Array<{
      html: string;
      failureSummary?: string;
    }>;
  }>;
  passes: Array<{
    id: string;
    impact?: string;
    message: string;
    nodes: unknown[];
  }>;
  incomplete: Array<{
    id: string;
    message: string;
    nodes: unknown[];
  }>;
}

/**
 * Configuration for axe accessibility scans
 */
export interface AccessibilityScanConfig {
  /** CSS selector for the root element to scan */
  root?: string;
  /** Rules to run. Can be rule IDs to enable/disable */
  runOnly?: {
    type: 'rule' | 'tag';
    values: string[];
  };
  /** Rules to exclude from the scan */
  rules?: {
    [ruleId: string]: {
      enabled: boolean;
    };
  };
}

type AxeCore = {
  run?: (
    context: Element | Document | string,
    options: {
      runOnly?: AccessibilityScanConfig['runOnly'];
      rules?: AccessibilityScanConfig['rules'];
    },
    callback: (error: Error | null, results: AccessibilityCheckResult) => void,
  ) => void;
};

const getAxe = (): AxeCore | undefined =>
  (window as unknown as { axe?: AxeCore }).axe;

/**
 * Check if axe-core is available (imported from global)
 */
function isAxeAvailable(): boolean {
  return typeof getAxe() !== 'undefined';
}

/**
 * Run an accessibility scan on the document using axe-core
 *
 * @param config Optional scan configuration
 * @returns Promise resolving to accessibility check results
 *
 * @example
 * ```typescript
 * const results = await runAccessibilityScan({ runOnly: { type: 'rule', values: ['aria-required-attr'] } });
 * expect(results.violations.length).toBe(0);
 * ```
 */
export async function runAccessibilityScan(
  config?: AccessibilityScanConfig,
): Promise<AccessibilityCheckResult | null> {
  if (!isAxeAvailable()) {
    console.warn(
      'axe-core is not available. Accessibility testing skipped. ' +
        'Install axe-core to enable automated accessibility checks.',
    );
    return null;
  }

  return new Promise((resolve, reject) => {
    const axe = getAxe();
    if (!axe || !axe.run) {
      reject(new Error('axe-core axe.run method not found'));
      return;
    }

    axe.run(
      config?.root || document,
      config ? { runOnly: config.runOnly, rules: config.rules } : {},
      (error: Error | null, results: AccessibilityCheckResult) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      },
    );
  });
}

/**
 * Assert that there are no accessibility violations in a scan result
 *
 * @param results Accessibility check results from axe-core scan
 * @param severityLevel Minimum severity level to report (default: 'critical')
 *
 * @example
 * ```typescript
 * const results = await runAccessibilityScan();
 * if (results) {
 *   assertNoA11yViolations(results, 'serious');
 * }
 * ```
 */
export function assertNoA11yViolations(
  results: AccessibilityCheckResult,
  severityLevel: string = 'critical',
): void {
  const severityLevels = ['critical', 'serious', 'moderate', 'minor'];
  const severityIndex = severityLevels.indexOf(severityLevel);
  const filteredViolations = results.violations.filter(
    (v) => severityLevels.indexOf(v.impact) <= severityIndex,
  );

  if (filteredViolations.length > 0) {
    const message = filteredViolations
      .map(
        (v) =>
          `${v.id} (${v.impact}): ${v.message}\n` +
          v.nodes.map((n) => `  - ${n.html}`).join('\n'),
      )
      .join('\n\n');

    throw new Error(`Accessibility violations found:\n${message}`);
  }
}

/**
 * Get detailed information about accessibility violations
 *
 * @param results Accessibility check results
 * @returns Formatted string with violation details
 */
export function formatA11yViolations(
  results: AccessibilityCheckResult,
): string {
  if (results.violations.length === 0) {
    return 'No accessibility violations found.';
  }

  const lines: string[] = [
    `Found ${results.violations.length} accessibility violation(s):`,
    '',
  ];

  results.violations.forEach((violation) => {
    lines.push(`[${violation.impact.toUpperCase()}] ${violation.id}`);
    lines.push(`  ${violation.message}`);
    lines.push(`  Affected elements: ${violation.nodes.length}`);
    violation.nodes.slice(0, 2).forEach((node) => {
      lines.push(`    - ${node.html.substring(0, 80)}...`);
    });
    if (violation.nodes.length > 2) {
      lines.push(`    ... and ${violation.nodes.length - 2} more`);
    }
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Check for specific ARIA attributes on an element
 *
 * @param element Element to check
 * @param requiredAttributes Array of required ARIA attributes
 * @returns Object with attribute check results
 *
 * @example
 * ```typescript
 * const calendar = fixture.nativeElement.querySelector('.ngxsmk-calendar');
 * const attrs = checkAriaAttributes(calendar, ['role', 'aria-label']);
 * expect(attrs.role).toBeTruthy();
 * ```
 */
export function checkAriaAttributes(
  element: HTMLElement,
  requiredAttributes: string[],
): Record<string, string | null> {
  const results: Record<string, string | null> = {};
  requiredAttributes.forEach((attr) => {
    results[attr] = element.getAttribute(attr);
  });
  return results;
}

/**
 * Verify keyboard navigation support
 *
 * @param element Element to test
 * @returns boolean indicating if element responds to keyboard events
 */
export function supportsKeyboardNavigation(element: HTMLElement): boolean {
  return (
    element.tabIndex >= 0 ||
    ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName) ||
    element.getAttribute('role') === 'button'
  );
}

/**
 * Get all interactive elements within a container
 *
 * @param container Root element to search
 * @returns Array of interactive elements
 */
export function getInteractiveElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]',
  ];

  return Array.from(
    container.querySelectorAll(selectors.join(',')),
  ) as HTMLElement[];
}

/**
 * Test focus management
 *
 * @param element Element to focus
 * @returns boolean indicating if element can receive focus
 */
export function canFocus(element: HTMLElement): boolean {
  try {
    element.focus();
    return document.activeElement === element;
  } catch {
    return false;
  }
}
