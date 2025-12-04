import { Injectable, effect, EffectRef, Injector, runInInjectionContext, inject } from '@angular/core';
import { DatepickerValue } from '../utils/calendar.utils';

export type SignalFormField = ({
  value?: DatepickerValue | (() => DatepickerValue) | { (): DatepickerValue };
  disabled?: boolean | (() => boolean) | { (): boolean };
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
        if (this._isUpdatingFromInternal) {
          return;
        }
        
        let fieldValue: DatepickerValue | null = null;
        
        if (typeof field.value === 'function') {
          try {
            fieldValue = field.value();
          } catch (error) {
            console.warn('[NgxsmkDatepicker] Error reading field value:', error);
            callbacks.onSyncError?.(error);
            fieldValue = null;
          }
        } else if (field.value !== undefined) {
          fieldValue = field.value;
        }
        
        const normalizedValue = callbacks.normalizeValue(fieldValue);
        
        const valueChanged = !callbacks.isValueEqual(normalizedValue, this._lastKnownFieldValue as DatepickerValue);
        const isInitialLoad = this._lastKnownFieldValue === undefined && fieldValue !== null && fieldValue !== undefined;
        const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) && 
                                 fieldValue !== null && fieldValue !== undefined;
        
        if (valueChanged || isInitialLoad || isValueTransition) {
          this._lastKnownFieldValue = normalizedValue;
          callbacks.onValueChanged(normalizedValue);
          callbacks.onCalendarGenerated?.();
          callbacks.onStateChanged?.();
        } else if (this._lastKnownFieldValue !== fieldValue) {
          this._lastKnownFieldValue = fieldValue as DatepickerValue;
        }
        
        if (typeof field.disabled === 'function') {
          try {
            const newDisabled = field.disabled();
            callbacks.onDisabledChanged(newDisabled);
          } catch (error) {
            console.warn('[NgxsmkDatepicker] Error reading field disabled state:', error);
            callbacks.onSyncError?.(error);
          }
        } else if (field.disabled !== undefined) {
          callbacks.onDisabledChanged(field.disabled);
        }
      }));
      
      this._fieldEffectRef = effectRef;
      return effectRef;
    } catch (error) {
      console.warn('[NgxsmkDatepicker] Error setting up field effect, falling back to manual sync:', error);
      callbacks.onSyncError?.(error);
      this.syncFieldValue(field, callbacks);
      return null;
    }
  }

  syncFieldValue(field: SignalFormField, callbacks: FieldSyncCallbacks): boolean {
    if (!field || typeof field !== 'object') return false;
    
    let fieldValue: DatepickerValue | null | undefined = null;
    try {
      const rawValue = typeof field.value === 'function' ? field.value() : field.value;
      fieldValue = rawValue ?? null;
    } catch (error) {
      console.warn('[NgxsmkDatepicker] Error reading field value during sync:', error);
      callbacks.onSyncError?.(error);
      return false;
    }
    
    const normalizedValue = callbacks.normalizeValue(fieldValue);
    
    const hasValueChanged = !callbacks.isValueEqual(normalizedValue, this._lastKnownFieldValue as DatepickerValue);
    const isInitialLoad = this._lastKnownFieldValue === undefined && fieldValue !== null && fieldValue !== undefined;
    const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) && 
                             fieldValue !== null && fieldValue !== undefined;
    
    if (hasValueChanged || isInitialLoad || isValueTransition) {
      this._lastKnownFieldValue = normalizedValue;
      callbacks.onValueChanged(normalizedValue);
      callbacks.onCalendarGenerated?.();
      callbacks.onStateChanged?.();
      return true;
    }
    
    if (this._lastKnownFieldValue !== fieldValue) {
      this._lastKnownFieldValue = fieldValue as DatepickerValue;
    }
    
    if (typeof field.disabled === 'function') {
      try {
        const disabled = field.disabled();
        callbacks.onDisabledChanged(disabled);
      } catch (error) {
        console.warn('[NgxsmkDatepicker] Error reading field disabled state during sync:', error);
        callbacks.onSyncError?.(error);
      }
    } else if (field.disabled !== undefined) {
      callbacks.onDisabledChanged(field.disabled);
    }
    return false;
  }

  updateFieldFromInternal(value: DatepickerValue, field: SignalFormField): void {
    if (!field || typeof field !== 'object') return;

    this._isUpdatingFromInternal = true;
    
    try {
      if (field.setValue) {
        field.setValue(value);
      } else if (field.updateValue) {
        field.updateValue(() => value);
      }
    } catch (error) {
      console.warn('[NgxsmkDatepicker] Error updating field value:', error);
    } finally {
      setTimeout(() => {
        this._isUpdatingFromInternal = false;
      }, 0);
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

