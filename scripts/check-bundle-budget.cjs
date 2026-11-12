#!/usr/bin/env node
/**
 * Fails CI when the main library FESM exceeds the configured budget.
 * Run after `npm run build:optimized` (or any production lib build).
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '../dist/ngxsmk-datepicker');
const BUDGET_KB = Number(process.env.NGXSMK_BUNDLE_BUDGET_KB || 1100);
const FESM_DIR = path.join(DIST, 'fesm2022');

function findMainFesm() {
  if (!fs.existsSync(FESM_DIR)) return null;
  const files = fs.readdirSync(FESM_DIR).filter((name) => name.endsWith('.mjs'));
  // Prefer the primary package bundle (not adapters/material secondary entries).
  const primary =
    files.find((name) => name === 'ngxsmk-datepicker.mjs') ||
    files.find((name) => !name.includes('adapters') && !name.includes('material'));
  return primary ? path.join(FESM_DIR, primary) : null;
}

const fesm = findMainFesm();
if (!fesm) {
  console.error('❌ Bundle budget check failed: no main FESM .mjs found under dist/ngxsmk-datepicker/fesm2022');
  process.exit(1);
}

const sizeKb = fs.statSync(fesm).size / 1024;
const rel = path.relative(path.join(__dirname, '..'), fesm);
console.log(`📦 ${rel}: ${sizeKb.toFixed(2)} KB (budget ${BUDGET_KB} KB)`);

if (sizeKb > BUDGET_KB) {
  console.error(`❌ Bundle exceeds budget by ${(sizeKb - BUDGET_KB).toFixed(2)} KB`);
  process.exit(1);
}

console.log('✅ Bundle within budget');
