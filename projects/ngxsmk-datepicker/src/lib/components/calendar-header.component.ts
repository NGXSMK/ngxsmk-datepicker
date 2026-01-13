import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { CustomSelectComponent } from './custom-select.component';

@Component({
  selector: 'ngxsmk-calendar-header',
  standalone: true,
  imports: [NgClass, CustomSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ngxsmk-header" [ngClass]="headerClass">
      <div class="ngxsmk-month-year-selects">
        <ngxsmk-custom-select 
          class="month-select" 
          [options]="monthOptions"
          [(value)]="currentMonth" 
          [disabled]="disabled"
          (valueChange)="currentMonthChange.emit($any($event))">
        </ngxsmk-custom-select>
        <ngxsmk-custom-select 
          class="year-select" 
          [options]="yearOptions" 
          [(value)]="currentYear" 
          [disabled]="disabled" 
          (valueChange)="currentYearChange.emit($any($event))">
        </ngxsmk-custom-select>
      </div>
      <div class="ngxsmk-nav-buttons">
        <button 
          type="button" 
          class="ngxsmk-nav-button" 
          (click)="previousMonth.emit()"
          [disabled]="disabled || isBackArrowDisabled" 
          [attr.aria-label]="prevMonthAriaLabel" 
          [title]="prevMonthAriaLabel" 
          [ngClass]="navPrevClass">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                  d="M328 112L184 256l144 144"/>
          </svg>
        </button>
        <button 
          type="button" 
          class="ngxsmk-nav-button" 
          (click)="nextMonth.emit()"
          [disabled]="disabled" 
          [attr.aria-label]="nextMonthAriaLabel" 
          [title]="nextMonthAriaLabel" 
          [ngClass]="navNextClass">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                  d="M184 112l144 144-144 144"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .month-select {
      flex: 1.5;
    }
    .year-select {
      flex: 1;
    }
  `]
})
/**
 * The header section of the calendar, containing navigation and selection controls.
 * 
 * Includes:
 * - Month selection dropdown
 * - Year selection dropdown
 * - Previous/Next month navigation buttons
 */
export class CalendarHeaderComponent {
  @Input() monthOptions: { label: string; value: number }[] = [];
  @Input() yearOptions: { label: string; value: number }[] = [];
  @Input() currentMonth: number = 0;
  @Input() currentYear: number = new Date().getFullYear();
  @Input() disabled: boolean = false;
  @Input() isBackArrowDisabled: boolean = false;
  @Input() prevMonthAriaLabel: string = '';
  @Input() nextMonthAriaLabel: string = '';
  @Input() headerClass?: string;
  @Input() navPrevClass?: string;
  @Input() navNextClass?: string;

  @Output() currentYearChange = new EventEmitter<number>();
  @Output() currentMonthChange = new EventEmitter<number>();
  @Output() previousMonth = new EventEmitter<void>();
  @Output() nextMonth = new EventEmitter<void>();
}

