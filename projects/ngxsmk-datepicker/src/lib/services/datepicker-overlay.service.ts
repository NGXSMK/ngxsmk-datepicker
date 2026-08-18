import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface OverlayPositionOptions {
  alignment?: 'left' | 'right' | 'center';
  offset?: number;
  flipOnCollision?: boolean;
  minWidth?: number;
  viewportWidth?: number;
  viewportHeight?: number;
}

export interface CalculatedOverlayPosition {
  top: number;
  left: number;
  placement: 'bottom' | 'top';
  width?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DatepickerOverlayService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Calculates the best position for an overlay popover relative to a trigger anchor.
   * Handles viewport collision detection and automatic top/bottom flip.
   */
  calculatePosition(
    anchor: HTMLElement | DOMRect,
    popover: HTMLElement | { width: number; height: number },
    options: OverlayPositionOptions = {}
  ): CalculatedOverlayPosition {
    if (!this.isBrowser) {
      return { top: 0, left: 0, placement: 'bottom' };
    }

    const { alignment = 'left', offset = 8, flipOnCollision = true, minWidth = 320 } = options;

    const anchorRect = anchor instanceof HTMLElement ? anchor.getBoundingClientRect() : anchor;
    const popoverWidth = popover instanceof HTMLElement ? popover.offsetWidth || minWidth : popover.width || minWidth;
    const popoverHeight = popover instanceof HTMLElement ? popover.offsetHeight || 380 : popover.height || 380;

    const viewportWidth = options.viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1024);
    const viewportHeight = options.viewportHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 768);
    const scrollX = typeof window !== 'undefined' ? window.scrollX || window.pageXOffset || 0 : 0;
    const scrollY = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0;

    const spaceBelow = viewportHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;

    let placement: 'bottom' | 'top' = 'bottom';
    let top = anchorRect.bottom + scrollY + offset;

    if (flipOnCollision && spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
      placement = 'top';
      top = anchorRect.top + scrollY - popoverHeight - offset;
    }

    let left = anchorRect.left + scrollX;
    if (alignment === 'right') {
      left = anchorRect.right + scrollX - popoverWidth;
    } else if (alignment === 'center') {
      left = anchorRect.left + scrollX + (anchorRect.width - popoverWidth) / 2;
    }

    // Clamp horizontally within viewport if viewport is wide enough
    if (viewportWidth >= popoverWidth + 16) {
      if (left + popoverWidth > viewportWidth + scrollX - 8) {
        left = viewportWidth + scrollX - popoverWidth - 8;
      }
      if (left < scrollX + 8) {
        left = scrollX + 8;
      }
    }

    return {
      top: Math.round(top),
      left: Math.round(left),
      placement,
      width: Math.max(minWidth, Math.round(anchorRect.width)),
    };
  }

  /**
   * Applies calculated position styles to a target popover element.
   */
  applyPosition(popover: HTMLElement, position: CalculatedOverlayPosition, appendToBody = false): void {
    if (!popover || !this.isBrowser) return;

    if (appendToBody) {
      popover.style.position = 'fixed';
      popover.style.top = `${position.top - (window.scrollY || 0)}px`;
      popover.style.left = `${position.left - (window.scrollX || 0)}px`;
      popover.style.zIndex = '9999';
    } else {
      popover.style.top = `${position.top}px`;
      popover.style.left = `${position.left}px`;
    }
  }
}
