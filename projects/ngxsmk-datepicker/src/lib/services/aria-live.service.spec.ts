import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AriaLiveService } from './aria-live.service';
import { PLATFORM_ID } from '@angular/core';

describe('AriaLiveService', () => {
  let service: AriaLiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AriaLiveService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AriaLiveService);
  });

  afterEach(() => {
    service.ngOnDestroy();
    // Clean up any remaining regions in the body
    document.querySelectorAll('.ngxsmk-aria-live-region').forEach(el => el.remove());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should announce a polite message', fakeAsync(() => {
    service.announce('Hello world', 'polite');
    tick(100); // Wait for debounce
    tick(16);  // Wait for setAnnouncement delay

    const region = document.querySelector('.ngxsmk-aria-live-polite') as HTMLElement;
    expect(region).toBeTruthy();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('Hello world');
  }));

  it('should announce an assertive message', fakeAsync(() => {
    service.announce('Alert!', 'assertive');
    tick(100); // Wait for debounce
    tick(16);  // Wait for setAnnouncement delay

    const region = document.querySelector('.ngxsmk-aria-live-assertive') as HTMLElement;
    expect(region).toBeTruthy();
    expect(region.getAttribute('aria-live')).toBe('assertive');
    expect(region.textContent).toBe('Alert!');
  }));

  it('should debounce rapid announcements', fakeAsync(() => {
    service.announce('Message 1');
    service.announce('Message 2');
    service.announce('Message 3');

    tick(50); // Less than debounce delay
    let region = document.querySelector('.ngxsmk-aria-live-polite');
    expect(region).toBeFalsy(); // Should not have been created yet

    tick(100); // Wait for debounce
    tick(16);  // Wait for setAnnouncement delay
    region = document.querySelector('.ngxsmk-aria-live-polite');
    expect(region?.textContent).toBe('Message 3');
  }));

  it('should clear announcement after delay', fakeAsync(() => {
    service.announce('Temporary message');
    tick(100); // Wait for debounce
    tick(16);  // Wait for setAnnouncement delay

    const region = document.querySelector('.ngxsmk-aria-live-polite') as HTMLElement;
    expect(region.textContent).toBe('Temporary message');

    tick(2000); // Wait for CLEAR_DELAY
    expect(region.textContent).toBe('');
  }));

  it('should manage queue correctly with mixed priorities', fakeAsync(() => {
    service.announce('Polite 1', 'polite');
    service.announce('Assertive 1', 'assertive');
    service.announce('Polite 2', 'polite');

    tick(100); // Wait for debounce
    tick(16);  // Wait for setAnnouncement delay

    const politeRegion = document.querySelector('.ngxsmk-aria-live-polite');
    const assertiveRegion = document.querySelector('.ngxsmk-aria-live-assertive');

    expect(politeRegion?.textContent).toBe('Polite 2');
    expect(assertiveRegion?.textContent).toBe('Assertive 1');
  }));

  it('should check for empty/missing messages', fakeAsync(() => {
    service.announce('');
    service.announce('   ');

    tick(200);
    const region = document.querySelector('.ngxsmk-aria-live-region');
    expect(region).toBeFalsy();
  }));

  it('should not do anything if not in browser', () => {
    // Reset TestBed to simulate server environment
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AriaLiveService,
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    const serverService = TestBed.inject(AriaLiveService);

    serverService.announce('Test');
    const region = document.querySelector('.ngxsmk-aria-live-region');
    expect(region).toBeFalsy();
  });

  it('should clean up regions on destroy', fakeAsync(() => {
    service.announce('Cleanup test');
    tick(120); // Wait for debounce + delay

    expect(document.querySelector('.ngxsmk-aria-live-polite')).toBeTruthy();

    service.ngOnDestroy();
    expect(document.querySelector('.ngxsmk-aria-live-polite')).toBeFalsy();
  }));
});
