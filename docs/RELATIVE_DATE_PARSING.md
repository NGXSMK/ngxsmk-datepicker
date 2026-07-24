# 🧠 Natural Language Relative Date Parsing

**Last updated:** July 24, 2026 - **Current stable:** v3.0.2

This document describes the Natural Language date entry and relative date parsing engine implemented in `ngxsmk-datepicker`.

## 🎯 Objective

Allow users to type human-readable relative date expressions (e.g., "today", "tomorrow", "next Friday", "in 2 weeks") into the input field and have them resolved automatically into valid `Date` objects or ranges.

## 🛠️ Implementation Details

The datepicker integrates `NaturalLanguageParserService` to handle relative inputs. It is zero-dependency, maintaining a lightweight package bundle.

### 1. Supported Expressions

The parser resolves several classes of human-readable text inputs:
- **Specific dates**: `today`, `tomorrow`, `yesterday`
- **Relative offsets**: `in X days`, `X days ago`, `in Y weeks`, `Y weeks ago`, `in Z months`, `Z months ago`, `in N years`
- **Relative weekdays**: `next friday`, `last monday`, `this wednesday`
- **Quarter descriptors**: `this quarter`, `next quarter`, `last quarter`

### 2. Logic Flow

When `[enableNaturalLanguage]="true"` is active:
1. As the user types in the input field, the component dynamically runs the text through the `NaturalLanguageParserService`.
2. If a valid relative pattern is matched, a floating **suggestion preview tooltip** appears underneath the input field showing the resolved date/range format.
3. On input blur or press of Enter, the resolved value is set and the calendar view automatically jumps to the resolved date.
4. The event `(naturalLanguageResolved)` is emitted with the resolved `Date` or `DateRange` value.

## 🚀 UX Configuration

Enable natural language input in your template:

```html
<ngxsmk-datepicker
  [enableNaturalLanguage]="true"
  (naturalLanguageResolved)="onResolved($event)">
</ngxsmk-datepicker>
```

### Custom Preview Template

You can override the default suggestion preview tooltip using the `naturalLanguagePreviewTemplate` input:

```html
<ngxsmk-datepicker
  [enableNaturalLanguage]="true"
  [naturalLanguagePreviewTemplate]="customPreviewTpl">
</ngxsmk-datepicker>

<ng-template #customPreviewTpl let-previewText>
  <div class="custom-tooltip">
    ✨ Suggestion: <strong>{{ previewText }}</strong>
  </div>
</ng-template>
```
