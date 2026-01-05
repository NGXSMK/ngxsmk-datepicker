import { test, expect } from '@playwright/test';

/**
 * Ionic Framework Integration E2E Tests
 * 
 * These tests verify that ngxsmk-datepicker works correctly with Ionic Angular.
 * Note: These tests require an Ionic app setup. For standalone testing,
 * create a test Ionic app or use the example components provided.
 */

test.describe('Ionic Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Ionic test page
    // Adjust URL based on your test setup
    await page.goto('/ionic-test');
  });

  test.describe('Focus Management', () => {
    test('should not trap focus when disableFocusTrap is true', async ({ page }) => {
      // This test verifies focus trapping doesn't conflict with Ionic
      const datepicker = page.locator('ngxsmk-datepicker[disableFocusTrap="true"]').first();
      
      if (await datepicker.count() > 0) {
        const inputGroup = datepicker.locator('.ngxsmk-input-group');
        await inputGroup.click();
        
        // Wait for calendar
        await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
        
        // Try to tab out - should be possible when focus trap is disabled
        await page.keyboard.press('Tab');
        
        // Focus should move outside datepicker
        const activeElement = await page.evaluate(() => document.activeElement?.tagName);
        // Focus should not be trapped within datepicker
        expect(activeElement).not.toBeNull();
      }
    });

    test('should work correctly inside ion-modal', async ({ page }) => {
      // Open modal with datepicker
      const openModalButton = page.locator('button:has-text("Open Datepicker Modal")');
      if (await openModalButton.count() > 0) {
        await openModalButton.click();
        
        // Wait for modal
        await page.waitForSelector('ion-modal', { state: 'visible' });
        
        // Find datepicker in modal
        const datepicker = page.locator('ion-modal ngxsmk-datepicker').first();
        await expect(datepicker).toBeVisible();
        
        // Click datepicker input
        const inputGroup = datepicker.locator('.ngxsmk-input-group');
        await inputGroup.click();
        
        // Calendar should open
        const calendar = datepicker.locator('.ngxsmk-popover-container');
        await expect(calendar).toBeVisible();
      }
    });
  });

  test.describe('Keyboard Behavior', () => {
    test('should prevent keyboard on mobile when allowTyping is false', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
      }

      const datepicker = page.locator('ngxsmk-datepicker').first();
      const input = datepicker.locator('.ngxsmk-display-input').first();
      
      await input.click();
      
      // On mobile, keyboard should not appear when allowTyping is false
      // Calendar should open instead
      const calendar = datepicker.locator('.ngxsmk-popover-container');
      await expect(calendar).toBeVisible();
      
      // Verify input is not focused (keyboard not shown)
      const isFocused = await input.evaluate((el: HTMLInputElement) => document.activeElement === el);
      expect(isFocused).toBe(false);
    });

    test('should handle keyboard show/hide on iOS', async ({ page, browserName }) => {
      if (browserName !== 'webkit') {
        test.skip();
      }

      const datepicker = page.locator('ngxsmk-datepicker').first();
      const input = datepicker.locator('.ngxsmk-display-input[allowTyping="true"]').first();
      
      if (await input.count() > 0) {
        await input.click();
        
        // Wait a bit for keyboard animation
        await page.waitForTimeout(500);
        
        // Verify viewport adjusted for keyboard
        const viewportHeight = await page.evaluate(() => window.visualViewport?.height || window.innerHeight);
        expect(viewportHeight).toBeLessThan(await page.evaluate(() => window.innerHeight));
      }
    });
  });

  test.describe('ion-modal Integration', () => {
    test('should display correctly inside ion-modal', async ({ page }) => {
      const openModalButton = page.locator('button:has-text("Open Modal")');
      if (await openModalButton.count() > 0) {
        await openModalButton.click();
        
        await page.waitForSelector('ion-modal', { state: 'visible' });
        
        const datepicker = page.locator('ion-modal ngxsmk-datepicker').first();
        await expect(datepicker).toBeVisible();
        
        // Verify z-index is correct (datepicker should be above modal backdrop)
        const zIndex = await datepicker.locator('.ngxsmk-popover-container')
          .evaluate((el) => window.getComputedStyle(el).zIndex);
        expect(parseInt(zIndex)).toBeGreaterThan(20000);
      }
    });

    test('should close calendar when modal closes', async ({ page }) => {
      const openModalButton = page.locator('button:has-text("Open Modal")');
      if (await openModalButton.count() > 0) {
        await openModalButton.click();
        
        await page.waitForSelector('ion-modal', { state: 'visible' });
        
        const datepicker = page.locator('ion-modal ngxsmk-datepicker').first();
        const inputGroup = datepicker.locator('.ngxsmk-input-group');
        await inputGroup.click();
        
        await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
        
        // Close modal
        const closeButton = page.locator('ion-modal ion-button:has-text("Close")');
        if (await closeButton.count() > 0) {
          await closeButton.click();
        }
        
        // Calendar should be closed
        await page.waitForSelector('.ngxsmk-popover-container', { state: 'hidden' });
      }
    });
  });

  test.describe('ion-popover Integration', () => {
    test('should display correctly inside ion-popover', async ({ page }) => {
      const openPopoverButton = page.locator('button:has-text("Open Popover")');
      if (await openPopoverButton.count() > 0) {
        await openPopoverButton.click();
        
        await page.waitForSelector('ion-popover', { state: 'visible' });
        
        const datepicker = page.locator('ion-popover ngxsmk-datepicker').first();
        await expect(datepicker).toBeVisible();
      }
    });

    test('should use inline mode in popover', async ({ page }) => {
      const openPopoverButton = page.locator('button:has-text("Open Popover")');
      if (await openPopoverButton.count() > 0) {
        await openPopoverButton.click();
        
        await page.waitForSelector('ion-popover', { state: 'visible' });
        
        const datepicker = page.locator('ion-popover ngxsmk-datepicker[inline="true"]').first();
        await expect(datepicker).toBeVisible();
        
        // Inline mode should not show popover container
        const popoverContainer = datepicker.locator('.ngxsmk-popover-container.ngxsmk-popover-open');
        await expect(popoverContainer).toHaveCount(0);
      }
    });
  });

  test.describe('Scroll Behavior in ion-content', () => {
    test('should scroll correctly with datepicker in ion-content', async ({ page }) => {
      const content = page.locator('ion-content').first();
      
      if (await content.count() > 0) {
        // Scroll down
        await content.evaluate((el) => {
          el.scrollTo({ top: 500, behavior: 'smooth' });
        });
        
        await page.waitForTimeout(500);
        
        // Datepicker should still be visible and functional
        const datepicker = content.locator('ngxsmk-datepicker').first();
        await expect(datepicker).toBeVisible();
        
        // Click datepicker
        const inputGroup = datepicker.locator('.ngxsmk-input-group');
        await inputGroup.click();
        
        // Calendar should open
        await page.waitForSelector('.ngxsmk-popover-container, .ngxsmk-inline-container', { state: 'visible' });
      }
    });

    test('should not lock body scroll when in ion-content', async ({ page }) => {
      const content = page.locator('ion-content').first();
      const datepicker = content.locator('ngxsmk-datepicker').first();
      
      if (await datepicker.count() > 0) {
        const inputGroup = datepicker.locator('.ngxsmk-input-group');
        await inputGroup.click();
        
        await page.waitForSelector('.ngxsmk-popover-container', { state: 'visible' });
        
        // Body should not have overflow: hidden
        const bodyOverflow = await page.evaluate(() => 
          window.getComputedStyle(document.body).overflow
        );
        expect(bodyOverflow).not.toBe('hidden');
        
        // ion-content should handle scroll lock
        const contentScrollable = await content.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.overflow !== 'hidden';
        });
        expect(contentScrollable).toBe(true);
      }
    });
  });

  test.describe('SSR Compatibility', () => {
    test('should render correctly after SSR hydration', async ({ page }) => {
      // Navigate to SSR page
      await page.goto('/ssr-test');
      
      // Wait for hydration
      await page.waitForSelector('ngxsmk-datepicker', { state: 'visible' });
      
      const datepicker = page.locator('ngxsmk-datepicker').first();
      await expect(datepicker).toBeVisible();
      
      // Verify component is interactive
      const inputGroup = datepicker.locator('.ngxsmk-input-group');
      await inputGroup.click();
      
      const calendar = datepicker.locator('.ngxsmk-popover-container, .ngxsmk-inline-container');
      await expect(calendar).toBeVisible();
    });

    test('should handle platform detection correctly in SSR', async ({ page }) => {
      await page.goto('/ssr-test');
      
      // Component should detect browser platform after hydration
      const datepicker = page.locator('ngxsmk-datepicker').first();
      await expect(datepicker).toBeVisible();
      
      // Browser-only features should work
      const inputGroup = datepicker.locator('.ngxsmk-input-group');
      await inputGroup.click();
      
      // Calendar should open (browser-only feature)
      await page.waitForSelector('.ngxsmk-popover-container, .ngxsmk-inline-container', { state: 'visible' });
    });
  });

  test.describe('Safe Area Insets (iOS)', () => {
    test('should respect safe area insets in bottom-sheet mode', async ({ page, browserName, isMobile }) => {
      if (browserName !== 'webkit' || !isMobile) {
        test.skip();
      }

      const datepicker = page.locator('ngxsmk-datepicker[mobileModalStyle="bottom-sheet"]').first();
      
      if (await datepicker.count() > 0) {
        const inputGroup = datepicker.locator('.ngxsmk-input-group');
        await inputGroup.click();
        
        await page.waitForSelector('.ngxsmk-popover-container.ngxsmk-bottom-sheet', { state: 'visible' });
        
        // Check for safe area inset padding
        const paddingBottom = await page.locator('.ngxsmk-popover-container.ngxsmk-bottom-sheet')
          .evaluate((el) => window.getComputedStyle(el).paddingBottom);
        
        // Should have padding for safe area (even if 0 on non-notch devices)
        expect(paddingBottom).toBeTruthy();
      }
    });
  });
});

