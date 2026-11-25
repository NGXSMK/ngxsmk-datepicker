#!/usr/bin/env node

/**
 * Sets a beta (prerelease) version in both root and library package.json.
 * Use before publishing a beta so production release can follow later.
 *
 * Usage:
 *   node scripts/set-beta-version.js 2.2.0-beta.0   # set exact version
 *   node scripts/set-beta-version.js next           # next beta (2.1.8 → 2.2.0-beta.0; 2.2.0-beta.0 → 2.2.0-beta.1)
 *   node scripts/set-beta-version.js stable 2.2.0   # specific stable (e.g. 2.2.0);
 */

const root = require('../package.json');
const writeReleaseVersion = require('./write-release-version.cjs');

const current = root.version;
const arg = process.argv[2];

function nextBetaVersion(ver) {
  const match = ver.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) return null;
  const [, major, minor, patch, prerelease] = match;
  if (prerelease && prerelease.startsWith('beta.')) {
    const n = parseInt(prerelease.slice(5), 10);
    return `${major}.${minor}.${patch}-beta.${n + 1}`;
  }
  return `${major}.${minor}.${parseInt(patch, 10) + 1}-beta.0`;
}

let newVersion;
if (arg && /^\d+\.\d+\.\d+-beta\.\d+$/.test(arg)) {
  newVersion = arg;
} else if (arg === 'next') {
  newVersion = nextBetaVersion(current);
  if (!newVersion) {
    console.error('Could not compute next beta from version:', current);
    process.exit(1);
  }
} else {
  console.error('Usage: node scripts/set-beta-version.js <version> | next');
  console.error('  e.g. node scripts/set-beta-version.js 2.1.7-beta.0');
  console.error('  e.g. node scripts/set-beta-version.js next');
  process.exit(1);
}

writeReleaseVersion(newVersion);
console.log('Version set to', newVersion, 'in both manifests and the lockfile');
console.log('Run: npm run publish:beta');
