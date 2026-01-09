const https = require('https');
const http = require('http');

const baseUrl = 'https://ngxsmk.github.io/ngxsmk-datepicker/';

console.log(`Verifying deployment at ${baseUrl}...`);

function checkUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, (response) => {
            if (response.statusCode === 200) {
                console.log(`✓ ${url} - Status: ${response.statusCode}`);
                resolve(true);
            } else {
                console.log(`✗ ${url} - Status: ${response.statusCode}`);
                resolve(false);
            }
        });

        request.on('error', (err) => {
            console.log(`✗ ${url} - Error: ${err.message}`);
            resolve(false);
        });

        request.setTimeout(5000, () => {
            request.destroy();
            console.log(`✗ ${url} - Timeout`);
            resolve(false);
        });
    });
}

async function verifyDeployment() {
    const urlsToCheck = [
        baseUrl,
        `${baseUrl}index.html`,
        `${baseUrl}main-V72PVOVS.js`,
        `${baseUrl}polyfills-5CFQRCPP.js`,
        `${baseUrl}styles-47VN4LSQ.css`,
        `${baseUrl}favicon.ico`
    ];

    let allPassed = true;
    for (const url of urlsToCheck) {
        const passed = await checkUrl(url);
        allPassed = allPassed && passed;
    }

    if (allPassed) {
        console.log('\n✅ All checks passed! Deployment is working correctly.');
    } else {
        console.log('\n❌ Some checks failed. Please review the deployment.');
    }
}

verifyDeployment();