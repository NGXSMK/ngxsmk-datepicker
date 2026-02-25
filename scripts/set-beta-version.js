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

const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '..', 'package.json');
const libPath = path.join(__dirname, '..', 'projects', 'ngxsmk-datepicker', 'package.json');

const root = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

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

root.version = newVersion;
lib.version = newVersion;
fs.writeFileSync(rootPath, JSON.stringify(root, null, 2) + '\n');
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2) + '\n');
console.log('Version set to', newVersion, 'in root and library package.json');
console.log('Run: npm run publish:beta');
