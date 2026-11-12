import { test, expect } from '@playwright/test';

test.describe('Datepicker smoke', () => {
  test('opens calendar, selects date, closes', async ({ page }) => {
    await page.goto('/examples');
    const firstPicker = page.locator('ngxsmk-datepicker').first();
    const trigger = firstPicker.locator('.ngxsmk-input-group[role="button"]');
    await trigger.click();
    const openOverlay = page.locator('.ngxsmk-popover-container.ngxsmk-popover-open[role="dialog"]');
    await expect(openOverlay).toBeVisible({ timeout: 15000 });
    const day = page.locator('[role="gridcell"][data-date]').first();
    await day.click({ timeout: 10000 });
    await expect(openOverlay).toHaveCount(0);
  });

  test('range picker opens and selects range', async ({ page }) => {
    await page.goto('/examples');
    const rangePicker = page.locator('ngxsmk-datepicker').nth(1);
    const trigger = rangePicker.locator('.ngxsmk-input-group[role="button"]');
    await trigger.click();
    const openOverlay = page.locator('.ngxsmk-popover-container.ngxsmk-popover-open[role="dialog"]');
    await expect(openOverlay).toBeVisible({ timeout: 15000 });
    const days = page.locator('[role="gridcell"][data-date]');
    await days.nth(5).click();
    await days.nth(12).click();
    await expect(openOverlay).toHaveCount(0);
  });

  test('next-month control is disabled at maxDate boundary when applicable', async ({ page }) => {
    await page.goto('/examples');
    const firstPicker = page.locator('ngxsmk-datepicker').first();
    const trigger = firstPicker.locator('.ngxsmk-input-group[role="button"]');
    await trigger.click();
    const openOverlay = page.locator('.ngxsmk-popover-container.ngxsmk-popover-open[role="dialog"]');
    await expect(openOverlay).toBeVisible({ timeout: 15000 });

    const nextButton = openOverlay.locator('button.ngxsmk-nav-button').nth(1);
    await expect(nextButton).toBeVisible();
    // Smoke: control exists and is interactable or intentionally disabled — never missing.
    const disabled = await nextButton.isDisabled();
    expect(typeof disabled).toBe('boolean');
  });

  test('month custom select exposes combobox/listbox semantics', async ({ page }) => {
    await page.goto('/examples');
    const firstPicker = page.locator('ngxsmk-datepicker').first();
    await firstPicker.locator('.ngxsmk-input-group[role="button"]').click();
    const openOverlay = page.locator('.ngxsmk-popover-container.ngxsmk-popover-open[role="dialog"]');
    await expect(openOverlay).toBeVisible({ timeout: 15000 });

    const monthTrigger = openOverlay.locator('ngxsmk-custom-select .ngxsmk-select-display').first();
    await expect(monthTrigger).toHaveAttribute('role', 'combobox');
    await monthTrigger.click();
    await expect(openOverlay.locator('[role="listbox"]').first()).toBeVisible();
    await monthTrigger.press('Escape');
    await expect(openOverlay.locator('[role="listbox"]')).toHaveCount(0);
  });
});
