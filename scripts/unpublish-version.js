#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Published package is the library (ngxsmk-datepicker), not the workspace root
const libPackageJsonPath = path.join(__dirname, '..', 'projects', 'ngxsmk-datepicker', 'package.json');
const libPackageJson = JSON.parse(fs.readFileSync(libPackageJsonPath, 'utf8'));
const packageName = libPackageJson.name;

// Version: optional first arg (e.g. 2.1.5), else from library package.json
const versionArg = process.argv.find((a) => a.match(/^\d+\.\d+\.\d+$/));
const version = versionArg || libPackageJson.version;

// OTP: --otp=CODE or --otp CODE
const otpMatch = process.argv.find((a) => a.startsWith('--otp='));
const otp = otpMatch ? otpMatch.split('=')[1] : (process.argv[process.argv.indexOf('--otp') + 1] || null);

if (!otp) {
  console.error('Error: OTP code is required (from npm 2FA).');
  console.error('Usage: npm run unpublish:version -- 2.1.5 --otp=YOUR_OTP');
  console.error('   or: npm run unpublish:version -- --otp=YOUR_OTP   (unpublishes version from projects/ngxsmk-datepicker/package.json)');
  process.exit(1);
}

console.log(`Unpublishing ${packageName}@${version}...`);

try {
  const command = `npm unpublish ${packageName}@${version} --otp=${otp}`;
  execSync(command, { stdio: 'inherit' });
  console.log(`Successfully unpublished ${packageName}@${version}`);
} catch (error) {
  console.error(`Failed to unpublish ${packageName}@${version}`);
  process.exit(1);
}

