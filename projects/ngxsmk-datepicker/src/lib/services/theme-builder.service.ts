import { Injectable, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Theme builder service for generating CSS-in-JS styles and managing themes
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeBuilderService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private styleElement: HTMLStyleElement | null = null;
  private scopedStyleElements: Map<HTMLElement, HTMLStyleElement> = new Map();

  /**
   * Map theme color keys to actual CSS variable names
   */
  private mapColorKey(key: string): string {
    const colorMap: Record<string, string> = {
      primary: 'primary-color',
      primaryContrast: 'primary-contrast',
      rangeBackground: 'range-background',
      background: 'background',
      text: 'text-color',
      textSecondary: 'subtle-text-color',
      subtleText: 'subtle-text-color',
      border: 'border-color',
      borderColor: 'border-color',
      hover: 'hover-background',
      hoverBackground: 'hover-background',
      active: 'active',
      disabled: 'disabled',
      error: 'error',
      secondary: 'secondary',
      surface: 'surface',
    };
    return colorMap[key] || key;
  }

  /**
   * Map typography keys to actual CSS variable names
   */
  private mapTypographyKey(key: string): string {
    const typographyMap: Record<string, string> = {
      fontFamily: 'font-family',
      fontSize: 'font-size-base',
      fontSizeBase: 'font-size-base',
      fontSizeXs: 'font-size-xs',
      fontSizeSm: 'font-size-sm',
      fontSizeLg: 'font-size-lg',
      fontSizeXl: 'font-size-xl',
      fontWeight: 'font-weight',
      lineHeight: 'line-height',
    };
    return typographyMap[key] || key;
  }

  /**
   * Generate CSS variables from a theme object
   */
  generateTheme(theme: DatepickerTheme): string {
    const cssVars: string[] = [];

    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        if (value !== undefined) {
          const cssKey = this.mapColorKey(key);
          cssVars.push(`--datepicker-${cssKey}: ${value};`);
        }
      });
      // Bridge internal --ngxsmk-color-* from public --datepicker-* (Issue #222)
      if (theme.colors.primary) cssVars.push(`--ngxsmk-color-primary: ${theme.colors.primary};`);
      if (theme.colors.background) cssVars.push(`--ngxsmk-color-surface: ${theme.colors.background};`);
      if (theme.colors.border ?? theme.colors['borderColor'])
        cssVars.push(`--ngxsmk-color-border: ${theme.colors.border ?? theme.colors['borderColor']};`);
      if (theme.colors.hover ?? theme.colors['hoverBackground'])
        cssVars.push(`--ngxsmk-color-surface-hover: ${theme.colors.hover ?? theme.colors['hoverBackground']};`);
      if (theme.colors.text) cssVars.push(`--ngxsmk-color-text-main: ${theme.colors.text};`);
      if (theme.colors.textSecondary ?? theme.colors['subtleText'])
        cssVars.push(`--ngxsmk-color-text-muted: ${theme.colors.textSecondary ?? theme.colors['subtleText']};`);
      if (theme.colors['rangeBackground']) cssVars.push(`--ngxsmk-color-range-bg: ${theme.colors['rangeBackground']};`);
    }

    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        if (value !== undefined) {
          cssVars.push(`--datepicker-spacing-${key}: ${value};`);
        }
      });
    }

    if (theme.typography) {
      Object.entries(theme.typography).forEach(([key, value]) => {
        if (value !== undefined) {
          const cssKey = this.mapTypographyKey(key);
          cssVars.push(`--datepicker-${cssKey}: ${value};`);
        }
      });
    }

    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        if (value !== undefined) {
          cssVars.push(`--datepicker-radius-${key}: ${value};`);
        }
      });
    }

    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([key, value]) => {
        if (value !== undefined) {
          const varName = key === 'focus' ? 'shadow-focus' : `shadow-${key}`;
          cssVars.push(`--datepicker-${varName}: ${value};`);
        }
      });
    }

    return cssVars.join('\n');
  }

  /**
   * Apply theme to a specific element or globally
   * @param theme The theme to apply
   * @param targetElement Optional specific element to apply theme to. If not provided, applies globally.
   */
  applyTheme(theme: DatepickerTheme, targetElement?: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const themeCss = this.generateTheme(theme);
    const styles = this.generateStyleObject(theme);

    if (targetElement) {
      // Apply theme to specific element only using a scoped style element
      targetElement.dataset['themeApplied'] = 'true';

      // Remove existing scoped style if any
      const existingStyle = this.scopedStyleElements.get(targetElement);
      if (existingStyle) {
        existingStyle.remove();
        this.scopedStyleElements.delete(targetElement);
      }

      // Create a scoped style element for this specific element
      const scopedStyle = document.createElement('style');
      scopedStyle.dataset['datepickerThemeScoped'] = '';

      // Generate CSS targeting this specific element
      const elementId = targetElement.id || `datepicker-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      if (!targetElement.id) {
        targetElement.id = elementId;
      }

      // When target is a wrapper, also apply to descendant ngxsmk-datepicker so library defaults are overridden (Issue #222)
      const selector =
        targetElement.tagName === 'NGXSMK-DATEPICKER'
          ? `#${elementId}, ngxsmk-datepicker-content .ngxsmk-popover-container, ngxsmk-datepicker-content .ngxsmk-backdrop`
          : `#${elementId}, #${elementId} ngxsmk-datepicker, #${elementId} .ngxsmk-popover-container, #${elementId} .ngxsmk-backdrop, ngxsmk-datepicker-content .ngxsmk-popover-container, ngxsmk-datepicker-content .ngxsmk-backdrop`;
      const css = `${selector} {\n${themeCss}\n}`;
      scopedStyle.textContent = css;
      document.head.appendChild(scopedStyle);
      this.scopedStyleElements.set(targetElement, scopedStyle);

      // Apply inline styles for immediate effect using batch updates
      requestAnimationFrame(() => {
        // Apply to the target element itself
        Object.entries(styles).forEach(([property, value]) => {
          targetElement.style.setProperty(property, value, 'important');
        });

        // Apply to nested ngxsmk-datepicker elements when target is a wrapper
        const nestedDatepickers = targetElement.querySelectorAll('ngxsmk-datepicker');
        nestedDatepickers.forEach((el: Element) => {
          const htmlElement = el as HTMLElement;
          Object.entries(styles).forEach(([property, value]) => {
            htmlElement.style.setProperty(property, value, 'important');
          });
        });

        const portalledElements = document.querySelectorAll(
          'ngxsmk-datepicker-content .ngxsmk-popover-container, ngxsmk-datepicker-content .ngxsmk-backdrop'
        );
        portalledElements.forEach((element: Element) => {
          const htmlElement = element as HTMLElement;
          Object.entries(styles).forEach(([property, value]) => {
            htmlElement.style.setProperty(property, value, 'important');
          });
        });
      });
    } else {
      // Apply globally (original behavior) - optimized version
      if (!this.styleElement) {
        this.styleElement = document.createElement('style');
        this.styleElement.dataset['datepickerTheme'] = '';
        document.head.appendChild(this.styleElement);
      }

      // Optimized CSS - use more specific selector to override global :root variables
      // Also apply to body-portalled popovers and backdrops for mobile
      const css = `:root, :root > body, ngxsmk-datepicker-content .ngxsmk-popover-container, ngxsmk-datepicker-content .ngxsmk-backdrop {\n${themeCss}\n}`;
      this.styleElement.textContent = css;

      // Apply to elements more efficiently using requestAnimationFrame
      requestAnimationFrame(() => {
        this.applyToElements(theme);
      });
    }
  }

  /**
   * Apply theme variables directly to all datepicker elements (for global theme)
   * Optimized version with batch DOM operations
   */
  private applyToElements(theme: DatepickerTheme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const datepickerElements = document.querySelectorAll(
      'ngxsmk-datepicker, ngxsmk-datepicker-content .ngxsmk-popover-container, ngxsmk-datepicker-content .ngxsmk-backdrop'
    );
    const styles = this.generateStyleObject(theme);

    // Batch DOM operations for better performance
    datepickerElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      // Mark element as having theme applied for CSS selector specificity
      htmlElement.dataset['themeApplied'] = '';

      // Batch style property updates
      Object.entries(styles).forEach(([property, value]) => {
        htmlElement.style.setProperty(property, value, 'important');
      });
    });
  }

  /**
   * Generate CSS-in-JS style object (for styled-components, emotion, etc.)
   */
  generateStyleObject(theme: DatepickerTheme): Record<string, string> {
    const styles: Record<string, string> = {};

    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        if (value !== undefined) {
          const cssKey = this.mapColorKey(key);
          styles[`--datepicker-${cssKey}`] = value;
        }
      });
      if (theme.colors.primary) styles['--ngxsmk-color-primary'] = theme.colors.primary;
      if (theme.colors.background) styles['--ngxsmk-color-surface'] = theme.colors.background;
      if (theme.colors.border ?? theme.colors['borderColor'])
        styles['--ngxsmk-color-border'] = String(theme.colors.border ?? theme.colors['borderColor']);
      if (theme.colors.hover ?? theme.colors['hoverBackground'])
        styles['--ngxsmk-color-surface-hover'] = String(theme.colors.hover ?? theme.colors['hoverBackground']);
      if (theme.colors.text) styles['--ngxsmk-color-text-main'] = theme.colors.text;
      if (theme.colors.textSecondary ?? theme.colors['subtleText'])
        styles['--ngxsmk-color-text-muted'] = String(theme.colors.textSecondary ?? theme.colors['subtleText']);
      if (theme.colors['rangeBackground']) styles['--ngxsmk-color-range-bg'] = theme.colors['rangeBackground'];
    }

    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        if (value !== undefined) {
          styles[`--datepicker-spacing-${key}`] = value;
        }
      });
    }

    if (theme.typography) {
      Object.entries(theme.typography).forEach(([key, value]) => {
        if (value !== undefined) {
          const cssKey = this.mapTypographyKey(key);
          styles[`--datepicker-${cssKey}`] = value;
        }
      });
    }

    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        if (value !== undefined) {
          styles[`--datepicker-radius-${key}`] = value;
        }
      });
    }

    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([key, value]) => {
        if (value !== undefined) {
          const varName = key === 'focus' ? 'shadow-focus' : `shadow-${key}`;
          styles[`--datepicker-${varName}`] = value;
        }
      });
    }

    return styles;
  }

  /**
   * Remove applied theme
   * @param targetElement Optional specific element to remove theme from. If not provided, removes from all.
   */
  removeTheme(targetElement?: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (targetElement) {
      // Remove theme from specific element only
      delete targetElement.dataset['themeApplied'];

      // Remove scoped style element
      const scopedStyle = this.scopedStyleElements.get(targetElement);
      if (scopedStyle) {
        scopedStyle.remove();
        this.scopedStyleElements.delete(targetElement);
      }

      // Remove temporary ID if we added one
      if (targetElement.id && targetElement.id.startsWith('datepicker-')) {
        targetElement.removeAttribute('id');
      }

      // Remove all datepicker CSS variables from this element
      const allStyles = Array.from(targetElement.style);
      allStyles.forEach((prop) => {
        if (prop.startsWith('--datepicker-')) {
          targetElement.style.removeProperty(prop);
        }
      });
      // Clear from nested ngxsmk-datepicker elements
      const nestedDatepickers = targetElement.querySelectorAll('ngxsmk-datepicker');
      nestedDatepickers.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        const nestedStyles = Array.from(htmlEl.style);
        nestedStyles.forEach((prop) => {
          if (prop.startsWith('--datepicker-')) {
            htmlEl.style.removeProperty(prop);
          }
        });
      });
      // Also clear from any open body-portalled popovers
      const portalledElements = document.querySelectorAll(
        'ngxsmk-datepicker-content .ngxsmk-popover-container, ngxsmk-datepicker-content .ngxsmk-backdrop'
      );
      portalledElements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        const portalledStyles = Array.from(htmlElement.style);
        portalledStyles.forEach((prop) => {
          if (prop.startsWith('--datepicker-')) {
            htmlElement.style.removeProperty(prop);
          }
        });
      });
    } else {
      // Remove global theme (original behavior)
      // Remove the style element
      if (this.styleElement) {
        this.styleElement.remove();
        this.styleElement = null;
      }

      // Clear inline styles from all datepicker elements and body-portalled popovers
      const datepickerElements = document.querySelectorAll(
        'ngxsmk-datepicker, ngxsmk-datepicker-content .ngxsmk-popover-container, ngxsmk-datepicker-content .ngxsmk-backdrop'
      );
      datepickerElements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        // Remove theme attribute
        delete htmlElement.dataset['themeApplied'];

        // Remove all datepicker CSS variables
        const allStyles = Array.from(htmlElement.style);
        allStyles.forEach((prop) => {
          if (prop.startsWith('--datepicker-')) {
            htmlElement.style.removeProperty(prop);
          }
        });
      });
    }
  }

  /**
   * Get current theme from CSS variables
   */
  getCurrentTheme(selector: string = ':root'): Partial<DatepickerTheme> {
    if (!isPlatformBrowser(this.platformId)) {
      return {};
    }

    const element = selector === ':root' ? document.documentElement : document.querySelector(selector);
    if (!element) {
      return {};
    }

    const computedStyle = globalThis.getComputedStyle(element);
    const theme: Partial<DatepickerTheme> = {
      colors: {},
      spacing: {},
      typography: {},
      borderRadius: {},
      shadows: {},
    };

    // Extract CSS variables
    const allStyles = Array.from(computedStyle).filter((prop) => prop.startsWith('--datepicker-'));

    allStyles.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop).trim();
      const key = prop.replace('--datepicker-', '');

      if (key.startsWith('color-') || key.startsWith('bg-') || key.startsWith('border-')) {
        if (!theme.colors) theme.colors = {};
        theme.colors[key] = value;
      } else if (key.startsWith('spacing-')) {
        if (!theme.spacing) theme.spacing = {};
        theme.spacing[key.replace('spacing-', '')] = value;
      } else if (key.startsWith('font-')) {
        if (!theme.typography) theme.typography = {};
        theme.typography[key.replace('font-', '')] = value;
      } else if (key.startsWith('radius-')) {
        if (!theme.borderRadius) theme.borderRadius = {};
        theme.borderRadius[key.replace('radius-', '')] = value;
      } else if (key.startsWith('shadow-')) {
        if (!theme.shadows) theme.shadows = {};
        theme.shadows[key.replace('shadow-', '')] = value;
      } else if (key === 'focus-shadow') {
        if (!theme.shadows) theme.shadows = {};
        theme.shadows['focus'] = value;
      }
    });

    return theme;
  }

  /**
   * Clean up all themes and resources when service is destroyed
   */
  cleanupAllThemes(): void {
    // Remove global theme
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }

    // Remove all scoped themes
    this.scopedStyleElements.forEach((styleElement) => {
      styleElement.remove();
    });
    this.scopedStyleElements.clear();
  }

  ngOnDestroy(): void {
    this.cleanupAllThemes();
  }
}

/**
 * Datepicker theme interface
 */
export interface DatepickerTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    hover?: string;
    active?: string;
    disabled?: string;
    error?: string;
    [key: string]: string | undefined;
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    [key: string]: string | undefined;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    [key: string]: string | undefined;
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    full?: string;
    [key: string]: string | undefined;
  };
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
    /** Focus ring (e.g. input focus). Use a color-mix or rgba for 15% opacity. Example: 0 0 0 3px color-mix(in srgb, var(--datepicker-primary-color) 15%, transparent) */
    focus?: string;
    [key: string]: string | undefined;
  };
}
