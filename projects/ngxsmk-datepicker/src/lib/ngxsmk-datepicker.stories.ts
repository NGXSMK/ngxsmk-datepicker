import type { Meta, StoryObj } from '@storybook/angular';
import { NgxsmkDatepickerComponent } from './ngxsmk-datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

const meta: Meta<NgxsmkDatepickerComponent> = {
  title: 'Components/Datepicker',
  component: NgxsmkDatepickerComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(CommonModule, ReactiveFormsModule)],
    }),
    moduleMetadata({
      imports: [NgxsmkDatepickerComponent],
    }),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modern, powerful, and fully customizable date and date-range picker component for Angular 17+ applications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range', 'multiple'],
      description: 'Selection mode: single date, date range, or multiple dates',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme variant',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the datepicker',
    },
    showTime: {
      control: 'boolean',
      description: 'Show time selection',
    },
    timeOnly: {
      control: 'boolean',
      description: 'Display time picker only (no calendar)',
    },
    timezone: {
      control: 'text',
      description: 'IANA timezone name (e.g., "America/New_York", "UTC")',
    },
    rtl: {
      control: 'boolean',
      description: 'Right-to-left layout support',
    },
    inline: {
      control: 'select',
      options: [false, true, 'always', 'auto'],
      description: 'Inline calendar display',
    },
    minuteInterval: {
      control: { type: 'number', min: 1, max: 60, step: 1 },
      description: 'Minute interval for time selection',
    },
    weekStart: {
      control: { type: 'number', min: 0, max: 6, step: 1 },
      description: 'First day of week (0=Sunday, 1=Monday, etc.)',
    },
    yearRange: {
      control: { type: 'number', min: 1, max: 100, step: 1 },
      description: 'Year range for year selection dropdown',
    },
    locale: {
      control: 'text',
      description: 'Locale for date formatting',
    },
    clearLabel: {
      control: 'text',
      description: 'Clear button label',
    },
    closeLabel: {
      control: 'text',
      description: 'Close button label',
    },
    autoApplyClose: {
      control: 'boolean',
      description: 'Automatically close calendar after selection',
    },
    enableKeyboardShortcuts: {
      control: 'boolean',
      description: 'Enable keyboard navigation shortcuts',
    },
  },
};

export default meta;
type Story = StoryObj<NgxsmkDatepickerComponent>;

export const Default: Story = {
  args: {
    mode: 'single',
    placeholder: 'Select a date',
    theme: 'light',
    disabled: false,
    showTime: false,
    timeOnly: false,
    inline: false,
  },
};

export const WithFormControl: Story = {
  args: {
    mode: 'single',
    placeholder: 'Select a date',
    theme: 'light',
  },
  render: (args) => {
    const form = new FormGroup({
      date: new FormControl(null),
    });

    return {
      props: {
        ...args,
        form,
      },
      template: `
        <div style="width: 300px;">
          <form [formGroup]="form">
            <ngxsmk-datepicker
              [mode]="mode"
              [placeholder]="placeholder"
              [theme]="theme"
              [showTime]="showTime"
              formControlName="date">
            </ngxsmk-datepicker>
          </form>
          <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px; font-size: 14px;">
            <strong>Form Value:</strong> {{ form.value.date | json }}
          </div>
        </div>
      `,
    };
  },
};

export const DateRange: Story = {
  args: {
    mode: 'range',
    placeholder: 'Select date range',
    showTime: true,
    minuteInterval: 15,
    theme: 'light',
  },
};

export const TimeOnly: Story = {
  args: {
    mode: 'single',
    timeOnly: true,
    minuteInterval: 15,
    placeholder: 'Select time',
    theme: 'light',
  },
};

export const MultipleDates: Story = {
  args: {
    mode: 'multiple',
    placeholder: 'Select multiple dates',
    theme: 'light',
  },
};

export const Inline: Story = {
  args: {
    mode: 'range',
    inline: true,
    theme: 'light',
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 600px; max-width: 100%;">
        <ngxsmk-datepicker
          [mode]="mode"
          [inline]="inline"
          [theme]="theme"
          (valueChange)="onValueChange($event)">
        </ngxsmk-datepicker>
      </div>
    `,
    methods: {
      onValueChange: (_value: unknown) => {
        // Value changed
      },
    },
  }),
};

export const WithTimezone: Story = {
  args: {
    mode: 'single',
    showTime: true,
    timezone: 'America/New_York',
    placeholder: 'New York Time',
    theme: 'light',
  },
};

export const RTL: Story = {
  args: {
    mode: 'single',
    rtl: true,
    locale: 'ar-SA',
    placeholder: 'اختر تاريخ',
    theme: 'light',
  },
};

export const DarkTheme: Story = {
  args: {
    mode: 'single',
    theme: 'dark',
    placeholder: 'Select a date',
    showTime: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 300px; padding: 2rem; background: #1f2937; border-radius: 8px;">
        <ngxsmk-datepicker
          [mode]="mode"
          [theme]="theme"
          [placeholder]="placeholder"
          [showTime]="showTime"
          (valueChange)="onValueChange($event)">
        </ngxsmk-datepicker>
      </div>
    `,
    methods: {
      onValueChange: (_value: unknown) => {
        // Value changed
      },
    },
  }),
};

export const WithMinMax: Story = {
  args: {
    mode: 'single',
    placeholder: 'Select a date',
    theme: 'light',
  },
  render: (args) => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    return {
      props: {
        ...args,
        minDate,
        maxDate,
      },
      template: `
        <div style="width: 300px;">
          <p style="margin-bottom: 1rem; color: #6b7280; font-size: 14px;">
            <strong>Min:</strong> {{ minDate | date:'short' }}<br>
            <strong>Max:</strong> {{ maxDate | date:'short' }}
          </p>
          <ngxsmk-datepicker
            [mode]="mode"
            [placeholder]="placeholder"
            [theme]="theme"
            [minDate]="minDate"
            [maxDate]="maxDate"
            (valueChange)="onValueChange($event)">
          </ngxsmk-datepicker>
        </div>
      `,
      methods: {
        onValueChange: (value: unknown) => {
          // Value change handler for story
        },
      },
    };
  },
};

export const CustomLabels: Story = {
  args: {
    mode: 'single',
    placeholder: 'Select a date',
    clearLabel: 'Clear',
    closeLabel: 'Close',
    prevMonthAriaLabel: 'Previous month',
    nextMonthAriaLabel: 'Next month',
    theme: 'light',
  },
};
