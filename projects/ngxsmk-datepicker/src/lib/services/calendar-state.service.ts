import { Injectable, signal, computed } from '@angular/core';
import { DatepickerValue } from '../utils/calendar.utils';


@Injectable()
export class CalendarStateService {
    // Core Value State
    readonly internalValue = signal<DatepickerValue>(null);
    readonly selectedDate = signal<Date | null>(null);
    readonly startDate = signal<Date | null>(null);
    readonly endDate = signal<Date | null>(null);
    readonly selectedDates = signal<Date[]>([]);

    // Navigation State
    readonly currentMonth = signal<number>(new Date().getMonth());
    readonly currentYear = signal<number>(new Date().getFullYear());
    readonly viewMode = signal<'month' | 'year' | 'decade' | 'timeline' | 'time-slider'>('month');

    // Input State
    readonly disabled = signal<boolean>(false);
    readonly required = signal<boolean>(false);
    readonly errorState = signal<boolean>(false);

    // Computed state for derived values
    readonly displayMonthLabel = computed(() => {
        // Logic to be moved here
        return '';
    });

    /**
     * Reset the current state
     */
    reset() {
        this.internalValue.set(null);
        this.selectedDate.set(null);
        this.startDate.set(null);
        this.endDate.set(null);
        this.selectedDates.set([]);
    }

    /**
     * Update selection based on mode
     */
    updateSelection(value: DatepickerValue) {
        this.internalValue.set(value);
        // Parsing logic will interact with InputHandlingService
    }
}

