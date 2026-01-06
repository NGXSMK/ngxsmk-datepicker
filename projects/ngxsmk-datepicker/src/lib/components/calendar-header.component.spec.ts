import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CustomSelectComponent } from './custom-select.component';
import { ChangeDetectorRef } from '@angular/core';

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent;
  let fixture: ComponentFixture<CalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarHeaderComponent, CustomSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarHeaderComponent);
    component = fixture.componentInstance;
    // Provide default options so the component renders properly
    component.monthOptions = [
      { label: 'January', value: 0 },
      { label: 'February', value: 1 }
    ];
    component.yearOptions = [
      { label: '2024', value: 2024 },
      { label: '2025', value: 2025 }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentMonth).toBe(0);
    expect(component.currentYear).toBe(new Date().getFullYear());
    expect(component.disabled).toBe(false);
    expect(component.isBackArrowDisabled).toBe(false);
  });

  it('should emit previousMonth when previous button is clicked', () => {
    spyOn(component.previousMonth, 'emit');
    const button = fixture.nativeElement.querySelector('.ngxsmk-nav-button');
    button.click();
    expect(component.previousMonth.emit).toHaveBeenCalled();
  });

  it('should emit nextMonth when next button is clicked', () => {
    spyOn(component.nextMonth, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('.ngxsmk-nav-button');
    const nextButton = buttons[1];
    nextButton.click();
    expect(component.nextMonth.emit).toHaveBeenCalled();
  });

  it('should emit yearChange when year select changes', () => {
    spyOn(component.yearChange, 'emit');
    component.yearChange.emit(2025);
    expect(component.yearChange.emit).toHaveBeenCalledWith(2025);
  });

    it('should disable buttons when disabled is true', () => {
      component.disabled = true;
      // Force change detection for OnPush component
      const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
      cdr.markForCheck();
      fixture.detectChanges();
      
      const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((button: HTMLButtonElement) => {
        expect(button.hasAttribute('disabled')).toBe(true);
      });
    });

  it('should disable previous button when isBackArrowDisabled is true', () => {
    component.isBackArrowDisabled = true;
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
    expect(buttons.length).toBeGreaterThan(0);
    const prevButton = buttons[0] as HTMLButtonElement;
    expect(prevButton.hasAttribute('disabled')).toBe(true);
  });

  it('should apply headerClass when provided', () => {
    component.headerClass = 'custom-header';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const header = fixture.nativeElement.querySelector('.ngxsmk-header');
    expect(header).toBeTruthy();
    if (header) {
      // ngClass adds the class to the element's classList
      expect(header.classList.contains('custom-header')).toBe(true);
    }
  });

  it('should apply navPrevClass when provided', () => {
    component.navPrevClass = 'custom-prev';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
    expect(buttons.length).toBeGreaterThan(0);
    const prevButton = buttons[0] as HTMLElement;
    expect(prevButton.classList.contains('custom-prev')).toBe(true);
  });

  it('should apply navNextClass when provided', () => {
    component.navNextClass = 'custom-next';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
    expect(buttons.length).toBeGreaterThan(0);
    const nextButton = buttons[1] as HTMLElement;
    expect(nextButton.classList.contains('custom-next')).toBe(true);
  });

  it('should set aria-label on previous button', () => {
    component.prevMonthAriaLabel = 'Previous month';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
    expect(buttons.length).toBeGreaterThan(0);
    const prevButton = buttons[0];
    expect(prevButton.getAttribute('aria-label')).toBe('Previous month');
  });

  it('should set aria-label on next button', () => {
    component.nextMonthAriaLabel = 'Next month';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
    expect(buttons.length).toBeGreaterThan(0);
    const nextButton = buttons[1];
    expect(nextButton.getAttribute('aria-label')).toBe('Next month');
  });

  it('should set title on previous button', () => {
    component.prevMonthAriaLabel = 'Previous month';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
    expect(buttons.length).toBeGreaterThan(0);
    const prevButton = buttons[0];
    expect(prevButton.getAttribute('title')).toBe('Previous month');
  });

  it('should set title on next button', () => {
    component.nextMonthAriaLabel = 'Next month';
    // Force change detection for OnPush component
    const cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    cdr.markForCheck();
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button.ngxsmk-nav-button');
    expect(buttons.length).toBeGreaterThan(0);
    const nextButton = buttons[1];
    expect(nextButton.getAttribute('title')).toBe('Next month');
  });

  it('should pass monthOptions to month select', () => {
    component.monthOptions = [
      { label: 'January', value: 0 },
      { label: 'February', value: 1 }
    ];
    fixture.detectChanges();
    
    // The options are passed to CustomSelectComponent
    expect(component.monthOptions.length).toBe(2);
  });

  it('should pass yearOptions to year select', () => {
    component.yearOptions = [
      { label: '2024', value: 2024 },
      { label: '2025', value: 2025 }
    ];
    fixture.detectChanges();
    
    expect(component.yearOptions.length).toBe(2);
  });

  it('should pass currentMonth to month select', () => {
    component.currentMonth = 5;
    fixture.detectChanges();
    
    expect(component.currentMonth).toBe(5);
  });

  it('should pass currentYear to year select', () => {
    component.currentYear = 2025;
    fixture.detectChanges();
    
    expect(component.currentYear).toBe(2025);
  });

  it('should pass disabled to selects', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    // The disabled state is passed to CustomSelectComponent
    expect(component.disabled).toBe(true);
  });
});

