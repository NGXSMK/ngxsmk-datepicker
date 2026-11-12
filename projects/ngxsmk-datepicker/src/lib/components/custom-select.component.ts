import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type CustomSelectOption = { label: string; value: unknown; disabled?: boolean };

@Component({
  selector: 'ngxsmk-custom-select',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-open]': 'isOpen',
  },
  template: `
    <div class="ngxsmk-select-container" [class.is-open]="isOpen" #container>
      <button
        type="button"
        class="ngxsmk-select-display"
        role="combobox"
        [disabled]="disabled"
        [attr.aria-expanded]="isOpen"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-controls]="isOpen ? listboxId : null"
        [attr.aria-activedescendant]="isOpen ? activeOptionId : null"
        (click)="toggleDropdown(); $event.stopPropagation()"
        (keydown)="onTriggerKeydown($event)"
        #button
      >
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
        <div class="ngxsmk-options-panel" role="listbox" [id]="listboxId" #panel>
          <ul role="presentation">
            @for (option of options; track option.value; let i = $index) {
              <li
                [id]="optionId(i)"
                [class.selected]="option.value === value"
                [class.disabled]="option.disabled"
                [class.active]="i === activeIndex"
                (click)="option.disabled ? null : selectOption(option); $event.stopPropagation()"
                (keydown.enter)="option.disabled ? null : selectOption(option); $event.stopPropagation()"
                (keydown.space)="
                  option.disabled ? null : selectOption(option); $event.stopPropagation(); $event.preventDefault()
                "
                [attr.tabindex]="-1"
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
  @Input() options: CustomSelectOption[] = [];
  @Input() value: unknown;
  private isDisabled = false;
  @Input()
  set disabled(value: boolean) {
    this.isDisabled = value;
    if (value) {
      this.isOpen = false;
      this.activeIndex = -1;
    }
  }
  get disabled(): boolean {
    return this.isDisabled;
  }
  @Output() valueChange = new EventEmitter<unknown>();
  @ViewChild('container', { static: false }) container!: ElementRef<HTMLDivElement>;
  @ViewChild('button', { static: false }) button!: ElementRef<HTMLButtonElement>;
  @ViewChild('panel', { static: false }) panel!: ElementRef<HTMLDivElement>;

  public isOpen = false;
  public activeIndex = -1;
  readonly listboxId = `ngxsmk-select-${Math.random().toString(36).slice(2, 10)}`;

  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private resizeObserver: ResizeObserver | null = null;
  private openTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private typeaheadBuffer = '';
  private typeaheadTimeoutId: ReturnType<typeof setTimeout> | null = null;

  get activeOptionId(): string | null {
    return this.activeIndex >= 0 ? this.optionId(this.activeIndex) : null;
  }

  optionId(index: number): string {
    return `${this.listboxId}-opt-${index}`;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setupResizeObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.openTimeoutId !== null) {
      clearTimeout(this.openTimeoutId);
      this.openTimeoutId = null;
    }
    if (this.typeaheadTimeoutId !== null) {
      clearTimeout(this.typeaheadTimeoutId);
      this.typeaheadTimeoutId = null;
    }
  }

  private setupResizeObserver(): void {
    if (this.isBrowser && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        // Panel uses relative CSS positioning; observer kept for future fixed overlays.
      });
      if (this.container?.nativeElement) {
        this.resizeObserver.observe(this.container.nativeElement);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent | TouchEvent): void {
    if (this.isBrowser) {
      if (event.composedPath && typeof event.composedPath === 'function') {
        const path = event.composedPath();
        if (!path.includes(this.elementRef.nativeElement)) {
          this.closeDropdown();
        }
      } else {
        const target = event.target as Node;
        if (target && !this.elementRef.nativeElement.contains(target)) {
          this.closeDropdown();
        }
      }
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    if (!this.isBrowser || !this.isOpen) return;

    const calendarBackdrop = this.document.querySelector('.ngxsmk-backdrop');
    if (!calendarBackdrop) return;

    if (event.composedPath && typeof event.composedPath === 'function') {
      const path = event.composedPath();
      if (!path.includes(this.elementRef.nativeElement)) {
        this.closeDropdown();
      }
    } else {
      const target = event.target as Node;
      if (target && !this.elementRef.nativeElement.contains(target)) {
        this.closeDropdown();
      }
    }
  }

  get displayValue(): string {
    const selectedOption = this.options.find((opt) => opt.value === this.value);
    return selectedOption ? selectedOption.label : '';
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.moveActive(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown(true);
        } else {
          this.moveActive(-1);
        }
        break;
      case 'Home':
        if (this.isOpen) {
          event.preventDefault();
          this.setActiveToEdge('start');
        }
        break;
      case 'End':
        if (this.isOpen) {
          event.preventDefault();
          this.setActiveToEdge('end');
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else if (this.activeIndex >= 0) {
          const option = this.options[this.activeIndex];
          if (option && !option.disabled) {
            this.selectOption(option);
          }
        } else {
          this.closeDropdown();
        }
        break;
      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          event.stopPropagation();
          this.closeDropdown();
          this.button?.nativeElement?.focus();
        }
        break;
      case 'Tab':
        if (this.isOpen) {
          this.closeDropdown();
        }
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          this.handleTypeahead(event.key);
        }
        break;
    }
  }

  private openDropdown(fromEnd = false): void {
    this.isOpen = true;
    const selectedIndex = this.options.findIndex((opt) => opt.value === this.value && !opt.disabled);
    if (selectedIndex >= 0) {
      this.activeIndex = selectedIndex;
    } else {
      this.setActiveToEdge(fromEnd ? 'end' : 'start');
    }

    if (this.openTimeoutId !== null) {
      clearTimeout(this.openTimeoutId);
    }
    this.openTimeoutId = setTimeout(() => {
      this.openTimeoutId = null;
      this.scrollActiveIntoView();
    }, 0);
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.activeIndex = -1;
    this.typeaheadBuffer = '';
  }

  private enabledIndexes(): number[] {
    return this.options
      .map((opt, index) => ({ opt, index }))
      .filter(({ opt }) => !opt.disabled)
      .map(({ index }) => index);
  }

  private moveActive(delta: number): void {
    const enabled = this.enabledIndexes();
    if (!enabled.length) return;

    const currentPos = enabled.indexOf(this.activeIndex);
    let nextPos: number;
    if (currentPos === -1) {
      nextPos = delta > 0 ? 0 : enabled.length - 1;
    } else {
      nextPos = (currentPos + delta + enabled.length) % enabled.length;
    }
    this.activeIndex = enabled[nextPos]!;
    this.scrollActiveIntoView();
  }

  private setActiveToEdge(edge: 'start' | 'end'): void {
    const enabled = this.enabledIndexes();
    if (!enabled.length) {
      this.activeIndex = -1;
      return;
    }
    this.activeIndex = edge === 'start' ? enabled[0]! : enabled[enabled.length - 1]!;
    this.scrollActiveIntoView();
  }

  private handleTypeahead(char: string): void {
    this.typeaheadBuffer += char.toLowerCase();
    if (this.typeaheadTimeoutId !== null) {
      clearTimeout(this.typeaheadTimeoutId);
    }
    this.typeaheadTimeoutId = setTimeout(() => {
      this.typeaheadBuffer = '';
      this.typeaheadTimeoutId = null;
    }, 500);

    const matchIndex = this.options.findIndex(
      (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(this.typeaheadBuffer)
    );
    if (matchIndex >= 0) {
      if (!this.isOpen) {
        this.openDropdown();
      }
      this.activeIndex = matchIndex;
      this.scrollActiveIntoView();
    }
  }

  private scrollActiveIntoView(): void {
    if (!this.isBrowser || !this.panel?.nativeElement || this.activeIndex < 0) return;
    const el = this.panel.nativeElement.querySelector(`#${this.optionId(this.activeIndex)}`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  selectOption(option: CustomSelectOption): void {
    if (this.disabled || option.disabled) return;

    this.value = option.value;
    this.valueChange.emit(this.value);
    this.closeDropdown();
    this.button?.nativeElement?.focus();
  }
}
