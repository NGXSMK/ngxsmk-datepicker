import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';

describe('NgxsmkDatepickerComponent Month Navigation Bug', () => {
    let component: NgxsmkDatepickerComponent;
    let fixture: ComponentFixture<NgxsmkDatepickerComponent>;
    // Start with a date that has 31 days (Jan 2024)
    const initialDate = new Date(2024, 0, 31); // Jan 31, 2024

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgxsmkDatepickerComponent],
            providers: [DatePipe]
        }).compileComponents();

        fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
        component = fixture.componentInstance;
        component.inline = true; // Use inline to avoid open/close logic
        component.mode = 'range';

        component.writeValue({ start: initialDate, end: initialDate });

        fixture.detectChanges();
    });

    it('should navigate from Jan to Feb correctly even if currently selected date is Jan 31', fakeAsync(() => {
        // Initial state: Jan 31 selected. Calendar should show January.
        expect(component.currentDate.getMonth()).toBe(0); // Jan

        // 1. User navigates to Next Month (Feb)
        component.changeMonth(1);
        fixture.detectChanges();
        // Should be Feb
        expect(component.currentDate.getMonth()).toBe(1); // Feb

        // 2. Select a date in Feb (e.g., Feb 3)
        const febDate = new Date(2024, 1, 3);
        component.onDateClick(febDate);

        // Simulate the form control updating the value back to the component
        // This triggers writeValue -> initializeValue -> resets currentDate to Start Date (Jan 31)
        component.writeValue({ start: initialDate, end: febDate });

        fixture.detectChanges();

        // At this point, range is Jan 31 - Feb 3.


        // Component logic should PRESERVE the current view (Feb) because the end date is visible.
        // It should NOT reset to startDate (Jan 31).
        expect(component.startDate?.getDate()).toBe(31);
        expect(component.endDate?.getDate()).toBe(3);

        // VERIFY FIX: View should remain in Feb
        expect(component.currentDate.getMonth()).toBe(1, 'Should remain in Feb view');

        // 3. User navigates Next Month again (from Feb).
        // Since we are correctly in Feb, adding 1 month should go to March.
        component.changeMonth(1);
        fixture.detectChanges();

        // Expectation: Should be March (2)
        expect(component.currentDate.getMonth()).toBe(2, 'Should navigate to March');
    }));
});
