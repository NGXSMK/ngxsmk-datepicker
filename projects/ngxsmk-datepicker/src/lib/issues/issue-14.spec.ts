import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent Feature Tests', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start the week on Monday when weekStartDay is 1', () => {
    component.isCalendarOpen = true;
    component.weekStartDay = 1;
    component.ngOnChanges({
        weekStartDay: {
            currentValue: 1,
            previousValue: 0,
            firstChange: true,
            isFirstChange: () => true
        }
    });
    fixture.detectChanges();
    const dayNames = fixture.debugElement.queryAll(By.css('.ngxsmk-day-name'));
    expect(dayNames[0].nativeElement.textContent).toBe('Mon');
  });

  it('should display custom button labels', () => {
    const inputGroup = fixture.debugElement.query(By.css('.ngxsmk-input-group'));
    expect(inputGroup).toBeTruthy();
    inputGroup.triggerEventHandler('click', null);
    fixture.detectChanges();

    component.clearButtonLabel = 'Reset';
    component.closeButtonLabel = 'Done';
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.ngxsmk-clear-button-footer'));
    const closeButton = fixture.debugElement.query(By.css('.ngxsmk-close-button'));
    expect(clearButton).toBeTruthy();
    expect(closeButton).toBeTruthy();
    expect(clearButton.nativeElement.textContent.trim()).toBe('Reset');
    expect(closeButton.nativeElement.textContent.trim()).toBe('Done');
  });

  it('should have aria-labels on navigation buttons', async () => {
    const inputGroup = fixture.debugElement.query(By.css('.ngxsmk-input-group'));
    inputGroup.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const navButtons = fixture.debugElement.queryAll(By.css('.ngxsmk-nav-button'));
    expect(navButtons.length).toBe(2, 'Should find two navigation buttons');
    
    const prevButton = navButtons[0];
    const nextButton = navButtons[1];

    expect(prevButton.nativeElement.getAttribute('aria-label')).toBe('Previous month');
    expect(nextButton.nativeElement.getAttribute('aria-label')).toBe('Next month');
  });

  it('should generate a custom year range', () => {
    component.isCalendarOpen = true;
    component.yearRange = 5;
    component.ngOnChanges({
        yearRange: {
            currentValue: 5,
            previousValue: 10,
            firstChange: true,
            isFirstChange: () => true
        }
    });
    fixture.detectChanges();
    const currentYear = new Date().getFullYear();
    const expectedYearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    expect(component.yearOptions.map(opt => opt.value)).toEqual(expectedYearOptions);
  });
});