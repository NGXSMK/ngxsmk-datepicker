/**
 * Mobile / tablet platform helpers for latest iOS Safari and Android Chrome.
 * Prefer capability queries over brittle UA sniffing; UA is a fallback for iPadOS
 * (which reports as Macintosh) and Android tablets.
 */

export function isBrowserGlobal(): boolean {
  return typeof globalThis !== 'undefined' && typeof document !== 'undefined';
}

export function matchMediaSafe(query: string): boolean {
  if (!isBrowserGlobal() || typeof globalThis.matchMedia !== 'function') {
    return false;
  }
  try {
    return globalThis.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/** Primary pointing device is touch (phones, many tablets). */
export function isCoarsePointer(): boolean {
  return matchMediaSafe('(pointer: coarse)') || matchMediaSafe('(any-pointer: coarse)');
}

/** Hover is unavailable — typical phone / tablet. */
export function isHoverNone(): boolean {
  return matchMediaSafe('(hover: none)') || matchMediaSafe('(any-hover: none)');
}

export function hasTouchPoints(): boolean {
  if (!isBrowserGlobal()) return false;
  try {
    const nav = navigator as Navigator & { maxTouchPoints?: number };
    return ('ontouchstart' in globalThis && true) || (typeof nav.maxTouchPoints === 'number' && nav.maxTouchPoints > 0);
  } catch {
    return false;
  }
}

/** iPhone / iPod / iPad (incl. iPadOS 13+ desktop UA with touch). */
export function isIOSFamily(): boolean {
  if (!isBrowserGlobal()) return false;
  try {
    const ua = navigator.userAgent || '';
    const platform = (navigator as Navigator & { platform?: string }).platform || '';
    const iOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (/iPad|iPhone|iPod/.test(platform) && !(window as unknown as { MSStream?: unknown }).MSStream);
    // iPadOS 13+ can report as MacIntel with touch points
    const iPadOSDesktopUa =
      platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
    return iOSDevice || iPadOSDesktopUa;
  } catch {
    return false;
  }
}

export function isAndroid(): boolean {
  if (!isBrowserGlobal()) return false;
  try {
    return /Android/i.test(navigator.userAgent || '');
  } catch {
    return false;
  }
}

/**
 * Whether the datepicker should use mobile presentation (sheet / fullscreen / touch UX).
 * Combines viewport width, coarse pointer, and known mobile platforms (incl. iPadOS).
 */
export function isMobileLikeDevice(options?: { maxWidthPx?: number }): boolean {
  if (!isBrowserGlobal()) return false;
  const maxWidth = options?.maxWidthPx ?? 1024;
  const narrow = matchMediaSafe(`(max-width: ${maxWidth}px)`);
  const coarse = isCoarsePointer();
  const touch = hasTouchPoints();
  const ios = isIOSFamily();
  const android = isAndroid();

  // Phones / small tablets by viewport
  if (narrow && (coarse || touch || ios || android)) {
    return true;
  }
  // Large iPad / Android tablet in landscape still wants mobile chrome
  if ((ios || android) && (coarse || touch)) {
    return true;
  }
  // Coarse pointer + no hover (phone-like) even on wider foldables
  if (coarse && isHoverNone() && touch) {
    return true;
  }
  return false;
}
