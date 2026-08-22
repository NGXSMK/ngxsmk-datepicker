# Ionic Framework Integration Guide

**Last updated:** August 22, 2026 - **Current stable:** v3.0.5

This guide provides step-by-step instructions for integrating `ngxsmk-datepicker` with modern **Ionic 7, 8, & 9+** and **Angular 17–21+** applications.

## Quick Start

### 1. Install Dependencies

```bash
npm install ngxsmk-datepicker @ionic/angular
```

### 2. Import Ionic Integration Styles

Add to your `global.scss` or main stylesheet:

```scss
@import 'ngxsmk-datepicker/styles/ionic-integration.css';
```

Or import directly in your component:

```typescript
import 'ngxsmk-datepicker/styles/ionic-integration.css';
```

### 3. Use with Modern Standalone Ionic + Angular Signals

```typescript
import { Component, signal } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';
import { IonContent, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [NgxsmkDatepickerComponent, IonContent, IonItem, IonLabel, IonList],
  template: `
    <ion-content [fullscreen]="true">
      <ion-list [inset]="true">
        <ion-item>
          <ion-label position="stacked">Booking Date</ion-label>
          <ngxsmk-datepicker
            [(ngModel)]="selectedDate"
            [inline]="true"
            mode="single"
            [locale]="'en-US'"
            [enableAi]="true"
            [showAiSuggestions]="true"
          >
          </ngxsmk-datepicker>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class DatepickerPage {
  selectedDate = signal<Date | null>(new Date());
}
```

## Configuration & Mobile Best Practices

### Disable Focus Trap (for Ionic Modals)

When using datepicker inside `ion-modal`, disable focus trapping to prevent focus loops:

```html
<ngxsmk-datepicker
  [inline]="true"
  [disableFocusTrap]="true"
  mode="single"
></ngxsmk-datepicker>
```

### Ionic 8 Dark Mode (`.ion-palette-dark`)

The integration stylesheet automatically detects Ionic 8's `.ion-palette-dark` and legacy `.ion-theme-dark`:

- `--ion-color-primary` → `--datepicker-primary-color`
- `--ion-background-color` → `--datepicker-background`
- `--ion-text-color` → `--datepicker-text-color`
- `--ion-border-color` → `--datepicker-border-color`
- `--ion-font-family` → `--datepicker-font-family`

## Usage Patterns

### Pattern 1: Inline in ion-content (Recommended)

```typescript
<ion-content>
  <ion-item>
    <ion-label>Date</ion-label>
    <ngxsmk-datepicker [inline]="true" mode="single"></ngxsmk-datepicker>
  </ion-item>
</ion-content>
```

**Pros**: No z-index conflicts, no scroll locking issues, works perfectly with Ionic gestures

### Pattern 2: Inside ion-modal

```typescript
async openDatepickerModal() {
  const modal = await this.modalController.create({
    component: DatepickerModalPage,
    cssClass: 'datepicker-modal'
  });
  return await modal.present();
}
```

```typescript
// DatepickerModalPage
<ion-header>
  <ion-toolbar>
    <ion-title>Select Date</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ngxsmk-datepicker
    [inline]="true"
    [disableFocusTrap]="true"
    mode="single">
  </ngxsmk-datepicker>
</ion-content>
```

**Pros**: Native Ionic modal behavior, handles safe areas automatically

### Pattern 3: Inside ion-popover

```typescript
async openDatepickerPopover(event: Event) {
  const popover = await this.popoverController.create({
    component: DatepickerPopoverPage,
    event: event,
    cssClass: 'datepicker-popover'
  });
  return await popover.present();
}
```

**Note**: Use `[inline]="true"` and `[disableFocusTrap]="true"` inside popovers.

## Testing Checklist

### iOS Safari
- [ ] Datepicker opens correctly in `ion-content`
- [ ] Datepicker opens correctly in `ion-modal`
- [ ] Safe area insets are respected (notch, home indicator)
- [ ] Keyboard doesn't cover datepicker
- [ ] Swipe gestures work (swipe-to-go-back)
- [ ] Pull-to-refresh works
- [ ] Focus management works correctly
- [ ] No layout shifts when keyboard opens/closes

### Android Chrome
- [ ] Datepicker opens correctly in `ion-content`
- [ ] Datepicker opens correctly in `ion-modal`
- [ ] Keyboard doesn't cause layout issues
- [ ] Swipe gestures work
- [ ] Focus management works correctly
- [ ] No double scroll behavior

### Ionic Web
- [ ] Datepicker works in browser
- [ ] Z-index conflicts resolved
- [ ] Positioning correct in all scenarios
- [ ] SSR works correctly

## Troubleshooting

### Issue: Datepicker appears behind ion-modal backdrop

**Solution**: Use `[inline]="true"` or import `ionic-integration.css`

### Issue: Body scroll is locked when datepicker opens

**Solution**: Import `ionic-integration.css` which disables body scroll lock in Ionic apps

### Issue: Touch gestures don't work (swipe-to-go-back)

**Solution**: Use `[inline]="true"` mode to avoid touch event conflicts

### Issue: Datepicker doesn't respect safe areas on iOS

**Solution**: Safe area insets are automatically added in `ionic-integration.css`

### Issue: Focus jumps unexpectedly

**Solution**: Set `[disableFocusTrap]="true"` when inside Ionic overlays

## Capacitor Integration

For Capacitor apps, handle keyboard events:

```typescript
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  // ...
})
export class DatepickerPage {
  ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      Keyboard.addListener('keyboardWillShow', () => {
        // Adjust datepicker position if needed
      });
      
      Keyboard.addListener('keyboardWillHide', () => {
        // Restore datepicker position
      });
    }
  }
}
```

## Best Practices

1. **Always use `[inline]="true"`** in Ionic apps to avoid most compatibility issues
2. **Import `ionic-integration.css`** for automatic fixes
3. **Use `[disableFocusTrap]="true"`** inside `ion-modal` and `ion-popover`
4. **Test on real devices** - iOS and Android behavior differs from browsers
5. **Use `ion-modal`** for popover-style datepickers instead of native popover mode

## Additional Resources

- [Ionic Overlay System](https://ionicframework.com/docs/utilities/overlays)
- [Ionic Theming](https://ionicframework.com/docs/theming/basics)
- [Capacitor Keyboard Plugin](https://capacitorjs.com/docs/apis/keyboard)



