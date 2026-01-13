import { Injectable, isDevMode } from '@angular/core';
import { getStartOfDay } from '../utils/date.utils';

export interface TouchGestureState {
  touchStartTime: number;
  touchStartElement: EventTarget | null;
  dateCellTouchStartTime: number;
  dateCellTouchStartDate: Date | null;
  dateCellTouchStartX: number;
  dateCellTouchStartY: number;
  isDateCellTouching: boolean;
  lastDateCellTouchDate: Date | null;
  dateCellTouchHandled: boolean;
  calendarSwipeStartX: number;
  calendarSwipeStartY: number;
  calendarSwipeStartTime: number;
  isCalendarSwiping: boolean;
  hoveredDate: Date | null;
}

export interface TouchGestureConfig {
  disabled: boolean;
  mode: 'single' | 'range' | 'multiple';
  swipeThreshold: number;
  swipeTimeThreshold: number;
}

export interface TouchGestureCallbacks {
  isDateDisabled: (date: Date) => boolean;
  onDateClick: (date: Date) => void;
  changeMonth: (delta: number) => void;
  onStateChanged: () => void;
  onHoverChanged: (date: Date | null) => void;
}

/**
 * Service for handling touch gestures
 */
@Injectable()
export class TouchGestureHandlerService {
  /**
   * Handle date cell touch start
   */
  handleDateCellTouchStart(
    event: TouchEvent,
    day: Date | null,
    state: TouchGestureState,
    config: TouchGestureConfig,
    callbacks: TouchGestureCallbacks
  ): void {
    if (config.disabled || !day || callbacks.isDateDisabled(day)) {
      return;
    }

    event.stopPropagation();

    state.dateCellTouchHandled = false;
    state.isDateCellTouching = true;

    const touch = event.touches[0];
    if (touch) {
      state.dateCellTouchStartTime = Date.now();
      state.dateCellTouchStartDate = day;
      state.dateCellTouchStartX = touch.clientX;
      state.dateCellTouchStartY = touch.clientY;
      state.lastDateCellTouchDate = day;
    } else {
      state.isDateCellTouching = false;
    }
  }

