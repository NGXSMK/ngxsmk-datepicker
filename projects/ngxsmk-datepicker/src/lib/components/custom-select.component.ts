import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
  viewChild,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'ngxsmk-custom-select',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-open]': 'isOpen',
  },
  template: `
    <div
      class="ngxsmk-select-container"
      [class.is-open]="isOpen"
      (click)="toggleDropdown()"
      (keydown.enter)="toggleDropdown()"
      (keydown.space)="toggleDropdown(); $event.preventDefault()"
      tabindex="0"
      role="button"
      [attr.aria-expanded]="isOpen"
      #container
    >
      <button type="button" class="ngxsmk-select-display" [disabled]="disabled" #button>
        <span>{{ displayValue }}</span>
        <svg class="ngxsmk-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
            d="M112 184l144 144 144-144"
          />
        </svg>
      </button>
      @if (isOpen) {
        <div class="ngxsmk-options-panel" #panel>
          <ul>
            @for (option of options; track option.value) {
              <li
                [class.selected]="option.value === value"
                [class.disabled]="option.disabled"
                (click)="option.disabled ? null : selectOption(option); $event.stopPropagation()"
                (keydown.enter)="option.disabled ? null : selectOption(option); $event.stopPropagation()"
                (keydown.space)="
                  option.disabled ? null : selectOption(option); $event.stopPropagation(); $event.preventDefault()
                "
                [attr.tabindex]="option.disabled ? -1 : 0"
                role="option"
                [attr.aria-selected]="option.value === value"
                [attr.aria-disabled]="option.disabled ? true : null"
              >
                {{ option.label }}
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class CustomSelectComponent implements AfterViewInit, OnDestroy {
  @Input() options: { label: string; value: unknown; disabled?: boolean }[] = [];
  @Input() value: unknown;
  @Input() disabled: boolean = false;
  readonly valueChange = output<unknown>();
  readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');
  readonly panel = viewChild<ElementRef<HTMLDivElement>>('panel');

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
      const container = this.container();
      if (container?.nativeElement) {
        this.resizeObserver.observe(container.nativeElement);
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
      if (event.composedPath && typeof event.composedPath === 'function') {
        const path = event.composedPath();
        if (!path.includes(this.elementRef.nativeElement)) {
          this.isOpen = false;
        }
      } else {
        const target = event.target as Node;
        if (target && !this.elementRef.nativeElement.contains(target)) {
          this.isOpen = false;
        }
      }
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    // On mobile, close dropdown when calendar opens
    if (!this.isBrowser || !this.isOpen) return;

    const calendarBackdrop = this.document.querySelector('.ngxsmk-backdrop');
    if (!calendarBackdrop) return;

    if (event.composedPath && typeof event.composedPath === 'function') {
      const path = event.composedPath();
      if (!path.includes(this.elementRef.nativeElement)) {
        this.isOpen = false;
      }
    } else {
      const target = event.target as Node;
      // Only close if touch is outside the dropdown
      if (target && !this.elementRef.nativeElement.contains(target)) {
        this.isOpen = false;
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
    const panel = this.panel();
    if (!this.isBrowser || !panel?.nativeElement) return;

    const selectedEl = panel.nativeElement.querySelector('.selected') as HTMLElement;
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
