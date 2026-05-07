 'use strict';

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

 const repoRoot = path.join(__dirname, '..');
 const distRoot = path.join(repoRoot, 'dist', 'ngxsmk-datepicker');

 function run(command) {
   return execSync(command, { cwd: repoRoot, encoding: 'utf8' }).trim();
 }

function normalizeManifestPath(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }
  return value.replace(/^[./]+/, '');
}

function collectExportTargetPaths(exportsField, acc = new Set()) {
  if (typeof exportsField === 'string') {
    const normalized = normalizeManifestPath(exportsField);
    if (normalized && !normalized.includes('*')) {
      acc.add(normalized);
    }
    return acc;
  }

  if (!exportsField || typeof exportsField !== 'object') {
    return acc;
  }

  for (const value of Object.values(exportsField)) {
    collectExportTargetPaths(value, acc);
  }

  return acc;
}

 if (!fs.existsSync(distRoot)) {
   console.error('[verify-dist-tarball] Missing dist package folder:', distRoot);
   console.error('[verify-dist-tarball] Run: npm run build:optimized && npm run prepublish:copy-assets');
   process.exit(1);
 }

const manifestPath = path.join(distRoot, 'package.json');
if (!fs.existsSync(manifestPath)) {
  console.error('[verify-dist-tarball] Missing dist package manifest:', manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestTargets = new Set([
  normalizeManifestPath(manifest.main),
  normalizeManifestPath(manifest.module),
  normalizeManifestPath(manifest.es2022),
  normalizeManifestPath(manifest.esm2022),
  normalizeManifestPath(manifest.types),
  normalizeManifestPath(manifest.typings),
  ...collectExportTargetPaths(manifest.exports),
]);
manifestTargets.delete(null);

let ok = true;
for (const relPath of manifestTargets) {
  const absPath = path.join(distRoot, relPath);
  if (!fs.existsSync(absPath)) {
    console.error('[verify-dist-tarball] Manifest references missing file:', relPath);
    ok = false;
  }
}

 const tgzName = run('npm pack "./dist/ngxsmk-datepicker" --silent').split('\n').pop();
 const tgzPath = path.join(repoRoot, tgzName);

 if (!fs.existsSync(tgzPath)) {
   console.error('[verify-dist-tarball] npm pack did not produce expected tarball:', tgzPath);
   process.exit(1);
 }

const listing = run(`tar -tzf "${tgzPath}"`)
  .split('\n')
  .map((entry) => entry.trim())
  .filter(Boolean);
const tarEntries = new Set(listing);
for (const relPath of manifestTargets) {
  const tarPath = `package/${relPath}`;
  if (!tarEntries.has(tarPath)) {
    console.error('[verify-dist-tarball] Missing tarball entry referenced by manifest:', tarPath);
     ok = false;
   }
 }

 fs.unlinkSync(tgzPath);

 if (!ok) {
   console.error('[verify-dist-tarball] Tarball validation failed.');
   process.exit(1);
 }

console.log('[verify-dist-tarball] Tarball contains all files referenced by package manifest.');
