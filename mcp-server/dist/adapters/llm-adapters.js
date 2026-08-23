import { handleParseDate, handleCalculateDateRange, handleConvertTimezone, handleGetHolidays, handleValidateDateSelection, parseDateSchema, calculateDateRangeSchema, convertTimezoneSchema, getHolidaysSchema, validateDateSelectionSchema, } from '../tools/date-tools.js';
export const TOOLS_METADATA = [
    {
        name: 'parse_date',
        description: 'Parses natural language date expressions (e.g. "tomorrow", "next Friday", "in 3 weeks", "start of next month", "2026-09-15") into structured ISO date objects with timezone conversion support.',
        parameters: {
            type: 'object',
            properties: {
                expression: {
                    type: 'string',
                    description: 'Natural language date expression, e.g. "tomorrow", "next Monday", "in 5 days", "2026-09-15"',
                },
                referenceDate: {
                    type: 'string',
                    description: 'Optional reference date in ISO format. Defaults to now.',
                },
                timezone: {
                    type: 'string',
                    description: 'Optional IANA timezone, e.g. "America/New_York", "Europe/London", "Asia/Colombo"',
                },
            },
            required: ['expression'],
        },
    },
    {
        name: 'calculate_date_range',
        description: 'Computes start and end dates given relative presets ("last_7_days", "this_month", "this_quarter", "last_quarter") or start date with calendar or business day offsets.',
        parameters: {
            type: 'object',
            properties: {
                preset: {
                    type: 'string',
                    enum: [
                        'today',
                        'yesterday',
                        'last_7_days',
                        'last_30_days',
                        'this_week',
                        'last_week',
                        'this_month',
                        'last_month',
                        'this_quarter',
                        'last_quarter',
                        'this_year',
                    ],
                    description: 'Standard date range preset',
                },
                startDate: {
                    type: 'string',
                    description: 'Custom start date in ISO format',
                },
                daysOffset: {
                    type: 'number',
                    description: 'Offset in calendar days from start date',
                },
                businessDaysOffset: {
                    type: 'number',
                    description: 'Offset in business/working days (Mon-Fri)',
                },
                timezone: {
                    type: 'string',
                    description: 'Optional IANA timezone',
                },
            },
        },
    },
    {
        name: 'convert_timezone',
        description: 'Converts date and time strings across international IANA timezones with DST indicator and offset difference.',
        parameters: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    description: 'ISO date-time string to convert',
                },
                fromTimezone: {
                    type: 'string',
                    description: 'Source IANA timezone (defaults to system/UTC)',
                },
                toTimezone: {
                    type: 'string',
                    description: 'Target IANA timezone, e.g. "Europe/Berlin", "Asia/Tokyo"',
                },
            },
            required: ['date', 'toTimezone'],
        },
    },
    {
        name: 'get_holidays',
        description: 'Retrieves public and national holidays for a given year and country code (e.g. US, GB, DE, FR, LK).',
        parameters: {
            type: 'object',
            properties: {
                year: {
                    type: 'integer',
                    description: 'Calendar year (e.g. 2026)',
                },
                countryCode: {
                    type: 'string',
                    description: '2-letter ISO country code (e.g. US, GB, DE, FR, CA, AU, LK)',
                },
            },
            required: ['year', 'countryCode'],
        },
    },
    {
        name: 'validate_date_selection',
        description: 'Validates a date or date range against constraints like minDate, maxDate, disabled dates list, and weekends.',
        parameters: {
            type: 'object',
            properties: {
                date: {
                    description: 'Single ISO date string or range object with start and end',
                    oneOf: [
                        { type: 'string' },
                        {
                            type: 'object',
                            properties: {
                                start: { type: 'string' },
                                end: { type: 'string' },
                            },
                            required: ['start', 'end'],
                        },
                    ],
                },
                minDate: {
                    type: 'string',
                    description: 'Minimum permitted ISO date',
                },
                maxDate: {
                    type: 'string',
                    description: 'Maximum permitted ISO date',
                },
                disabledDates: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of blocked/disabled ISO date strings',
                },
                excludeWeekends: {
                    type: 'boolean',
                    description: 'Whether weekend dates (Saturday/Sunday) are invalid',
                },
            },
            required: ['date'],
        },
    },
];
/**
 * Executes a tool by name with arguments.
 */
export function executeTool(name, args) {
    switch (name) {
        case 'parse_date': {
            const parsed = parseDateSchema.parse(args);
            return handleParseDate(parsed);
        }
        case 'calculate_date_range': {
            const parsed = calculateDateRangeSchema.parse(args);
            return handleCalculateDateRange(parsed);
        }
        case 'convert_timezone': {
            const parsed = convertTimezoneSchema.parse(args);
            return handleConvertTimezone(parsed);
        }
        case 'get_holidays': {
            const parsed = getHolidaysSchema.parse(args);
            return handleGetHolidays(parsed);
        }
        case 'validate_date_selection': {
            const parsed = validateDateSelectionSchema.parse(args);
            return handleValidateDateSelection(parsed);
        }
        default:
            throw new Error(`Unknown tool: "${name}"`);
    }
}
/**
 * Formats tools for OpenAI function calling (GPT-4o, Assistants API, ChatGPT Connectors).
 */
export function formatOpenAiTools() {
    return TOOLS_METADATA.map((tool) => ({
        type: 'function',
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
        },
    }));
}
/**
 * Formats tools for Google Gemini Function Declarations (Gemini 1.5/2.0, Vertex AI).
 */
export function formatGeminiTools() {
    return {
        functionDeclarations: TOOLS_METADATA.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
        })),
    };
}
/**
 * Formats tools for Anthropic Claude Tools (Claude 3.5 Sonnet, Claude Desktop).
 */
export function formatClaudeTools() {
    return TOOLS_METADATA.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters,
    }));
}
//# sourceMappingURL=llm-adapters.js.map