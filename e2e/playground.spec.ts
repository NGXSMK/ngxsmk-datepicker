import { test, expect } from '@playwright/test';

test.describe('Playground', () => {
  test('loads interactive playground', async ({ page }) => {
    await page.goto('/playground');
    await expect(page.locator('.playground-hero h1').first()).toBeVisible();
  });

  test('RTL locale applies ngxsmk-rtl to host', async ({ page }) => {
    await page.goto('/playground');
    await page.locator('#activeLocale').selectOption('ar-SA');
    const picker = page.locator('ngxsmk-datepicker').first();
    await expect(picker).toHaveClass(/ngxsmk-rtl/);
  });

  test('multi-calendar shows two month panels when count is 2 (inline)', async ({ page }) => {
    await page.goto('/playground');
    await page.locator('#calendarCount').fill('2');
    await page.getByRole('checkbox', { name: /inline/i }).check();
    const months = page.locator('.ngxsmk-calendar-month-multi');
    await expect(months).toHaveCount(2, { timeout: 15_000 });
  });

  test('range mode can toggle range quick picks without error', async ({ page }) => {
    await page.goto('/playground');
    await page.locator('#pg-mode-select').selectOption('range');
    const presetsToggle = page.locator('#pg-range-presets');
    await presetsToggle.uncheck();
    await presetsToggle.check();
    await expect(page.locator('ngxsmk-datepicker')).toBeVisible();
  });
});
