import { z } from 'zod';
export declare const parseDateSchema: z.ZodObject<{
    expression: z.ZodString;
    referenceDate: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const calculateDateRangeSchema: z.ZodObject<{
    preset: z.ZodOptional<z.ZodEnum<{
        today: "today";
        yesterday: "yesterday";
        last_7_days: "last_7_days";
        last_30_days: "last_30_days";
        this_week: "this_week";
        last_week: "last_week";
        this_month: "this_month";
        last_month: "last_month";
        this_quarter: "this_quarter";
        last_quarter: "last_quarter";
        this_year: "this_year";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    daysOffset: z.ZodOptional<z.ZodNumber>;
    businessDaysOffset: z.ZodOptional<z.ZodNumber>;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const convertTimezoneSchema: z.ZodObject<{
    date: z.ZodString;
    fromTimezone: z.ZodOptional<z.ZodString>;
    toTimezone: z.ZodString;
}, z.core.$strip>;
export declare const getHolidaysSchema: z.ZodObject<{
    year: z.ZodNumber;
    countryCode: z.ZodString;
}, z.core.$strip>;
export declare const validateDateSelectionSchema: z.ZodObject<{
    date: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        start: z.ZodString;
        end: z.ZodString;
    }, z.core.$strip>]>;
    minDate: z.ZodOptional<z.ZodString>;
    maxDate: z.ZodOptional<z.ZodString>;
    disabledDates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    excludeWeekends: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Parses natural language or formatted date string using Luxon.
 */
export declare function handleParseDate(params: z.infer<typeof parseDateSchema>): {
    success: boolean;
    error: string;
    iso?: undefined;
    date?: undefined;
    time?: undefined;
    formatted?: undefined;
    year?: undefined;
    month?: undefined;
    day?: undefined;
    weekday?: undefined;
    timezone?: undefined;
} | {
    success: boolean;
    iso: string | null;
    date: string | null;
    time: string | null;
    formatted: string;
    year: number;
    month: number;
    day: number;
    weekday: string | null;
    timezone: string | null;
    error?: undefined;
};
/**
 * Calculates date ranges based on presets or offsets.
 */
export declare function handleCalculateDateRange(params: z.infer<typeof calculateDateRangeSchema>): {
    success: boolean;
    error: string;
    startDate?: undefined;
    endDate?: undefined;
    formattedStart?: undefined;
    formattedEnd?: undefined;
    calendarDays?: undefined;
    businessDays?: undefined;
    timezone?: undefined;
} | {
    success: boolean;
    startDate: string | null;
    endDate: string | null;
    formattedStart: string;
    formattedEnd: string;
    calendarDays: number;
    businessDays: number;
    timezone: string;
    error?: undefined;
};
/**
 * Converts timestamps across timezones.
 */
export declare function handleConvertTimezone(params: z.infer<typeof convertTimezoneSchema>): {
    success: boolean;
    error: string;
    sourceDate?: undefined;
    sourceTimezone?: undefined;
    targetDate?: undefined;
    targetTimezone?: undefined;
    targetFormatted?: undefined;
    offsetDifferenceMinutes?: undefined;
    isDST?: undefined;
} | {
    success: boolean;
    sourceDate: string;
    sourceTimezone: string;
    targetDate: string;
    targetTimezone: string;
    targetFormatted: string;
    offsetDifferenceMinutes: number;
    isDST: boolean;
    error?: undefined;
};
/**
 * Retrieves standard holidays for supported countries.
 */
export declare function handleGetHolidays(params: z.infer<typeof getHolidaysSchema>): {
    success: boolean;
    year: number;
    countryCode: string;
    count: number;
    holidays: {
        name: string;
        date: string;
        type: string;
    }[];
};
/**
 * Validates a single date or date range against constraints.
 */
export declare function handleValidateDateSelection(params: z.infer<typeof validateDateSelectionSchema>): {
    valid: boolean;
    errors: string[];
};
