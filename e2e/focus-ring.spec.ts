import { expect, test } from '@playwright/test';

test.use({ locale: 'en-US', timezoneId: 'UTC' });

for (const width of [1280, 390]) {
  test(`shows the full focus ring at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.setFixedTime(new Date('2026-11-25T12:00:00Z'));
    await page.goto('/');
    await page.getByRole('tab', { name: 'Single', exact: true }).click();

    const selectedDay = page.getByRole('gridcell', { name: 'Friday, November 20, 2026' });
    const nextDay = page.getByRole('gridcell', { name: 'Saturday, November 21, 2026' });

    await selectedDay.click();
    await expect(selectedDay).toHaveAttribute('aria-selected', 'true');
    await expect(selectedDay).toHaveCSS('overflow', 'visible');
    await expect(selectedDay.locator('.ngxsmk-day-number')).toHaveCSS('outline-width', '2px');

    await selectedDay.press('ArrowRight');
    await expect(nextDay).toBeFocused();
    await expect(nextDay).toHaveCSS('overflow', 'visible');
    await expect(nextDay.locator('.ngxsmk-day-number')).toHaveCSS('outline-width', '2px');
    await expect(selectedDay).toHaveAttribute('aria-selected', 'true');
    await expect(selectedDay).toHaveCSS('overflow', 'hidden');
  });
}
