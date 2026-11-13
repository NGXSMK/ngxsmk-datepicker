/** Supported selection modes on the datepicker host and calendar views. */
export type DatepickerMode = 'single' | 'range' | 'multiple' | 'week' | 'month' | 'quarter' | 'year' | 'timeRange';

/** Extended mode union used by optional hooks / schedule integrations. */
export type DatepickerModeExtended = DatepickerMode | 'schedule';
