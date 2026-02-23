import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, PLATFORM_ID, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'ngxsmk-custom-select',
  standalone: true,
  imports: [],
  host: {
    '[attr.data-open]': 'isOpen'
  },
  template: `
    <div class="ngxsmk-select-container" [class.is-open]="isOpen" (click)="toggleDropdown()" (keydown.enter)="toggleDropdown()" (keydown.space)="toggleDropdown(); $event.preventDefault()" tabindex="0" role="button" [attr.aria-expanded]="isOpen" #container>
      <button type="button" class="ngxsmk-select-display" [disabled]="disabled" #button>
        <span>{{ displayValue }}</span>
        <svg class="ngxsmk-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                d="M112 184l144 144 144-144"/>
        </svg>
      </button>
      @if (isOpen) {
        <div class="ngxsmk-options-panel" 
             #panel>
          <ul>
            @for (option of options; track option.value) {
              <li [class.selected]="option.value === value" (click)="selectOption(option); $event.stopPropagation()" (keydown.enter)="selectOption(option); $event.stopPropagation()" (keydown.space)="selectOption(option); $event.stopPropagation(); $event.preventDefault()" [attr.tabindex]="0" role="option" [attr.aria-selected]="option.value === value">
                {{ option.label }}
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { 
      position: relative; 
      display: flex;
      flex: 1;
      min-width: 0;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      z-index: 1;
      box-sizing: border-box;
    }
    :host[data-open="true"] {
      z-index: 10000000;
    }
    .ngxsmk-time-selection :host[data-open="true"] {
      z-index: 10000000 !important;
    }
    .ngxsmk-select-container { 
      cursor: pointer; 
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      min-height: 100%;
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      z-index: inherit;
      outline: none;
    }
    .ngxsmk-select-container.is-open {
      z-index: 10000000;
    }
    .ngxsmk-time-selection .ngxsmk-select-container.is-open {
      z-index: 10000000 !important;
    }
    .ngxsmk-select-display {
      display: flex; 
      align-items: center;
      flex: 1;
      width: 100%;
      height: 100%;
      min-height: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0.06); 
      background: rgba(0, 0, 0, 0.02);
      color: var(--datepicker-text-color, #1f2937);
      border-radius: var(--datepicker-border-radius, 8px); 
      padding: 8px 16px; 
      font-size: 14px; 
      text-align: left; 
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: none;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
    }
    .ngxsmk-select-display:hover:not(:disabled) {
      border-color: var(--datepicker-primary-color, #6d28d9);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .ngxsmk-select-container:focus-within .ngxsmk-select-display {
      background: var(--datepicker-background, #fff);
      box-shadow: 0 0 0 2px rgba(var(--datepicker-primary-rgb, 109, 40, 217), 0.1);
      border-color: var(--datepicker-primary-color, #6d28d9);
    }
    .ngxsmk-select-display:disabled {
      background-color: var(--datepicker-hover-background, #f3f4f6);
      cursor: not-allowed;
      opacity: 0.6;
    }
    .ngxsmk-arrow-icon { 
      width: 14px; 
      height: 14px; 
      margin-left: 8px; 
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
      backface-visibility: hidden;
      flex-shrink: 0;
    }
    .ngxsmk-select-container.is-open .ngxsmk-arrow-icon {
      transform: rotate(180deg);
    }
    .ngxsmk-options-panel {
      position: absolute; 
      top: calc(100% + 4px); 
      left: 0; 
      width: 100%;
      background: var(--datepicker-background, #fff); 
      border: 1px solid var(--datepicker-border-color, #e5e7eb);
      color: var(--datepicker-text-color, #1f2937); 
      border-radius: var(--datepicker-border-radius, 8px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
      max-height: 200px; 
      overflow-y: auto; 
      z-index: 9999999;
      animation: fadeInDown 0.12s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, opacity;
      backface-visibility: hidden;
      transform: translateZ(0);
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    @media (max-width: 768px) {
      .ngxsmk-options-panel li { 
        padding: 12px 16px !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        font-size: 14px !important;
      }
    }
    .ngxsmk-time-selection .ngxsmk-options-panel {
      z-index: 10000001 !important;
      position: absolute !important;
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    .ngxsmk-options-panel.fixed-position {
      position: fixed !important;
    }
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translate3d(0, -4px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    .ngxsmk-options-panel {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    .ngxsmk-options-panel ul { 
      list-style: none; 
      padding: 4px; 
      margin: 0;
      min-height: 50px;
    }
    .ngxsmk-options-panel li { 
      padding: 10px 12px; 
      border-radius: var(--datepicker-radius-sm, 6px); 
      cursor: pointer; 
      transition: background-color 0.12s cubic-bezier(0.4, 0, 0.2, 1), color 0.12s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 400;
      margin: 2px 0;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    .ngxsmk-options-panel li:hover:not(.selected) { 
      background-color: var(--datepicker-hover-background, #f3f4f6); 
    }
    .ngxsmk-options-panel li.selected {
      background-color: var(--datepicker-primary-color, #6d28d9); 
      color: var(--datepicker-primary-contrast, #fff);
      font-weight: 600;
    }
    .ngxsmk-options-panel::-webkit-scrollbar {
      display: none;
    }

  `],
})
export class CustomSelectComponent implements AfterViewInit, OnDestroy {
  @Input() options: { label: string; value: unknown }[] = [];
  @Input() value: unknown;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<unknown>();
  @ViewChild('container', { static: false }) container!: ElementRef<HTMLDivElement>;
  @ViewChild('button', { static: false }) button!: ElementRef<HTMLButtonElement>;
  @ViewChild('panel', { static: false }) panel!: ElementRef<HTMLDivElement>;

