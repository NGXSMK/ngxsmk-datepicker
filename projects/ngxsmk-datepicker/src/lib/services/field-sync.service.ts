import { Injectable, effect, EffectRef, Injector, runInInjectionContext, inject, Signal, isDevMode } from '@angular/core';
import { DatepickerValue } from '../utils/calendar.utils';

interface AngularCoreModule {
  isSignal?: (value: unknown) => boolean;
}

interface AngularGlobal {
  ng?: {
    core?: AngularCoreModule;
  };
}

interface WritableSignal<T> extends Signal<T> {
  set(value: T): void;
}

function safeIsSignal(value: unknown): value is Signal<unknown> {
  if (value === null || value === undefined) {
    return false;
  }

  try {
    const ngCore = (globalThis as AngularGlobal).ng?.core;
    if (ngCore?.isSignal && typeof ngCore.isSignal === 'function') {
      return ngCore.isSignal(value);
    }
  } catch {
  }

  if (typeof value === 'function') {
    const fn = value as () => unknown;
    try {
      if (fn.length === 0 || fn.length === undefined) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}

export interface ValidationError {
  kind: string;
  message?: string;
}

export type SignalFormFieldConfig = {
  value?: DatepickerValue | string | (() => DatepickerValue | string) | { (): DatepickerValue | string } | Signal<DatepickerValue | string>;
  disabled?: boolean | (() => boolean) | { (): boolean } | Signal<boolean>;
  required?: boolean | (() => boolean) | { (): boolean } | Signal<boolean>;
  errors?: ValidationError[] | (() => ValidationError[]) | { (): ValidationError[] } | Signal<ValidationError[]>;
  valid?: boolean | (() => boolean) | { (): boolean } | Signal<boolean>;
  invalid?: boolean | (() => boolean) | { (): boolean } | Signal<boolean>;
  touched?: boolean | (() => boolean) | { (): boolean } | Signal<boolean>;
  setValue?: (value: DatepickerValue | string) => void;
  updateValue?: (updater: () => DatepickerValue | string) => void;
  markAsDirty?: () => void;
};

// Angular 21+ FieldTree compatibility - accepts any structure
export type SignalFormField = any;

export interface FieldSyncCallbacks {
  onValueChanged: (value: DatepickerValue) => void;
  onDisabledChanged: (disabled: boolean) => void;
  onRequiredChanged?: (required: boolean) => void;
  onErrorStateChanged?: (hasError: boolean) => void;
  onSyncError: (error: unknown) => void;
  normalizeValue: (value: unknown) => DatepickerValue;
  isValueEqual: (val1: DatepickerValue, val2: DatepickerValue) => boolean;
  onCalendarGenerated?: () => void;
  onStateChanged?: () => void;
}

@Injectable()
export class FieldSyncService {
  private _fieldEffectRef: EffectRef | null = null;
  private _lastKnownFieldValue: DatepickerValue | undefined = undefined;
  private _isUpdatingFromInternal: boolean = false;
  private readonly injector = inject(Injector);

  private readFieldValue(field: SignalFormFieldConfig): DatepickerValue | null {
    if (!field || typeof field !== 'object' || field.value === undefined) {
      return null;
    }

    try {
      const fieldValue = field.value;

      if (typeof fieldValue === 'function') {
        try {
          const result = fieldValue();
          if (safeIsSignal(result)) {
            const signalResult = result() as DatepickerValue;
            return signalResult !== undefined && signalResult !== null ? signalResult : null;
          }
          if (result !== undefined && result !== null) {
            return result as DatepickerValue;
          }
          return null;
        } catch {
          if (safeIsSignal(fieldValue)) {
            try {
              const signalResult = fieldValue() as DatepickerValue;
              return signalResult !== undefined && signalResult !== null ? signalResult : null;
            } catch {
              return null;
            }
          }
          return null;
        }
      }

      if (safeIsSignal(fieldValue)) {
        const result = fieldValue() as DatepickerValue;
        return result !== undefined && result !== null ? result : null;
      }

      if (fieldValue !== null && typeof fieldValue === 'object') {
        if (fieldValue instanceof Date) {
          return fieldValue as DatepickerValue;
        }

        try {
          const result = (fieldValue as unknown as { (): DatepickerValue })() as DatepickerValue;
          if (result !== undefined && result !== null) {
            return result;
          }
        } catch {
          return fieldValue as DatepickerValue;
        }
      }

      // Direct value (shouldn't happen often, but handle it)
      if (fieldValue !== undefined && fieldValue !== null) {
        return fieldValue as DatepickerValue;
      }

      return null;
    } catch {
      return null;
    }
  }

  private readDisabledState(field: SignalFormFieldConfig): boolean {
    if (!field || (typeof field !== 'object' && typeof field !== 'function')) {
      return false;
    }

    try {
      if ('disabled' in field && field.disabled !== undefined) {
        const disabledVal = field.disabled;

        if (safeIsSignal(disabledVal)) {
          return !!disabledVal();
        }

        if (typeof disabledVal === 'function') {
          return !!(disabledVal as () => boolean)();
        }

        if (typeof disabledVal === 'object' && disabledVal !== null) {
          try {
            return !!(disabledVal as unknown as { (): boolean })();
          } catch {
            return !!disabledVal;
          }
        }

        return !!disabledVal;
      }

      return false;
    } catch {
      // Silently return false on error to allow graceful degradation
      return false;
    }
  }

  private readFieldErrors(field: SignalFormFieldConfig): ValidationError[] {
    if (!field || (typeof field !== 'object' && typeof field !== 'function')) {
      return [];
    }

    try {
      if ('errors' in field && field.errors !== undefined) {
        const errorsVal = field.errors;

        if (safeIsSignal(errorsVal)) {
          const result = errorsVal();
          return Array.isArray(result) ? result : [];
        }

        if (typeof errorsVal === 'function') {
          const result = (errorsVal as () => ValidationError[])();
          return Array.isArray(result) ? result : [];
        }

        if (typeof errorsVal === 'object' && errorsVal !== null) {
          try {
            const result = (errorsVal as unknown as { (): ValidationError[] })();
            return Array.isArray(result) ? result : [];
          } catch {
            return Array.isArray(errorsVal) ? errorsVal : [];
          }
        }

        return Array.isArray(errorsVal) ? errorsVal : [];
      }

      return [];
    } catch {
      return [];
    }
  }

  private readRequiredState(field: SignalFormFieldConfig): boolean {
    if (!field || (typeof field !== 'object' && typeof field !== 'function')) {
      return false;
    }

    try {
      const errors = this.readFieldErrors(field);
      const hasRequiredError = errors.some(error => error.kind === 'required');
      if (hasRequiredError) {
        return true;
      }

      if ('required' in field && field.required !== undefined) {
        const requiredVal = field.required;

        if (safeIsSignal(requiredVal)) {
          return !!requiredVal();
        }

        if (typeof requiredVal === 'function') {
          return !!(requiredVal as () => boolean)();
        }

        if (typeof requiredVal === 'object' && requiredVal !== null) {
          try {
            return !!(requiredVal as unknown as { (): boolean })();
          } catch {
            return !!requiredVal;
          }
        }

        return !!requiredVal;
      }

      return false;
    } catch {
      return false;
    }
  }

  private hasValidationErrors(field: SignalFormFieldConfig): boolean {
    if (!field || (typeof field !== 'object' && typeof field !== 'function')) {
      return false;
    }

    try {
      if ('invalid' in field && field.invalid !== undefined) {
        const invalidVal = field.invalid;

        if (safeIsSignal(invalidVal)) {
          return !!invalidVal();
        }

        if (typeof invalidVal === 'function') {
          return !!(invalidVal as () => boolean)();
        }

        if (typeof invalidVal === 'object' && invalidVal !== null) {
          try {
            return !!(invalidVal as unknown as { (): boolean })();
          } catch {
            return !!invalidVal;
          }
        }

        return !!invalidVal;
      }

      // Fallback: check if errors array has any errors
      const errors = this.readFieldErrors(field);
      return errors.length > 0;
    } catch {
      return false;
    }
  }
  private resolveField(field: unknown): SignalFormFieldConfig | null {
    if (!field) return null;

    if (typeof field === 'object') {
      return field as SignalFormFieldConfig;
    }

    if (typeof field === 'function') {
      const fieldFn = field as unknown as Record<string, unknown>;

      const hasFieldProps = 'value' in fieldFn || 'disabled' in fieldFn || 'required' in fieldFn ||
        'setValue' in fieldFn || 'markAsDirty' in fieldFn || 'errors' in fieldFn;

      if (hasFieldProps) {
        return fieldFn as SignalFormFieldConfig;
      }

      if (safeIsSignal(field)) {
        try {
          const result = field();
          if (result && typeof result === 'object') {
            return result as SignalFormFieldConfig;
          }
        } catch {
        }
      }

      // Generic fallback for getters
      try {
        const result = (field as () => unknown)();
        if (result && typeof result === 'object') {
          return result as SignalFormFieldConfig;
        }
      } catch {
        // Fall through
      }
    }

    return null;
  }

  setupFieldSync(
    fieldInput: SignalFormField,
    callbacks: FieldSyncCallbacks
  ): EffectRef | null {
    this.cleanup();

    if (!fieldInput) {
      return null;
    }

    try {
      const effectRef = runInInjectionContext(this.injector, () => effect(() => {
        if (this._isUpdatingFromInternal) {
          return;
        }

        const field = this.resolveField(fieldInput);

        if (!field) {
          return;
        }

        let fieldValue: DatepickerValue | null = null;

        try {
          const fieldValueRef = field.value;

          if (fieldValueRef === undefined || fieldValueRef === null) {
            fieldValue = null;
          } else if (typeof fieldValueRef === 'function') {
            try {
              const funcResult = fieldValueRef();
              if (safeIsSignal(funcResult)) {
                const signalResult = funcResult() as DatepickerValue;
                fieldValue = (signalResult !== undefined && signalResult !== null) ? signalResult : null;
              } else if (safeIsSignal(fieldValueRef)) {
                const signalResult = fieldValueRef() as DatepickerValue;
                fieldValue = (signalResult !== undefined && signalResult !== null) ? signalResult : null;
              } else {
                fieldValue = (funcResult !== undefined && funcResult !== null) ? funcResult as DatepickerValue : null;
              }
            } catch {
              if (safeIsSignal(fieldValueRef)) {
                try {
                  const signalResult = fieldValueRef() as DatepickerValue;
                  fieldValue = (signalResult !== undefined && signalResult !== null) ? signalResult : null;
                } catch {
                  fieldValue = null;
                }
              } else {
                fieldValue = null;
              }
            }
          } else if (safeIsSignal(fieldValueRef)) {
            const signalResult = fieldValueRef();
            fieldValue = (signalResult !== undefined && signalResult !== null) ? signalResult as DatepickerValue : null;
          } else if (fieldValueRef instanceof Date) {
            fieldValue = fieldValueRef as DatepickerValue;
          } else if (typeof fieldValueRef === 'object') {
            fieldValue = fieldValueRef as DatepickerValue;
          } else {
            fieldValue = this.readFieldValue(field);
          }
        } catch {
          fieldValue = this.readFieldValue(field);
        }

        const normalizedValue = callbacks.normalizeValue(fieldValue);

        const isInitialLoad = this._lastKnownFieldValue === undefined;

        const valuesAreEqual = this._lastKnownFieldValue !== undefined &&
          callbacks.isValueEqual(normalizedValue, this._lastKnownFieldValue as DatepickerValue);

        const valueChanged = !isInitialLoad && !valuesAreEqual;
        const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) &&
          fieldValue !== null && fieldValue !== undefined;

        if ((isInitialLoad || valueChanged || isValueTransition) && !valuesAreEqual) {
          this._lastKnownFieldValue = normalizedValue;
          callbacks.onValueChanged(normalizedValue);
          callbacks.onCalendarGenerated?.();
          callbacks.onStateChanged?.();
        } else if (!valuesAreEqual && this._lastKnownFieldValue !== normalizedValue) {
          this._lastKnownFieldValue = normalizedValue;
        }

        const disabled = this.readDisabledState(field);
        callbacks.onDisabledChanged(disabled);

        const required = this.readRequiredState(field);
        callbacks.onRequiredChanged?.(required);

        const hasError = this.hasValidationErrors(field);
        callbacks.onErrorStateChanged?.(hasError);
      }));

      this._fieldEffectRef = effectRef;

      return effectRef;
    } catch (error) {
      // Fall back to manual sync if effect setup fails
      callbacks.onSyncError?.(error);
      this.syncFieldValue(fieldInput, callbacks);
      return null;
    }
  }

  syncFieldValue(fieldInput: SignalFormField | Signal<SignalFormField> | (() => unknown) | unknown, callbacks: FieldSyncCallbacks): boolean {
    const field = this.resolveField(fieldInput);
    if (!field) return false;

    const fieldValue = this.readFieldValue(field);
    const normalizedValue = callbacks.normalizeValue(fieldValue);

    const hasValueChanged = !callbacks.isValueEqual(normalizedValue, this._lastKnownFieldValue as DatepickerValue);
    const isInitialLoad = this._lastKnownFieldValue === undefined;
    const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) &&
      fieldValue !== null && fieldValue !== undefined;

    if (isInitialLoad || hasValueChanged || isValueTransition) {
      this._lastKnownFieldValue = normalizedValue;
      callbacks.onValueChanged(normalizedValue);
      callbacks.onCalendarGenerated?.();
      callbacks.onStateChanged?.();

      const disabled = this.readDisabledState(field);
      callbacks.onDisabledChanged(disabled);

      const required = this.readRequiredState(field);
      callbacks.onRequiredChanged?.(required);

      const hasError = this.hasValidationErrors(field);
      callbacks.onErrorStateChanged?.(hasError);
      return true;
    }

    if (this._lastKnownFieldValue !== normalizedValue) {
      this._lastKnownFieldValue = normalizedValue;
    }

    const disabled = this.readDisabledState(field);
    callbacks.onDisabledChanged(disabled);

    const required = this.readRequiredState(field);
    callbacks.onRequiredChanged?.(required);

    const hasError = this.hasValidationErrors(field);
    callbacks.onErrorStateChanged?.(hasError);
    return false;
  }

  updateFieldFromInternal(
    value: DatepickerValue,
    fieldInput: SignalFormField | Signal<SignalFormField> | (() => unknown) | unknown
  ): void {
    const field = this.resolveField(fieldInput);
    if (!field || typeof field !== 'object') {
      return;
    }

    this._isUpdatingFromInternal = true;

    try {
      const normalizedValue = value;
      this._lastKnownFieldValue = normalizedValue;

      if (typeof field.setValue === 'function') {
        try {
          field.setValue(normalizedValue);
          if (typeof field.markAsDirty === 'function') {
            field.markAsDirty();
          }
          Promise.resolve().then(() => {
            this._isUpdatingFromInternal = false;
          });
          return;
        } catch {
        }
      }

      if (typeof field.updateValue === 'function') {
        try {
          field.updateValue(() => normalizedValue);
          if (typeof field.markAsDirty === 'function') {
            field.markAsDirty();
          }
          Promise.resolve().then(() => {
            this._isUpdatingFromInternal = false;
          });
          return;
        } catch {
        }
      }

      try {
        const val = field.value;

        if (typeof val === 'function') {
          try {
            const signalOrValue = val();
            if (safeIsSignal(signalOrValue)) {
              const writableSignal = signalOrValue as unknown as WritableSignal<DatepickerValue>;
              if (typeof writableSignal.set === 'function') {
                writableSignal.set(normalizedValue);
                if (typeof field.markAsDirty === 'function') {
                  field.markAsDirty();
                }
                Promise.resolve().then(() => {
                  this._isUpdatingFromInternal = false;
                });
                return;
              }
            }
          } catch {
          }
        }

        if (safeIsSignal(val)) {
          const writableSignal = val as WritableSignal<DatepickerValue>;
          if (typeof writableSignal.set === 'function') {
            writableSignal.set(normalizedValue);
            if (typeof field.markAsDirty === 'function') {
              field.markAsDirty();
            }
            Promise.resolve().then(() => {
              this._isUpdatingFromInternal = false;
            });
            return;
          }
        }
      } catch {
      }

      this._isUpdatingFromInternal = false;

    } catch (error) {
      if (isDevMode()) {
        console.warn('[ngxsmk-datepicker] Field sync error:', error);
      }
      this._isUpdatingFromInternal = false;
    }
  }

  getLastKnownValue(): DatepickerValue | undefined {
    return this._lastKnownFieldValue;
  }

  cleanup(): void {
    if (this._fieldEffectRef) {
      this._fieldEffectRef.destroy();
      this._fieldEffectRef = null;
    }
    this._lastKnownFieldValue = undefined;
    this._isUpdatingFromInternal = false;
  }
}

