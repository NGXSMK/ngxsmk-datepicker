import { Injectable, Renderer2, RendererFactory2, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AriaLiveService implements OnDestroy {
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer: Renderer2;
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private politeClearTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private assertiveClearTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private debounceTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private announcementQueue: Array<{ message: string; priority: 'polite' | 'assertive'; timestamp: number }> = [];
  private readonly DEBOUNCE_DELAY = 100;
  private readonly CLEAR_DELAY = 2000;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

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

    // Group by priority and keep only the most recent for each
    const latestPolite = this.announcementQueue
      .filter(a => a.priority === 'polite')
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    const latestAssertive = this.announcementQueue
      .filter(a => a.priority === 'assertive')
      .sort((a, b) => b.timestamp - a.timestamp)[0];

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

    // Use requestAnimationFrame to ensure DOM update is processed
    requestAnimationFrame(() => {
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
    });
  }

  /**
   * Create a live region for announcements
   */
  private createLiveRegion(priority: 'polite' | 'assertive'): void {
    if (!this.isBrowser) {
      return;
    }

    const region = this.renderer.createElement('div');
    this.renderer.setAttribute(region, 'aria-live', priority);
    this.renderer.setAttribute(region, 'aria-atomic', 'true');
    this.renderer.setAttribute(region, 'role', 'status');
    this.renderer.setStyle(region, 'position', 'absolute');
    this.renderer.setStyle(region, 'left', '-10000px');
    this.renderer.setStyle(region, 'width', '1px');
    this.renderer.setStyle(region, 'height', '1px');
    this.renderer.setStyle(region, 'overflow', 'hidden');
    this.renderer.setStyle(region, 'clip', 'rect(0, 0, 0, 0)');
    this.renderer.setStyle(region, 'clip-path', 'inset(50%)');
    this.renderer.setAttribute(region, 'class', `ngxsmk-aria-live-region ngxsmk-aria-live-${priority}`);
    this.renderer.appendChild(document.body, region);

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
      this.renderer.removeChild(document.body, this.politeRegion);
      this.politeRegion = null;
    }

    if (this.assertiveRegion && this.isBrowser) {
      this.renderer.removeChild(document.body, this.assertiveRegion);
      this.assertiveRegion = null;
    }

    this.announcementQueue = [];
  }

  destroy(): void {
    this.ngOnDestroy();
  }
}
