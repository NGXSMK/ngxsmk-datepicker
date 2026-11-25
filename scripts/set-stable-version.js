#!/usr/bin/env node

/**
 * Sets a stable (production) version in the release manifests and lockfile.
 * Use after beta testing, before publishing the production release.
 *
 * Usage:
 *   node scripts/set-stable-version.js 2.1.7
 */

const writeReleaseVersion = require('./write-release-version.cjs');

const arg = process.argv[2];
if (!arg || !/^\d+\.\d+\.\d+$/.test(arg)) {
  console.error('Usage: node scripts/set-stable-version.js <version>');
  console.error('  e.g. node scripts/set-stable-version.js 2.1.7');
  process.exit(1);
}

const newVersion = arg;
writeReleaseVersion(newVersion);
console.log('Version set to', newVersion, 'in the release manifests and lockfile');
console.log('Run: npm run publish:patch');
