import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { signal } from '@angular/core';
import { SignalFormField } from '../services/field-sync.service';

describe('NgxsmkDatepickerComponent Required Attribute', () => {
    let component: NgxsmkDatepickerComponent;
    let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgxsmkDatepickerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
        component = fixture.componentInstance;
        component.inline = false;
        fixture.detectChanges();
    });

    it('should apply required attribute to internal input when required input is true', fakeAsync(() => {
        component.required = true;
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const inputDebug = fixture.debugElement.query(By.css('.ngxsmk-display-input'));
        expect(inputDebug).withContext('Input element not found').toBeTruthy();

        if (inputDebug) {
            const input = inputDebug.nativeElement as HTMLInputElement;
            expect(input.required).toBe(true);
        }
    }));

    it('should handle required as a direct boolean in field', fakeAsync(() => {
        const mockField: Partial<SignalFormField> = {
            value: null,
            required: true,
            setValue: (val: any) => { }
        };

        component.field = mockField as SignalFormField;
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        expect(component.required).toBe(true);
        const inputDebug = fixture.debugElement.query(By.css('.ngxsmk-display-input'));
        if (inputDebug) {
            const input = inputDebug.nativeElement as HTMLInputElement;
            expect(input.required).toBe(true);
        }
    }));

    it('should handle required as a function in field', fakeAsync(() => {
        const mockField: Partial<SignalFormField> = {
            value: null,
            required: () => true,
            setValue: (val: any) => { }
        };

        component.field = mockField as SignalFormField;
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        expect(component.required).toBe(true);
        const inputDebug = fixture.debugElement.query(By.css('.ngxsmk-display-input'));
        if (inputDebug) {
            const input = inputDebug.nativeElement as HTMLInputElement;
            expect(input.required).toBe(true);
        }
    }));
});
