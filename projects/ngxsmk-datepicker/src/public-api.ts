/**
 * Main entry point for ngxsmk-datepicker
 *
 * All exports are explicit to enable optimal tree-shaking.
 * Import only what you need:
 *
 * @example
 * ```typescript
 * import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
 * import { getStartOfDay, normalizeDate } from 'ngxsmk-datepicker/utils';
 * ```
 */

export { NgxsmkDatepickerComponent } from './lib/ngxsmk-datepicker';
export { NgxsmkDatepickerModule } from './lib/ngxsmk-datepicker.module';

export { CustomSelectComponent } from './lib/components/custom-select.component';

export {
  getStartOfDay,
  getEndOfDay,
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

export type {
  HolidayProvider,
  DateRange,
  DatepickerValue,
} from './lib/utils/calendar.utils';

export {
  exportToJson,
  importFromJson,
  exportToCsv,
  importFromCsv,
  exportToIcs,
  importFromIcs,
  type ExportOptions,
} from './lib/utils/export-import.utils';

export {
  formatDateWithTimezone,
  parseDateWithTimezone,
  convertTimezone,
  getTimezoneOffset,
  isValidTimezone,
} from './lib/utils/timezone.utils';

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

export {
  type DateAdapter,
  NativeDateAdapter,
} from './lib/adapters/date-adapter.interface';

export { LocaleRegistryService } from './lib/services/locale-registry.service';
export type {
  LocaleData,
  CalendarSystem,
} from './lib/services/locale-registry.service';

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
export type {
  SignalFormField,
  SignalFormFieldConfig,
} from './lib/services/field-sync.service';

export { provideMaterialFormFieldControl } from './lib/material-form-field.helper';
