#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  handleParseDate,
  handleCalculateDateRange,
  handleConvertTimezone,
  handleGetHolidays,
  handleValidateDateSelection,
} from './tools/date-tools.js';
import { API_DOCS_RESOURCE, TIMEZONES_RESOURCE } from './resources/api-resources.js';

// Create MCP Server instance
const server = new McpServer({
  name: 'ngxsmk-datepicker-mcp',
  version: '3.0.5',
});

// Tool: parse_date
server.registerTool(
  'parse_date',
  {
    description:
      'Parses natural language date expressions (e.g. "tomorrow", "next Friday", "in 3 weeks", "start of next month", "2026-09-15") into structured ISO date objects with timezone conversion support.',
    inputSchema: {
      expression: z
        .string()
        .describe('Natural language date expression, e.g. "tomorrow", "next Monday", "in 5 days", "2026-09-15"'),
      referenceDate: z
        .string()
        .optional()
        .describe('Optional reference date in ISO format. Defaults to now.'),
      timezone: z
        .string()
        .optional()
        .describe('Optional IANA timezone, e.g. "America/New_York", "Europe/London", "Asia/Colombo"'),
    },
  },
  async (args) => {
    const result = handleParseDate(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: calculate_date_range
server.registerTool(
  'calculate_date_range',
  {
    description:
      'Computes start and end dates given relative presets ("last_7_days", "this_month", "this_quarter", "last_quarter") or start date with calendar or business day offsets.',
    inputSchema: {
      preset: z
        .enum([
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
        ])
        .optional()
        .describe('Standard date range preset'),
      startDate: z.string().optional().describe('Custom start date in ISO format'),
      daysOffset: z.number().optional().describe('Offset in calendar days from start date'),
      businessDaysOffset: z.number().optional().describe('Offset in business/working days (Mon-Fri)'),
      timezone: z.string().optional().describe('Optional IANA timezone'),
    },
  },
  async (args) => {
    const result = handleCalculateDateRange(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: convert_timezone
server.registerTool(
  'convert_timezone',
  {
    description: 'Converts date and time strings across international IANA timezones with DST indicator and offset difference.',
    inputSchema: {
      date: z.string().describe('ISO date-time string to convert'),
      fromTimezone: z.string().optional().describe('Source IANA timezone (defaults to system/UTC)'),
      toTimezone: z.string().describe('Target IANA timezone, e.g. "Europe/Berlin", "Asia/Tokyo"'),
    },
  },
  async (args) => {
    const result = handleConvertTimezone(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: get_holidays
server.registerTool(
  'get_holidays',
  {
    description: 'Retrieves public and national holidays for a given year and country code (e.g. US, GB, DE, FR, LK).',
    inputSchema: {
      year: z.number().int().describe('Calendar year (e.g. 2026)'),
      countryCode: z.string().length(2).describe('2-letter ISO country code (e.g. US, GB, DE, FR, CA, AU, LK)'),
    },
  },
  async (args) => {
    const result = handleGetHolidays(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: validate_date_selection
server.registerTool(
  'validate_date_selection',
  {
    description: 'Validates a date or date range against constraints like minDate, maxDate, disabled dates list, and weekends.',
    inputSchema: {
      date: z.union([
        z.string().describe('Single ISO date string'),
        z.object({
          start: z.string().describe('Start ISO date string'),
          end: z.string().describe('End ISO date string'),
        }),
      ]),
      minDate: z.string().optional().describe('Minimum permitted ISO date'),
      maxDate: z.string().optional().describe('Maximum permitted ISO date'),
      disabledDates: z.array(z.string()).optional().describe('List of blocked/disabled ISO date strings'),
      excludeWeekends: z.boolean().optional().describe('Whether weekend dates (Saturday/Sunday) are invalid'),
    },
  },
  async (args) => {
    const result = handleValidateDateSelection(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Resources
server.registerResource(
  'api_docs',
  API_DOCS_RESOURCE.uri,
  {
    mimeType: API_DOCS_RESOURCE.mimeType,
    description: API_DOCS_RESOURCE.name,
  },
  async () => {
    return {
      contents: [
        {
          uri: API_DOCS_RESOURCE.uri,
          mimeType: API_DOCS_RESOURCE.mimeType,
          text: API_DOCS_RESOURCE.text,
        },
      ],
    };
  }
);

server.registerResource(
  'timezones',
  TIMEZONES_RESOURCE.uri,
  {
    mimeType: TIMEZONES_RESOURCE.mimeType,
    description: TIMEZONES_RESOURCE.name,
  },
  async () => {
    return {
      contents: [
        {
          uri: TIMEZONES_RESOURCE.uri,
          mimeType: TIMEZONES_RESOURCE.mimeType,
          text: TIMEZONES_RESOURCE.text,
        },
      ],
    };
  }
);

// Prompts
server.registerPrompt(
  'schedule_meeting',
  {
    description: 'Generates structured date/time recommendations and prompts for scheduling a meeting.',
    argsSchema: {
      topic: z.string().describe('Meeting title or purpose'),
      timeframe: z.string().describe('Target timeframe, e.g. "next Tuesday", "in 3 days"'),
      durationMinutes: z.string().optional().describe('Meeting duration in minutes'),
    },
  },
  async (args) => {
    const duration = args.durationMinutes || '30';
    return {
      description: `Schedule a meeting about: ${args.topic}`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please help me schedule a ${duration}-minute meeting about "${args.topic}" around ${args.timeframe}. Use the parse_date and validate_date_selection tools to check for valid business days.`,
          },
        },
      ],
    };
  }
);

server.registerPrompt(
  'plan_time_off',
  {
    description: 'Generates vacation/leave scheduling options taking holidays and business days into account.',
    argsSchema: {
      daysCount: z.string().describe('Number of days requested for time off'),
      startingFrom: z.string().describe('Start date or timeframe, e.g. "next month", "2026-09-01"'),
      countryCode: z.string().optional().describe('2-letter country code for holiday evaluation'),
    },
  },
  async (args) => {
    const cc = args.countryCode || 'US';
    return {
      description: `Plan ${args.daysCount} days of time off starting from ${args.startingFrom}`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Plan a ${args.daysCount}-day time off period starting ${args.startingFrom} in country ${cc}. Use calculate_date_range and get_holidays to optimize vacation days around weekends and public holidays.`,
          },
        },
      ],
    };
  }
);

import {
  formatOpenAiTools,
  formatGeminiTools,
  formatClaudeTools,
  executeTool,
  TOOLS_METADATA,
} from './adapters/llm-adapters.js';

export {
  formatOpenAiTools,
  formatGeminiTools,
  formatClaudeTools,
  executeTool,
  TOOLS_METADATA,
};

// Start server on stdio transport or handle CLI export commands
async function run() {
  const args = process.argv.slice(2);
  if (args.includes('--export-openai')) {
    console.log(JSON.stringify(formatOpenAiTools(), null, 2));
    process.exit(0);
  }
  if (args.includes('--export-gemini')) {
    console.log(JSON.stringify(formatGeminiTools(), null, 2));
    process.exit(0);
  }
  if (args.includes('--export-claude')) {
    console.log(JSON.stringify(formatClaudeTools(), null, 2));
    process.exit(0);
  }
  if (args.includes('--export-all')) {
    console.log(
      JSON.stringify(
        {
          openai: formatOpenAiTools(),
          gemini: formatGeminiTools(),
          claude: formatClaudeTools(),
        },
        null,
        2
      )
    );
    process.exit(0);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[ngxsmk-datepicker-mcp] Server running on stdio');
}

run().catch((error) => {
  console.error('[ngxsmk-datepicker-mcp] Fatal error:', error);
  process.exit(1);
});
