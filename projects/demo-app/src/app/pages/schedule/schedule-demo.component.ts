import { Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ScheduleEditorComponent,
  ScheduleItem,
  ScheduleChangeEvent,
  ScheduleFieldsConfig,
} from 'ngxsmk-datepicker';
import { ThemeService } from '@tokiforge/angular';

// ─── Seed Data ────────────────────────────────────────────────────────────────

function d(offset: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function seedItems(): ScheduleItem[] {
  return [
    {
      id: 'seed-1',
      title: 'Marilyn Schleifer',
      start: d(-1),
      end: d(3),
      color: 'pink',
      priority: 'high',
      category: 'Lot #1',
      tags: ['booking', 'renter'],
      notes: 'Renter: Marilyn Schleifer, Date: 26 Feb - 01 Mar',
    },
    {
      id: 'seed-2',
      title: 'Gustavo Carder',
      start: d(2),
      end: d(9),
      color: 'pink',
      priority: 'medium',
      category: 'Lot #2',
      tags: ['booking'],
    },
    {
      id: 'seed-3',
      title: 'Lot #3 Booking',
      start: d(5),
      end: d(8),
      color: 'pink',
      priority: 'low',
      category: 'Lot #3',
    },
    {
      id: 'seed-4',
      title: 'Kayla Jenkins',
      start: d(0),
      end: d(1),
      color: 'pink',
      priority: 'high',
      category: 'Lot #4',
      tags: ['booking'],
    },
    {
      id: 'seed-5',
      title: 'Charlie Adams',
      start: d(1),
      end: d(3),
      color: 'pink',
      priority: 'high',
      category: 'Lot #5',
      tags: ['booking'],
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-schedule-demo',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ScheduleEditorComponent],
  template: `
    <div class="animate-fade-in schedule-demo-page">

      <!-- ── Page Header ─────────────────────────────────────────── -->
      <div class="page-header">
        <h1>Date Schedule Planner</h1>
        <p class="text-lg">
          A fully-customizable schedule panel. Add, edit, drag-and-drop,
          filter, and export items — every unit is overridable.
        </p>
      </div>

      <!-- ── Feature Pills ──────────────────────────────────────── -->
      <div class="feature-pills">
        @for (pill of featurePills; track pill) {
          <span class="feature-pill">{{ pill }}</span>
        }
      </div>

      <!-- ═══════════════════════════════════════════════════════════
           DEMO 1 — Full-featured editor (default config)
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>1 · Full-Featured Editor</h2>
          <p>
            All features enabled: drag-and-drop reorder, inline add/edit form, search,
            sort, tag/category filters, conflict detection, and JSON/CSV/ICS export.
          </p>
        </div>

        <div class="demo-layout">
          <div class="demo-editor-wrap">
            <smk-schedule-editor
              [scheduleItems]="seedItems"
              [scheduleShowTime]="true"
              [scheduleCategoryOptions]="categories"
              [scheduleTagSuggestions]="tagSuggestions"
              (scheduleChange)="onScheduleChange($event)"
              (scheduleApply)="onApply($event)"
              (scheduleCancel)="onCancel()"
              (itemAdd)="logEvent('Added', $event)"
              (itemEdit)="logEvent('Editing', $event)"
              (itemDelete)="logEvent('Deleted', $event)"
              (itemDuplicate)="logEvent('Duplicated', $event)"
            />
          </div>

          <div class="demo-log">
            <h3 class="demo-log__title">Event Log</h3>
            @if (eventLog().length === 0) {
              <p class="demo-log__empty">Interact with the schedule to see events here.</p>
            }
            @for (entry of eventLog(); track $index) {
              <div class="demo-log__entry" [class]="'demo-log__entry--' + entry.type">
                <span class="demo-log__badge">{{ entry.type }}</span>
                <span class="demo-log__msg">{{ entry.msg }}</span>
                <span class="demo-log__time">{{ entry.time }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           DEMO 2 — Minimal (fields stripped back)
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>2 · Minimal Configuration</h2>
          <p>
            Only title + date fields visible. Color, icon, tags, notes, and all
            extra controls hidden via <code>scheduleFields</code>.
          </p>
        </div>

        <div class="demo-code-preview">
          <pre><code>{{ minimalCode }}</code></pre>
        </div>

        <div class="demo-editor-wrap demo-editor-wrap--sm">
          <smk-schedule-editor
            [scheduleFields]="minimalFields"
            [scheduleShowSearch]="false"
            [scheduleShowSort]="false"
            [scheduleShowFilter]="false"
            [scheduleShowExport]="false"
            [scheduleShowImport]="false"
            [scheduleShowConflicts]="false"
            [scheduleShowDuplicate]="false"
            scheduleTitle="Simple Planner"
            scheduleAddLabel="Add"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           DEMO 3 — Custom Row Template
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>3 · Custom Row Template</h2>
          <p>
            The default row is replaced entirely via <code>[scheduleRowTemplate]</code>.
            Your <code>TemplateRef</code> receives <code>{{ '{' }} $implicit: ScheduleItem {{ '}' }}</code>.
          </p>
        </div>

        <!-- Custom row template definition -->
        <ng-template #customRow let-item>
          <div class="custom-row" [style.--custom-row-color]="colorMap[item.color ?? 'blue']">
            <span class="custom-row__bullet" [style.background]="colorMap[item.color ?? 'blue']"></span>
            <div class="custom-row__body">
              <span class="custom-row__title">{{ item.title }}</span>
              @if (item.category) {
                <span class="custom-row__cat">{{ item.category }}</span>
              }
            </div>
            <span class="custom-row__date">{{ item.start | date:'MMM d' }}</span>
          </div>
        </ng-template>

        <div class="demo-editor-wrap demo-editor-wrap--sm">
          <smk-schedule-editor
            [scheduleItems]="seedItems"
            [scheduleRowTemplate]="customRow"
            [scheduleShowExport]="false"
            [scheduleShowImport]="false"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           DEMO 4 — Hook: onBeforeDelete confirmation
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>4 · Lifecycle Hook — Before Delete</h2>
          <p>
            The <code>[onBeforeDelete]</code> hook intercepts the delete action.
            Return <code>false</code> to cancel. Here we show a native <code>confirm()</code> dialog.
          </p>
        </div>

        <div class="demo-editor-wrap demo-editor-wrap--sm">
          <smk-schedule-editor
            [scheduleItems]="seedItems"
            [onBeforeDelete]="confirmDelete"
            [scheduleShowExport]="false"
            [scheduleShowImport]="false"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           DEMO 5 — Custom Colour Palette
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>5 · Custom Color Palette</h2>
          <p>
            Pass any mix of named presets and hex codes via
            <code>[scheduleColorPresets]</code>.
          </p>
        </div>

        <div class="demo-editor-wrap demo-editor-wrap--sm">
          <smk-schedule-editor
            [scheduleColorPresets]="customColorPalette"
            [scheduleShowExport]="false"
            [scheduleShowImport]="false"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           DEMO 6 — Custom Validation
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>6 · Custom Validation</h2>
          <p>
            The <code>[validateScheduleItem]</code> hook runs after built-in validation.
            Here titles must start with a capital letter.
          </p>
        </div>

        <div class="demo-code-preview">
          <pre><code>{{ validationCode }}</code></pre>
        </div>

        <div class="demo-editor-wrap demo-editor-wrap--sm">
          <smk-schedule-editor
            [validateScheduleItem]="capitalLetterValidator"
            [scheduleShowExport]="false"
            [scheduleShowImport]="false"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           DEMO 7 — Full-Page Dashboard Layout
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>7 · Full-Page Dashboard Layout</h2>
          <p>
            By setting <code>[fullPage]="true"</code>, the schedule panel will expand to fill 100% of the parent
            container's width and height. This is perfect for dedicated scheduling dashboards or planning tabs.
          </p>
        </div>

        <div class="demo-editor-wrap demo-editor-wrap--fullpage" style="height: 520px; border: 1px solid var(--color-border); border-radius: 16px; overflow: hidden;">
          <smk-schedule-editor
            [fullPage]="true"
            [scheduleItems]="fullPageItems"
            [scheduleShowTime]="true"
            scheduleTitle="Enterprise Workspace Planner"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           API Quick Reference Table
           ═══════════════════════════════════════════════════════════ -->
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>API Quick Reference</h2>
        </div>

        <div class="api-table-wrap">
          <table class="api-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              @for (row of apiRows; track row.input) {
                <tr>
                  <td><code>{{ row.input }}</code></td>
                  <td><code class="type">{{ row.type }}</code></td>
                  <td><code class="default">{{ row.default }}</code></td>
                  <td>{{ row.desc }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .schedule-demo-page { max-width: 960px; margin: 0 auto; }

    .feature-pills {
      display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 40px;
    }
    .feature-pill {
      background: var(--color-surface-2, rgba(0,0,0,0.03));
      color: var(--color-text-muted);
      border: 1px solid var(--color-border, rgba(0,0,0,0.06));
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 500;
    }

    .demo-section {
      margin-bottom: 64px;
    }
    .demo-section__header {
      margin-bottom: 20px;
    }
    .demo-section__header h2 {
      margin: 0 0 8px;
      font-size: 22px;
      font-weight: 700;
    }
    .demo-section__header p {
      margin: 0;
      color: var(--color-text-muted);
      font-size: 14px;
      line-height: 1.6;
    }

    .demo-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 20px;
      align-items: start;
    }

    .demo-editor-wrap {
      border-radius: 12px;
      overflow: hidden;
    }
    .demo-editor-wrap--sm smk-schedule-editor {
      --datepicker-schedule-panel-max-height: 400px;
    }

    .demo-code-preview {
      background: var(--color-surface-2, #1a1f2e);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 16px;
      overflow-x: auto;
    }
    .demo-code-preview pre { margin: 0; }
    .demo-code-preview code {
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 12.5px;
      color: var(--color-text-muted);
      white-space: pre;
    }

    /* Event Log */
    .demo-log {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 16px;
      max-height: 540px;
      overflow-y: auto;
    }
    .demo-log__title {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: var(--color-text-muted);
      margin: 0 0 12px;
    }
    .demo-log__empty { color: var(--color-text-muted); font-size: 13px; text-align: center; padding: 24px 0; }
    .demo-log__entry {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--color-border);
      font-size: 12px;
    }
    .demo-log__entry:last-child { border-bottom: none; }
    .demo-log__badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .demo-log__entry--Added .demo-log__badge    { background: rgba(34,197,94,.15); color: #22c55e; }
    .demo-log__entry--Editing .demo-log__badge  { background: rgba(59,130,246,.15); color: #3b82f6; }
    .demo-log__entry--Deleted .demo-log__badge  { background: rgba(239,68,68,.15); color: #ef4444; }
    .demo-log__entry--Duplicated .demo-log__badge { background: rgba(168,85,247,.15); color: #a855f7; }
    .demo-log__entry--applied .demo-log__badge  { background: rgba(234,179,8,.15); color: #eab308; }
    .demo-log__msg { flex: 1; color: var(--color-text); }
    .demo-log__time { color: var(--color-text-muted); font-size: 11px; flex-shrink: 0; }

    /* Custom row template */
    .custom-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-left: 3px solid var(--custom-row-color, var(--color-primary));
      border-radius: 8px;
      cursor: default;
      transition: all 150ms ease;
    }
    .custom-row:hover { background: var(--color-surface-hover); }
    .custom-row__bullet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .custom-row__body {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .custom-row__title {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .custom-row__cat {
      font-size: 10px;
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 8%, transparent);
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 500;
    }
    .custom-row__date {
      font-size: 11px;
      color: var(--color-text-muted);
      flex-shrink: 0;
      font-weight: 500;
    }

    /* API Table */
    .api-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--color-border);
      border-radius: 10px;
    }
    .api-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .api-table th {
      background: var(--color-surface-2);
      padding: 10px 14px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border);
    }
    .api-table td {
      padding: 10px 14px;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text);
    }
    .api-table tr:last-child td { border-bottom: none; }
    .api-table code { font-size: 12px; }
    .api-table code.type    { color: #a855f7; }
    .api-table code.default { color: #22c55e; }

    @media (max-width: 700px) {
      .demo-layout { grid-template-columns: 1fr; }
    }
  `],
})
export class ScheduleDemoComponent {
  readonly themeService = inject(ThemeService);

  // ─── Seed Data ─────────────────────────────────────────────────

  readonly seedItems: ScheduleItem[] = seedItems();
  readonly fullPageItems: ScheduleItem[] = seedItems();

  readonly categories = ['Lot #1', 'Lot #2', 'Lot #3', 'Lot #4', 'Lot #5', 'Lot #6', 'Lot #7', 'Lot #8', 'Lot #9', 'Lot #10'];
  readonly tagSuggestions = ['sprint', 'kickoff', 'review', 'milestone', 'launch', 'stakeholders', 'ui', 'team'];

  // ─── Color map for custom row template ────────────────────────

  readonly colorMap: Record<string, string> = {
    red: '#ef4444', orange: '#f97316', yellow: '#eab308',
    green: '#22c55e', teal: '#14b8a6', blue: '#3b82f6',
    indigo: '#6366f1', purple: '#a855f7', pink: '#ec4899', gray: '#6b7280',
  };

  // ─── Feature Pills ─────────────────────────────────────────────

  readonly featurePills = [
    'Drag & Drop', 'Inline Edit', 'Search', 'Sort',
    'Tag Filters', 'Conflict Detection', 'Recurrence',
    'Color Picker', 'Icon Picker', 'Import', 'Export',
    'Lock Items', 'Complete Toggle', 'Template Slots',
    'Lifecycle Hooks', 'i18n Ready', 'Dark Mode',
  ];

  // ─── Event Log ─────────────────────────────────────────────────

  readonly eventLog = signal<{ type: string; msg: string; time: string }[]>([]);

  logEvent(type: string, item: ScheduleItem) {
    const now = new Date().toLocaleTimeString();
    this.eventLog.update((log) => [
      { type, msg: `"${item.title}"`, time: now },
      ...log.slice(0, 19),
    ]);
  }

  onScheduleChange(event: ScheduleChangeEvent) {
    const type = event.action.charAt(0).toUpperCase() + event.action.slice(1);
    const count = event.items.length;
    const now = new Date().toLocaleTimeString();
    this.eventLog.update((log) => [
      { type, msg: `${count} item${count !== 1 ? 's' : ''} in schedule`, time: now },
      ...log.slice(0, 19),
    ]);
  }

  onApply(items: ScheduleItem[]) {
    const now = new Date().toLocaleTimeString();
    this.eventLog.update((log) => [
      { type: 'applied', msg: `Applied ${items.length} item${items.length !== 1 ? 's' : ''}`, time: now },
      ...log.slice(0, 19),
    ]);
  }

  onCancel() {
    const now = new Date().toLocaleTimeString();
    this.eventLog.update((log) => [
      { type: 'Cancelled', msg: 'Schedule editing cancelled', time: now },
      ...log.slice(0, 19),
    ]);
  }

  // ─── Demo 2 — Minimal Fields ────────────────────────────────────

  readonly minimalFields: ScheduleFieldsConfig = {
    showTitle:      true,
    showStart:      true,
    showEnd:        true,
    showColor:      false,
    showIcon:       false,
    showPriority:   false,
    showTags:       false,
    showNotes:      false,
    showUrl:        false,
    showCategory:   false,
    showAllDay:     false,
    showRecurrence: false,
    showTimezone:   false,
    showBadgeText:  false,
  };

  readonly minimalCode = `<smk-schedule-editor
  [scheduleFields]="{ showColor: false, showIcon: false,
    showTags: false, showNotes: false, showPriority: false }"
  [scheduleShowSearch]="false"
  [scheduleShowExport]="false"
  scheduleTitle="Simple Planner"
/>`;

  // ─── Demo 4 — Before Delete Hook ────────────────────────────────

  readonly confirmDelete = (item: ScheduleItem): boolean => {
    return window.confirm(`Delete "${item.title}"?`);
  };

  // ─── Demo 5 — Custom Colors ─────────────────────────────────────

  readonly customColorPalette = [
    '#FF6B6B', '#FF8E53', '#FFC300', '#2ECC71', '#1ABC9C',
    '#3498DB', '#9B59B6', '#E91E63', '#607D8B',
  ];

  // ─── Demo 6 — Custom Validation ─────────────────────────────────

  readonly capitalLetterValidator = (item: ScheduleItem): string | null => {
    if (item.title && !/^[A-Z]/.test(item.title)) {
      return 'Title must start with a capital letter.';
    }
    return null;
  };

  readonly validationCode = `validateScheduleItem = (item, all) => {
  if (!/^[A-Z]/.test(item.title)) {
    return 'Title must start with a capital letter.';
  }
  return null;
};`;

  // ─── API Reference Table ─────────────────────────────────────────

  readonly apiRows = [
    { input: 'scheduleItems',         type: 'ScheduleItem[]',            default: '[]',    desc: 'Initial items to seed the schedule' },
    { input: 'scheduleTitle',         type: 'string',                    default: '"Date Schedule"', desc: 'Panel heading text' },
    { input: 'scheduleAddLabel',      type: 'string',                    default: '"Add Item"', desc: 'Add button label' },
    { input: 'scheduleFields',        type: 'ScheduleFieldsConfig',      default: 'all on', desc: 'Show/hide each form field individually' },
    { input: 'scheduleFormTemplates', type: 'ScheduleFormTemplates',     default: 'null',  desc: 'TemplateRef overrides for each form field' },
    { input: 'scheduleColorPresets',  type: '(ScheduleColor|string)[]', default: '10 presets', desc: 'Color swatches in the color picker' },
    { input: 'scheduleIconPresets',   type: 'string[]',                  default: '12 emojis', desc: 'Icon buttons in the icon picker' },
    { input: 'scheduleCategoryOptions','type': 'string[]',               default: '[]',    desc: 'Category dropdown options' },
    { input: 'scheduleTagSuggestions','type': 'string[]',               default: '[]',    desc: 'Tag autocomplete suggestions' },
    { input: 'scheduleShowTime',      type: 'boolean',                   default: 'false', desc: 'Show time inputs alongside date fields' },
    { input: 'scheduleAllowOverlap',  type: 'boolean',                   default: 'true',  desc: 'Allow items with overlapping dates' },
    { input: 'scheduleMaxItems',      type: 'number|null',               default: 'null',  desc: 'Maximum number of items allowed' },
    { input: 'scheduleShowDragHandle','type': 'boolean',                 default: 'true',  desc: 'Show drag-and-drop handle on rows' },
    { input: 'scheduleShowExport',    type: 'boolean',                   default: 'true',  desc: 'Show JSON/CSV/ICS export buttons' },
    { input: 'scheduleShowImport',    type: 'boolean',                   default: 'true',  desc: 'Show file import button' },
    { input: 'scheduleShowSearch',    type: 'boolean',                   default: 'true',  desc: 'Show search input in header' },
    { input: 'scheduleShowFilter',    type: 'boolean',                   default: 'true',  desc: 'Show tag/category filter chips' },
    { input: 'scheduleShowConflicts', type: 'boolean',                   default: 'true',  desc: 'Show conflict detection banner' },
    { input: 'scheduleRowTemplate',   type: 'TemplateRef',               default: 'null',  desc: 'Replace the entire item row' },
    { input: 'scheduleBadgeTemplate', type: 'TemplateRef',               default: 'null',  desc: 'Replace only the date/duration badge' },
    { input: 'scheduleActionsTemplate','type': 'TemplateRef',            default: 'null',  desc: 'Replace the action button group' },
    { input: 'scheduleEmptyTemplate', type: 'TemplateRef',               default: 'null',  desc: 'Replace the empty-state placeholder' },
    { input: 'scheduleHeaderTemplate','type': 'TemplateRef',             default: 'null',  desc: 'Replace the entire panel header' },
    { input: 'scheduleFooterTemplate','type': 'TemplateRef',             default: 'null',  desc: 'Replace the panel footer' },
    { input: 'onBeforeAdd',           type: '(item) => boolean',         default: 'null',  desc: 'Return false to cancel add' },
    { input: 'onBeforeEdit',          type: '(item) => boolean',         default: 'null',  desc: 'Return false to cancel edit' },
    { input: 'onBeforeDelete',        type: '(item) => boolean',         default: 'null',  desc: 'Return false to cancel delete' },
    { input: 'onBeforeReorder',       type: '(from,to,items) => boolean',default: 'null',  desc: 'Return false to cancel drag-drop' },
    { input: 'validateScheduleItem',  type: '(item, all) => string|null',default: 'null',  desc: 'Custom per-item validation' },
    { input: 'formatItemDate',        type: '(item) => string',          default: 'null',  desc: 'Custom date label formatter' },
    { input: 'formatItemDuration',    type: '(item) => string',          default: 'null',  desc: 'Custom duration label formatter' },
    { input: 'scheduleChange',        type: 'EventEmitter<ScheduleChangeEvent>', default: '—', desc: 'Fires on every mutation' },
    { input: 'scheduleApply',         type: 'EventEmitter<ScheduleItem[]>',      default: '—', desc: 'Fires when Apply is clicked' },
    { input: 'scheduleCancel',        type: 'EventEmitter<void>',                default: '—', desc: 'Fires when Cancel is clicked' },
  ];
}
