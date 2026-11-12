import { Injectable } from '@angular/core';
import { KeyboardShortcutContext } from '../interfaces/datepicker-hooks.interface';
import { DatepickerHooks } from '../interfaces/datepicker-hooks.interface';

/**
 * @internal Prototype only — keyboard handling lives on {@link NgxsmkDatepickerComponent}.
 * Do not import for app code; kept for unit-test / future Selection module reference.
 */
export interface KeyboardNavigationState {
  currentDate: Date;
  selectedDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  selectedDates: Date[];
  focusedDate: Date | null;
  isCalendarOpen: boolean;
  mode: 'single' | 'range' | 'multiple';
  isRtl: boolean;
}

export interface KeyboardNavigationCallbacks {
  isDateValid: (date: Date) => boolean;
  navigateDate: (days: number, weeks: number) => void;
  changeMonth: (delta: number) => void;
  changeYear: (delta: number) => void;
  navigateToFirstDay: () => void;
  navigateToLastDay: () => void;
  selectToday: () => void;
  selectYesterday: () => void;
  selectTomorrow: () => void;
  selectNextWeek: () => void;
  onDateClick: (date: Date) => void;
  closeCalendar: () => void;
  onStateChanged: () => void;
}

export interface KeyboardNavigationConfig {
  enableKeyboardShortcuts: boolean;
  customShortcuts?: { [key: string]: (context: KeyboardShortcutContext) => boolean } | null;
  hooks?: DatepickerHooks | null;
  isInlineMode: boolean;
}

/**
 * @internal Prototype only — not wired into the host. Prefer the datepicker's own keyboard handlers.
 */
@Injectable()
export class KeyboardNavigationService {
  handleKeyboardNavigation(
    event: KeyboardEvent,
    state: KeyboardNavigationState,
    config: KeyboardNavigationConfig,
    callbacks: KeyboardNavigationCallbacks
  ): boolean {
    if (!config.enableKeyboardShortcuts) {
      return false;
    }

    const context: KeyboardShortcutContext = {
      currentDate: state.currentDate,
      selectedDate: state.selectedDate,
      startDate: state.startDate,
      endDate: state.endDate,
      selectedDates: state.selectedDates,
      mode: state.mode,
      focusedDate: state.focusedDate,
      isCalendarOpen: state.isCalendarOpen,
    };

    if (config.customShortcuts) {
      const key = this.getShortcutKey(event);
      if (key && config.customShortcuts[key]) {
        const handled = config.customShortcuts[key](context);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
      }
    }

    if (config.hooks?.handleShortcut) {
      const handled = config.hooks.handleShortcut(event, context);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    }

    switch (event.key) {
      case 'ArrowLeft':
        callbacks.navigateDate(state.isRtl ? 1 : -1, 0);
        return true;
      case 'ArrowRight':
        callbacks.navigateDate(state.isRtl ? -1 : 1, 0);
        return true;
      case 'ArrowUp':
        callbacks.navigateDate(0, -1);
        return true;
      case 'ArrowDown':
        callbacks.navigateDate(0, 1);
        return true;
      case 'PageUp':
        if (event.shiftKey) {
          callbacks.changeYear(-1);
        } else {
          callbacks.changeMonth(-1);
        }
        return true;
      case 'PageDown':
        if (event.shiftKey) {
          callbacks.changeYear(1);
        } else {
          callbacks.changeMonth(1);
        }
        return true;
      case 'Home':
        callbacks.navigateToFirstDay();
        return true;
      case 'End':
        callbacks.navigateToLastDay();
        return true;
      case 'Enter':
      case ' ':
        if (state.focusedDate) {
          callbacks.onDateClick(state.focusedDate);
        }
        return true;
      case 'Escape':
        if (!config.isInlineMode) {
          callbacks.closeCalendar();
        }
        return true;
      case 't':
      case 'T':
        if (!event.ctrlKey && !event.metaKey) {
          callbacks.selectToday();
          return true;
        }
        return false;
      case 'y':
      case 'Y':
        if (!event.ctrlKey && !event.metaKey) {
          callbacks.selectYesterday();
          return true;
        }
        return false;
      case 'n':
      case 'N':
        if (!event.ctrlKey && !event.metaKey) {
          callbacks.selectTomorrow();
          return true;
        }
        return false;
      case 'w':
      case 'W':
        if (!event.ctrlKey && !event.metaKey) {
          callbacks.selectNextWeek();
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  private getShortcutKey(event: KeyboardEvent): string | null {
    const parts: string[] = [];
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.metaKey) parts.push('Meta');
    if (event.shiftKey) parts.push('Shift');
    if (event.altKey) parts.push('Alt');
    parts.push(event.key);
    return parts.length > 1 ? parts.join('+') : event.key;
  }
}
