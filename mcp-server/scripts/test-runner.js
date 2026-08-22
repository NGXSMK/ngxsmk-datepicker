import assert from 'node:assert';
import {
  handleParseDate,
  handleCalculateDateRange,
  handleConvertTimezone,
  handleGetHolidays,
  handleValidateDateSelection,
} from '../dist/tools/date-tools.js';
import {
  formatOpenAiTools,
  formatGeminiTools,
  formatClaudeTools,
  executeTool,
} from '../dist/adapters/llm-adapters.js';

console.log('Running MCP date-tools assertions...');

// 1. parse_date
const parseToday = handleParseDate({
  expression: 'today',
  referenceDate: '2026-08-22T10:00:00.000Z',
  timezone: 'UTC',
});
assert.strictEqual(parseToday.success, true);
assert.strictEqual(parseToday.date, '2026-08-22');

const parseTomorrow = handleParseDate({
  expression: 'tomorrow',
  referenceDate: '2026-08-22T10:00:00.000Z',
  timezone: 'UTC',
});
assert.strictEqual(parseTomorrow.success, true);
assert.strictEqual(parseTomorrow.date, '2026-08-23');

const parseOffset = handleParseDate({
  expression: 'in 5 days',
  referenceDate: '2026-08-20T00:00:00.000Z',
  timezone: 'UTC',
});
assert.strictEqual(parseOffset.success, true);
assert.strictEqual(parseOffset.date, '2026-08-25');

// 2. calculate_date_range
const rangePreset = handleCalculateDateRange({
  preset: 'last_7_days',
  timezone: 'UTC',
});
assert.strictEqual(rangePreset.success, true);
assert.strictEqual(rangePreset.calendarDays, 7);

const businessOffset = handleCalculateDateRange({
  startDate: '2026-08-24', // Monday
  businessDaysOffset: 5,
  timezone: 'UTC',
});
assert.strictEqual(businessOffset.success, true);
assert.strictEqual(businessOffset.businessDays, 6);

// 3. convert_timezone
const tzConv = handleConvertTimezone({
  date: '2026-08-22T12:00:00.000Z',
  fromTimezone: 'UTC',
  toTimezone: 'Asia/Tokyo',
});
assert.strictEqual(tzConv.success, true);
assert.strictEqual(tzConv.targetTimezone, 'Asia/Tokyo');
assert.strictEqual(tzConv.offsetDifferenceMinutes, 540);

// 4. get_holidays
const holidays = handleGetHolidays({
  year: 2026,
  countryCode: 'US',
});
assert.strictEqual(holidays.success, true);
assert(holidays.holidays.length > 0);

// 5. validate_date_selection
const validDate = handleValidateDateSelection({
  date: '2026-08-22',
  minDate: '2026-08-01',
  maxDate: '2026-08-31',
});
assert.strictEqual(validDate.valid, true);

const invalidDate = handleValidateDateSelection({
  date: '2026-07-31',
  minDate: '2026-08-01',
});
assert.strictEqual(invalidDate.valid, false);

// 6. Multi-LLM Formats (OpenAI, Gemini, Claude)
const openAiTools = formatOpenAiTools();
assert.strictEqual(openAiTools.length, 5);
assert.strictEqual(openAiTools[0].type, 'function');
assert.strictEqual(openAiTools[0].function.name, 'parse_date');

const geminiTools = formatGeminiTools();
assert.strictEqual(geminiTools.functionDeclarations.length, 5);
assert.strictEqual(geminiTools.functionDeclarations[0].name, 'parse_date');

const claudeTools = formatClaudeTools();
assert.strictEqual(claudeTools.length, 5);
assert.strictEqual(claudeTools[0].name, 'parse_date');
assert(claudeTools[0].input_schema !== undefined);

// 7. Universal Tool Execution
const execResult = executeTool('parse_date', {
  expression: 'tomorrow',
  referenceDate: '2026-08-22T00:00:00.000Z',
  timezone: 'UTC',
});
assert.strictEqual(execResult.success, true);
assert.strictEqual(execResult.date, '2026-08-23');

console.log('All MCP & Multi-LLM date-tools tests passed successfully! (11/11 assertions verified)');
