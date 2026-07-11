'use strict';

/**
 * Smoke test for the compiled ng-add schematic in dist.
 * Runs the schematic against an in-memory host tree and asserts that a
 * missing `luxon` dependency is added to package.json.
 */
const path = require('path');
const { SchematicTestRunner } = require('@angular-devkit/schematics/testing');

async function main() {
  const collectionPath = path.join(__dirname, '..', 'dist', 'ngxsmk-datepicker', 'schematics', 'collection.json');
  const runner = new SchematicTestRunner('ngxsmk-datepicker', collectionPath);

  const { HostTree } = require('@angular-devkit/schematics');
  const tree = new HostTree();
  tree.create('/package.json', JSON.stringify({ name: 'app', dependencies: { '@angular/core': '^21.0.0' } }, null, 2));

  const result = await runner.runSchematic('ng-add', { skipInstall: true }, tree);
  const pkg = JSON.parse(result.readContent('/package.json'));

  if (!pkg.dependencies || pkg.dependencies['luxon'] !== '^3.0.0') {
    console.error('[smoke-test-ng-add] FAILED: luxon was not added:', pkg.dependencies);
    process.exit(1);
  }

  // Second run with luxon present must be a no-op
  const result2 = await runner.runSchematic('ng-add', { skipInstall: true }, result);
  const pkg2 = JSON.parse(result2.readContent('/package.json'));
  if (pkg2.dependencies['luxon'] !== '^3.0.0') {
    console.error('[smoke-test-ng-add] FAILED: second run modified luxon version');
    process.exit(1);
  }

  console.log('[smoke-test-ng-add] PASSED: ng-add adds luxon and is idempotent.');
}

main().catch((err) => {
  console.error('[smoke-test-ng-add] FAILED:', err);
  process.exit(1);
});
