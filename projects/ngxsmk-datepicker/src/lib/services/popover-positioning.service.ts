import { Injectable, isDevMode } from '@angular/core';

export interface PopoverPositioningOptions {
  isInlineMode: boolean;
  shouldAppendToBody: boolean;
  minHeight?: number;
  minWidth?: number;
  gap?: number;
  desktopBreakpoint?: number;
  narrowViewport?: number;
}

@Injectable()
export class PopoverPositioningService {
  /**
   * Positions the popover relative to the input element dynamically.
   * - Prioritizes layout below the input.
   * - Falls back to positioning above if required.
   * - Defaults to CSS-centered positioning if space is insufficient.
   *
   * @remarks
   * This logic primarily targets mobile/tablet viewports; desktop layout (≥1024px)
   * is handled via CSS absolute positioning.
   */
  positionRelativeToInput(
    popover: HTMLElement | null,
    inputGroup: HTMLElement | null,
    options: PopoverPositioningOptions,
  ): void {
    if (!popover || !inputGroup || options.isInlineMode) {
      return;
    }

    const desktopBreakpoint = options.desktopBreakpoint ?? 1024;
    const narrowViewport = options.narrowViewport ?? 500;
    const minHeight = options.minHeight ?? 400;
    const minWidth = options.minWidth ?? 280;
    const gap = options.gap ?? 8;

    // Delegate positioning to CSS for desktop layouts (≥1024px) UNLESS appendToBody is requested.
    const isDesktop = window.innerWidth >= desktopBreakpoint;
    if (isDesktop && !options.shouldAppendToBody) {
      popover.style.top = '';
      popover.style.left = '';
      popover.style.transform = '';
      return;
    }

    try {
      const inputRect = inputGroup.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      const spaceRight = viewportWidth - inputRect.left;

      const resolvedMinHeight = popoverRect.height || minHeight;
      const resolvedMinWidth = popoverRect.width || minWidth;

      if (
        spaceBelow >= resolvedMinHeight &&
        (spaceRight >= resolvedMinWidth || viewportWidth < narrowViewport)
      ) {
        const top = inputRect.bottom + window.scrollY + gap;
        const left = inputRect.left + window.scrollX;

        popover.style.position = 'absolute';
        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
        popover.style.transform = 'none';
        popover.style.right = 'auto';
        popover.style.bottom = 'auto';
      } else if (
        spaceAbove >= resolvedMinHeight &&
        (spaceRight >= resolvedMinWidth || viewportWidth < narrowViewport)
      ) {
        const top = inputRect.top + window.scrollY - popoverRect.height - gap;
        const left = inputRect.left + window.scrollX;

        popover.style.position = 'absolute';
        popover.style.top = `${top}px`;
        popover.style.bottom = 'auto';
        popover.style.left = `${left}px`;
        popover.style.transform = 'none';
        popover.style.right = 'auto';
      } else {
        popover.style.top = '';
        popover.style.left = '';
        popover.style.bottom = '';
        popover.style.transform = '';
      }
    } catch (error) {
      if (isDevMode()) {
        console.warn('[ngxsmk-datepicker] Error positioning popover:', error);
      }
    }
  }
}
