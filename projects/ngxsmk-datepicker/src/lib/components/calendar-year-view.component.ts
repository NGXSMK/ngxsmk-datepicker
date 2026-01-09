import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngxsmk-calendar-year-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (viewMode === 'year') {
      <div class="ngxsmk-header" [ngClass]="headerClass">
        <div class="ngxsmk-year-display">
          <button type="button" class="ngxsmk-view-toggle" (click)="viewModeChange.emit('decade')" [disabled]="disabled">
            {{ currentDecade }} - {{ currentDecade + 9 }}
          </button>
        </div>
        <div class="ngxsmk-nav-buttons">
          <button type="button" class="ngxsmk-nav-button" (click)="changeYear.emit(-12)" [disabled]="disabled" [attr.aria-label]="previousYearsLabel" [ngClass]="navPrevClass">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                    d="M328 112L184 256l144 144"/>
            </svg>
          </button>
          <button type="button" class="ngxsmk-nav-button" (click)="changeYear.emit(12)" [disabled]="disabled" [attr.aria-label]="nextYearsLabel" [ngClass]="navNextClass">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                    d="M184 112l144 144-144 144"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="ngxsmk-year-grid">
        @for (year of yearGrid; track $index) {
          <button type="button" 
                  class="ngxsmk-year-cell"
                  [class.selected]="year === currentYear"
                  [class.today]="year === today.getFullYear()"
                  [disabled]="disabled"
                  (click)="yearClick.emit(year); $event.stopPropagation()"
                  (keydown.enter)="yearClick.emit(year)"
                  [attr.aria-label]="getYearAriaLabel(year)">
            {{ year }}
          </button>
        }
      </div>
    }
    
    @if (viewMode === 'decade') {
      <div class="ngxsmk-header" [ngClass]="headerClass">
        <div class="ngxsmk-decade-display">
          {{ currentDecade }} - {{ currentDecade + 99 }}
        </div>
        <div class="ngxsmk-nav-buttons">
          <button type="button" class="ngxsmk-nav-button" (click)="changeDecade.emit(-1)" [disabled]="disabled" [attr.aria-label]="previousDecadeLabel" [ngClass]="navPrevClass">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                    d="M328 112L184 256l144 144"/>
            </svg>
          </button>
          <button type="button" class="ngxsmk-nav-button" (click)="changeDecade.emit(1)" [disabled]="disabled" [attr.aria-label]="nextDecadeLabel" [ngClass]="navNextClass">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                    d="M184 112l144 144-144 144"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="ngxsmk-decade-grid">
        @for (decade of decadeGrid; track $index) {
          <button type="button" 
                  class="ngxsmk-decade-cell"
                  [class.selected]="decade === currentDecade"
                  [disabled]="disabled"
                  (click)="decadeClick.emit(decade); $event.stopPropagation()"
                  (keydown.enter)="decadeClick.emit(decade)"
                  [attr.aria-label]="getDecadeAriaLabel(decade)">
            {{ decade }} - {{ decade + 9 }}
          </button>
        }
      </div>
    }
  `
})
/**
 * Presentational component for selecting years and decades.
 * 
 * @remarks
 * Supports two distinct view modes:
 * 1. **'year'**: Displays a grid of years (typically 12) for selection.
 * 2. **'decade'**: Displays a grid of decades for navigating large time spans.
 * 
 * Like the month view, this component is stateless and relies on the parent for logic and state management.
 */
export class CalendarYearViewComponent {
  @Input() viewMode: 'year' | 'decade' = 'year';
  @Input() yearGrid: number[] = [];
  @Input() decadeGrid: number[] = [];
  @Input() currentYear: number = new Date().getFullYear();
  @Input() currentDecade: number = new Date().getFullYear();
  @Input() today: Date = new Date();
  @Input() disabled: boolean = false;

  // Translation labels
  @Input() previousYearsLabel: string = 'Previous Years';
  @Input() nextYearsLabel: string = 'Next Years';
  @Input() previousDecadeLabel: string = 'Previous Decade';
  @Input() nextDecadeLabel: string = 'Next Decade';

  // Styling classes
  @Input() headerClass?: string;
  @Input() navPrevClass?: string;
  @Input() navNextClass?: string;

  @Output() viewModeChange = new EventEmitter<'year' | 'decade'>();
  @Output() yearClick = new EventEmitter<number>();
  @Output() decadeClick = new EventEmitter<number>();
  @Output() changeYear = new EventEmitter<number>();
  @Output() changeDecade = new EventEmitter<number>();

  getYearAriaLabel(year: number): string {
    return `Select year ${year}`;
  }

  getDecadeAriaLabel(decade: number): string {
    return `Select decade ${decade} - ${decade + 9}`;
  }
}
