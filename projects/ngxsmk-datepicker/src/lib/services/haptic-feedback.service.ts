import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HapticFeedbackService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly isSupported = this.isBrowser && 'vibrate' in navigator;

  /**
   * Trigger light haptic feedback (short vibration)
   */
  light(): void {
    if (!this.isSupported) return;
    try {
      // Very short single pulse for subtle interaction
      navigator.vibrate(5);
    } catch { }
  }

  selection(): void {
    if (!this.isSupported) return;
    try {
      // Tiny double pulse for selecting list items/scrolling "ticks"
      navigator.vibrate([1, 5, 1]);
    } catch { }
  }

  medium(): void {
    if (!this.isSupported) return;
    try {
      // Success-like double pulse
      navigator.vibrate([10, 5, 10]);
    } catch { }
  }

  heavy(): void {
    if (!this.isSupported) return;
    try {
      // Error-like or confirmation-like pattern
      navigator.vibrate([15, 30, 15]);
    } catch { }
  }

  /**
   * Trigger custom vibration pattern
   * @param pattern Vibration pattern in milliseconds
   */
  custom(pattern: number | number[]): void {
    if (!this.isSupported) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Silently fail if vibration is not supported
    }
  }
}

