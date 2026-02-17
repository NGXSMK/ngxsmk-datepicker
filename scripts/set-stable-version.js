#!/usr/bin/env node

/**
 * Sets a stable (production) version in both root and library package.json.
 * Use after beta testing, before publishing the production release.
 *
 * Usage:
 *   node scripts/set-stable-version.js 2.1.7
 */

const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '..', 'package.json');
const libPath = path.join(__dirname, '..', 'projects', 'ngxsmk-datepicker', 'package.json');

const root = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const arg = process.argv[2];
if (!arg || !/^\d+\.\d+\.\d+$/.test(arg)) {
  console.error('Usage: node scripts/set-stable-version.js <version>');
  console.error('  e.g. node scripts/set-stable-version.js 2.1.7');
  process.exit(1);
}

const newVersion = arg;
root.version = newVersion;
lib.version = newVersion;
fs.writeFileSync(rootPath, JSON.stringify(root, null, 2) + '\n');
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2) + '\n');
console.log('Version set to', newVersion, 'in root and library package.json');
console.log('Run: npm run publish:patch');
