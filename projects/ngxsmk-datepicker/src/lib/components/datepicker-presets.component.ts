import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DatepickerClasses } from '../interfaces/datepicker-classes.interface';

@Component({
  selector: 'ngxsmk-datepicker-presets',
  standalone: true,
  imports: [],
  template: `
    <div class="ngxsmk-ranges-container">
      <ul>
        @for (range of ranges; track trackByRange($index, range)) {
          <li
            (click)="onRangeSelect(range.value)"
            (keydown.enter)="onRangeSelect(range.value)"
            (keydown.space)="onRangeSelect(range.value); $event.preventDefault()"
            [class.disabled]="disabled"
            [attr.tabindex]="disabled ? -1 : 0"
            role="button"
            [attr.aria-disabled]="disabled"
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
  @Input() ranges: { key: string; value: [Date, Date] }[] = [];
  @Input() disabled: boolean = false;
  @Input() classes: DatepickerClasses | undefined = undefined;

  @Output() rangeSelected = new EventEmitter<[Date, Date]>();

  onRangeSelect(range: [Date, Date]): void {
    if (!this.disabled) {
      this.rangeSelected.emit(range);
    }
  }

  trackByRange(_index: number, range: { key: string; value: [Date, Date] }): string {
    return range.key;
  }
}
