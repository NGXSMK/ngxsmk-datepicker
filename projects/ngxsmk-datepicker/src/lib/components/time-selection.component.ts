import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './custom-select.component';

@Component({
  selector: 'ngxsmk-time-selection',
  standalone: true,
  imports: [CommonModule, CustomSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ngxsmk-time-selection" [class.is-mobile]="isMobile">
      @if (!isMobile) {
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
        @if (showSeconds) {
          <ngxsmk-custom-select
            class="second-select"
            [options]="secondOptions"
            [(value)]="currentSecond"
            (valueChange)="currentSecondChange.emit($any($event)); timeChange.emit()"
            [disabled]="disabled">
          </ngxsmk-custom-select>
        }
        @if (showAmpm) {
          <ngxsmk-custom-select
            class="ampm-select"
            [options]="ampmOptions"
            [(value)]="isPm"
            (valueChange)="isPmChange.emit($any($event)); timeChange.emit()"
            [disabled]="disabled">
          </ngxsmk-custom-select>
        }
      } @else {
        <div class="ngxsmk-mobile-time-picker">
          <span class="ngxsmk-time-label" style="display: none;">{{ timeLabel }}</span>
          <div class="ngxsmk-wheel-container">
            <!-- Hour Wheel -->
            <div class="ngxsmk-wheel" #hourWheel (scroll)="onWheelScroll('hour')">
              <div class="ngxsmk-wheel-spacer"></div>
              @for (opt of hourOptions; track opt.value) {
                <div class="ngxsmk-wheel-item" [class.is-selected]="opt.value === currentDisplayHour" 
                     (click)="scrollToValue('hour', opt.value)">
                  {{ opt.label }}
                </div>
              }
              <div class="ngxsmk-wheel-spacer"></div>
            </div>

            <div class="ngxsmk-wheel-separator ngxsmk-time-separator">:</div>

            <!-- Minute Wheel -->
            <div class="ngxsmk-wheel" #minuteWheel (scroll)="onWheelScroll('minute')">
              <div class="ngxsmk-wheel-spacer"></div>
              @for (opt of minuteOptions; track opt.value) {
                <div class="ngxsmk-wheel-item" [class.is-selected]="opt.value === currentMinute"
                     (click)="scrollToValue('minute', opt.value)">
                  {{ opt.label }}
                </div>
              }
              <div class="ngxsmk-wheel-spacer"></div>
            </div>

            @if (showSeconds) {
              <div class="ngxsmk-wheel-separator ngxsmk-time-separator">:</div>
              <!-- Second Wheel -->
              <div class="ngxsmk-wheel second-select" #secondWheel (scroll)="onWheelScroll('second')">
                <div class="ngxsmk-wheel-spacer"></div>
                @for (opt of secondOptions; track opt.value) {
                  <div class="ngxsmk-wheel-item" [class.is-selected]="opt.value === currentSecond"
                       (click)="scrollToValue('second', opt.value)">
                    {{ opt.label }}
                  </div>
                }
                <div class="ngxsmk-wheel-spacer"></div>
              </div>
            }

            @if (showAmpm) {
              <!-- AM/PM Wheel -->
              <div class="ngxsmk-wheel ampm-wheel" #ampmWheel (scroll)="onWheelScroll('ampm')">
                <div class="ngxsmk-wheel-spacer"></div>
                @for (opt of ampmOptions; track opt.value) {
                  <div class="ngxsmk-wheel-item" [class.is-selected]="opt.value === isPm"
                       (click)="scrollToValue('ampm', opt.value)">
                    {{ opt.label }}
                  </div>
                }
                <div class="ngxsmk-wheel-spacer"></div>
              </div>
            }
            
            <!-- Selection Overlay (The highlight lens) -->
            <div class="ngxsmk-wheel-overlay"></div>
          </div>
        </div>
      }
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
export class TimeSelectionComponent implements AfterViewInit, OnDestroy {
  @Input() hourOptions: { label: string; value: number }[] = [];
  @Input() minuteOptions: { label: string; value: number }[] = [];
  @Input() secondOptions: { label: string; value: number }[] = [];
  @Input() ampmOptions: { label: string; value: any }[] = [
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
  @Input() showAmpm: boolean = true;

  @Output() timeChange = new EventEmitter<void>();
  @Output() currentDisplayHourChange = new EventEmitter<number>();
  @Output() currentMinuteChange = new EventEmitter<number>();
  @Output() currentSecondChange = new EventEmitter<number>();
  @Output() isPmChange = new EventEmitter<boolean>();

  @ViewChild('hourWheel') hourWheel?: ElementRef<HTMLDivElement>;
  @ViewChild('minuteWheel') minuteWheel?: ElementRef<HTMLDivElement>;
  @ViewChild('secondWheel') secondWheel?: ElementRef<HTMLDivElement>;
  @ViewChild('ampmWheel') ampmWheel?: ElementRef<HTMLDivElement>;

  public isMobile = false;
  private scrollTimeout: any;
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.checkMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    const wasMobile = this.isMobile;
    this.isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (wasMobile !== this.isMobile) {
      this.cdr.markForCheck();
      if (this.isMobile) {
        setTimeout(() => this.initializeWheels(), 50);
      }
    }
  }

  ngAfterViewInit() {
    if (this.isMobile) {
      this.initializeWheels();
    }
  }

  ngOnDestroy() {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
  }

  private initializeWheels() {
    this.scrollToValue('hour', this.currentDisplayHour, 'auto');
    this.scrollToValue('minute', this.currentMinute, 'auto');
    if (this.showSeconds) this.scrollToValue('second', this.currentSecond, 'auto');
    if (this.showAmpm) this.scrollToValue('ampm', this.isPm, 'auto');
  }

  public scrollToValue(type: 'hour' | 'minute' | 'second' | 'ampm', value: any, behavior: ScrollBehavior = 'smooth') {
    const wheel = this.getWheel(type);
    if (!wheel) return;

    const options = this.getOptions(type);
    const index = options.findIndex(opt => opt.value === value);
    if (index === -1) return;

    const itemHeight = 44; // Matches CSS
    wheel.scrollTo({
      top: index * itemHeight,
      behavior
    });
  }

  onWheelScroll(type: 'hour' | 'minute' | 'second' | 'ampm') {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => this.updateValueFromScroll(type), 150);
  }

  private updateValueFromScroll(type: 'hour' | 'minute' | 'second' | 'ampm') {
    const wheel = this.getWheel(type);
    if (!wheel) return;

    const itemHeight = 44;
    const index = Math.round(wheel.scrollTop / itemHeight);
    const options = this.getOptions(type);

    if (options[index]) {
      const newValue = options[index].value;
      this.applyValue(type, newValue);
    }
  }

  private getWheel(type: string): HTMLDivElement | undefined {
    switch (type) {
      case 'hour': return this.hourWheel?.nativeElement;
      case 'minute': return this.minuteWheel?.nativeElement;
      case 'second': return this.secondWheel?.nativeElement;
      case 'ampm': return this.ampmWheel?.nativeElement;
      default: return undefined;
    }
  }

  private getOptions(type: string): any[] {
    switch (type) {
      case 'hour': return this.hourOptions;
      case 'minute': return this.minuteOptions;
      case 'second': return this.secondOptions;
      case 'ampm': return this.ampmOptions;
      default: return [];
    }
  }

  private applyValue(type: string, value: any) {
    let changed = false;
    switch (type) {
      case 'hour':
        if (this.currentDisplayHour !== value) {
          this.currentDisplayHour = value;
          this.currentDisplayHourChange.emit(value);
          changed = true;
        }
        break;
      case 'minute':
        if (this.currentMinute !== value) {
          this.currentMinute = value;
          this.currentMinuteChange.emit(value);
          changed = true;
        }
        break;
      case 'second':
        if (this.currentSecond !== value) {
          this.currentSecond = value;
          this.currentSecondChange.emit(value);
          changed = true;
        }
        break;
      case 'ampm':
        if (this.isPm !== value) {
          this.isPm = value;
          this.isPmChange.emit(value);
          changed = true;
        }
        break;
    }
    if (changed) {
      this.timeChange.emit();
      this.cdr.markForCheck();
    }
  }
}

