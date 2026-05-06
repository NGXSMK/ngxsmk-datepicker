 'use strict';

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

 const repoRoot = path.join(__dirname, '..');
 const distRoot = path.join(repoRoot, 'dist', 'ngxsmk-datepicker');

 function run(command) {
   return execSync(command, { cwd: repoRoot, encoding: 'utf8' }).trim();
 }

 if (!fs.existsSync(distRoot)) {
   console.error('[verify-dist-tarball] Missing dist package folder:', distRoot);
   console.error('[verify-dist-tarball] Run: npm run build:optimized && npm run prepublish:copy-assets');
   process.exit(1);
 }

 const tgzName = run('npm pack "./dist/ngxsmk-datepicker" --silent').split('\n').pop();
 const tgzPath = path.join(repoRoot, tgzName);

 if (!fs.existsSync(tgzPath)) {
   console.error('[verify-dist-tarball] npm pack did not produce expected tarball:', tgzPath);
   process.exit(1);
 }

 const listing = run(`tar -tzf "${tgzPath}"`);
 const requiredEntries = ['package/fesm2022/ngxsmk-datepicker.mjs', 'package/types/ngxsmk-datepicker.d.ts'];

 let ok = true;
 for (const required of requiredEntries) {
   if (!listing.includes(required)) {
     console.error('[verify-dist-tarball] Missing tarball entry:', required);
     ok = false;
   }
 }

 fs.unlinkSync(tgzPath);

 if (!ok) {
   console.error('[verify-dist-tarball] Tarball validation failed.');
   process.exit(1);
 }

 console.log('[verify-dist-tarball] Tarball contains required compiled outputs.');
