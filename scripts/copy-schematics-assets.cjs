'use strict';

/**
 * Copies schematic JSON assets (collection.json, schema.json) into
 * dist/ngxsmk-datepicker/schematics next to the tsc-compiled factories.
 * Run after `tsc -p projects/ngxsmk-datepicker/schematics/tsconfig.json`.
 */
const fs = require('fs');
const path = require('path');

const srcRoot = path.join(__dirname, '..', 'projects', 'ngxsmk-datepicker', 'schematics');
const destRoot = path.join(__dirname, '..', 'dist', 'ngxsmk-datepicker', 'schematics');

const assets = ['collection.json', path.join('ng-add', 'schema.json')];

for (const rel of assets) {
  const src = path.join(srcRoot, rel);
  const dest = path.join(destRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

console.log('[copy-schematics-assets] Copied schematic assets to dist/ngxsmk-datepicker/schematics.');
