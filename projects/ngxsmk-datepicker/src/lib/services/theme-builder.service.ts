import { Injectable, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Theme builder service for generating CSS-in-JS styles and managing themes
 */
@Injectable({
  providedIn: 'root'
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
          cssVars.push(`--datepicker-shadow-${key}: ${value};`);
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
      targetElement.setAttribute('data-theme-applied', '');
      
      // Remove existing scoped style if any
      const existingStyle = this.scopedStyleElements.get(targetElement);
      if (existingStyle) {
        existingStyle.remove();
        this.scopedStyleElements.delete(targetElement);
      }
      
      // Create a scoped style element for this specific element
      const scopedStyle = document.createElement('style');
      scopedStyle.setAttribute('data-datepicker-theme-scoped', '');
      
      // Generate CSS targeting this specific element
      const elementId = targetElement.id || `datepicker-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      if (!targetElement.id) {
        targetElement.id = elementId;
      }
      
      // Optimized CSS generation - avoid duplication
      const css = `#${elementId} {\n${themeCss}\n}`;
      scopedStyle.textContent = css;
      document.head.appendChild(scopedStyle);
      this.scopedStyleElements.set(targetElement, scopedStyle);
      
      // Apply inline styles for immediate effect using batch updates
      requestAnimationFrame(() => {
        Object.entries(styles).forEach(([property, value]) => {
          targetElement.style.setProperty(property, value);
        });
      });
    } else {
      // Apply globally (original behavior) - optimized version
      if (!this.styleElement) {
        this.styleElement = document.createElement('style');
        this.styleElement.setAttribute('data-datepicker-theme', '');
        document.head.appendChild(this.styleElement);
      }

      // Optimized CSS - avoid redundant selectors
      const css = `:root {\n${themeCss}\n}`;
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

    const datepickerElements = document.querySelectorAll('ngxsmk-datepicker');
    const styles = this.generateStyleObject(theme);
    
    // Batch DOM operations for better performance
    datepickerElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      // Mark element as having theme applied for CSS selector specificity
      htmlElement.setAttribute('data-theme-applied', '');
      
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
          styles[`--datepicker-shadow-${key}`] = value;
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
      targetElement.removeAttribute('data-theme-applied');
      
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
      allStyles.forEach(prop => {
        if (prop.startsWith('--datepicker-')) {
          targetElement.style.removeProperty(prop);
        }
      });
    } else {
      // Remove global theme (original behavior)
      // Remove the style element
      if (this.styleElement) {
        this.styleElement.remove();
        this.styleElement = null;
      }

      // Clear inline styles from all datepicker elements
      const datepickerElements = document.querySelectorAll('ngxsmk-datepicker');
      datepickerElements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        // Remove theme attribute
        htmlElement.removeAttribute('data-theme-applied');
        
        // Remove all datepicker CSS variables
        const allStyles = Array.from(htmlElement.style);
        allStyles.forEach(prop => {
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

    const computedStyle = window.getComputedStyle(element);
    const theme: Partial<DatepickerTheme> = {
      colors: {},
      spacing: {},
      typography: {},
      borderRadius: {},
      shadows: {},
    };

    // Extract CSS variables
    const allStyles = Array.from(computedStyle).filter(prop => prop.startsWith('--datepicker-'));
    
    allStyles.forEach(prop => {
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
    this.scopedStyleElements.forEach(styleElement => {
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
    [key: string]: string | undefined;
  };
}

