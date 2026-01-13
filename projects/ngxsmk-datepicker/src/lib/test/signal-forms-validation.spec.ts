import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { FieldSyncService, SignalFormField } from '../services/field-sync.service';
import { signal } from '@angular/core';

describe('NgxsmkDatepickerComponent - Angular Signal Forms Validation', () => {
    let component: NgxsmkDatepickerComponent;
    let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgxsmkDatepickerComponent],
            providers: [FieldSyncService]
        }).compileComponents();

        fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
        component = fixture.componentInstance;
    });

    describe('Schema-based required validation', () => {
        it('should recognize required validation from errors signal', fakeAsync(() => {
            // Simulate Angular Signal Forms field with required validation error
            const errorsSignal = signal([{ kind: 'required', message: 'This field is required' }]);
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: errorsSignal,
                invalid: signal(true),
                valid: signal(false),
                touched: signal(false),
                disabled: signal(false),
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            // The component should recognize the field as required
            expect(component.required).toBe(true);
        }));

        it('should update error state when field has validation errors', fakeAsync(() => {
            const errorsSignal = signal([{ kind: 'required', message: 'This field is required' }]);
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: errorsSignal,
                invalid: signal(true),
                valid: signal(false),
                touched: signal(false),
                disabled: signal(false),
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            // The component should have error state set to true
            expect(component.errorState).toBe(true);
        }));

        it('should clear error state when validation errors are resolved', fakeAsync(() => {
            const errorsSignal = signal([{ kind: 'required', message: 'This field is required' }]);
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: errorsSignal,
                invalid: signal(true),
                valid: signal(false),
                touched: signal(false),
                disabled: signal(false),
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            expect(component.errorState).toBe(true);

            // Resolve the validation error
            errorsSignal.set([]);
            mockField.invalid = signal(false);
            mockField.valid = signal(true);
            tick();
            fixture.detectChanges();

            // Error state should be cleared
            expect(component.errorState).toBe(false);
        }));

        it('should handle multiple validation errors', fakeAsync(() => {
            const errorsSignal = signal([
                { kind: 'required', message: 'This field is required' },
                { kind: 'minDate', message: 'Date is too early' }
            ]);
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: errorsSignal,
                invalid: signal(true),
                valid: signal(false),
                touched: signal(false),
                disabled: signal(false),
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            expect(component.required).toBe(true);
            expect(component.errorState).toBe(true);
        }));

        it('should work with errors as function', fakeAsync(() => {
            const errorsArray = [{ kind: 'required', message: 'This field is required' }];
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: () => errorsArray,
                invalid: () => true,
                valid: () => false,
                touched: () => false,
                disabled: () => false,
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            expect(component.required).toBe(true);
            expect(component.errorState).toBe(true);
        }));

        it('should not set required when no required error exists', fakeAsync(() => {
            const errorsSignal = signal([{ kind: 'minLength', message: 'Too short' }]);
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: errorsSignal,
                invalid: signal(true),
                valid: signal(false),
                touched: signal(false),
                disabled: signal(false),
                required: false,
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            // Should not be required (no required error)
            expect(component.required).toBe(false);
            // But should still have error state
            expect(component.errorState).toBe(true);
        }));

        it('should handle field with both required property and errors signal', fakeAsync(() => {
            const errorsSignal = signal<unknown[]>([]);
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: errorsSignal,
                invalid: signal(false),
                valid: signal(true),
                touched: signal(false),
                disabled: signal(false),
                required: true, // Direct required property
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            // Should be required from direct property
            expect(component.required).toBe(true);
            // No validation errors
            expect(component.errorState).toBe(false);
        }));

        it('should reactively update when errors signal changes', fakeAsync(() => {
            const errorsSignal = signal<unknown[]>([]);
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                errors: errorsSignal,
                invalid: signal(false),
                valid: signal(true),
                touched: signal(false),
                disabled: signal(false),
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            expect(component.required).toBe(false);
            expect(component.errorState).toBe(false);

            // Add required error
            errorsSignal.set([{ kind: 'required', message: 'Required' }]);
            mockField.invalid = signal(true);
            mockField.valid = signal(false);
            tick();
            fixture.detectChanges();

            expect(component.required).toBe(true);
            expect(component.errorState).toBe(true);

            // Remove error
            errorsSignal.set([]);
            mockField.invalid = signal(false);
            mockField.valid = signal(true);
            tick();
            fixture.detectChanges();

            expect(component.required).toBe(false);
            expect(component.errorState).toBe(false);
        }));
    });

    describe('Backward compatibility', () => {
        it('should still work with direct required property', fakeAsync(() => {
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                disabled: signal(false),
                required: true,
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            expect(component.required).toBe(true);
        }));

        it('should work without errors signal', fakeAsync(() => {
            const valueSignal = signal<Date | null>(null);

            const mockField = {
                value: valueSignal,
                disabled: signal(false),
                setValue: (val: Date | null) => valueSignal.set(val),
                markAsDirty: () => { }
            };

            component.field = mockField as unknown as SignalFormField;
            tick();
            fixture.detectChanges();

            expect(component.required).toBe(false);
            expect(component.errorState).toBe(false);
        }));
    });
});
