import { Injectable, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AriaLiveService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;
  private politeClearTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private assertiveClearTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private debounceTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private announcementQueue: Array<{ message: string; priority: 'polite' | 'assertive'; timestamp: number }> = [];
  private readonly DEBOUNCE_DELAY = 100;
  private readonly CLEAR_DELAY = 2000;

  constructor() { }

  /**
   * Announce a message to screen readers with improved timing and queue management
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.isBrowser || !message || message.trim() === '') {
      return;
    }

    const timestamp = Date.now();
    this.announcementQueue.push({ message, priority, timestamp });

    // Debounce rapid announcements
    if (this.announcementQueue.length === 1) {
      // Clear any existing debounce timeout before setting a new one
      if (this.debounceTimeoutId !== null) {
        clearTimeout(this.debounceTimeoutId);
      }
      this.debounceTimeoutId = setTimeout(() => {
        this.debounceTimeoutId = null;
        this.processAnnouncementQueue();
      }, this.DEBOUNCE_DELAY);
    }
  }

  /**
   * Process queued announcements, keeping only the most recent for each priority
   */
  private processAnnouncementQueue(): void {
    if (this.announcementQueue.length === 0) {
      return;
    }

    // Filter by priority and take the last one pushed (the latest)
    // We don't use sort() because timestamps might be identical in the same tick
    const politeAnnouncements = this.announcementQueue.filter(a => a.priority === 'polite');
    const assertiveAnnouncements = this.announcementQueue.filter(a => a.priority === 'assertive');

    const latestPolite = politeAnnouncements[politeAnnouncements.length - 1];
    const latestAssertive = assertiveAnnouncements[assertiveAnnouncements.length - 1];

    this.announcementQueue = [];

    if (latestPolite) {
      this.announceToRegion(latestPolite.message, 'polite');
    }

    if (latestAssertive) {
      this.announceToRegion(latestAssertive.message, 'assertive');
    }
  }

  /**
   * Announce to a specific live region
   */
  private announceToRegion(message: string, priority: 'polite' | 'assertive'): void {
    const region = priority === 'polite' ? this.politeRegion : this.assertiveRegion;
    const clearTimeoutId = priority === 'polite' ? this.politeClearTimeoutId : this.assertiveClearTimeoutId;

    if (!region) {
      this.createLiveRegion(priority);
      const newRegion = priority === 'polite' ? this.politeRegion : this.assertiveRegion;
      if (newRegion) {
        this.setAnnouncement(newRegion, message, priority);
      }
      return;
    }

    // Clear existing timeout
    if (clearTimeoutId !== null) {
      clearTimeout(clearTimeoutId);
      if (priority === 'polite') {
        this.politeClearTimeoutId = null;
      } else {
        this.assertiveClearTimeoutId = null;
      }
    }

    this.setAnnouncement(region, message, priority);
  }

  /**
   * Set announcement text and schedule cleanup
   */
  private setAnnouncement(region: HTMLElement, message: string, priority: 'polite' | 'assertive'): void {
    // Clear and set new content to ensure screen readers detect the change
    region.textContent = '';

    // Use setTimeout to ensure the clear-then-set pattern is detected by screen readers.
    // A small delay (16ms ~ 1 frame) is used to ensure the DOM update of clearing is processed.
    setTimeout(() => {
      if (!region) return;
      region.textContent = message;

      const timeoutId = setTimeout(() => {
        if (region) {
          region.textContent = '';
        }
        if (priority === 'polite') {
          this.politeClearTimeoutId = null;
        } else {
          this.assertiveClearTimeoutId = null;
        }
      }, this.CLEAR_DELAY);

      if (priority === 'polite') {
        this.politeClearTimeoutId = timeoutId;
      } else {
        this.assertiveClearTimeoutId = timeoutId;
      }
    }, 16);
  }

  /**
   * Create a live region for announcements
   */
  private createLiveRegion(priority: 'polite' | 'assertive'): void {
    if (!this.isBrowser) {
      return;
    }

    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    region.setAttribute('class', `ngxsmk-aria-live-region ngxsmk-aria-live-${priority}`);

    // Apply styles to hide the region while keeping it accessible
    Object.assign(region.style, {
      position: 'absolute',
      left: '-10000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      clipPath: 'inset(50%)'
    });

    document.body.appendChild(region);

    if (priority === 'polite') {
      this.politeRegion = region;
    } else {
      this.assertiveRegion = region;
    }
  }

  ngOnDestroy(): void {
    if (this.politeClearTimeoutId !== null) {
      clearTimeout(this.politeClearTimeoutId);
      this.politeClearTimeoutId = null;
    }

    if (this.assertiveClearTimeoutId !== null) {
      clearTimeout(this.assertiveClearTimeoutId);
      this.assertiveClearTimeoutId = null;
    }

    if (this.debounceTimeoutId !== null) {
      clearTimeout(this.debounceTimeoutId);
      this.debounceTimeoutId = null;
    }

    if (this.politeRegion && this.isBrowser) {
      this.politeRegion.remove();
      this.politeRegion = null;
    }

    if (this.assertiveRegion && this.isBrowser) {
      this.assertiveRegion.remove();
      this.assertiveRegion = null;
    }

    this.announcementQueue = [];
  }

  destroy(): void {
    this.ngOnDestroy();
  }
}
