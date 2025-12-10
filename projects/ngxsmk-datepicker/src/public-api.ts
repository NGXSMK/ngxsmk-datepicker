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
  generateTimeOptions,
  generateWeekDays,
  getFirstDayOfWeek,
  get24Hour,
  update12HourState,
  processDateRanges,
  generateYearGrid,
  generateDecadeGrid,
  type HolidayProvider,
  type DateRange,
  type DatepickerValue,
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
export type { LocaleData, CalendarSystem } from './lib/services/locale-registry.service';

export { TranslationRegistryService, DefaultTranslationService } from './lib/services';
export type { TranslationService, DatepickerTranslations, PartialDatepickerTranslations } from './lib/services';

export { ThemeBuilderService, DatePresetsService } from './lib/services';
export type { DatepickerTheme, DatePreset } from './lib/services';

export { FieldSyncService } from './lib/services/field-sync.service';
export type { SignalFormField } from './lib/services/field-sync.service';


