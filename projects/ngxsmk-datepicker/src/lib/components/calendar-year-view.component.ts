import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  computed,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { NgClass } from '@angular/common';
import {
  calculateVirtualScroll,
  VirtualScrollConfig,
  generateLargeYearRange,
  generateLargeDecadeRange,
} from '../utils/virtual-scroll.utils';

@Component({
  selector: 'ngxsmk-calendar-year-view',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (viewMode === 'year') {
      <div class="ngxsmk-header" [ngClass]="headerClass">
        <div class="ngxsmk-year-display">
          <button
            type="button"
            class="ngxsmk-view-toggle"
            (click)="viewModeChange.emit('decade')"
            [disabled]="disabled"
          >
            {{ currentDecade }} - {{ currentDecade + 9 }}
          </button>
        </div>
        <div class="ngxsmk-nav-buttons">
          <button
            type="button"
            class="ngxsmk-nav-button"
            (click)="changeYear.emit(-12)"
            [disabled]="disabled"
            [attr.aria-label]="previousYearsLabel"
            [ngClass]="navPrevClass"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
                d="M328 112L184 256l144 144"
              />
            </svg>
          </button>
          <button
            type="button"
            class="ngxsmk-nav-button"
            (click)="changeYear.emit(12)"
            [disabled]="disabled"
            [attr.aria-label]="nextYearsLabel"
            [ngClass]="navNextClass"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
                d="M184 112l144 144-144 144"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        class="ngxsmk-year-grid-container"
        #yearScrollContainer
        (scroll)="onYearScroll($event)"
        [style.height.px]="yearContainerHeight"
      >
        <div
          class="ngxsmk-year-grid"
          [style.height.px]="yearVirtualResult().totalHeight"
          [style.transform]="
            'translateY(' + (yearVirtualResult().offsetY || 0) + 'px)'
          "
        >
          @for (item of yearVirtualResult().visibleItems; track item.index) {
            <button
              type="button"
              class="ngxsmk-year-cell"
              [class.selected]="item.data === currentYear"
              [class.today]="item.data === today.getFullYear()"
              [disabled]="disabled"
              (click)="yearClick.emit(item.data); $event.stopPropagation()"
              (keydown.enter)="yearClick.emit(item.data)"
              [attr.aria-label]="getYearAriaLabel(item.data)"
            >
              {{ item.data }}
            </button>
          }
        </div>
      </div>
    }

    @if (viewMode === 'decade') {
      <div class="ngxsmk-header" [ngClass]="headerClass">
        <div class="ngxsmk-decade-display">
          {{ currentDecade }} - {{ currentDecade + 99 }}
        </div>
        <div class="ngxsmk-nav-buttons">
          <button
            type="button"
            class="ngxsmk-nav-button"
            (click)="changeDecade.emit(-1)"
            [disabled]="disabled"
            [attr.aria-label]="previousDecadeLabel"
            [ngClass]="navPrevClass"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
                d="M328 112L184 256l144 144"
              />
            </svg>
          </button>
          <button
            type="button"
            class="ngxsmk-nav-button"
            (click)="changeDecade.emit(1)"
            [disabled]="disabled"
            [attr.aria-label]="nextDecadeLabel"
            [ngClass]="navNextClass"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
                d="M184 112l144 144-144 144"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        class="ngxsmk-decade-grid-container"
        #decadeScrollContainer
        (scroll)="onDecadeScroll($event)"
        [style.height.px]="decadeContainerHeight"
      >
        <div
          class="ngxsmk-decade-grid"
          [style.height.px]="decadeVirtualResult().totalHeight"
          [style.transform]="
            'translateY(' + (decadeVirtualResult().offsetY || 0) + 'px)'
          "
        >
          @for (item of decadeVirtualResult().visibleItems; track item.index) {
            <button
              type="button"
              class="ngxsmk-decade-cell"
              [class.selected]="item.data === currentDecade"
              [disabled]="disabled"
              (click)="decadeClick.emit(item.data); $event.stopPropagation()"
              (keydown.enter)="decadeClick.emit(item.data)"
              [attr.aria-label]="getDecadeAriaLabel(item.data)"
            >
              {{ item.data }} - {{ item.data + 9 }}
            </button>
          }
        </div>
      </div>
    }
  `,
})
/**
 * Presentational component for selecting years and decades with virtual scrolling support.
 *
 * @remarks
 * Supports two distinct view modes:
 * 1. **'year'**: Displays a virtual-scrolled grid of years for selection.
 * 2. **'decade'**: Displays a virtual-scrolled grid of decades for navigating large time spans.
 *
 * Virtual scrolling ensures that only visible items are rendered, enabling smooth navigation
 * through large year/decade ranges without performance degradation.
 *
 * This component is stateless and relies on the parent for logic and state management.
 */
export class CalendarYearViewComponent implements OnInit {
  @Input() viewMode: 'year' | 'decade' = 'year';
  @Input() yearGrid: number[] = [];
  @Input() decadeGrid: number[] = [];
  @Input() currentYear: number = new Date().getFullYear();
  @Input() currentDecade: number = new Date().getFullYear();
  @Input() today: Date = new Date();
  @Input() disabled: boolean = false;

  // Virtual scrolling container heights
  @Input() yearContainerHeight: number = 280; // Adjust based on CSS height
  @Input() decadeContainerHeight: number = 280;

  // Translation labels
  @Input() previousYearsLabel: string = 'Previous Years';
  @Input() nextYearsLabel: string = 'Next Years';
  @Input() previousDecadeLabel: string = 'Previous Decade';
  @Input() nextDecadeLabel: string = 'Next Decade';

  // Styling classes
  @Input() headerClass?: string;
  @Input() navPrevClass?: string;
  @Input() navNextClass?: string;

  @ViewChild('yearScrollContainer') yearScrollContainer?: ElementRef;
  @ViewChild('decadeScrollContainer') decadeScrollContainer?: ElementRef;

  @Output() viewModeChange = new EventEmitter<'year' | 'decade'>();
  @Output() yearClick = new EventEmitter<number>();
  @Output() decadeClick = new EventEmitter<number>();
  @Output() changeYear = new EventEmitter<number>();
  @Output() changeDecade = new EventEmitter<number>();

  // Virtual scrolling signals
  private yearScrollPositionSignal = signal<number>(0);
  private decadeScrollPositionSignal = signal<number>(0);

  // Large year/decade ranges for virtual scrolling
  private largeYearRange: number[] = [];
  private largeDecadeRange: number[] = [];

  // Virtual scroll results (computed from signals and scroll position)
  yearVirtualResult = computed(() => {
    return calculateVirtualScroll<number>(
      this.largeYearRange,
      this.yearScrollPositionSignal(),
      {
        itemHeight: 40, // Adjust based on CSS button height
        containerHeight: this.yearContainerHeight,
        overscan: 5,
        itemsPerRow: 4, // 4 columns for year grid
      } as VirtualScrollConfig,
    );
  });

  decadeVirtualResult = computed(() => {
    return calculateVirtualScroll<number>(
      this.largeDecadeRange,
      this.decadeScrollPositionSignal(),
      {
        itemHeight: 40, // Adjust based on CSS button height
        containerHeight: this.decadeContainerHeight,
        overscan: 5,
        itemsPerRow: 3, // 3 columns for decade grid
      } as VirtualScrollConfig,
    );
  });

  ngOnInit(): void {
    // Generate large ranges for virtual scrolling
    // Centers on current year/decade with 100 years / 50 decades range
    this.largeYearRange = generateLargeYearRange(this.currentYear, 100);
    this.largeDecadeRange = generateLargeDecadeRange(this.currentDecade, 50);
  }

  onYearScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    this.yearScrollPositionSignal.set(scrollTop);
  }

  onDecadeScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    this.decadeScrollPositionSignal.set(scrollTop);
  }

  getYearAriaLabel(year: number): string {
    return `Select year ${year}`;
  }

  getDecadeAriaLabel(decade: number): string {
    return `Select decade ${decade} - ${decade + 9}`;
  }
}
