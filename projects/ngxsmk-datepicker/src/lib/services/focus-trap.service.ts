import { Injectable, ElementRef, OnDestroy } from '@angular/core';

interface FocusTrapState {
  element: HTMLElement;
  handleKeyDown: (event: KeyboardEvent) => void;
  previousActiveElement: HTMLElement | null;
}

@Injectable()
export class FocusTrapService implements OnDestroy {
  private activeTraps = new Map<ElementRef<HTMLElement>, FocusTrapState>();
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  /**
   * Trap focus within an element and restore focus on cleanup
   */
  trapFocus(elementRef: ElementRef<HTMLElement>): () => void {
    if (!elementRef?.nativeElement) {
      return () => {};
    }

    const element = elementRef.nativeElement;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const firstFocusable = this.getFirstFocusable(element);
    const lastFocusable = this.getLastFocusable(element);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      // Handle Tab key navigation
      if (event.shiftKey) {
        // Shift+Tab: move backwards
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          if (lastFocusable) {
            lastFocusable.focus();
          }
        }
      } else {
        // Tab: move forwards
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Store state for cleanup
    this.activeTraps.set(elementRef, {
      element,
      handleKeyDown,
      previousActiveElement
    });

    // Focus first focusable element after a short delay to ensure DOM is ready
    if (firstFocusable) {
      // Use requestAnimationFrame to ensure focus happens after render
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
    
    // Restore focus to previous element if it still exists in the DOM
    if (state.previousActiveElement && document.body.contains(state.previousActiveElement)) {
      // Use requestAnimationFrame to ensure focus restoration happens after trap removal
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

  private getFirstFocusable(element: HTMLElement): HTMLElement | null {
    const focusableElements = Array.from(
      element.querySelectorAll(this.focusableSelectors)
    ) as HTMLElement[];

    return focusableElements.find(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }) || null;
  }

  private getLastFocusable(element: HTMLElement): HTMLElement | null {
    const focusableElements = Array.from(
      element.querySelectorAll(this.focusableSelectors)
    ) as HTMLElement[];

    return focusableElements
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .pop() || null;
  }

  ngOnDestroy(): void {
    // Clean up all active traps
    for (const [elementRef] of this.activeTraps) {
      this.removeFocusTrap(elementRef);
    }
    this.activeTraps.clear();
  }
}

