/**
 * Services for the ngxsmk-datepicker component
 * 
 * These services extract business logic from the monolithic component
 * to improve maintainability, testability, and separation of concerns.
 */

export { ValueManagementService } from './value-management.service';
export { DateSelectionService } from './date-selection.service';
export { ThemeBuilderService } from './theme-builder.service';
export { DatePresetsService } from './date-presets.service';
export type { DatepickerTheme } from './theme-builder.service';
export type { DatePreset } from './date-presets.service';
export type { DateSelectionState, DateSelectionConfig, DateSelectionCallbacks } from './date-selection.service';
export { KeyboardNavigationService } from './keyboard-navigation.service';
export type { KeyboardNavigationState, KeyboardNavigationCallbacks, KeyboardNavigationConfig } from './keyboard-navigation.service';
export { TouchGestureHandlerService } from './touch-gesture-handler.service';
export type { TouchGestureState, TouchGestureConfig, TouchGestureCallbacks } from './touch-gesture-handler.service';
export { FieldSyncService } from './field-sync.service';
export type { SignalFormField, FieldSyncCallbacks } from './field-sync.service';

export { LocaleRegistryService } from './locale-registry.service';
export type { LocaleData, CalendarSystem } from './locale-registry.service';

export { TranslationRegistryService } from './translation-registry.service';
export { DefaultTranslationService } from './translation.service';
export type { TranslationService } from './translation.service';
export type { DatepickerTranslations, PartialDatepickerTranslations } from '../interfaces/datepicker-translations.interface';

export { FocusTrapService } from './focus-trap.service';
export { AriaLiveService } from './aria-live.service';
export { CalendarGenerationService } from './calendar-generation.service';
export type { CalendarMonth } from './calendar-generation.service';
export { DisplayFormattingService } from './display-formatting.service';
export type { FormattingOptions } from './display-formatting.service';
export { DateValidationService } from './date-validation.service';
export type { ValidationConstraints } from './date-validation.service';

