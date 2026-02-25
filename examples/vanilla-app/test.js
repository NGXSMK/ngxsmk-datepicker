const puppeteer = require('puppeteer');
const StaticServer = require('static-server');
const assert = require('assert');

(async () => {
    // 1. Boot up simple http server on port 8080 to serve HTML
    const server = new StaticServer({
        rootPath: '.',
        port: 8080,
    });

    await new Promise((resolve) => server.start(resolve));
    console.log('Static server started at http://localhost:8080');

    // 2. Launch Puppeteer
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();

        // Navigate
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });

        // Ensure custom element mounts
        const datepicker = await page.waitForSelector('ngxsmk-datepicker:not(:empty)');

        const isLoaded = await page.evaluate(() => {
            return !!document.querySelector('ngxsmk-datepicker');
        });

        if (isLoaded && datepicker) {
            console.log('✅ PASS: Vanilla JS loaded the Angular Custom Web Component directly via `<script>` tag!');
        } else {
            throw new Error('Could not find ngxsmk-datepicker in Vanilla DOM.');
        }

    } catch (err) {
        console.error('❌ FAIL: ', err);
        process.exit(1);
    } finally {
        await browser.close();
        server.stop();
    }
})();
