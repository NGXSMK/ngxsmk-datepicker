# Integration Guides

**Last updated:** February 20, 2026 · **Current stable:** v2.1.7

This document provides integration examples for using ngxsmk-datepicker with popular frameworks and libraries.

## Table of Contents

- [Angular Material](#angular-material)
- [Ionic](#ionic)
- [Tailwind CSS](#tailwind-css)

## Angular Material

### Installation

```bash
npm install @angular/material @angular/cdk ngxsmk-datepicker
```

### Basic Integration (Standalone Components)

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    NgxsmkDatepickerComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Select Date</mat-label>
      <ngxsmk-datepicker
        [value]="dateControl.value"
        (valueChange)="dateControl.setValue($event)"
        [theme]="materialTheme"
        placeholder="Choose a date">
      </ngxsmk-datepicker>
    </mat-form-field>
  `
})
export class DatepickerComponent {
  dateControl = new FormControl<Date | null>(null);
  
  materialTheme = {
    colors: {
      primary: '#3f51b5',
      background: '#ffffff',
      text: '#212121',
      border: '#e0e0e0',
      hover: '#f5f5f5'
    },
    borderRadius: {
      md: '4px'
    }
  };
}
```

### Integration with Non-Standalone Components (NgModules)

For non-standalone components, you need to provide the Material form field control token using the `provideMaterialFormFieldControl` helper:

```typescript
import { NgModule } from '@angular/core';
import { MAT_FORM_FIELD_CONTROL } from '@angular/material/form-field';
import { NgxsmkDatepickerComponent, provideMaterialFormFieldControl } from 'ngxsmk-datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NgxsmkDatepickerComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [provideMaterialFormFieldControl(MAT_FORM_FIELD_CONTROL)]
})
export class MyModule { }
```

Then use it in your component:

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-material-form',
  template: `
    <form [formGroup]="myForm">
      <mat-form-field appearance="outline">
        <mat-label>Select Date</mat-label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="date"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </mat-form-field>
    </form>
  `
})
export class MaterialFormComponent {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null)
  });
}
```

### Using with Reactive Forms

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxsmkDatepickerComponent
  ],
  template: `
    <form [formGroup]="myForm">
      <mat-form-field appearance="outline">
        <mat-label>Select Date</mat-label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="date"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </mat-form-field>
    </form>
  `
})
export class MaterialFormComponent {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null)
  });
}
```

### With Material Datepicker Styling

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, ThemeBuilderService } from 'ngxsmk-datepicker';
import { inject } from '@angular/core';

@Component({
  selector: 'app-material-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="material-datepicker-wrapper">
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        [theme]="materialTheme"
        [classes]="materialClasses">
      </ngxsmk-datepicker>
    </div>
  `,
  styles: [`
    .material-datepicker-wrapper {
      width: 100%;
    }
    
    :host ::ng-deep .ngxsmk-input-group {
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      padding: 8px 12px;
      transition: border-color 0.2s;
    }
    
    :host ::ng-deep .ngxsmk-input-group:hover {
      border-color: rgba(0, 0, 0, 0.24);
    }
    
    :host ::ng-deep .ngxsmk-input-group:focus-within {
      border-color: #3f51b5;
      border-width: 2px;
    }
  `]
})
export class MaterialDatepickerComponent {
  private themeBuilder = inject(ThemeBuilderService);
  selectedDate: Date | null = null;
  
  materialTheme = {
    colors: {
      primary: '#3f51b5',
      primaryContrast: '#ffffff',
      background: '#ffffff',
      text: '#212121',
      border: '#e0e0e0',
      hover: '#f5f5f5'
    },
    borderRadius: {
      md: '4px',
      lg: '8px'
    }
  };
  
  materialClasses = {
    wrapper: 'material-datepicker',
    inputGroup: 'material-input-group',
    popover: 'material-popover'
  };
}
```

## Ionic

### Installation

```bash
npm install @ionic/angular ngxsmk-datepicker
```

### Basic Integration

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, IonItem, IonLabel],
  template: `
    <ion-item>
      <ion-label position="stacked">Select Date</ion-label>
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        [theme]="ionicTheme"
        [classes]="ionicClasses">
      </ngxsmk-datepicker>
    </ion-item>
  `,
  styles: [`
    :host ::ng-deep .ngxsmk-input-group {
      border: 1px solid var(--ion-color-medium);
      border-radius: 8px;
      background: var(--ion-background-color);
    }
    
    :host ::ng-deep .ngxsmk-popover-container {
      --datepicker-primary-color: var(--ion-color-primary);
      --datepicker-background: var(--ion-background-color);
      --datepicker-text-color: var(--ion-text-color);
    }
  `]
})
export class IonicDatepickerComponent {
  selectedDate: Date | null = null;
  
  ionicTheme = {
    colors: {
      primary: 'var(--ion-color-primary)',
      background: 'var(--ion-background-color)',
      text: 'var(--ion-text-color)',
      border: 'var(--ion-color-medium)',
      hover: 'var(--ion-color-light)'
    },
    borderRadius: {
      md: '8px',
      lg: '12px'
    }
  };
  
