const fs = require('fs-extra');
const { execSync } = require('child_process');

(async function build() {
    console.log('Building Angular Elements...');
    execSync('npx ng build ngxsmk-datepicker-element --configuration production', { stdio: 'inherit' });

    // Wait, Angular outputs to dist/ngxsmk-datepicker-element/browser
    const sourcePath = 'dist/ngxsmk-datepicker-element/browser';
    const targetPath = 'dist/ngxsmk-datepicker-element';

    // Just rename browser folder or use the JS files generated
    console.log('Elements generated at:', sourcePath);
})();
