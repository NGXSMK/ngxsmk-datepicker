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
      navigator.vibrate(10);
    } catch {
      // Silently fail if vibration is not supported
    }
  }

  /**
   * Trigger medium haptic feedback (medium vibration)
   */
  medium(): void {
    if (!this.isSupported) return;
    try {
      navigator.vibrate(20);
    } catch {
      // Silently fail if vibration is not supported
    }
  }

  /**
   * Trigger heavy haptic feedback (longer vibration)
   */
  heavy(): void {
    if (!this.isSupported) return;
    try {
      navigator.vibrate([30, 10, 30]);
    } catch {
      // Silently fail if vibration is not supported
    }
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

