import { Injectable, isDevMode } from '@angular/core';

export interface PopoverPositioningOptions {
  isInlineMode: boolean;
  shouldAppendToBody: boolean;
  /** When true, on mobile/tablet the popover is not positioned relative to input; CSS centers it. */
  centerOnMobile?: boolean;
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
    const isDesktop = window.innerWidth >= desktopBreakpoint;
    if (isDesktop && !options.shouldAppendToBody) {
      this.clearPositionStyles(popover, false);
      return;
    }

    if (!isDesktop && options.centerOnMobile) {
      this.clearPositionStyles(popover, true);
      return;
    }

    try {
      this.applyPosition(popover, inputGroup, options);
    } catch (error) {
      if (isDevMode()) {
        console.warn('[ngxsmk-datepicker] Error positioning popover:', error);
      }
    }
  }

  private clearPositionStyles(popover: HTMLElement, includePositionRight: boolean): void {
    popover.style.removeProperty('top');
    popover.style.removeProperty('left');
    popover.style.removeProperty('bottom');
    popover.style.removeProperty('transform');
    popover.style.removeProperty('width');
    popover.style.removeProperty('min-width');
    popover.style.removeProperty('max-width');
    if (includePositionRight) {
      popover.style.removeProperty('position');
      popover.style.removeProperty('right');
    }
  }

  private applyPosition(
    popover: HTMLElement,
    inputGroup: HTMLElement,
    options: PopoverPositioningOptions,
  ): void {
    const narrowViewport = options.narrowViewport ?? 500;
    const minHeight = options.minHeight ?? 400;
    const minWidth = options.minWidth ?? 280;
    const gap = options.gap ?? 8;

    const inputRect = inputGroup.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    const spaceRight = viewportWidth - inputRect.left;

    const resolvedMinHeight = popoverRect.height || minHeight;
    const resolvedMinWidth = popoverRect.width || minWidth;
    const fitsHorizontal = spaceRight >= resolvedMinWidth || viewportWidth < narrowViewport;

    const useViewportCoords = options.shouldAppendToBody;
    const setStyle = this.createStyleSetter(popover, useViewportCoords);
    const popoverWidth = Math.max(minWidth, Math.round(inputRect.width));

    if (spaceBelow >= resolvedMinHeight && fitsHorizontal) {
      const top = useViewportCoords ? inputRect.bottom + gap : inputRect.bottom + window.scrollY + gap;
      const left = useViewportCoords ? inputRect.left : inputRect.left + window.scrollX;
      this.setPlacement(setStyle, useViewportCoords, top, left);
      this.setPopoverWidth(setStyle, popoverWidth);
      return;
    }
    if (spaceAbove >= resolvedMinHeight && fitsHorizontal) {
      const top = useViewportCoords
        ? inputRect.top - popoverRect.height - gap
        : inputRect.top + window.scrollY - popoverRect.height - gap;
      const left = useViewportCoords ? inputRect.left : inputRect.left + window.scrollX;
      this.setPlacement(setStyle, useViewportCoords, top, left);
      this.setPopoverWidth(setStyle, popoverWidth);
      return;
    }
    // When appended to body we must always set position so CSS (e.g. left: 0 !important) does not win
    if (useViewportCoords) {
      const top = inputRect.bottom + gap;
      const left = inputRect.left;
      this.setPlacement(setStyle, true, top, left);
      this.setPopoverWidth(setStyle, popoverWidth);
      return;
    }
    this.clearPositionStyles(popover, false);
  }

  private setPopoverWidth(
    setStyle: (key: string, value: string) => void,
    widthPx: number,
  ): void {
    const w = `${widthPx}px`;
    setStyle('width', w);
    setStyle('min-width', w);
    setStyle('max-width', w);
  }

  private createStyleSetter(
    popover: HTMLElement,
    useViewportCoords: boolean,
  ): (key: string, value: string) => void {
    if (useViewportCoords) {
      return (key: string, value: string) =>
        popover.style.setProperty(key, value, 'important');
    }
    return (key: string, value: string) => {
      (popover.style as unknown as Record<string, string>)[key] = value;
    };
  }

  private setPlacement(
    setStyle: (key: string, value: string) => void,
    useViewportCoords: boolean,
    top: number,
    left: number,
  ): void {
    const position = useViewportCoords ? 'fixed' : 'absolute';
    setStyle('position', position);
    setStyle('top', `${top}px`);
    setStyle('left', `${left}px`);
    setStyle('transform', 'none');
    setStyle('right', 'auto');
    setStyle('bottom', 'auto');
  }
}
