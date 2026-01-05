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

/**
 * Safely detects if a value is an Angular Signal.
 * Handles compatibility across Angular 17.0.0 - 21.x
 * 
 * @param value - The value to check
 * @returns true if value is a Signal
 * 
 * @remarks
 * This function uses runtime detection because isSignal() 
 * may not be available in Angular 17.0.0. The detection
 * works by checking if the value is a callable function
 * with no required arguments, which is characteristic
 * of Angular signals.
 * 
 * The function first attempts to use the official isSignal()
 * function if available via dynamic access to avoid build-time
 * import resolution issues. If not available, it falls back
 * to heuristic detection based on function characteristics.
 * 
 * @example
 * ```typescript
 * const mySignal = signal(42);
 * if (safeIsSignal(mySignal)) {
 *   const value = mySignal(); // Type-safe access
 * }
 * ```
 */
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
  setValue?: (value: DatepickerValue) => void;
  updateValue?: (updater: () => DatepickerValue) => void;
} & {
  [key: string]: unknown;
}) | null | undefined;

export interface FieldSyncCallbacks {
  onValueChanged: (value: DatepickerValue) => void;
  onDisabledChanged: (disabled: boolean) => void;
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
   * Helper function to safely read a field value, handling both functions and signals.
   * This handles Angular 21 Signal Forms where field.value can be a signal directly.
   * 
   * @param field - The form field to read from
   * @returns The field value or null if not available
   * 
   * @remarks
   * Angular signals (including computed) are detected as 'function' type.
   * This function handles multiple scenarios:
   * - Direct signal values (Angular 21 Signal Forms)
   * - Functions that return signals
   * - Functions that return direct values
   * - Direct Date objects or range objects
   * 
   * The function safely handles errors and returns null on any failure,
   * ensuring the component doesn't crash on invalid field structures.
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
   * Helper function to safely read disabled state.
   * Handles both direct values, functions, and signals (Angular 21 Signal Forms).
   * 
   * @param field - The form field to read from
   * @returns true if the field is disabled, false otherwise
   * 
   * @remarks
   * This function safely extracts the disabled state from various field formats:
   * - Direct boolean values
   * - Signal<boolean> values
   * - Functions that return boolean or Signal<boolean>
   * 
   * Returns false on any error to allow graceful degradation.
   */
  private readDisabledState(field: SignalFormField): boolean {
    if (!field || typeof field !== 'object') {
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
   * Sets up reactive synchronization between a Signal Form field and the datepicker component.
   * 
   * @param field - The Signal Form field to sync with
   * @param callbacks - Callback functions for handling value changes, disabled state, and errors
   * @returns An EffectRef that can be used to destroy the sync, or null if setup failed
   * 
   * @remarks
   * This method creates an Angular effect that automatically tracks changes to the field's
   * value and disabled state. The effect runs in a reactive context, ensuring all signal
   * dependencies (including computed signals) are properly tracked.
   * 
   * The sync prevents circular updates by tracking when updates originate from the component
   * itself vs. external changes to the field.
   * 
   * @example
   * ```typescript
   * const effectRef = fieldSyncService.setupFieldSync(
   *   myForm.dateField,
   *   {
   *     onValueChanged: (value) => component.setValue(value),
   *     onDisabledChanged: (disabled) => component.disabled = disabled,
   *     onSyncError: (error) => console.error(error),
   *     normalizeValue: (value) => normalizeDate(value),
   *     isValueEqual: (a, b) => isSameDay(a, b)
   *   }
   * );
   * ```
   */
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
    if (!field || typeof field !== 'object') return false;

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
      return true;
    }

    // Update last known value even if we don't trigger callbacks
    if (this._lastKnownFieldValue !== normalizedValue) {
      this._lastKnownFieldValue = normalizedValue;
    }

    const disabled = this.readDisabledState(field);
    callbacks.onDisabledChanged(disabled);
    return false;
  }

  updateFieldFromInternal(
    value: DatepickerValue,
    field: SignalFormField
  ): void {
    if (!field || typeof field !== 'object') {
      return;
    }

    this._isUpdatingFromInternal = true;

    try {
      const normalizedValue = value;
      this._lastKnownFieldValue = normalizedValue;

      let updateSucceeded = false;
      let lastError: unknown = null;

      if (typeof field.setValue === 'function') {
        try {
          field.setValue(normalizedValue);
          updateSucceeded = true;
          Promise.resolve().then(() => {
            this._isUpdatingFromInternal = false;
          });
          return;
        } catch (error) {
          lastError = error;
        }
      }

      if (!updateSucceeded && typeof field.updateValue === 'function') {
        try {
          field.updateValue(() => normalizedValue);
          updateSucceeded = true;
          Promise.resolve().then(() => {
            this._isUpdatingFromInternal = false;
          });
          return;
        } catch (error) {
          lastError = error;
        }
      }

      if (!updateSucceeded) {
        let fallbackUsed = false;
        try {
          const val = field.value;
          
          if (typeof val === 'function') {
            try {
              const signalOrValue = val();
              if (safeIsSignal(signalOrValue)) {
                const writableSignal = signalOrValue as unknown as WritableSignal<DatepickerValue>;
                if (typeof writableSignal.set === 'function') {
                  writableSignal.set(normalizedValue);
                  fallbackUsed = true;
                  Promise.resolve().then(() => {
                    this._isUpdatingFromInternal = false;
                  });
                  
                  if (isDevMode()) {
                    console.warn(
                      '[ngxsmk-datepicker] Using direct signal mutation as fallback. ' +
                      'This may prevent the form from tracking dirty state correctly. ' +
                      'Ensure your Signal Form field provides setValue() or updateValue() methods. ' +
                      'Error from setValue/updateValue:', lastError
                    );
                  }
                  return;
                }
              }
            } catch {
              // Continue to check if val itself is a signal
            }
          }
          
          if (!fallbackUsed && safeIsSignal(val)) {
            const writableSignal = val as WritableSignal<DatepickerValue>;
            if (typeof writableSignal.set === 'function') {
              writableSignal.set(normalizedValue);
              fallbackUsed = true;
              Promise.resolve().then(() => {
                this._isUpdatingFromInternal = false;
              });
              
              if (isDevMode()) {
                console.warn(
                  '[ngxsmk-datepicker] Using direct signal mutation as fallback. ' +
                  'This may prevent the form from tracking dirty state correctly. ' +
                  'Ensure your Signal Form field provides setValue() or updateValue() methods. ' +
                  'Error from setValue/updateValue:', lastError
                );
              }
              return;
            }
          }
        } catch (error) {
          lastError = error;
        }

        if (!fallbackUsed && isDevMode()) {
          console.error(
            '[ngxsmk-datepicker] Failed to update field value. ' +
            'Field does not provide setValue(), updateValue(), or a writable signal. ' +
            'Last error:', lastError
          );
        }
      }

      if (!updateSucceeded) {
        this._isUpdatingFromInternal = false;
      }

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

