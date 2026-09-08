import { Constraints, EMPTY_CONSTRAINTS_SOURCES, type ConstraintsSources } from './constraints';
import { HolidayProvider } from '../utils/calendar.utils';
import { getStartOfDay } from '../utils/date.utils';

function d(y: number, m: number, day: number): Date {
  return getStartOfDay(new Date(y, m, day));
}

function sources(partial: Partial<ConstraintsSources>): ConstraintsSources {
  return { ...EMPTY_CONSTRAINTS_SOURCES, ...partial };
}

class TestHolidays implements HolidayProvider {
  constructor(
    private readonly holidays: Record<string, string>,
    private readonly throwOnCheck = false
  ) {}

  isHoliday(date: Date): boolean {
    if (this.throwOnCheck) throw new Error('holiday boom');
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return key in this.holidays;
  }

  getHolidayLabel(date: Date): string | null {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return this.holidays[key] ?? null;
  }
}

describe('Constraints Snapshot', () => {
  it('allows any day when sources are empty', () => {
    const snap = Constraints.build(EMPTY_CONSTRAINTS_SOURCES);
    expect(snap.isAllowed(d(2026, 5, 15))).toBe(true);
    expect(snap.evaluate(d(2026, 5, 15))).toEqual({ allowed: true });
  });

  it('treats null as allowed (parity with Host isDateDisabled)', () => {
    const snap = Constraints.build(sources({ minDate: d(2026, 0, 1) }));
    expect(snap.isAllowed(null)).toBe(true);
    expect(snap.evaluate(null)).toEqual({ allowed: true });
  });

  it('denies before minDate with min denial', () => {
    const min = d(2026, 5, 10);
    const snap = Constraints.build(sources({ minDate: min }));
    const verdict = snap.evaluate(d(2026, 5, 9));
    expect(verdict.allowed).toBe(false);
    if (!verdict.allowed) {
      expect(verdict.denial.code).toBe('min');
      if (verdict.denial.code === 'min') {
        expect(verdict.denial.min.getTime()).toBe(min.getTime());
      }
    }
    expect(snap.isAllowed(d(2026, 5, 10))).toBe(true);
  });

  it('denies after maxDate with max denial', () => {
    const max = d(2026, 5, 10);
    const snap = Constraints.build(sources({ maxDate: max }));
    const verdict = snap.evaluate(d(2026, 5, 11));
    expect(verdict.allowed).toBe(false);
    if (!verdict.allowed) {
      expect(verdict.denial.code).toBe('max');
    }
    expect(snap.isAllowed(d(2026, 5, 10))).toBe(true);
  });

  it('denies explicit disabled dates (Date and string)', () => {
    const snap = Constraints.build(
      sources({
        disabledDates: [d(2026, 11, 25), '2026-12-26'],
      })
    );
    expect(snap.isAllowed(d(2026, 11, 25))).toBe(false);
    const verdict = snap.evaluate(d(2026, 11, 25));
    expect(verdict.allowed).toBe(false);
    if (!verdict.allowed) {
      expect(verdict.denial.code).toBe('disabledDate');
    }
  });

  it('denies days inside disabledRanges', () => {
    const snap = Constraints.build(
      sources({
        disabledRanges: [{ start: d(2026, 5, 1), end: d(2026, 5, 3) }],
      })
    );
    expect(snap.isAllowed(d(2026, 5, 1))).toBe(false);
    expect(snap.isAllowed(d(2026, 5, 2))).toBe(false);
    expect(snap.isAllowed(d(2026, 5, 3))).toBe(false);
    expect(snap.isAllowed(d(2026, 5, 4))).toBe(true);
    const verdict = snap.evaluate(d(2026, 5, 2));
    expect(verdict.allowed).toBe(false);
    if (!verdict.allowed) {
      expect(verdict.denial.code).toBe('disabledRange');
    }
  });

  it('denies Host-fed async disabled timestamps', () => {
    const blocked = d(2026, 2, 15);
    const snap = Constraints.build(
      sources({
        asyncDisabledDayTimes: new Set([blocked.getTime()]),
      })
    );
    expect(snap.isAllowed(blocked)).toBe(false);
    const verdict = snap.evaluate(blocked);
    expect(verdict.allowed).toBe(false);
    if (!verdict.allowed) {
      expect(verdict.denial.code).toBe('asyncDisabled');
    }
  });

  it('denies holidays when disableHolidays and provider say so', () => {
    const christmas = d(2026, 11, 25);
    const snap = Constraints.build(
      sources({
        disableHolidays: true,
        holidayProvider: new TestHolidays({ '2026-11-25': 'Christmas' }),
      })
    );
    const verdict = snap.evaluate(christmas);
    expect(verdict.allowed).toBe(false);
    if (!verdict.allowed) {
      expect(verdict.denial).toEqual({
        code: 'holiday',
        date: christmas,
        label: 'Christmas',
      });
    }
  });

  it('fails open when holidayProvider throws', () => {
    const snap = Constraints.build(
      sources({
        disableHolidays: true,
        holidayProvider: new TestHolidays({}, true),
      })
    );
    expect(snap.isAllowed(d(2026, 0, 1))).toBe(true);
  });

  it('denies via isInvalidDate adapter and fails closed on throw', () => {
    const snap = Constraints.build(
      sources({
        isInvalidDate: (date) => date.getDay() === 0,
      })
    );
    // 2026-06-14 is Sunday
    expect(snap.isAllowed(d(2026, 5, 14))).toBe(false);
    expect(snap.isAllowed(d(2026, 5, 15))).toBe(true);

    const throwing = Constraints.build(
      sources({
        isInvalidDate: () => {
          throw new Error('boom');
        },
      })
    );
    expect(throwing.isAllowed(d(2026, 5, 15))).toBe(false);
  });

  it('uses denial priority: disabledDate before min', () => {
    const day = d(2026, 5, 1);
    const snap = Constraints.build(
      sources({
        minDate: d(2026, 5, 10),
        disabledDates: [day],
      })
    );
    const verdict = snap.evaluate(day);
    expect(verdict.allowed).toBe(false);
    if (!verdict.allowed) {
      expect(verdict.denial.code).toBe('disabledDate');
    }
  });

  it('scan returns denied days in ascending order and empty for inverted interval', () => {
    const snap = Constraints.build(
      sources({
        disabledDates: [d(2026, 5, 2)],
        minDate: d(2026, 5, 1),
      })
    );
    const hits = snap.scan({ start: d(2026, 5, 1), end: d(2026, 5, 3) });
    expect(hits.map((h) => h.day.getDate())).toEqual([2]);
    expect(hits[0].denial.code).toBe('disabledDate');

    expect(snap.scan({ start: d(2026, 5, 3), end: d(2026, 5, 1) })).toEqual([]);
  });

  it('snapshot is immutable: rebuilding sources does not mutate prior snapshot', () => {
    const first = Constraints.build(sources({ minDate: d(2026, 5, 10) }));
    const second = Constraints.build(sources({ minDate: d(2026, 0, 1) }));
    expect(first.isAllowed(d(2026, 5, 5))).toBe(false);
    expect(second.isAllowed(d(2026, 5, 5))).toBe(true);
  });
});
