# Ionic Integration Manual Testing Guide

This guide provides step-by-step instructions for manually testing ngxsmk-datepicker with Ionic Framework.

## Prerequisites

1. **Ionic App Setup**: Create a test Ionic Angular app or use the provided test component
2. **Import Integration Styles**: Add to `global.scss`:
   ```scss
   @import 'ngxsmk-datepicker/styles/ionic-integration.css';
   ```
3. **Add Test Component**: Use `ionic-test.component.ts` from the demo app

## Test Scenarios

### 1. Focus Management Test

**Objective**: Verify focus trapping doesn't conflict with Ionic

**Steps**:
1. Open the Ionic test page
2. Find the "Disable Focus Trap" datepicker
3. Click the input to open calendar
4. Press `Tab` key multiple times
5. Verify focus can move outside datepicker when `disableFocusTrap="true"`
6. Test inside `ion-modal` - verify Ionic's focus management works

**Expected Results**:
- ✅ Focus can move outside datepicker when trap is disabled
- ✅ No focus conflicts when inside `ion-modal`
- ✅ Focus returns to trigger element when modal closes

**Platforms**: iOS Safari, Android Chrome, Ionic Web

---

### 2. Keyboard Behavior Test

**Objective**: Verify keyboard show/hide behavior on mobile

**Steps**:
1. Open test page on mobile device (or mobile viewport)
2. Find datepicker with `allowTyping="false"`
3. Tap the input field
4. Verify keyboard does NOT appear
5. Verify calendar opens instead
6. Test with `allowTyping="true"` - verify keyboard appears
7. Test keyboard dismissal when calendar closes

**Expected Results**:
- ✅ Keyboard doesn't appear when `allowTyping="false"`
- ✅ Calendar opens on tap instead
- ✅ Keyboard appears when `allowTyping="true"`
- ✅ Keyboard dismisses when calendar closes (iOS)
- ✅ No layout shifts when keyboard appears (Android)

**Platforms**: iOS Safari, Android Chrome

---

### 3. ion-modal Integration Test

**Objective**: Verify datepicker works correctly inside Ionic modals

**Steps**:
1. Click "Open Modal" button
2. Verify modal opens with datepicker inside
3. Click datepicker input
4. Verify calendar opens (should be above modal backdrop)
5. Select a date
6. Verify calendar closes
7. Close modal
8. Verify datepicker state is preserved

**Expected Results**:
- ✅ Datepicker is visible inside modal
- ✅ Calendar appears above modal backdrop (z-index correct)
- ✅ Calendar opens and closes correctly
- ✅ Date selection works
- ✅ Modal can be closed normally

**Platforms**: iOS Safari, Android Chrome, Ionic Web

---

### 4. ion-popover Integration Test

**Objective**: Verify datepicker works correctly inside Ionic popovers

**Steps**:
1. Click "Open Popover" button
2. Verify popover opens with datepicker inside
3. Verify datepicker uses inline mode
4. Click datepicker input
5. Verify calendar is visible (inline, no popover container)
6. Select a date
7. Verify selection works
8. Close popover

**Expected Results**:
- ✅ Datepicker is visible inside popover
- ✅ Uses inline mode (no nested popover)
- ✅ Date selection works
- ✅ Popover can be closed normally

**Platforms**: iOS Safari, Android Chrome, Ionic Web

---

### 5. Scroll Behavior Test

**Objective**: Verify scrolling works correctly with datepicker in ion-content

**Steps**:
1. Navigate to "Scroll Test" section
2. Scroll down the page
3. Verify datepicker at top remains functional
4. Scroll to bottom datepicker
5. Click bottom datepicker input
6. Verify calendar opens correctly
7. Verify calendar position is correct (not offset by scroll)
8. Verify body scroll is NOT locked
9. Verify ion-content scroll still works

**Expected Results**:
- ✅ Datepicker remains functional after scrolling
- ✅ Calendar opens in correct position
- ✅ Body scroll is NOT locked (Ionic handles it)
- ✅ ion-content scroll works normally
- ✅ No double scroll behavior

**Platforms**: iOS Safari, Android Chrome

---

### 6. SSR Compatibility Test

**Objective**: Verify server-side rendering works with Ionic

**Steps**:
1. Build app with SSR enabled
2. Navigate to page with datepicker
3. Verify datepicker renders on server
4. Wait for client hydration
5. Click datepicker input
6. Verify calendar opens (browser-only feature)
7. Select a date
8. Verify selection works

**Expected Results**:
- ✅ Datepicker renders on server (no errors)
- ✅ Hydration completes successfully
- ✅ Browser-only features work after hydration
- ✅ No console errors
- ✅ Date selection works correctly

**Platforms**: Ionic Web (SSR)

---

## Test Checklist

### iOS Safari
- [ ] Focus management works correctly
- [ ] Keyboard doesn't appear when it shouldn't
- [ ] Keyboard dismisses correctly
- [ ] Safe area insets are respected (notch, home indicator)
- [ ] Swipe-to-go-back works
- [ ] Pull-to-refresh works
- [ ] No layout shifts when keyboard opens
- [ ] Datepicker works in modal
- [ ] Datepicker works in popover
- [ ] Scroll behavior is correct

### Android Chrome
- [ ] Focus management works correctly
- [ ] Keyboard behavior is correct
- [ ] No layout shifts
- [ ] Swipe gestures work
- [ ] Datepicker works in modal
- [ ] Datepicker works in popover
- [ ] Scroll behavior is correct

### Ionic Web
- [ ] Z-index conflicts resolved
- [ ] Positioning is correct
- [ ] SSR works correctly
- [ ] All features work in browser

---

## Troubleshooting

### Issue: Focus is trapped incorrectly
**Solution**: Set `[disableFocusTrap]="true"` or use inline mode

### Issue: Keyboard appears when it shouldn't
**Solution**: Ensure `allowTyping="false"` and component handles it correctly

### Issue: Datepicker appears behind modal backdrop
**Solution**: Import `ionic-integration.css` for z-index fixes

### Issue: Body scroll is locked
**Solution**: Import `ionic-integration.css` to disable body scroll lock

### Issue: Calendar position is wrong after scroll
**Solution**: Use `[inline]="true"` mode in ion-content

---

## Reporting Issues

When reporting issues, include:
1. Platform (iOS/Android/Web)
2. Ionic version
3. Datepicker version
4. Test scenario that failed
5. Steps to reproduce
6. Expected vs actual behavior
7. Screenshots/videos if possible

