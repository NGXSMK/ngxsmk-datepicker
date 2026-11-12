import {
  hasTouchPoints,
  isAndroid,
  isCoarsePointer,
  isIOSFamily,
  isMobileLikeDevice,
  matchMediaSafe,
} from './mobile-platform.utils';

describe('mobile-platform.utils', () => {
  it('matchMediaSafe returns a boolean without throwing', () => {
    expect(typeof matchMediaSafe('(max-width: 1024px)')).toBe('boolean');
  });

  it('exposes coarse pointer / touch helpers', () => {
    expect(typeof isCoarsePointer()).toBe('boolean');
    expect(typeof hasTouchPoints()).toBe('boolean');
    expect(typeof isIOSFamily()).toBe('boolean');
    expect(typeof isAndroid()).toBe('boolean');
  });

  it('isMobileLikeDevice returns a boolean for current environment', () => {
    expect(typeof isMobileLikeDevice()).toBe('boolean');
    expect(typeof isMobileLikeDevice({ maxWidthPx: 768 })).toBe('boolean');
  });
});
