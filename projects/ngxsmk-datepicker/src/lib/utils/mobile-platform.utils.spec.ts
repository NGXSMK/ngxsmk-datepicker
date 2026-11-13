import {
  hasTouchPoints,
  isAndroid,
  isBrowserGlobal,
  isCoarsePointer,
  isHoverNone,
  isIOSFamily,
  isMobileLikeDevice,
  matchMediaSafe,
} from './mobile-platform.utils';

describe('mobile-platform.utils', () => {
  let matchMediaSpy: jasmine.Spy;
  let originalUserAgent: string;
  let originalPlatform: string;
  let originalMaxTouchPoints: number;

  beforeEach(() => {
    originalUserAgent = navigator.userAgent;
    originalPlatform = (navigator as Navigator & { platform?: string }).platform || '';
    originalMaxTouchPoints = navigator.maxTouchPoints;
    matchMediaSpy = spyOn(globalThis, 'matchMedia').and.callFake((query: string) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList;
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', { configurable: true, get: () => originalUserAgent });
    Object.defineProperty(navigator, 'platform', { configurable: true, get: () => originalPlatform });
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, get: () => originalMaxTouchPoints });
  });

  function setUa(ua: string, platform = '', maxTouchPoints = 0): void {
    Object.defineProperty(navigator, 'userAgent', { configurable: true, get: () => ua });
    Object.defineProperty(navigator, 'platform', { configurable: true, get: () => platform });
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, get: () => maxTouchPoints });
  }

  function setMatch(queryIncludes: string | string[], matches: boolean): void {
    const needles = Array.isArray(queryIncludes) ? queryIncludes : [queryIncludes];
    matchMediaSpy.and.callFake((query: string) => {
      const hit = needles.some((n) => query.includes(n));
      return {
        matches: hit ? matches : false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList;
    });
  }

  it('isBrowserGlobal is true in Karma', () => {
    expect(isBrowserGlobal()).toBe(true);
  });

  it('matchMediaSafe returns false when matchMedia throws', () => {
    matchMediaSpy.and.throwError('unsupported');
    expect(matchMediaSafe('(max-width: 1px)')).toBe(false);
  });

  it('matchMediaSafe returns matchMedia result', () => {
    setMatch('max-width', true);
    expect(matchMediaSafe('(max-width: 1024px)')).toBe(true);
    setMatch('max-width', false);
    expect(matchMediaSafe('(max-width: 1024px)')).toBe(false);
  });

  it('isCoarsePointer / isHoverNone follow media queries', () => {
    setMatch('pointer: coarse', true);
    expect(isCoarsePointer()).toBe(true);
    setMatch('hover: none', true);
    expect(isHoverNone()).toBe(true);
  });

  it('hasTouchPoints is true when maxTouchPoints > 0', () => {
    setUa('Mozilla/5.0', 'Win32', 5);
    expect(hasTouchPoints()).toBe(true);
  });

  it('isIOSFamily detects iPhone UA and iPadOS desktop UA', () => {
    setUa('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'iPhone', 5);
    expect(isIOSFamily()).toBe(true);

    setUa('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 5);
    expect(isIOSFamily()).toBe(true);

    setUa('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32', 0);
    expect(isIOSFamily()).toBe(false);
  });

  it('isAndroid detects Android UA', () => {
    setUa('Mozilla/5.0 (Linux; Android 14)', 'Linux armv8l', 5);
    expect(isAndroid()).toBe(true);
    setUa('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32', 0);
    expect(isAndroid()).toBe(false);
  });

  it('isMobileLikeDevice is true for narrow + coarse pointer', () => {
    setUa('Mozilla/5.0', 'Win32', 0);
    matchMediaSpy.and.callFake((query: string) => {
      const matches = query.includes('max-width') || query.includes('pointer: coarse');
      return {
        matches,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList;
    });
    expect(isMobileLikeDevice({ maxWidthPx: 1024 })).toBe(true);
  });

  it('isMobileLikeDevice is true for iOS tablet even when wide', () => {
    setUa('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)', 'iPad', 5);
    matchMediaSpy.and.callFake((query: string) => {
      const matches = query.includes('pointer: coarse');
      return {
        matches,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList;
    });
    expect(isMobileLikeDevice({ maxWidthPx: 1024 })).toBe(true);
  });

  it('isMobileLikeDevice is true for coarse + hover none + touch on wide foldable', () => {
    setUa('Mozilla/5.0', 'Linux', 5);
    matchMediaSpy.and.callFake((query: string) => {
      const matches =
        query.includes('pointer: coarse') || query.includes('hover: none') || query.includes('any-hover: none');
      return {
        matches: query.includes('max-width') ? false : matches,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList;
    });
    expect(isMobileLikeDevice({ maxWidthPx: 1024 })).toBe(true);
  });

  it('isMobileLikeDevice is false for desktop mouse + wide viewport', () => {
    setUa('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32', 0);
    matchMediaSpy.and.returnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    } as MediaQueryList);
    expect(isMobileLikeDevice()).toBe(false);
  });
});
