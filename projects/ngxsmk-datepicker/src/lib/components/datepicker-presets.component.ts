import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatepickerClasses } from '../interfaces/datepicker-classes.interface';

@Component({
  selector: 'ngxsmk-datepicker-presets',
  standalone: true,
  imports: [],
  template: `
    <div class="ngxsmk-ranges-container">
      <ul>
        @for (range of ranges(); track trackByRange($index, range)) {
          <li
            (click)="onRangeSelect(range.value)"
            (keydown.enter)="onRangeSelect(range.value)"
            (keydown.space)="onRangeSelect(range.value); $event.preventDefault()"
            [class.disabled]="disabled()"
            [class.ngxsmk-preset-active]="isActive(range.value)"
            [attr.tabindex]="disabled() ? -1 : 0"
            role="button"
            [attr.aria-disabled]="disabled()"
          >
            {{ range.key }}
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDatepickerPresetsComponent {
  readonly ranges = input<
    {
      key: string;
      value: [Date, Date];
    }[]
  >([]);
  readonly disabled = input<boolean>(false);
  readonly classes = input<DatepickerClasses>();
  readonly selectedRange = input<[Date | null, Date | null] | null>(null);

  readonly rangeSelected = output<[Date, Date]>();

  onRangeSelect(range: [Date, Date]): void {
    if (!this.disabled()) {
      this.rangeSelected.emit(range);
    }
  }

  isActive(value: [Date, Date]): boolean {
    const selectedRange = this.selectedRange();
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) {
      return false;
    }
    const start = selectedRange[0];
    const end = selectedRange[1];
    return this.isSameDay(value[0], start) && this.isSameDay(value[1], end);
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  trackByRange(_index: number, range: { key: string; value: [Date, Date] }): string {
    return range.key;
  }
}
