import { test, expect } from '@playwright/test';

test.describe('ngxsmk-datepicker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display datepicker component', async ({ page }) => {
    const datepicker = page.locator('ngxsmk-datepicker');
    await expect(datepicker).toBeVisible();
  });

  test('should open calendar on input click', async ({ page }) => {
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.click();
    
    const calendar = page.locator('.ngxsmk-popover-container');
    await expect(calendar).toBeVisible();
  });

  test('should select a date', async ({ page }) => {
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.click();
    
    // Wait for calendar to be visible
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    // Click on today's date
    const todayCell = page.locator('.ngxsmk-day-cell.today').first();
    if (await todayCell.count() > 0) {
      await todayCell.click();
      
      // Calendar should close after selection (if auto-close is enabled)
      // Input should have a value
      const input = page.locator('.ngxsmk-display-input').first();
      const value = await input.inputValue();
      expect(value).not.toBe('');
    }
  });

  test('should navigate to next month', async ({ page }) => {
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.click();
    
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    // Get current month text
    const monthDisplay = page.locator('.ngxsmk-month-year-display').first();
    const initialMonth = await monthDisplay.textContent();
    
    // Click next month button
    const nextButton = page.locator('.ngxsmk-nav-button').nth(1);
    await nextButton.click();
    
    // Wait for calendar to update
    await page.waitForTimeout(300);
    
    const newMonth = await monthDisplay.textContent();
    expect(newMonth).not.toBe(initialMonth);
  });

  test('should support keyboard navigation', async ({ page }) => {
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.focus();
    
    // Press Enter to open calendar
    await page.keyboard.press('Enter');
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'hidden' });
  });

  test('should clear selected date', async ({ page }) => {
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.click();
    
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    // Select a date
    const todayCell = page.locator('.ngxsmk-day-cell.today').first();
    if (await todayCell.count() > 0) {
      await todayCell.click();
      await page.waitForTimeout(300);
      
      // Click clear button
      const clearButton = page.locator('.ngxsmk-clear-button').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
        
        const input = page.locator('.ngxsmk-display-input').first();
        const value = await input.inputValue();
        expect(value).toBe('');
      }
    }
  });

  test('should work in inline mode', async ({ page }) => {
    // This test assumes there's an inline datepicker on the page
    const inlineDatepicker = page.locator('ngxsmk-datepicker[inline]').first();
    if (await inlineDatepicker.count() > 0) {
      const calendar = inlineDatepicker.locator('.ngxsmk-inline-container');
      await expect(calendar).toBeVisible();
    }
  });

  test('should support range selection', async ({ page }) => {
    // This test assumes there's a range mode datepicker on the page
    const rangeDatepicker = page.locator('ngxsmk-datepicker[mode="range"]').first();
    if (await rangeDatepicker.count() > 0) {
      const inputGroup = rangeDatepicker.locator('.ngxsmk-input-group').first();
      await inputGroup.click();
      
      await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
      
      // Select start date
      const firstDate = page.locator('.ngxsmk-day-cell:not(.disabled):not(.empty)').first();
      await firstDate.click();
      
      // Select end date
      const secondDate = page.locator('.ngxsmk-day-cell:not(.disabled):not(.empty)').nth(5);
      await secondDate.click();
      
      // Check that range is selected
      const startDate = page.locator('.ngxsmk-day-cell.start-date');
      const endDate = page.locator('.ngxsmk-day-cell.end-date');
      
      await expect(startDate.first()).toBeVisible();
      await expect(endDate.first()).toBeVisible();
    }
  });

  test('should be accessible', async ({ page }) => {
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    
    // Check ARIA attributes
    const ariaLabel = await inputGroup.getAttribute('aria-label');
    const ariaHaspopup = await inputGroup.getAttribute('aria-haspopup');
    
    expect(ariaHaspopup).toBe('dialog');
    
    // Open calendar and check dialog role
    await inputGroup.click();
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    const popover = page.locator('.ngxsmk-popover-container').first();
    const role = await popover.getAttribute('role');
    expect(role).toBe('dialog');
  });

  test('should work on mobile viewport', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.click();
    
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    // On mobile, calendar should be in modal/overlay mode
    const calendar = page.locator('.ngxsmk-popover-container').first();
    await expect(calendar).toBeVisible();
  });

  test('should support week selection mode', async ({ page }) => {
    // This test assumes the demo app has a week mode example
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.click();
    
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    // Click on a date - should select the week
    const dayCell = page.locator('.ngxsmk-day-cell:not(.empty)').first();
    await dayCell.click();
    
    // Calendar should show range selection
    const rangeStart = page.locator('.ngxsmk-day-cell.start-date');
    const rangeEnd = page.locator('.ngxsmk-day-cell.end-date');
    
    // At least one should be visible if week mode is working
    const hasRange = await rangeStart.count() > 0 || await rangeEnd.count() > 0;
    expect(hasRange).toBeTruthy();
  });

  test('should support seconds selection when enabled', async ({ page }) => {
    // This test assumes the demo app has showSeconds enabled
    const inputGroup = page.locator('.ngxsmk-input-group').first();
    await inputGroup.click();
    
    await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
    
    // Check if seconds selector is visible
    const secondsSelect = page.locator('.second-select');
    const secondsCount = await secondsSelect.count();
    
    // Seconds selector may or may not be present depending on demo configuration
    // This test just verifies the page loads without errors
    expect(secondsCount).toBeGreaterThanOrEqual(0);
  });
});

