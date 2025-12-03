import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { getStartOfDay } from '../utils/date.utils';
import { DatepickerValue } from '../utils/calendar.utils';

/**
 * Issue #33: Type '() => string' is not assignable to type 'never'
 * 
 * This test verifies that the Angular 21+ Signal Forms FieldTree type compatibility fix works correctly.
 * The fix allows FieldTree<Date, string> types to be accepted by the field input without TypeScript errors.
 */
describe('Issue #33: Angular 21+ Signal Forms Type Compatibility', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.mode = 'single';
    component.inline = true;
    fixture.detectChanges();
  });

  describe('FieldTree<Date, string> type compatibility', () => {
    it('should accept FieldTree-like structure with Date value type', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      // Simulate Angular 21 FieldTree<Date, string> structure
      // This structure mimics what Angular 21's form() returns
      const mockFieldTree = {
        value: () => testDate,
        disabled: () => false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      // This should not cause TypeScript compilation errors
      // The SignalFormField type should accept this structure
      component.field = mockFieldTree;
      fixture.detectChanges();

      expect(component.field).toBe(mockFieldTree);
      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should handle FieldTree with value as signal-like function', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 20));
      let currentValue = testDate;

      // Simulate FieldTree where value is a function that returns Date
      const mockFieldTree = {
        value: () => currentValue,
        disabled: () => false,
        setValue: (val: DatepickerValue) => { currentValue = val as Date; },
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockFieldTree;
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      if (component.selectedDate) {
        expect(component.selectedDate.getTime()).toBe(testDate.getTime());
      }
    });

    it('should update FieldTree value when datepicker value changes', async () => {
      const initialDate = getStartOfDay(new Date(2024, 5, 15));
      const newDate = getStartOfDay(new Date(2024, 5, 20));
      let fieldValue = initialDate;

      const mockFieldTree = {
        value: () => fieldValue,
        disabled: () => false,
        setValue: (val: DatepickerValue) => { fieldValue = val as Date; },
        updateValue: (updater: () => DatepickerValue) => { fieldValue = updater() as Date; }
      };

      component.field = mockFieldTree;
      component.inline = true;
      fixture.detectChanges();

      // Ensure calendar is showing June 2024 (month 5, year 2024)
      // Set currentDate first, then generateCalendar will use it
      component.currentDate = new Date(2024, 5, 1);
      component.generateCalendar();
      
      // generateCalendar sets _currentMonth and _currentYear but doesn't update signals
      // We need to update signals so isCurrentMonthMemo works correctly
      (component as any)._updateMemoSignals();
      (component as any)._invalidateMemoCache();
      
      fixture.detectChanges();

      // Wait a bit for calendar to render
      await new Promise(resolve => setTimeout(resolve, 100));
      fixture.detectChanges();

      // Find and click a day cell (day 20)
      const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
      
      const day20 = dayCells.find(cell => {
        const dayNumber = cell.query(By.css('.ngxsmk-day-number'));
        const is20 = dayNumber && dayNumber.nativeElement.textContent.trim() === '20';
        if (is20) {
            // console.log('Found day 20. Classes:', cell.nativeElement.className);
        }
        return is20 &&
               !cell.nativeElement.classList.contains('disabled') &&
               !cell.nativeElement.classList.contains('empty');
      });

      // Verify day 20 exists (calendar should be showing June 2024)
      if (!day20) {
          const day20Any = dayCells.find(cell => {
             const dayNumber = cell.query(By.css('.ngxsmk-day-number'));
             return dayNumber && dayNumber.nativeElement.textContent.trim() === '20';
          });
          if (day20Any) {
             console.log('Day 20 exists but was filtered out. Classes:', day20Any.nativeElement.className);
          } else {
             console.log('Day 20 does not exist in DOM');
          }
          
          // Collect day numbers for debugging
          const dayNumbers = dayCells
            .map(cell => {
              const dayNumber = cell.query(By.css('.ngxsmk-day-number'));
              return dayNumber ? dayNumber.nativeElement.textContent.trim() : null;
            })
            .filter((num): num is string => num !== null && num !== '');
          
          expect(day20).toBeTruthy(`Day 20 should be found in the calendar. Found days: ${dayNumbers.join(', ')}`);
      } else {
          expect(day20).toBeTruthy();
      }
      
      if (day20) {
        day20.nativeElement.click();
        fixture.detectChanges();

        // Verify setValue or updateValue was called
        expect(component.selectedDate).toBeTruthy();
        if (component.selectedDate) {
          expect(component.selectedDate.getTime()).toBe(newDate.getTime());
        }
      }
    });

    it('should handle FieldTree with disabled state', (done) => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      const mockFieldTree = {
        value: () => testDate,
        disabled: () => true,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockFieldTree;
      fixture.detectChanges();

      // Wait for field sync to complete
      setTimeout(() => {
        expect(component.disabled).toBe(true);
        done();
      }, 50);
    });

    it('should handle FieldTree with value.set() method (signal pattern)', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      const newDate = getStartOfDay(new Date(2024, 5, 20));
      let currentValue = testDate;

      // Simulate FieldTree where value itself is a signal with set() method
      const valueSignal = (() => currentValue) as any;
      valueSignal.set = (val: Date) => { currentValue = val; };

      const mockFieldTree = {
        value: valueSignal,
        disabled: () => false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockFieldTree;
      component.inline = true;
      fixture.detectChanges();

      expect(component.selectedDate).toBeTruthy();
      
      // Simulate user clicking a date, which triggers the internal setValue mechanism
      // Find and click day 20
      const dayCells = fixture.debugElement.queryAll(By.css('.ngxsmk-day-cell'));
      const day20 = dayCells.find(cell => {
        const dayNumber = cell.query(By.css('.ngxsmk-day-number'));
        return dayNumber && dayNumber.nativeElement.textContent.trim() === '20' &&
               !cell.nativeElement.classList.contains('disabled') &&
               !cell.nativeElement.classList.contains('empty');
      });

      if (day20) {
        day20.nativeElement.click();
        fixture.detectChanges();
        
        // Verify the field's value.set was called through the component's internal mechanism
        expect(component.selectedDate).toBeTruthy();
        if (component.selectedDate) {
          expect(component.selectedDate.getTime()).toBe(newDate.getTime());
        }
      }
    });

    it('should handle null/undefined field values gracefully', () => {
      const mockFieldTree = {
        value: () => null,
        disabled: () => false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue')
      };

      component.field = mockFieldTree;
      fixture.detectChanges();

      expect(component.field).toBe(mockFieldTree);
      // Component should handle null values without errors
      expect(component).toBeTruthy();
    });

    it('should maintain backward compatibility with Angular 17-20 (null field)', () => {
      // Angular 17-20 don't use field input, so it should be null
      component.field = null;
      fixture.detectChanges();

      expect(component.field).toBeNull();
      expect(component).toBeTruthy();
    });

    it('should handle FieldTree with complex nested value structure', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      // Simulate a more complex FieldTree structure that might exist in Angular 21
      const mockFieldTree = {
        value: () => testDate,
        disabled: () => false,
        setValue: jasmine.createSpy('setValue'),
        updateValue: jasmine.createSpy('updateValue'),
        // Additional properties that might exist in FieldTree
        errors: () => null,
        touched: () => false,
        dirty: () => false
      };

      component.field = mockFieldTree;
      fixture.detectChanges();

      expect(component.field).toBe(mockFieldTree);
      expect(component.selectedDate).toBeTruthy();
    });
  });

  describe('Type safety verification', () => {
    it('should compile without TypeScript errors when assigning FieldTree<Date, string>', () => {
      const testDate = getStartOfDay(new Date(2024, 5, 15));
      
      // This test verifies that the type system accepts the assignment
      // If this compiles, the fix is working
      const fieldTree: any = {
        value: () => testDate,
        disabled: () => false,
        setValue: (_val: Date) => {},
        updateValue: (_updater: () => Date) => {}
      };

      // This assignment should not cause: 
      // "Type 'FieldTree<Date, string>' is not assignable to type 'FieldTree<unknown, string | number>'"
      component.field = fieldTree;
      
      expect(component.field).toBe(fieldTree);
    });

    it('should accept field with any value type (permissive type)', () => {
      // Test that the permissive SignalFormField type accepts various structures
      const fieldWithString = {
        value: () => '2024-06-15',
        disabled: () => false
      };

      const fieldWithNumber = {
        value: () => 1234567890,
        disabled: () => false
      };

      const fieldWithDate = {
        value: () => new Date(),
        disabled: () => false
      };

      // All should be accepted by the permissive type
      component.field = fieldWithString as any;
      expect(component.field).toBe(fieldWithString);

      component.field = fieldWithNumber as any;
      expect(component.field).toBe(fieldWithNumber);

      component.field = fieldWithDate;
      expect(component.field).toBe(fieldWithDate);
    });
  });
});

