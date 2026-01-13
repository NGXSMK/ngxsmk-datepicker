import { TestBed } from '@angular/core/testing';
import { HapticFeedbackService } from './haptic-feedback.service';
import { PLATFORM_ID } from '@angular/core';

describe('HapticFeedbackService', () => {
  let service: HapticFeedbackService;
  let originalVibrate: typeof navigator.vibrate | undefined;

  beforeEach(() => {
    // Store original vibrate function
    originalVibrate = navigator.vibrate;

    TestBed.configureTestingModule({
      providers: [
        HapticFeedbackService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(HapticFeedbackService);
  });

  afterEach(() => {
    // Restore original vibrate function
    if (originalVibrate) {
      (navigator as unknown as Record<string, unknown>)['vibrate'] = originalVibrate;
    } else {
      delete (navigator as unknown as Record<string, unknown>)['vibrate'];
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('light', () => {
    it('should trigger light vibration when supported', () => {
      const vibrateSpy = jasmine.createSpy('vibrate');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      service.light();

      expect(vibrateSpy).toHaveBeenCalledWith(10);
    });

    it('should not throw when vibration is not supported', () => {
      delete (navigator as unknown as Record<string, unknown>)['vibrate'];

      expect(() => service.light()).not.toThrow();
    });

    it('should handle vibration errors gracefully', () => {
      const vibrateSpy = jasmine.createSpy('vibrate').and.throwError('Vibration not allowed');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      expect(() => service.light()).not.toThrow();
    });
  });

  describe('medium', () => {
    it('should trigger medium vibration when supported', () => {
      const vibrateSpy = jasmine.createSpy('vibrate');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      service.medium();

      expect(vibrateSpy).toHaveBeenCalledWith(20);
    });

    it('should not throw when vibration is not supported', () => {
      delete (navigator as unknown as Record<string, unknown>)['vibrate'];

      expect(() => service.medium()).not.toThrow();
    });

    it('should handle vibration errors gracefully', () => {
      const vibrateSpy = jasmine.createSpy('vibrate').and.throwError('Vibration not allowed');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      expect(() => service.medium()).not.toThrow();
    });
  });

  describe('heavy', () => {
    it('should trigger heavy vibration pattern when supported', () => {
      const vibrateSpy = jasmine.createSpy('vibrate');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      service.heavy();

      expect(vibrateSpy).toHaveBeenCalledWith([30, 10, 30]);
    });

    it('should not throw when vibration is not supported', () => {
      delete (navigator as unknown as Record<string, unknown>)['vibrate'];

      expect(() => service.heavy()).not.toThrow();
    });

    it('should handle vibration errors gracefully', () => {
      const vibrateSpy = jasmine.createSpy('vibrate').and.throwError('Vibration not allowed');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      expect(() => service.heavy()).not.toThrow();
    });
  });

  describe('custom', () => {
    it('should trigger custom vibration pattern when supported', () => {
      const vibrateSpy = jasmine.createSpy('vibrate');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;
      const pattern = [50, 20, 50, 20, 50];

      service.custom(pattern);

      expect(vibrateSpy).toHaveBeenCalledWith(pattern);
    });

    it('should handle single number pattern', () => {
      const vibrateSpy = jasmine.createSpy('vibrate');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      service.custom(100);

      expect(vibrateSpy).toHaveBeenCalledWith(100);
    });

    it('should not throw when vibration is not supported', () => {
      delete (navigator as unknown as Record<string, unknown>)['vibrate'];

      expect(() => service.custom([50, 20, 50])).not.toThrow();
    });

    it('should handle vibration errors gracefully', () => {
      const vibrateSpy = jasmine.createSpy('vibrate').and.throwError('Vibration not allowed');
      (navigator as unknown as Record<string, unknown>)['vibrate'] = vibrateSpy;

      expect(() => service.custom([50, 20, 50])).not.toThrow();
    });
  });

  describe('SSR compatibility', () => {
    it('should not access navigator on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          HapticFeedbackService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });

      const serverService = TestBed.inject(HapticFeedbackService);

      expect(() => {
        serverService.light();
        serverService.medium();
        serverService.heavy();
        serverService.custom([50]);
      }).not.toThrow();
    });
  });
});

