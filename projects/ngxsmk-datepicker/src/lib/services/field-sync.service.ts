import { Injectable, effect, EffectRef, Injector, runInInjectionContext, inject, Signal, isDevMode } from '@angular/core';
import { DatepickerValue } from '../utils/calendar.utils';

// Type for Angular core module accessed via globalThis (for dynamic isSignal detection)
interface AngularCoreModule {
  isSignal?: (value: unknown) => boolean;
}

interface AngularGlobal {
  ng?: {
    core?: AngularCoreModule;
  };
}

// Type for writable signal with set method
interface WritableSignal<T> extends Signal<T> {
  set(value: T): void;
}

// Safe isSignal detection - works with all Angular 17+ versions including 17.0.0
// In Angular 17.0.0, isSignal might not be available, so we use function-based detection
// We avoid importing isSignal directly to prevent build errors in Angular 17.0.0
// This function provides compatibility across all Angular 17 sub-versions
function safeIsSignal(value: unknown): value is Signal<unknown> {
  if (value === null || value === undefined) {
    return false;
  }

  // For Angular 17.1.0+, try to use isSignal if available via dynamic access
  // We check at runtime to avoid build-time import resolution issues
  try {
    // Access Angular core module dynamically to check for isSignal
    // This avoids the @angular/core/primitives/signals resolution issue in Angular 17.0.0
    const ngCore = (globalThis as AngularGlobal).ng?.core;
    if (ngCore?.isSignal && typeof ngCore.isSignal === 'function') {
      return ngCore.isSignal(value);
    }
  } catch {
    // isSignal not available - use fallback detection
  }

  // Fallback detection for Angular 17.0.0 and all versions
  // This works by detecting signal-like function characteristics
  // Signals in Angular are functions that can be called without arguments
  if (typeof value === 'function') {
    const fn = value as () => unknown;
    // Signals are typically:
    // 1. Functions without a prototype (or minimal prototype)
    // 2. Callable without arguments
    // 3. Return values when called
    // In Angular 17.0.0, we treat callable functions as potential signals
    // This is safe because we're in a reactive context (effect) where signals can be read
    try {
      // Check if it's callable - if it is, treat it as a potential signal
      // This works for Angular 17.0.0 where isSignal might not be available
      if (fn.length === 0 || fn.length === undefined) {
        // No required arguments - likely a signal getter
        return true;
      }
    } catch {
      // Not callable - not a signal
      return false;
    }
  }

  return false;
}

export type SignalFormField = ({
  value?: DatepickerValue | (() => DatepickerValue) | { (): DatepickerValue } | Signal<DatepickerValue>;
  disabled?: boolean | (() => boolean) | { (): boolean } | Signal<boolean>;
  required?: boolean | (() => boolean) | { (): boolean } | Signal<boolean>;
  setValue?: (value: DatepickerValue) => void;
  updateValue?: (updater: () => DatepickerValue) => void;
  markAsDirty?: () => void;
} & {
  [key: string]: unknown;
}) | null | undefined;

export interface FieldSyncCallbacks {
  onValueChanged: (value: DatepickerValue) => void;
  onDisabledChanged: (disabled: boolean) => void;
  onRequiredChanged?: (required: boolean) => void;
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

