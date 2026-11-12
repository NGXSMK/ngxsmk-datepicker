import { Injectable, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

interface FocusTrapState {
  element: HTMLElement;
  handleKeyDown: (event: KeyboardEvent) => void;
  previousActiveElement: HTMLElement | null;
}

@Injectable({
  providedIn: 'root',
})
export class FocusTrapService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private activeTraps = new Map<ElementRef<HTMLElement>, FocusTrapState>();
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  /**
   * Trap focus within an element and restore focus on cleanup
   */
  trapFocus(elementRef: ElementRef<HTMLElement>): () => void {
    if (!this.isBrowser || !elementRef?.nativeElement) {
      return () => {};
    }

    const element = elementRef.nativeElement;
    const previousActiveElement = this.document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      // Re-query focusables on each Tab so month navigation stays correct.
      const firstFocusable = this.getFirstFocusable(element);
      const lastFocusable = this.getLastFocusable(element);
      if (!firstFocusable || !lastFocusable) {
        return;
      }

      if (event.shiftKey) {
        if (this.document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else if (this.document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    this.activeTraps.set(elementRef, {
      element,
      handleKeyDown,
      previousActiveElement,
    });

    const firstFocusable = this.getFirstFocusable(element);
    if (firstFocusable) {
      requestAnimationFrame(() => {
        firstFocusable.focus();
      });
    }

    return () => {
      this.removeFocusTrap(elementRef);
    };
  }

  /**
   * Remove focus trap and restore previous focus
   */
  private removeFocusTrap(elementRef: ElementRef<HTMLElement>): void {
    const state = this.activeTraps.get(elementRef);
    if (!state) {
      return;
    }

    state.element.removeEventListener('keydown', state.handleKeyDown);

    if (this.isBrowser && state.previousActiveElement && this.document.body.contains(state.previousActiveElement)) {
      requestAnimationFrame(() => {
        try {
          state.previousActiveElement?.focus();
        } catch {
          // Element may not be focusable, ignore error
        }
      });
    }

    this.activeTraps.delete(elementRef);
  }

  private getFocusableElements(element: HTMLElement): HTMLElement[] {
    if (!this.isBrowser) return [];

    return Array.from(element.querySelectorAll(this.focusableSelectors) as NodeListOf<HTMLElement>).filter((el) => {
      const style = this.document.defaultView?.getComputedStyle(el);
      if (!style) return false;
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  private getFirstFocusable(element: HTMLElement): HTMLElement | null {
    return this.getFocusableElements(element)[0] || null;
  }

  private getLastFocusable(element: HTMLElement): HTMLElement | null {
    const focusableElements = this.getFocusableElements(element);
    return focusableElements[focusableElements.length - 1] || null;
  }

  ngOnDestroy(): void {
    for (const [elementRef] of this.activeTraps) {
      this.removeFocusTrap(elementRef);
    }
    this.activeTraps.clear();
  }
}