  /**
   * Handle date cell touch move
   */
  handleDateCellTouchMove(
    event: TouchEvent,
    state: TouchGestureState,
    config: TouchGestureConfig,
    callbacks: TouchGestureCallbacks,
    startDate?: Date | null
  ): void {
    if (config.disabled || !state.isDateCellTouching || !state.dateCellTouchStartDate) {
      return;
    }

    if (config.mode === 'range' && startDate) {
      const touch = event.touches[0];
      if (touch) {
        const deltaX = Math.abs(touch.clientX - state.dateCellTouchStartX);
        const deltaY = Math.abs(touch.clientY - state.dateCellTouchStartY);
        const isSignificantMove = deltaX > 5 || deltaY > 5;

        if (isSignificantMove) {
          event.preventDefault();
        }

        try {
          const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
          if (elementFromPoint) {
            const dateCell = elementFromPoint.closest('.ngxsmk-day-cell') as HTMLElement;
            if (dateCell && !dateCell.classList.contains('empty') && !dateCell.classList.contains('disabled')) {
              const dateTimestamp = dateCell.getAttribute('data-date');
              if (dateTimestamp) {
                const dateValue = parseInt(dateTimestamp, 10);
                if (!isNaN(dateValue)) {
                  const day = new Date(dateValue);
                  if (day && !isNaN(day.getTime()) && !callbacks.isDateDisabled(day)) {
                    const dayTime = getStartOfDay(day).getTime();
                    const startTime = getStartOfDay(startDate).getTime();

                    if (dayTime >= startTime) {
                      callbacks.onHoverChanged(day);
                      state.lastDateCellTouchDate = day;
                    } else {
                      callbacks.onHoverChanged(null);
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          // Silently handle touch move errors - fallback to default behavior
          // Error is non-critical and doesn't affect core functionality
          if (isDevMode()) {
            console.warn('[ngxsmk-datepicker] Touch gesture error:', error);
          }
        }
      }
    }
  }

  /**
   * Handle date cell touch end
   */
  handleDateCellTouchEnd(
    event: TouchEvent,
    day: Date | null,
    state: TouchGestureState,
    config: TouchGestureConfig,
    callbacks: TouchGestureCallbacks
  ): void {
    if (config.disabled) {
      this.resetDateCellTouchState(state);
      return;
    }

    if (!state.isDateCellTouching || !state.dateCellTouchStartDate) {
      state.isDateCellTouching = false;
      return;
    }

    const now = Date.now();
    const touchDuration = state.dateCellTouchStartTime > 0 ? now - state.dateCellTouchStartTime : 0;
    const touch = event.changedTouches[0];

    let endDay: Date | null = day || state.dateCellTouchStartDate;
    if (touch) {
      try {
        const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementFromPoint) {
          const dateCell = elementFromPoint.closest('.ngxsmk-day-cell') as HTMLElement;
          if (dateCell) {
            const dateTimestamp = dateCell.getAttribute('data-date');
            if (dateTimestamp) {
              const dateValue = parseInt(dateTimestamp, 10);
              if (!isNaN(dateValue)) {
                const parsedDay = new Date(dateValue);
                if (parsedDay && !isNaN(parsedDay.getTime())) {
                  endDay = parsedDay;
                }
              }
            }
          }
        }
      } catch {
        // Silently handle touch end date determination errors - use fallback
        // Error is non-critical and fallback value ensures functionality continues
        endDay = day || state.dateCellTouchStartDate;
      }
    }

    const finalDay = state.lastDateCellTouchDate || endDay || state.dateCellTouchStartDate;

    if (!finalDay || callbacks.isDateDisabled(finalDay)) {
      this.resetDateCellTouchState(state);
      return;
    }

    // Handle touch duration for click vs drag
    if (touchDuration < 300 && finalDay === state.dateCellTouchStartDate) {
      // Quick tap - treat as click
      state.dateCellTouchHandled = true;
      callbacks.onDateClick(finalDay);
    } else if (config.mode === 'range' && state.lastDateCellTouchDate && state.lastDateCellTouchDate !== state.dateCellTouchStartDate) {
      // Drag gesture - select range
      callbacks.onDateClick(state.lastDateCellTouchDate);
    }

    this.resetDateCellTouchState(state);
    callbacks.onStateChanged();
  }

  /**
   * Handle calendar swipe start
   */
  handleCalendarSwipeStart(
    event: TouchEvent,
    state: TouchGestureState
  ): void {
    const touch = event.touches[0];
    if (touch) {
      state.calendarSwipeStartX = touch.clientX;
      state.calendarSwipeStartY = touch.clientY;
      state.calendarSwipeStartTime = Date.now();
      state.isCalendarSwiping = true;
    }
  }

  /**
   * Handle calendar swipe move
   */
  handleCalendarSwipeMove(
    event: TouchEvent,
    state: TouchGestureState
  ): void {
    if (!state.isCalendarSwiping) return;

    const touch = event.touches[0];
    if (touch) {
      const deltaX = Math.abs(touch.clientX - state.calendarSwipeStartX);
      const deltaY = Math.abs(touch.clientY - state.calendarSwipeStartY);

      // If significant movement, prevent default scrolling
      if (deltaX > 10 || deltaY > 10) {
        event.preventDefault();
      }
    }
  }

  /**
   * Handle calendar swipe end
   */
  handleCalendarSwipeEnd(
    event: TouchEvent,
    state: TouchGestureState,
    config: TouchGestureConfig,
    callbacks: TouchGestureCallbacks
  ): void {
    if (!state.isCalendarSwiping) return;

    const touch = event.changedTouches[0];
    if (!touch) {
      this.resetSwipeState(state);
      return;
    }

    const deltaX = touch.clientX - state.calendarSwipeStartX;
    const deltaY = touch.clientY - state.calendarSwipeStartY;
    const deltaTime = Date.now() - state.calendarSwipeStartTime;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if it's a valid swipe
    if (absDeltaX > config.swipeThreshold && absDeltaY < absDeltaX && deltaTime < config.swipeTimeThreshold) {
      if (deltaX > 0) {
        // Swipe right - previous month
        callbacks.changeMonth(-1);
      } else {
        // Swipe left - next month
        callbacks.changeMonth(1);
      }
    }

    this.resetSwipeState(state);
    callbacks.onStateChanged();
  }

  /**
   * Reset date cell touch state
   */
  private resetDateCellTouchState(state: TouchGestureState): void {
    state.isDateCellTouching = false;
    state.dateCellTouchStartTime = 0;
    state.dateCellTouchStartDate = null;
    state.lastDateCellTouchDate = null;
  }

  /**
   * Reset swipe state
   */
  private resetSwipeState(state: TouchGestureState): void {
    state.calendarSwipeStartX = 0;
    state.calendarSwipeStartY = 0;
    state.calendarSwipeStartTime = 0;
    state.isCalendarSwiping = false;
  }
}