  public isOpen = false;

  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private resizeObserver: ResizeObserver | null = null;
  private scrollListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setupResizeObserver();
      this.setupScrollListener();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.scrollListener && this.isBrowser) {
      window.removeEventListener('scroll', this.scrollListener, true);
    }
  }

  private setupResizeObserver(): void {
    if (this.isBrowser && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isOpen) {
          this.updatePanelPosition();
        }
      });
      if (this.container?.nativeElement) {
        this.resizeObserver.observe(this.container.nativeElement);
      }
    }
  }

  private setupScrollListener(): void {
    if (this.isBrowser) {
      this.scrollListener = () => {
        if (this.isOpen) {
          // Absolute positioning doesn't need updates on scroll
        }
      };
      window.addEventListener('scroll', this.scrollListener, { passive: true, capture: true });
    }
  }

  private updatePanelPosition(): void {
    // No special positioning needed for standard dropdowns
    // CSS handles top: 100% + 4px
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent | TouchEvent): void {
    if (this.isBrowser) {
      const target = event.target as Node;
      if (target && !this.elementRef.nativeElement.contains(target)) {
        this.isOpen = false;
      }

      // Logic removed: forcing closure when calendar is open prevented dropdown from opening

    }
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    // On mobile, close dropdown when calendar opens
    if (this.isBrowser && this.isOpen) {
      const calendarBackdrop = this.document.querySelector('.ngxsmk-backdrop');
      if (calendarBackdrop) {
        const target = event.target as Node;
        // Only close if touch is outside the dropdown
        if (target && !this.elementRef.nativeElement.contains(target)) {
          this.isOpen = false;
        }
      }
    }
  }

  get displayValue(): string {
    const selectedOption = this.options.find((opt) => opt.value === this.value);
    return selectedOption ? selectedOption.label : '';
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.updatePanelPosition();
        this.scrollToSelected();
      }, 0);
    }
  }

  private scrollToSelected(): void {
    if (!this.isBrowser || !this.panel?.nativeElement) return;

    const selectedEl = this.panel.nativeElement.querySelector('.selected') as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  selectOption(option: { label: string; value: unknown }): void {
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.isOpen = false;
  }
}


