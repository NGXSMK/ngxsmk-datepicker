import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { DatepickerClasses } from '../interfaces/datepicker-classes.interface';

@Component({
  selector: 'ngxsmk-datepicker-input',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (isNative) {
      <div
        class="ngxsmk-input-group ngxsmk-native-input-group"
        [class.disabled]="disabled"
        [ngClass]="classes?.inputGroup"
      >
        <input
          [type]="nativeInputType"
          #nativeInput
          [value]="formattedValue"
          [placeholder]="placeholder"
          [id]="id"
          [name]="name"
          [autocomplete]="autocomplete"
          [disabled]="disabled"
          [required]="required"
          [attr.min]="minDateNative"
          [attr.max]="maxDateNative"
          [attr.aria-label]="ariaLabel"
          [attr.aria-required]="required"
          [attr.aria-invalid]="errorState"
          [attr.aria-describedby]="ariaDescribedBy"
          class="ngxsmk-display-input ngxsmk-native-input"
          [ngClass]="classes?.input"
          (change)="onNativeInputChange($event)"
          (blur)="onInputBlur($event)"
        />
        @if (formattedValue) {
          <button
            type="button"
            class="ngxsmk-clear-button"
            (click)="onClearValue($event)"
            [disabled]="disabled"
            [attr.aria-label]="clearAriaLabel"
            [title]="clearLabel"
            [ngClass]="classes?.clearBtn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="16"
              height="16"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M368 368L144 144M368 144L144 368"
              />
            </svg>
          </button>
        }
      </div>
    } @else {
      <div class="ngxsmk-input-and-error">
        <div
          class="ngxsmk-input-group"
          (click)="onToggleCalendar($event)"
          (pointerdown)="onPointerDown($event)"
          (pointerup)="onPointerUp($event)"
          (focus)="onInputGroupFocus()"
          (keydown.enter)="onToggleCalendar($event)"
          (keydown.space)="onToggleCalendar($event); $event.preventDefault()"
          [class.disabled]="disabled"
          role="button"
          [attr.aria-disabled]="disabled"
          aria-haspopup="dialog"
          [attr.aria-expanded]="isCalendarOpen"
          tabindex="0"
          [ngClass]="classes?.inputGroup"
        >
          <input
            type="text"
            #customInput
            [value]="allowTyping ? typedInputValue || displayValue : displayValue"
            [placeholder]="placeholder"
            [id]="id"
            [name]="name"
            [autocomplete]="autocomplete"
            [readonly]="!allowTyping"
            [disabled]="disabled"
            [required]="required"
            [attr.aria-label]="ariaLabel"
            [attr.aria-required]="required"
            [attr.aria-invalid]="errorState"
            [attr.aria-describedby]="ariaDescribedBy"
            class="ngxsmk-display-input"
            [ngClass]="classes?.input"
            (keydown.enter)="onInputKeyDown($event)"
            (keydown.space)="onInputKeyDown($event)"
            (keydown.escape)="onInputKeyDown($event)"
            (input)="onInputChange($event)"
            (blur)="onInputBlur($event)"
            (focus)="onInputFocus($event)"
          />
          @if (displayValue) {
            <button
              type="button"
              class="ngxsmk-clear-button"
              (click)="onClearValue($event)"
              (touchstart)="$event.stopPropagation()"
              (touchend)="$event.stopPropagation()"
              (pointerdown)="$event.stopPropagation()"
              (pointerup)="$event.stopPropagation()"
              [disabled]="disabled"
              [attr.aria-label]="clearAriaLabel"
              [title]="clearLabel"
              [ngClass]="classes?.clearBtn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="16"
                height="16"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M368 368L144 144M368 144L144 368"
                />
              </svg>
            </button>
          }
          @if (showCalendarButton) {
            <button
              type="button"
              class="ngxsmk-calendar-button"
              (click)="onToggleCalendar($event); $event.stopPropagation()"
              [disabled]="disabled"
              [attr.aria-label]="calendarAriaLabel"
              [title]="calendarAriaLabel"
              [ngClass]="classes?.calendarBtn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M96 80H416c26.51 0 48 21.49 48 48V416c0 26.51-21.49 48-48 48H96c-26.51 0-48-21.49-48-48V128c0-26.51 21.49-48 48-48zM160 32v64M352 32v64M464 192H48M200 256h112M200 320h112M200 384h112M152 256h.01M152 320h.01M152 384h.01"
                />
              </svg>
            </button>
          }
        </div>
        @if (validationErrorMessage) {
          <div class="ngxsmk-validation-error" role="alert" [attr.aria-live]="'polite'">
            {{ validationErrorMessage }}
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDatepickerInputComponent {
  @Input() isNative: boolean = false;
  @Input() disabled: boolean = false;
  @Input() classes: DatepickerClasses | undefined = undefined;
  @Input() nativeInputType: string = 'date';
  @Input() formattedValue: string = '';
  @Input() placeholder: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() autocomplete: string = 'off';
  @Input() required: boolean = false;
  @Input() minDateNative: string | null = null;
  @Input() maxDateNative: string | null = null;
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';
  @Input() errorState: boolean = false;
  @Input() clearAriaLabel: string = '';
  @Input() clearLabel: string = '';
  @Input() isCalendarOpen: boolean = false;
  @Input() allowTyping: boolean = false;
  @Input() typedInputValue: string = '';
  @Input() displayValue: string = '';
  @Input() showCalendarButton: boolean = false;
  @Input() calendarAriaLabel: string = '';
  @Input() validationErrorMessage: string | null = null;

  @Output() nativeInputChange = new EventEmitter<Event>();
  @Output() inputBlur = new EventEmitter<FocusEvent>();
  @Output() clearValue = new EventEmitter<MouseEvent>();
  @Output() toggleCalendar = new EventEmitter<Event>();
  @Output() pointerDown = new EventEmitter<PointerEvent>();
  @Output() pointerUp = new EventEmitter<PointerEvent>();
  @Output() inputGroupFocus = new EventEmitter<void>();
  @Output() inputKeyDown = new EventEmitter<Event>();
  @Output() inputChange = new EventEmitter<Event>();
  @Output() inputFocus = new EventEmitter<FocusEvent>();

  @ViewChild('nativeInput') nativeInput?: ElementRef<HTMLInputElement>;
  @ViewChild('customInput') customInput?: ElementRef<HTMLInputElement>;

  focus(): void {
    if (this.isNative) {
      this.nativeInput?.nativeElement.focus();
    } else {
      this.customInput?.nativeElement.focus();
    }
  }

  onNativeInputChange(event: Event): void {
    this.nativeInputChange.emit(event);
  }

  onInputBlur(event: FocusEvent): void {
    this.inputBlur.emit(event);
  }

  onClearValue(event: MouseEvent): void {
    event.stopPropagation();
    this.clearValue.emit(event);
  }

  onToggleCalendar(event: Event): void {
    this.toggleCalendar.emit(event);
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerDown.emit(event);
  }

  onPointerUp(event: PointerEvent): void {
    this.pointerUp.emit(event);
  }

  onInputGroupFocus(): void {
    this.inputGroupFocus.emit();
  }

  onInputKeyDown(event: Event): void {
    this.inputKeyDown.emit(event);
  }

  onInputChange(event: Event): void {
    this.inputChange.emit(event);
  }

  onInputFocus(event: FocusEvent): void {
    this.inputFocus.emit(event);
  }
}
