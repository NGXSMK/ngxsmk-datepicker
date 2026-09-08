import { HolidayProvider } from '../utils/calendar.utils';
import { getEndOfDay, getStartOfDay, normalizeDate } from '../utils/date.utils';

/** Day identity: local calendar day. Time-of-day is ignored by the snapshot. */
export type Day = Date;

export type ConstraintDenial =
  | { code: 'min'; min: Date }
  | { code: 'max'; max: Date }
  | { code: 'disabledDate'; date: Date }
  | { code: 'disabledRange'; start: Date; end: Date }
  | { code: 'asyncDisabled'; date: Date }
  | { code: 'holiday'; date: Date; label: string | null }
  | { code: 'invalidDate'; date: Date };

export type DayVerdict = { allowed: true } | { allowed: false; denial: ConstraintDenial };

export type DayInterval = { start: Day; end: Day };

export interface ConstraintsSources {
  minDate: Date | null;
  maxDate: Date | null;
  disabledDates: readonly (Date | string)[];
  disabledRanges: readonly { start: Date | string; end: Date | string }[];
  /** Host-fed async truth — already resolved day-start timestamps. */
  asyncDisabledDayTimes: ReadonlySet<number>;
  disableHolidays: boolean;
  holidayProvider: HolidayProvider | null;
  isInvalidDate: ((date: Date) => boolean) | null;
}

export interface ConstraintsSnapshot {
  evaluate(day: Day | null): DayVerdict;
  isAllowed(day: Day | null): boolean;
  scan(interval: DayInterval): ReadonlyArray<{ day: Date; denial: ConstraintDenial }>;
}

const EMPTY_SET: ReadonlySet<number> = new Set();

export const EMPTY_CONSTRAINTS_SOURCES: ConstraintsSources = {
  minDate: null,
  maxDate: null,
  disabledDates: [],
  disabledRanges: [],
  asyncDisabledDayTimes: EMPTY_SET,
  disableHolidays: false,
  holidayProvider: null,
  isInvalidDate: null,
};

const SCAN_DAY_CAP = 365;

function toDay(value: Date | string | null | undefined): Date | null {
  if (value == null) return null;
  const parsed = value instanceof Date ? value : normalizeDate(value);
  if (!parsed || Number.isNaN(parsed.getTime())) return null;
  return getStartOfDay(parsed);
}

interface CompiledConstraints {
  minTime: number | null;
  minDate: Date | null;
  maxTime: number | null;
  maxDate: Date | null;
  disabledDates: ReadonlySet<number>;
  disabledRanges: ReadonlyArray<{ startTime: number; endTime: number; start: Date; end: Date }>;
  asyncDisabledDayTimes: ReadonlySet<number>;
  disableHolidays: boolean;
  holidayProvider: HolidayProvider | null;
  isInvalidDate: ((date: Date) => boolean) | null;
}

function compile(sources: ConstraintsSources): CompiledConstraints {
  const disabledDates = new Set<number>();
  for (const item of sources.disabledDates ?? []) {
    const day = toDay(item);
    if (day) disabledDates.add(day.getTime());
  }

  const disabledRanges: Array<{ startTime: number; endTime: number; start: Date; end: Date }> = [];
  for (const range of sources.disabledRanges ?? []) {
    const start = toDay(range.start);
    const end = toDay(range.end);
    if (!start || !end) continue;
    disabledRanges.push({
      startTime: start.getTime(),
      endTime: getEndOfDay(end).getTime(),
      start,
      end: getStartOfDay(end),
    });
  }

  const minDate = toDay(sources.minDate);
  const maxDate = toDay(sources.maxDate);

  return {
    minTime: minDate ? minDate.getTime() : null,
    minDate,
    maxTime: maxDate ? maxDate.getTime() : null,
    maxDate,
    disabledDates,
    disabledRanges,
    asyncDisabledDayTimes: sources.asyncDisabledDayTimes ?? EMPTY_SET,
    disableHolidays: !!sources.disableHolidays,
    holidayProvider: sources.holidayProvider ?? null,
    isInvalidDate: sources.isInvalidDate ?? null,
  };
}

function evaluateCompiled(compiled: CompiledConstraints, day: Day | null): DayVerdict {
  if (!day) return { allowed: true };
  if (Number.isNaN(day.getTime())) {
    return { allowed: false, denial: { code: 'invalidDate', date: day } };
  }

  const dateOnly = getStartOfDay(day);
  const time = dateOnly.getTime();

  if (compiled.disabledDates.has(time)) {
    return { allowed: false, denial: { code: 'disabledDate', date: dateOnly } };
  }

  for (const range of compiled.disabledRanges) {
    if (time >= range.startTime && time <= range.endTime) {
      return {
        allowed: false,
        denial: { code: 'disabledRange', start: range.start, end: range.end },
      };
    }
  }

  if (compiled.asyncDisabledDayTimes.has(time)) {
    return { allowed: false, denial: { code: 'asyncDisabled', date: dateOnly } };
  }

  if (compiled.disableHolidays && compiled.holidayProvider) {
    try {
      if (compiled.holidayProvider.isHoliday(dateOnly)) {
        const label = compiled.holidayProvider.getHolidayLabel?.(dateOnly) ?? null;
        return { allowed: false, denial: { code: 'holiday', date: dateOnly, label } };
      }
    } catch {
      // fail open for holidays (parity with Host / DateValidationService)
    }
  }

  if (compiled.minTime != null && compiled.minDate && time < compiled.minTime) {
    return { allowed: false, denial: { code: 'min', min: compiled.minDate } };
  }

  if (compiled.maxTime != null && compiled.maxDate && time > compiled.maxTime) {
    return { allowed: false, denial: { code: 'max', max: compiled.maxDate } };
  }

  if (compiled.isInvalidDate) {
    try {
      if (compiled.isInvalidDate(dateOnly)) {
        return { allowed: false, denial: { code: 'invalidDate', date: dateOnly } };
      }
    } catch {
      return { allowed: false, denial: { code: 'invalidDate', date: dateOnly } };
    }
  }

  return { allowed: true };
}

function createSnapshot(compiled: CompiledConstraints): ConstraintsSnapshot {
  return {
    evaluate(day: Day | null): DayVerdict {
      return evaluateCompiled(compiled, day);
    },
    isAllowed(day: Day | null): boolean {
      return evaluateCompiled(compiled, day).allowed;
    },
    scan(interval: DayInterval): ReadonlyArray<{ day: Date; denial: ConstraintDenial }> {
      const start = toDay(interval.start);
      const end = toDay(interval.end);
      if (!start || !end || end.getTime() < start.getTime()) return [];

      const hits: Array<{ day: Date; denial: ConstraintDenial }> = [];
      const current = new Date(start);
      const limit = new Date(start);
      limit.setDate(limit.getDate() + SCAN_DAY_CAP);
      const endChecked = end.getTime() < limit.getTime() ? end : getStartOfDay(limit);

      while (current.getTime() <= endChecked.getTime()) {
        const verdict = evaluateCompiled(compiled, current);
        if (!verdict.allowed) {
          hits.push({ day: getStartOfDay(current), denial: verdict.denial });
        }
        current.setDate(current.getDate() + 1);
      }

      return hits;
    },
  };
}

/** Pure factory for an immutable Constraints Snapshot. */
export function buildConstraints(sources: ConstraintsSources): ConstraintsSnapshot {
  return createSnapshot(compile(sources));
}

/** Namespace-style entry matching the hybrid design sketch. */
export const Constraints = {
  build: buildConstraints,
};
