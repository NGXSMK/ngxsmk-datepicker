import { TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

/**
 * Issue #71: window.matchMedia compatibility (jsdom/Vitest, SSR, or missing API).
 * These tests ensure the datepicker initializes without errors when matchMedia
 * is missing, throws, or returns null.
 */
describe('window.matchMedia Compatibility (Issue #71)', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();
  });

  afterEach(() => {
    if (originalMatchMedia !== undefined) {
      (window as unknown as Record<string, unknown>)['matchMedia'] =
        originalMatchMedia;
    } else {
      delete (window as unknown as Record<string, unknown>)['matchMedia'];
    }
  });

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  it('should initialize without errors when window.matchMedia is not available (jsdom/Vitest)', () => {
    delete (window as unknown as Record<string, unknown>)['matchMedia'];

    expect(() => {
      const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
      const testComponent = testFixture.componentInstance;
      testComponent.inline = true;
      testFixture.detectChanges();
    }).not.toThrow();
  });

  it('should initialize without errors when window.matchMedia throws an error', () => {
    (window as unknown as Record<string, unknown>)['matchMedia'] = (() => {
      throw new Error('matchMedia not supported');
    }) as unknown as typeof window.matchMedia;

    expect(() => {
      const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
      const testComponent = testFixture.componentInstance;
      testComponent.inline = true;
      testFixture.detectChanges();
    }).not.toThrow();
  });

  it('should initialize without errors when window.matchMedia returns null', () => {
    (window as unknown as Record<string, unknown>)['matchMedia'] = (() =>
      null) as unknown as typeof window.matchMedia;

    expect(() => {
      const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
      const testComponent = testFixture.componentInstance;
      testComponent.inline = true;
      testFixture.detectChanges();
    }).not.toThrow();
  });

  it('should apply animation config correctly when matchMedia is not available', () => {
    delete (window as unknown as Record<string, unknown>)['matchMedia'];

    const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    const testComponent = testFixture.componentInstance;
    testComponent.inline = true;

    expect(() => {
      testFixture.detectChanges();
      const element = testComponent['elementRef'].nativeElement;
      expect(element).toBeTruthy();
    }).not.toThrow();
  });

  it('should apply animation config correctly when matchMedia is available', () => {
    if (!window.matchMedia) {
      (window as unknown as Record<string, unknown>)['matchMedia'] = ((
        query: string,
      ) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }) as unknown as MediaQueryList) as unknown as typeof window.matchMedia;
    }

    const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    const testComponent = testFixture.componentInstance;
    testComponent.inline = true;

    expect(() => {
      testFixture.detectChanges();
      const element = testComponent['elementRef'].nativeElement;
      expect(element).toBeTruthy();
    }).not.toThrow();
  });

  it('should handle prefers-reduced-motion preference when matchMedia is available', () => {
    (window as unknown as Record<string, unknown>)['matchMedia'] = ((
      query: string,
    ) =>
      ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList) as unknown as typeof window.matchMedia;

    const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    const testComponent = testFixture.componentInstance;
    testComponent.inline = true;

    expect(() => {
      testFixture.detectChanges();
    }).not.toThrow();
  });

  it('should call ngOnInit without errors when matchMedia is unavailable', () => {
    delete (window as unknown as Record<string, unknown>)['matchMedia'];

    const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    const testComponent = testFixture.componentInstance;
    testComponent.inline = true;

    expect(() => {
      testComponent.ngOnInit();
      testFixture.detectChanges();
    }).not.toThrow();
  });

  it('should handle matchMedia returning null gracefully', () => {
    (window as unknown as Record<string, unknown>)['matchMedia'] = (() =>
      null) as unknown as typeof window.matchMedia;

    const testFixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    const testComponent = testFixture.componentInstance;
    testComponent.inline = true;

    expect(() => {
      testFixture.detectChanges();
      const isMobile = testComponent['isMobileDevice']();
      expect(typeof isMobile).toBe('boolean');
    }).not.toThrow();
  });
});
