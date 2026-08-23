export const API_DOCS_RESOURCE = {
    uri: 'datepicker://docs/api',
    name: 'ngxsmk-datepicker API Reference & Integration Guide',
    mimeType: 'text/markdown',
    text: `# ngxsmk-datepicker API Specification

## Core Component Inputs
- \`[(ngModel)]\` / \`[field]\`: DatepickerValue binding for Angular Signals and Reactive Forms.
- \`[mode]\`: 'single' | 'range' | 'multiple' | 'month' | 'year' | 'quarter' | 'week'.
- \`[enableAi]\`: boolean (enables natural language AI Assistant in popover/inline UI).
- \`[aiResolver]\`: Custom async resolver function for natural language prompts.
- \`[holidayProvider]\`: Function or lookup table for national and custom holidays.
- \`[timezone]\`: IANA timezone string for international date handling.
- \`[minDate]\` / \`[maxDate]\`: Date boundaries.
- \`[isInvalidDate]\`: Function returning true for disabled dates.
- \`[allowTyping]\` / \`[inputMask]\`: Guided typing with custom masking tokens.
- \`[showPresets]\`: Built-in quick date ranges for range mode.

## Built-in Validators
- \`ngxsmkMinDateValidator(minDate)\`
- \`ngxsmkMaxDateValidator(maxDate)\`
- \`ngxsmkDateRangeValidator({ minDays, maxDays, requireBoth })\`
- \`ngxsmkBlockedDatesValidator(blockedDates)\`
`,
};
export const TIMEZONES_RESOURCE = {
    uri: 'datepicker://timezones',
    name: 'Common IANA Timezones List',
    mimeType: 'application/json',
    text: JSON.stringify([
        'UTC',
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Toronto',
        'America/Sao_Paulo',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Europe/Rome',
        'Europe/Madrid',
        'Europe/Amsterdam',
        'Europe/Stockholm',
        'Asia/Dubai',
        'Asia/Kolkata',
        'Asia/Colombo',
        'Asia/Bangkok',
        'Asia/Singapore',
        'Asia/Tokyo',
        'Asia/Seoul',
        'Asia/Shanghai',
        'Australia/Sydney',
        'Australia/Melbourne',
        'Pacific/Auckland',
    ], null, 2),
};
//# sourceMappingURL=api-resources.js.map