  ionicClasses = {
    wrapper: 'ionic-datepicker',
    inputGroup: 'ionic-input-group'
  };
}
```

### With Ionic Popover

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-datepicker-popover',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ion-button (click)="openDatepicker()">
      Select Date
    </ion-button>
  `
})
export class DatepickerPopoverComponent {
  constructor(private popoverController: PopoverController) {}
  
  async openDatepicker() {
    const popover = await this.popoverController.create({
      component: NgxsmkDatepickerComponent,
      componentProps: {
        inline: true,
        value: new Date()
      },
      cssClass: 'datepicker-popover'
    });
    
    await popover.present();
  }
}
```

## Tailwind CSS

### Installation

```bash
npm install ngxsmk-datepicker tailwindcss
```

### Basic Integration

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-tailwind-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="w-full max-w-md">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Select Date
      </label>
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        [classes]="tailwindClasses">
      </ngxsmk-datepicker>
    </div>
  `,
  styles: [`
    :host ::ng-deep .ngxsmk-input-group {
      @apply border border-gray-300 rounded-lg px-4 py-2 
             focus-within:ring-2 focus-within:ring-blue-500 
             focus-within:border-blue-500 transition-all;
    }
    
    :host ::ng-deep .ngxsmk-display-input {
      @apply w-full outline-none text-gray-900;
    }
    
    :host ::ng-deep .ngxsmk-popover-container {
      @apply shadow-lg rounded-lg border border-gray-200;
    }
    
    :host ::ng-deep .ngxsmk-day-cell.selected {
      @apply bg-blue-500 text-white;
    }
    
    :host ::ng-deep .ngxsmk-day-cell:hover:not(.disabled) {
      @apply bg-blue-50;
    }
  `]
})
export class TailwindDatepickerComponent {
  selectedDate: Date | null = null;
  
  tailwindClasses = {
    wrapper: 'tailwind-datepicker',
    inputGroup: 'tailwind-input-group',
    popover: 'tailwind-popover'
  };
}
```

### With Tailwind Utility Classes

```typescript
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent, ThemeBuilderService } from 'ngxsmk-datepicker';
import { inject } from '@angular/core';

@Component({
  selector: 'app-tailwind-themed-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <div class="container mx-auto p-4">
      <ngxsmk-datepicker
        [value]="selectedDate"
        (valueChange)="selectedDate = $event"
        [theme]="tailwindTheme"
        class="w-full">
      </ngxsmk-datepicker>
    </div>
  `
})
export class TailwindThemedDatepickerComponent {
  private themeBuilder = inject(ThemeBuilderService);
  selectedDate: Date | null = null;
  
  tailwindTheme = {
    colors: {
      primary: '#3b82f6', // Tailwind blue-500
      background: '#ffffff',
      text: '#111827', // gray-900
      border: '#d1d5db', // gray-300
      hover: '#f3f4f6' // gray-100
    },
    spacing: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem'
    },
    borderRadius: {
      md: '0.5rem',
      lg: '0.75rem'
    }
  };
  
  constructor() {
    // Apply theme globally
    this.themeBuilder.applyTheme(this.tailwindTheme);
  }
}
```

## Custom Styling Tips

### Using CSS Variables

All datepicker styles can be customized using CSS variables:

```css
:root {
  --datepicker-primary-color: #3b82f6;
  --datepicker-background: #ffffff;
  --datepicker-text-color: #111827;
  --datepicker-border-color: #d1d5db;
  --datepicker-spacing-md: 1rem;
  --datepicker-radius-md: 0.5rem;
}
```

### Scoped Styling

For component-specific styling:

```typescript
@Component({
  styles: [`
    :host ::ng-deep .ngxsmk-datepicker-wrapper {
      /* Your custom styles */
    }
  `]
})
```

### Theme Builder Service

For dynamic theming:

```typescript
import { ThemeBuilderService } from 'ngxsmk-datepicker';

constructor(private themeBuilder: ThemeBuilderService) {
  const theme = {
    colors: {
      primary: '#your-color',
      // ... other colors
    }
  };
  
  // Apply globally
  this.themeBuilder.applyTheme(theme);
  
  // Or get CSS-in-JS style object
  const styles = this.themeBuilder.generateStyleObject(theme);
}
```

## Best Practices

1. **Consistent Theming**: Use your framework's design tokens (colors, spacing, etc.) when creating themes
2. **Accessibility**: Ensure your custom themes maintain sufficient color contrast
3. **Responsive Design**: Test datepicker on different screen sizes, especially when using multi-calendar mode
4. **Performance**: Use `OnPush` change detection strategy when possible
5. **Localization**: Set the `locale` input to match your application's locale

## Troubleshooting

### Styles Not Applying

- Ensure your styles are scoped correctly using `::ng-deep` or view encapsulation
- Check that CSS variables are defined in the correct scope
- Verify that the theme object structure matches the `DatepickerTheme` interface

### Integration Issues

- Make sure all required peer dependencies are installed
- Check that Angular version is compatible (Angular 17+)
- Verify that standalone components are properly imported

## Additional Resources

- [API Documentation](./API.md)
- [Theme Guide](./THEME-TOKENS.md)
- [Locale Guide](./LOCALE-GUIDE.md)

