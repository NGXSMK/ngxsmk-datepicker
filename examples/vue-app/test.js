import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        // Navigate to the Vue app
        await page.goto('http://localhost:5175', { waitUntil: 'networkidle0' });

        // Ensure the datepicker renders
        const datepicker = await page.waitForSelector('ngxsmk-datepicker:not(:empty)');

        // Check if inner shadow dom / components loaded
        const classExists = await page.evaluate(() => {
            const dp = document.querySelector('ngxsmk-datepicker');
            return !!dp;
        });

        if (classExists && datepicker) {
            console.log('✅ PASS: ngxsmk-datepicker custom element successfully rendered inside Vue App!');
        } else {
            throw new Error('Datepicker failed to render.');
        }

    } catch (error) {
        console.error('❌ FAIL:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
