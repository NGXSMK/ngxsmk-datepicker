#!/usr/bin/env node

/**
 * Script to set up GitHub issue labels for the repository
 * 
 * Usage:
 *   node scripts/setup-github-labels.js
 * 
 * Requires GITHUB_TOKEN environment variable
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const labelsFile = path.join(__dirname, '..', '.github', 'labels.json');
const labels = JSON.parse(fs.readFileSync(labelsFile, 'utf8'));

const repo = process.env.GITHUB_REPOSITORY || 'NGXSMK/ngxsmk-datepicker';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  console.error('Get a token from: https://github.com/settings/tokens');
  process.exit(1);
}

const [owner, repoName] = repo.split('/');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repoName}${path}`,
      method: method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'ngxsmk-datepicker-label-setup',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function setupLabels() {
  console.log(`Setting up labels for ${repo}...\n`);

  for (const label of labels) {
    try {
      // Try to create the label
      await makeRequest('POST', '/labels', JSON.stringify(label));
      console.log(`✅ Created label: ${label.name}`);
    } catch (error) {
      if (error.message.includes('422') || error.message.includes('already exists')) {
        // Label exists, try to update it
        try {
          await makeRequest('PATCH', `/labels/${encodeURIComponent(label.name)}`, JSON.stringify({
            color: label.color,
            description: label.description
          }));
          console.log(`🔄 Updated label: ${label.name}`);
        } catch (updateError) {
          console.error(`❌ Failed to update label ${label.name}:`, updateError.message);
        }
      } else {
        console.error(`❌ Failed to create label ${label.name}:`, error.message);
      }
    }
  }

  console.log('\n✅ Label setup complete!');
}

setupLabels().catch(console.error);

