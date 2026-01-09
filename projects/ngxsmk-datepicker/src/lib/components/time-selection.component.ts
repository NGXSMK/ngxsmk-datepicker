import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './custom-select.component';

@Component({
  selector: 'ngxsmk-time-selection',
  standalone: true,
  imports: [CommonModule, CustomSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ngxsmk-time-selection">
      <span class="ngxsmk-time-label">{{ timeLabel }}</span>
      <ngxsmk-custom-select
        class="hour-select"
        [options]="hourOptions"
        [(value)]="currentDisplayHour"
        (valueChange)="currentDisplayHourChange.emit($any($event)); timeChange.emit()"
        [disabled]="disabled">
      </ngxsmk-custom-select>
      <span class="ngxsmk-time-separator">:</span>
      <ngxsmk-custom-select
        class="minute-select"
        [options]="minuteOptions"
        [(value)]="currentMinute"
        (valueChange)="currentMinuteChange.emit($any($event)); timeChange.emit()"
        [disabled]="disabled">
      </ngxsmk-custom-select>
      <ngxsmk-custom-select
        *ngIf="showSeconds"
        class="second-select"
        [options]="secondOptions"
        [(value)]="currentSecond"
        (valueChange)="currentSecondChange.emit($any($event)); timeChange.emit()"
        [disabled]="disabled">
      </ngxsmk-custom-select>
      <ngxsmk-custom-select
        class="ampm-select"
        [options]="ampmOptions"
        [(value)]="isPm"
        (valueChange)="isPmChange.emit($any($event)); timeChange.emit()"
        [disabled]="disabled">
      </ngxsmk-custom-select>
    </div>
  `
})
/**
 * Component for selecting time (Hours, Minutes, Seconds, AM/PM).
 * 
 * @remarks
 * Renders a row of custom select dropdowns for each time component.
 * It handles the display logic and emits individual changes which are aggregated
 * by the parent component into a full date-time update.
 */
export class TimeSelectionComponent {
  @Input() hourOptions: { label: string; value: number }[] = [];
  @Input() minuteOptions: { label: string; value: number }[] = [];
  @Input() secondOptions: { label: string; value: number }[] = [];
  @Input() ampmOptions: { label: string; value: boolean }[] = [
    { label: 'AM', value: false },
    { label: 'PM', value: true }
  ];
  @Input() currentDisplayHour: number = 12;
  @Input() currentMinute: number = 0;
  @Input() currentSecond: number = 0;
  @Input() isPm: boolean = false;
  @Input() disabled: boolean = false;
  @Input() timeLabel: string = 'Time';
  @Input() showSeconds: boolean = false;

  @Output() timeChange = new EventEmitter<void>();
  @Output() currentDisplayHourChange = new EventEmitter<number>();
  @Output() currentMinuteChange = new EventEmitter<number>();
  @Output() currentSecondChange = new EventEmitter<number>();
  @Output() isPmChange = new EventEmitter<boolean>();
}

