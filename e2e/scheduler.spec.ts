import { test, expect } from '@playwright/test';

test.describe('Scheduler E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to demo app
    await page.goto('http://localhost:4200');
  });

  test('should display scheduler component', async ({ page }) => {
    await expect(page.locator('ngxsmk-scheduler')).toBeVisible();
  });

  test('should create a new event', async ({ page }) => {
    // Click create event button
    await page.click('button:has-text("Create Event")');
    
    // Fill in event form
    await page.fill('input[name="title"]', 'Test Event');
    await page.fill('input[name="startDate"]', '2024-01-15');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endDate"]', '2024-01-15');
    await page.fill('input[name="endTime"]', '11:00');
    
    // Submit form
    await page.click('button:has-text("Create")');
    
    // Verify event appears in scheduler
    await expect(page.locator('text=Test Event')).toBeVisible();
  });

  test('should switch between views', async ({ page }) => {
    // Click week view
    await page.click('button:has-text("Week")');
    await expect(page.locator('.week-view')).toBeVisible();
    
    // Click day view
    await page.click('button:has-text("Day")');
    await expect(page.locator('.day-view')).toBeVisible();
    
    // Click month view
    await page.click('button:has-text("Month")');
    await expect(page.locator('.month-view')).toBeVisible();
  });

  test('should navigate dates', async ({ page }) => {
    const initialDate = await page.locator('.current-date').textContent();
    
    // Click next button
    await page.click('button[aria-label="Next"]');
    
    const nextDate = await page.locator('.current-date').textContent();
    expect(nextDate).not.toBe(initialDate);
    
    // Click today button
    await page.click('button:has-text("Today")');
    
    const todayDate = await page.locator('.current-date').textContent();
    // Should be today's date (exact check depends on format)
    expect(todayDate).toBeTruthy();
  });

  test('should edit event on double click', async ({ page }) => {
    // Create an event first
    await page.click('button:has-text("Create Event")');
    await page.fill('input[name="title"]', 'Editable Event');
    await page.fill('input[name="startDate"]', '2024-01-15');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endDate"]', '2024-01-15');
    await page.fill('input[name="endTime"]', '11:00');
    await page.click('button:has-text("Create")');
    
    // Double click event
    await page.dblclick('text=Editable Event');
    
    // Verify editor opens
    await expect(page.locator('h3:has-text("Edit Event")')).toBeVisible();
  });

  test('should handle recurrence', async ({ page }) => {
    await page.click('button:has-text("Create Event")');
    await page.fill('input[name="title"]', 'Recurring Event');
    await page.fill('input[name="startDate"]', '2024-01-15');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endDate"]', '2024-01-15');
    await page.fill('input[name="endTime"]', '11:00');
    
    // Select daily recurrence
    await page.click('input[value="daily"]');
    
    // Verify preview appears
    await expect(page.locator('text=Preview')).toBeVisible();
    
    await page.click('button:has-text("Create")');
    
    // Verify recurring indicator
    await expect(page.locator('.event-recurring')).toBeVisible();
  });
});

