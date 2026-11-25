import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: __dirname,
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  timeout: 45_000,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npx ng serve demo-app --port=4200',
        url: 'http://localhost:4200',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
