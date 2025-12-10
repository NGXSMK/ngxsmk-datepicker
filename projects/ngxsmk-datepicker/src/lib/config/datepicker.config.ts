import { InjectionToken } from '@angular/core';
import { HolidayProvider } from '../utils/calendar.utils';
import { DateAdapter, NativeDateAdapter } from '../adapters/date-adapter.interface';

export interface DatepickerConfig {
  weekStart?: number | null;
  minuteInterval?: number;
  holidayProvider?: HolidayProvider | null;
  yearRange?: number;
  locale?: string;
  timezone?: string;
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
  dateAdapter?: DateAdapter;
  animations?: AnimationConfig;
}

export interface AnimationConfig {
  enabled?: boolean;
  duration?: number;
  easing?: string;
  property?: string;
  respectReducedMotion?: boolean;
}

export interface MobileConfig {
  useNativePicker?: boolean;
  enableHapticFeedback?: boolean;
  mobileModalStyle?: 'bottom-sheet' | 'center' | 'fullscreen';
  mobileTimePickerStyle?: 'wheel' | 'slider' | 'native';
  enablePullToRefresh?: boolean;
  mobileTheme?: 'compact' | 'comfortable' | 'spacious';
  enableVoiceInput?: boolean;
  autoDetectMobile?: boolean;
}

export const DEFAULT_ANIMATION_CONFIG: Required<AnimationConfig> = {
  enabled: true,
  duration: 150,
  easing: 'ease-in-out',
  property: 'all',
  respectReducedMotion: true,
};

export const DATEPICKER_CONFIG = new InjectionToken<DatepickerConfig>('DATEPICKER_CONFIG');

export const DEFAULT_DATEPICKER_CONFIG: DatepickerConfig = {
  weekStart: null,
  minuteInterval: 1,
  holidayProvider: null,
  yearRange: 10,
  dateAdapter: new NativeDateAdapter(),
  animations: DEFAULT_ANIMATION_CONFIG,
};

export function provideDatepickerConfig(config: DatepickerConfig) {
  return {
    provide: DATEPICKER_CONFIG,
    useValue: { ...DEFAULT_DATEPICKER_CONFIG, ...config }
  };
}

