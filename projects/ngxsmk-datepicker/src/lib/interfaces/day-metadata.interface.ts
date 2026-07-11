/**
 * Per-day decoration metadata for calendar cells — the building block for
 * availability/pricing calendars (booking-site style) without custom templates.
 */
export interface DayMetadata {
  /** Small text rendered under the day number (e.g. a price like "$120"). */
  label?: string;
  /** Color of a small indicator dot rendered in the cell (any CSS color). */
  indicatorColor?: string;
  /** Extra CSS class(es) applied to the day cell element. */
  cssClass?: string | string[];
  /** Tooltip (title attribute) for the cell. A `getDayCellTooltip` hook takes precedence. */
  tooltip?: string;
}

/**
 * Resolves metadata for a calendar day. Called during rendering, so it should
 * be fast — precompute or memoize lookups rather than fetching per call.
 * Return null/undefined for days without decorations.
 */
export type DayMetadataProvider = (date: Date) => DayMetadata | null | undefined;
