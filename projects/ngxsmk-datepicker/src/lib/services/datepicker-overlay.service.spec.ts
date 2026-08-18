import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DatepickerOverlayService } from './datepicker-overlay.service';

describe('DatepickerOverlayService', () => {
  let service: DatepickerOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatepickerOverlayService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(DatepickerOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate bottom placement when sufficient space below', () => {
    const anchorRect = {
      top: 100,
      bottom: 140,
      left: 100,
      right: 300,
      width: 200,
      height: 40,
    } as DOMRect;

    const popover = { width: 300, height: 350 };
    const pos = service.calculatePosition(anchorRect, popover);

    expect(pos.placement).toBe('bottom');
    expect(pos.top).toBeGreaterThanOrEqual(148);
    expect(pos.left).toBeGreaterThanOrEqual(100);
  });

  it('should calculate top placement when space below is insufficient', () => {
    const anchorRect = {
      top: 700,
      bottom: 740,
      left: 100,
      right: 300,
      width: 200,
      height: 40,
    } as DOMRect;

    const popover = { width: 300, height: 350 };
    const pos = service.calculatePosition(anchorRect, popover, { viewportHeight: 800 });

    expect(pos.placement).toBe('top');
    expect(pos.top).toBeLessThan(700);
  });

  it('should handle alignment options (right, center)', () => {
    const anchorRect = {
      top: 100,
      bottom: 140,
      left: 200,
      right: 400,
      width: 200,
      height: 40,
    } as DOMRect;

    const popover = { width: 300, height: 350 };

    const rightPos = service.calculatePosition(anchorRect, popover, { alignment: 'right' });
    expect(rightPos.left).toBe(100); // right (400) - popoverWidth (300) = 100

    const centerPos = service.calculatePosition(anchorRect, popover, { alignment: 'center' });
    expect(centerPos.left).toBe(150); // left (200) + (200 - 300)/2 = 150
  });

  it('should safely return default position in server environment', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [DatepickerOverlayService, { provide: PLATFORM_ID, useValue: 'server' }],
    });
    const serverService = TestBed.inject(DatepickerOverlayService);

    const pos = serverService.calculatePosition({} as DOMRect, { width: 300, height: 300 });
    expect(pos.placement).toBe('bottom');
    expect(pos.top).toBe(0);
    expect(pos.left).toBe(0);
  });
});
