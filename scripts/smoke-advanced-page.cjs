'use strict';

/**
 * One-off runtime smoke test: serves the built demo app and verifies the
 * Advanced page renders the new-feature demo sections.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const root = path.join(__dirname, '..', 'dist', 'demo-app', 'browser');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  // The demo builds with <base href="/ngxsmk-datepicker/"> for GitHub Pages
  const urlPath = req.url.split('?')[0].replace(/^\/ngxsmk-datepicker/, '');
  let file = path.join(root, urlPath === '/' || urlPath === '' ? 'index.html' : urlPath);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, 'index.html'); // SPA fallback
  }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

async function main() {
  await new Promise((r) => server.listen(4299, r));
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto('http://localhost:4299/ngxsmk-datepicker/advanced', { waitUntil: 'networkidle' });

  const checks = {
    'week-number column': await page.locator('.ngxsmk-week-number').count(),
    'secondary calendar labels': await page.locator('.ngxsmk-day-secondary').count(),
    'day metadata price labels': await page.locator('.ngxsmk-day-meta-label').count(),
    'custom footer slot': await page.locator('.ngxsmk-custom-footer-slot').count(),
    'custom header slot': await page.locator('.ngxsmk-custom-header-slot').count(),
  };

  // async filter: wait for the simulated API (600ms) then look for disabled 4th/12th/20th
  await page.waitForTimeout(1200);
  const disabledCells = await page.locator('.ngxsmk-day-cell.disabled').count();
  checks['disabled cells present (weekends + async)'] = disabledCells;

  let failed = false;
  for (const [name, count] of Object.entries(checks)) {
    const ok = count > 0;
    if (!ok) failed = true;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${count}`);
  }
  if (errors.length) {
    failed = true;
    console.log('PAGE ERRORS:', errors.slice(0, 5));
  }

  await browser.close();
  server.close();
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
