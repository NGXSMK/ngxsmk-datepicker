export function getStartOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function getEndOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function addMonths(d: Date, months: number): Date {
  const newDate = new Date(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}

export function subtractDays(d: Date, days: number): Date {
  const newDate = new Date(d);
  newDate.setDate(d.getDate() - days);
  return newDate;
}

export function getStartOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getEndOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function normalizeDate(date: DateInput | null): Date | null {
  if (!date) return null;
  const d = (date instanceof Date) 
    ? new Date(date.getTime()) 
    : new Date(
        (date as { toDate?: () => Date }).toDate 
          ? (date as { toDate: () => Date }).toDate() 
          : date as Date | string | number
      );
  if (isNaN(d.getTime())) return null;
  return d;
}

export type DateInput = Date | string | { toDate: () => Date; _isAMomentObject?: boolean; $d?: Date };

