import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngxsmk-datepicker-keyboard-help',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../styles/variables.css', '../styles/keyboard-help.css'],
  template: `
    <div
      class="ngxsmk-keyboard-help-backdrop"
      (click)="closeRequested.emit()"
      (keydown.enter)="closeRequested.emit()"
      (keydown.space)="closeRequested.emit()"
      tabindex="0"
      role="button"
      [attr.aria-label]="backdropLabel"
    ></div>
    <div class="ngxsmk-keyboard-help-dialog" role="dialog" aria-modal="true" [attr.aria-label]="title">
      <div class="ngxsmk-keyboard-help-header">
        <h3 class="ngxsmk-keyboard-help-title">{{ title }}</h3>
        <button
          type="button"
          class="ngxsmk-keyboard-help-close"
          (click)="closeRequested.emit()"
          [attr.aria-label]="closeLabel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <ul class="ngxsmk-keyboard-help-list">
        <li class="ngxsmk-keyboard-help-item">
          <span>Next/Prev day</span>
          <div>
            <span class="ngxsmk-keyboard-key">←</span>
            <span class="ngxsmk-keyboard-key">→</span>
          </div>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Next/Prev week</span>
          <div>
            <span class="ngxsmk-keyboard-key">↑</span>
            <span class="ngxsmk-keyboard-key">↓</span>
          </div>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Select date</span>
          <div>
            <span class="ngxsmk-keyboard-key">Enter</span>
            <span class="ngxsmk-keyboard-key">Space</span>
          </div>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Next/Prev month</span>
          <div>
            <span class="ngxsmk-keyboard-key">PgUp</span>
            <span class="ngxsmk-keyboard-key">PgDn</span>
          </div>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Next/Prev year</span>
          <div>
            <span class="ngxsmk-keyboard-key">Shift</span> +
            <span class="ngxsmk-keyboard-key">PgUp/Dn</span>
          </div>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>First/Last day</span>
          <div>
            <span class="ngxsmk-keyboard-key">Home</span>
            <span class="ngxsmk-keyboard-key">End</span>
          </div>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Close calendar</span>
          <span class="ngxsmk-keyboard-key">Esc</span>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Today</span>
          <span class="ngxsmk-keyboard-key">T</span>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Yesterday</span>
          <span class="ngxsmk-keyboard-key">Y</span>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Tomorrow</span>
          <span class="ngxsmk-keyboard-key">N</span>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Next Week</span>
          <span class="ngxsmk-keyboard-key">W</span>
        </li>
        <li class="ngxsmk-keyboard-help-item">
          <span>Show shortcuts</span>
          <span class="ngxsmk-keyboard-key">?</span>
        </li>
      </ul>
    </div>
  `,
})
export class NgxsmkDatepickerKeyboardHelpComponent {
  @Input() title = 'Keyboard shortcuts';
  @Input() closeLabel = 'Close';
  @Input() backdropLabel = 'Close overlay';
  @Output() closeRequested = new EventEmitter<void>();
}
