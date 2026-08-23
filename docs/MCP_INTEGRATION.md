# 🤖 Model Context Protocol (MCP) & Multi-LLM AI Integration

**Last updated:** August 22, 2026 - **Current stable:** v3.0.5

`ngxsmk-datepicker` provides comprehensive, standardized integration with all major AI ecosystems:
- **Claude** (Anthropic Claude Desktop, Claude Code, Claude 3.5 Sonnet Tool Use)
- **Google Gemini** (Google Antigravity, Gemini CLI, Vertex AI, Gemini 1.5/2.0 Function Calling)
- **OpenAI** (ChatGPT Operator, GPT-4o, OpenAI Assistants API, Function Calling)
- **Cursor / Windsurf / VS Code** (Native Stdio Model Context Protocol)

---

## 1. Standalone MCP & Multi-LLM Server (`@ngxsmk/datepicker-mcp`)

The `@ngxsmk/datepicker-mcp` package runs as a standard Model Context Protocol (MCP) server over standard I/O (stdio), while also providing native export capabilities for OpenAI, Gemini, and Claude schemas.

### Running & Building
```bash
# Build the server
npm run mcp:build

# Run MCP Server (Stdio transport)
npm run mcp:start

# Export tool schemas in native LLM formats
node mcp-server/dist/index.js --export-openai   # OpenAI Function Calling Schema
node mcp-server/dist/index.js --export-gemini   # Google Gemini Function Declarations
node mcp-server/dist/index.js --export-claude   # Anthropic Claude Tool Use Schema
node mcp-server/dist/index.js --export-all      # All formats combined

# Run automated tests
npm run test:mcp
```

### Available Tools & Functions

| Tool Name | Parameters | Description |
|-----------|------------|-------------|
| `parse_date` | `expression`, `referenceDate?`, `timezone?` | Converts natural language ("next Friday", "in 3 weeks", "start of next month", "2026-09-15") into structured ISO date objects. |
| `calculate_date_range` | `preset?`, `startDate?`, `daysOffset?`, `businessDaysOffset?`, `timezone?` | Calculates date spans from standard presets (`last_7_days`, `this_quarter`, `this_year`) or business day offsets. |
| `convert_timezone` | `date`, `fromTimezone?`, `toTimezone` | Converts timestamps between international IANA timezones with DST indicator and offset difference. |
| `get_holidays` | `year`, `countryCode` | Retrieves public and national holidays for supported country codes (e.g. `US`, `GB`, `DE`, `FR`, `LK`). |
| `validate_date_selection` | `date`, `minDate?`, `maxDate?`, `disabledDates?`, `excludeWeekends?` | Validates date and range selections against constraints. |

### Available Prompts

| Prompt Name | Arguments | Purpose |
|-------------|-----------|---------|
| `schedule_meeting` | `topic`, `timeframe`, `durationMinutes?` | Prepares meeting scheduling recommendations with business-day validation. |
| `plan_time_off` | `daysCount`, `startingFrom`, `countryCode?` | Calculates optimal vacation date spans avoiding weekends and holidays. |

### Available Resources

- `datepicker://docs/api` - Complete API specification and parameter contracts.
- `datepicker://timezones` - Comprehensive list of supported IANA timezone strings.

---

## 2. Platform Setup Guides

### A. Claude Desktop & Claude Code
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ngxsmk-datepicker": {
      "command": "node",
      "args": ["/absolute/path/to/ngxsmk-datepicker/mcp-server/dist/index.js"]
    }
  }
}
```

### B. Google Gemini / Antigravity CLI
Configured automatically via `.gemini/mcp_config.json`:

```json
{
  "mcpServers": {
    "ngxsmk-datepicker": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "description": "Date, calendar, holiday, and timezone intelligence tools for ngxsmk-datepicker"
    }
  }
}
```

### C. Cursor IDE & VS Code
Configured automatically via `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "ngxsmk-datepicker": {
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/dist/index.js"]
    }
  }
}
```

### D. OpenAI Function Calling (GPT-4o, ChatGPT, Assistants)
Export schemas directly into your OpenAI API payloads:

```typescript
import { formatOpenAiTools, executeTool } from '@ngxsmk/datepicker-mcp';

// 1. Pass tools to OpenAI
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'What is the date of next Friday?' }],
  tools: formatOpenAiTools(),
});

// 2. Execute tool call returned by OpenAI
const toolCall = response.choices[0].message.tool_calls?.[0];
if (toolCall) {
  const result = executeTool(toolCall.function.name, JSON.parse(toolCall.function.arguments));
  console.log('Result:', result);
}
```

---

## 3. UI AI Assistant Component

Enable the embedded AI Assistant prompt bar and quick suggestion chips inside `<ngxsmk-datepicker>`:

```html
<ngxsmk-datepicker
  [(ngModel)]="selectedDate"
  [enableAi]="true"
  [showAiSuggestions]="true"
  [aiSuggestions]="['Tomorrow', 'Next Friday', 'In 3 days', 'Next month']"
  aiPlaceholder="Ask AI (e.g. 'next Friday', 'last 7 days')..."
  (aiPromptSubmitted)="onPrompt($event)"
></ngxsmk-datepicker>
```

### AI Features & Shortcuts
- **Keyboard Shortcut**: Press `/` anywhere in the calendar popover to instantly focus the AI input.
- **One-Click Prompt Chips**: Clickable suggestions for instant selection without typing.
- **Async Loading Indicator**: Built-in spinning loader during asynchronous backend queries.
- **Screen Reader Announcements**: Live a11y announcements when AI resolves or encounters unrecognized inputs.

### Custom Backend Connection (`aiResolver`)
Connect directly to your Claude, Gemini, OpenAI, or MCP backend:

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
    <ngxsmk-datepicker
      [(ngModel)]="dateRange"
      mode="range"
      [enableAi]="true"
      [aiResolver]="resolveWithAi"
    ></ngxsmk-datepicker>
  `
})
export class MyComponent {
  dateRange = { start: null, end: null };

  resolveWithAi = async (prompt: string) => {
    const res = await fetch('/api/llm-date-parser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const json = await res.json();
    return {
      start: new Date(json.startDate),
      end: new Date(json.endDate),
    };
  };
}
```