  /**
   * Helper function to safely read a field value, handling both functions and signals
   * This handles Angular 21 Signal Forms where field.value can be a signal directly
   * Note: Angular signals (including computed) are detected as 'function' type
   */
  private readFieldValue(field: SignalFormField): DatepickerValue | null {
    if (!field || typeof field !== 'object' || field.value === undefined) {
      return null;
    }

    try {
      const fieldValue = field.value;

      // For Angular 21 Signal Forms, field.value might be a function that returns the signal
      // Try calling it first if it's a function (this handles FieldTree<Date, string> structure)
      if (typeof fieldValue === 'function') {
        try {
          const result = fieldValue();
          // If result is a signal, call it again to get the actual value
          if (safeIsSignal(result)) {
            const signalResult = result() as DatepickerValue;
            return signalResult !== undefined && signalResult !== null ? signalResult : null;
          }
          // If result is a value (Date, object, etc.), return it
          if (result !== undefined && result !== null) {
            return result as DatepickerValue;
          }
          return null;
        } catch (error) {
          // If calling fails, it might be a signal itself that needs to be called
          // Try checking if it's a signal
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

      // Explicitly check for Angular Signal (compatible with all Angular 17+ versions)
      if (safeIsSignal(fieldValue)) {
        const result = fieldValue() as DatepickerValue;
        return result !== undefined && result !== null ? result : null;
      }

      // If it's an object, it might be a Date, range object, or a signal that isSignal didn't catch
      if (fieldValue !== null && typeof fieldValue === 'object') {
        if (fieldValue instanceof Date) {
          return fieldValue as DatepickerValue;
        }

        // Try calling it as a last resort (for computed signals that isSignal missed)
        try {
          const result = (fieldValue as unknown as { (): DatepickerValue })() as DatepickerValue;
          if (result !== undefined && result !== null) {
            return result;
          }
        } catch {
          // Not callable, treat as value (could be range object {start, end} or array)
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

  /**
   * Helper function to safely read disabled state
   * Handles both direct values, functions, and signals (Angular 21 Signal Forms)
   */
  private readDisabledState(field: SignalFormField): boolean {
    if (!field || (typeof field !== 'object' && typeof field !== 'function')) {
      return false;
    }

    try {
      // Check disabled property first
      if ('disabled' in field && field.disabled !== undefined) {
        const disabledVal = field.disabled;

        // Explicitly check for Angular Signal (compatible with all Angular 17+ versions)
        if (safeIsSignal(disabledVal)) {
          return !!disabledVal();
        }

        if (typeof disabledVal === 'function') {
          return !!(disabledVal as () => boolean)();
        }

        // Handle signals detected as objects
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

  /**
   * Helper function to safely read required state
   * Handles both direct values, functions, and signals (Angular 21 Signal Forms)
   */
  private readRequiredState(field: SignalFormField): boolean {
    if (!field || (typeof field !== 'object' && typeof field !== 'function')) {
      return false;
    }

    try {
      // Check required property first
      if ('required' in field && field.required !== undefined) {
        const requiredVal = field.required;

        // Explicitly check for Angular Signal (compatible with all Angular 17+ versions)
        if (safeIsSignal(requiredVal)) {
          return !!requiredVal();
        }

        if (typeof requiredVal === 'function') {
          return !!(requiredVal as () => boolean)();
        }

        // Handle signals detected as objects
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

  setupFieldSync(
    field: SignalFormField,
    callbacks: FieldSyncCallbacks
  ): EffectRef | null {
    this.cleanup();

    if (!field || typeof field !== 'object') {
      return null;
    }

    try {
      const effectRef = runInInjectionContext(this.injector, () => effect(() => {
        // Skip if we're updating from internal to prevent circular updates
        if (this._isUpdatingFromInternal) {
          return;
        }

        // Read the field value directly in the effect context
        // This ensures all signal dependencies (including computed signals) are properly tracked
        let fieldValue: DatepickerValue | null = null;

        try {
          const fieldValueRef = field.value;

          if (fieldValueRef === undefined || fieldValueRef === null) {
            fieldValue = null;
          } else if (typeof fieldValueRef === 'function') {
            // For Angular 21 Signal Forms, field.value is often a function that returns a signal
            // Call it in effect context to track dependencies properly
            try {
              const funcResult = fieldValueRef();
              // Check if the result is a signal (common in Angular 21 Signal Forms)
              if (safeIsSignal(funcResult)) {
                // Read the signal value in effect context to track dependencies
                const signalResult = funcResult() as DatepickerValue;
                fieldValue = (signalResult !== undefined && signalResult !== null) ? signalResult : null;
              } else if (safeIsSignal(fieldValueRef)) {
                // If fieldValueRef itself is a signal, read it directly
                const signalResult = fieldValueRef() as DatepickerValue;
                fieldValue = (signalResult !== undefined && signalResult !== null) ? signalResult : null;
              } else {
                // Result is a direct value
                fieldValue = (funcResult !== undefined && funcResult !== null) ? funcResult as DatepickerValue : null;
              }
            } catch (error) {
              // If calling fails, try checking if it's a signal itself
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
            // For signals (including computed), read directly in effect context
            // This ensures computed signals track their underlying dependencies
            // Reading the signal here automatically tracks all its dependencies
            const signalResult = fieldValueRef();
            fieldValue = (signalResult !== undefined && signalResult !== null) ? signalResult as DatepickerValue : null;
          } else if (fieldValueRef instanceof Date) {
            // Direct Date value
            fieldValue = fieldValueRef as DatepickerValue;
          } else if (typeof fieldValueRef === 'object') {
            // Could be a range object or array
            fieldValue = fieldValueRef as DatepickerValue;
          } else {
            // Fallback to helper
            fieldValue = this.readFieldValue(field);
          }
        } catch {
          // Fallback to helper on any error
          fieldValue = this.readFieldValue(field);
        }

        // Normalize the value using the same normalization function as the component
        // This ensures consistent value comparison
        const normalizedValue = callbacks.normalizeValue(fieldValue);

        // Determine if we should update
        // Always update on initial load (even if null) to ensure component is initialized
        const isInitialLoad = this._lastKnownFieldValue === undefined;

        // Use isValueEqual to compare values - this handles date normalization and equality correctly
        // This prevents overwriting values that were just set internally, even if effect runs after flag reset
        const valuesAreEqual = this._lastKnownFieldValue !== undefined &&
          callbacks.isValueEqual(normalizedValue, this._lastKnownFieldValue as DatepickerValue);

        const valueChanged = !isInitialLoad && !valuesAreEqual;
        const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) &&
          fieldValue !== null && fieldValue !== undefined;

        // Always update on initial load (even if null), value change, or value transition
        // BUT skip if values are equal (prevents overwriting values set internally)
        // This ensures the component value is always set, including null values
        // but prevents circular updates when we just set the value internally
        if ((isInitialLoad || valueChanged || isValueTransition) && !valuesAreEqual) {
          this._lastKnownFieldValue = normalizedValue;
          callbacks.onValueChanged(normalizedValue);
          callbacks.onCalendarGenerated?.();
          callbacks.onStateChanged?.();
        } else if (!valuesAreEqual && this._lastKnownFieldValue !== normalizedValue) {
          // Update last known value even if we don't trigger callbacks
          // This handles edge cases where values are equal but references differ
          // But only if values are not equal according to isValueEqual
          this._lastKnownFieldValue = normalizedValue;
        }

        // Always update disabled state
        const disabled = this.readDisabledState(field);
        callbacks.onDisabledChanged(disabled);

        // Always update required state
        const required = this.readRequiredState(field);
        callbacks.onRequiredChanged?.(required);
      }));

      this._fieldEffectRef = effectRef;

      // Effects run immediately when created, so the effect has already run
      // and read the signal value in a reactive context. This ensures computed
      // signals are properly tracked and all dependencies are registered.

      return effectRef;
    } catch (error) {
      // Fall back to manual sync if effect setup fails
      callbacks.onSyncError?.(error);
      this.syncFieldValue(field, callbacks);
      return null;
    }
  }

  syncFieldValue(field: SignalFormField, callbacks: FieldSyncCallbacks): boolean {
    if (!field || (typeof field !== 'object' && typeof field !== 'function')) return false;

    const fieldValue = this.readFieldValue(field);
    const normalizedValue = callbacks.normalizeValue(fieldValue);

    // Check if value has changed or if this is initial load
    const hasValueChanged = !callbacks.isValueEqual(normalizedValue, this._lastKnownFieldValue as DatepickerValue);
    const isInitialLoad = this._lastKnownFieldValue === undefined;
    const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) &&
      fieldValue !== null && fieldValue !== undefined;

    // Always sync on initial load (even if null), value change, or value transition
    // This ensures the component value is set correctly, including null values
    if (isInitialLoad || hasValueChanged || isValueTransition) {
      this._lastKnownFieldValue = normalizedValue;
      callbacks.onValueChanged(normalizedValue);
      callbacks.onCalendarGenerated?.();
      callbacks.onStateChanged?.();

      const disabled = this.readDisabledState(field);
      callbacks.onDisabledChanged(disabled);

      const required = this.readRequiredState(field);
      callbacks.onRequiredChanged?.(required);
      return true;
    }

    // Update last known value even if we don't trigger callbacks
    if (this._lastKnownFieldValue !== normalizedValue) {
      this._lastKnownFieldValue = normalizedValue;
    }

    const disabled = this.readDisabledState(field);
    callbacks.onDisabledChanged(disabled);

    const required = this.readRequiredState(field);
    callbacks.onRequiredChanged?.(required);
    return false;
  }

  updateFieldFromInternal(
    value: DatepickerValue,
    field: SignalFormField
  ): void {
    if (!field || typeof field !== 'object') {
      return;
    }

    // Set flag to prevent effect from processing this update
    // This prevents circular updates when we update the field from component
    this._isUpdatingFromInternal = true;

    try {
      // The value passed in should already be normalized by the component
      // Store it as the last known value BEFORE updating the field
      // This ensures the effect sees a match if it runs, preventing overwrites
      const normalizedValue = value;
      this._lastKnownFieldValue = normalizedValue;

      // Try setValue first (preferred method for Angular 21 Signal Forms)
      // This works with computed signal patterns where setValue updates the underlying signal
      if (typeof field.setValue === 'function') {
        try {
          field.setValue(normalizedValue);
          if (typeof field.markAsDirty === 'function') {
            field.markAsDirty();
          }
          // Use microtask delay to ensure effect has time to see the flag
          // This prevents race condition where effect runs after flag is reset
          Promise.resolve().then(() => {
            this._isUpdatingFromInternal = false;
          });
          return;
        } catch {
          // If setValue fails, try updateValue as fallback
          // Don't return here, continue to try updateValue
        }
      }

      // Try updateValue as alternative method
      if (typeof field.updateValue === 'function') {
        try {
          field.updateValue(() => normalizedValue);
          if (typeof field.markAsDirty === 'function') {
            field.markAsDirty();
          }
          // Use microtask delay to ensure effect has time to see the flag
          Promise.resolve().then(() => {
            this._isUpdatingFromInternal = false;
          });
          return;
        } catch {
          // If updateValue also fails, continue to fallback
        }
      }

      // Fallback: try to update the underlying signal directly if field.value is a signal
      // This handles cases where field.value is a writable signal or a function returning a signal
      try {
        const val = field.value;

        // For Angular 21 Signal Forms, field.value might be a function that returns the signal
        if (typeof val === 'function') {
          try {
            const signalOrValue = val();
            // If it's a signal, try to update it
            if (safeIsSignal(signalOrValue)) {
              const writableSignal = signalOrValue as unknown as WritableSignal<DatepickerValue>;
              if (typeof writableSignal.set === 'function') {
                writableSignal.set(normalizedValue);
                if (typeof field.markAsDirty === 'function') {
                  field.markAsDirty();
                }
                // Use microtask delay to ensure effect has time to see the flag
                Promise.resolve().then(() => {
                  this._isUpdatingFromInternal = false;
                });
                return;
              }
            }
          } catch {
            // If calling fails, continue to check if val itself is a signal
          }
        }

        // Check if it's a writable signal (has .set method)
        // Compatible with all Angular 17+ versions
        if (safeIsSignal(val)) {
          const writableSignal = val as WritableSignal<DatepickerValue>;
          if (typeof writableSignal.set === 'function') {
            writableSignal.set(normalizedValue);
            if (typeof field.markAsDirty === 'function') {
              field.markAsDirty();
            }
            // Use microtask delay to ensure effect has time to see the flag
            Promise.resolve().then(() => {
              this._isUpdatingFromInternal = false;
            });
            return;
          }
        }
      } catch {
        // Silently handle - field might not support direct signal updates
        // This is expected for computed signals which are read-only
      }

      // If no update method worked, reset flag immediately
      this._isUpdatingFromInternal = false;

    } catch (error) {
      // Silently handle errors to prevent breaking the application
      // The error might be due to readonly signals or other constraints
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

