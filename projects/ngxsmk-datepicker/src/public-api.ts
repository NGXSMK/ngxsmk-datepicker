/**
 * Main entry point for ngxsmk-datepicker
 *
 * All exports are explicit to enable optimal tree-shaking.
 * Import only what you need:
 *
 * @example
 * ```typescript
 * import { NgxsmkDatepickerComponent, getStartOfDay, normalizeDate } from 'ngxsmk-datepicker';
 * ```
 */

export { NgxsmkDatepickerComponent } from './lib/ngxsmk-datepicker';
export { NgxsmkDatepickerModule } from './lib/ngxsmk-datepicker.module';

export { CustomSelectComponent } from './lib/components/custom-select.component';

export {
  getStartOfDay,
  getEndOfDay,
  getISOWeekNumber,
  addMonths,
  subtractDays,
  getStartOfMonth,
  getEndOfMonth,
  isSameDay,
  normalizeDate,
  type DateInput,
} from './lib/utils/date.utils';

export {
  generateMonthOptions,
  generateYearOptions,
  formatLocaleNumber,
  generateTimeOptions,
  generateWeekDays,
  getFirstDayOfWeek,
  get24Hour,
  update12HourState,
  processDateRanges,
  generateYearGrid,
  generateDecadeGrid,
} from './lib/utils/calendar.utils';

export type { HolidayProvider, DateRange, DatepickerValue } from './lib/utils/calendar.utils';

export {
  exportToJson,
  importFromJson,
  exportToCsv,
  importFromCsv,
  exportToIcs,
  importFromIcs,
  type ExportOptions,
} from './lib/utils/export-import.utils';

export { getSecondaryDayLabel, formatDateInCalendarSystem } from './lib/utils/calendar-systems.utils';

export {
  formatDateWithTimezone,
  parseDateWithTimezone,
  convertTimezone,
  getTimezoneOffset,
  isValidTimezone,
} from './lib/utils/timezone.utils';

export type { DayMetadata, DayMetadataProvider } from './lib/interfaces/day-metadata.interface';

export type {
  DayCellRenderHook,
  ValidationHook,
  KeyboardShortcutHook,
  KeyboardShortcutContext,
  KeyboardShortcutHelp,
  DateFormatHook,
  EventHook,
  DatepickerHooks,
} from './lib/interfaces/datepicker-hooks.interface';

export {
  DATEPICKER_CONFIG,
  DEFAULT_DATEPICKER_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  provideDatepickerConfig,
  type DatepickerConfig,
  type AnimationConfig,
} from './lib/config/datepicker.config';

export { type DateAdapter, NativeDateAdapter } from './lib/adapters/date-adapter.interface';

export { LocaleRegistryService } from './lib/services/locale-registry.service';
export type { LocaleData, CalendarSystem } from './lib/services/locale-registry.service';

export { TranslationRegistryService } from './lib/services/translation-registry.service';
export { DefaultTranslationService } from './lib/services/translation.service';
export type { TranslationService } from './lib/services/translation.service';
export { CustomDateFormatService } from './lib/services/custom-date-format.service';
export type {
  DatepickerTranslations,
  PartialDatepickerTranslations,
} from './lib/interfaces/datepicker-translations.interface';

export { ThemeBuilderService } from './lib/services/theme-builder.service';
export type { DatepickerTheme } from './lib/services/theme-builder.service';
export { DatePresetsService } from './lib/services/date-presets.service';
export type { DatePreset } from './lib/services/date-presets.service';
export { AriaLiveService } from './lib/services/aria-live.service';
export { FocusTrapService } from './lib/services/focus-trap.service';
export { HapticFeedbackService } from './lib/services/haptic-feedback.service';

export { FieldSyncService } from './lib/services/field-sync.service';
export type { SignalFormField, SignalFormFieldConfig } from './lib/services/field-sync.service';

// Material (mat-form-field) integration is optional. The main bundle does not import @angular/material.
// To use with mat-form-field: install @angular/material and @angular/cdk, then add the directive
// from the repo or use the snippet in INTEGRATION.md § Angular Material.

// ─── Schedule Mode ────────────────────────────────────────────────────────────
// Enabled when `mode="schedule"` on NgxsmkDatepickerComponent.
// The ScheduleEditorComponent can also be used standalone.
export type {
  ScheduleItem,
  ScheduleColor,
  SchedulePriority,
  ScheduleRecurrence,
  ScheduleChangeEvent,
  ScheduleFieldsConfig,
  ScheduleFormTemplates,
  ScheduleFormContext,
} from './lib/interfaces/schedule-item.interface';
export {
  DEFAULT_SCHEDULE_FIELDS,
  DEFAULT_SCHEDULE_COLORS,
  DEFAULT_SCHEDULE_ICONS,
} from './lib/interfaces/schedule-item.interface';
export { ScheduleService } from './lib/services/schedule.service';
export type { ScheduleValidationError, ScheduleValidationResult } from './lib/services/schedule.service';
export { ScheduleEditorComponent } from './lib/components/schedule-editor.component';
export { ScheduleItemRowComponent } from './lib/components/schedule-item-row.component';
export { ScheduleFormComponent } from './lib/components/schedule-form.component';
