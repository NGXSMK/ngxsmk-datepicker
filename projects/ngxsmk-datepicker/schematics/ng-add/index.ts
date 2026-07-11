import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

interface NgAddOptions {
  skipInstall?: boolean;
}

const LUXON_VERSION = '^3.0.0';

/**
 * `ng add ngxsmk-datepicker` entry point.
 *
 * The component ships its styles bundled, so no angular.json changes are needed.
 * This schematic only ensures the `luxon` peer dependency is present and prints
 * getting-started guidance.
 */
export function ngAdd(options: NgAddOptions = {}): Rule {
  return (tree: Tree, context: SchematicContext) => {
    ensureLuxon(tree, context, options);

    context.logger.info('');
    context.logger.info('ngxsmk-datepicker is ready to use.');
    context.logger.info('');
    context.logger.info('Import the standalone component where you need it:');
    context.logger.info('');
    context.logger.info("  import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';");
    context.logger.info('');
    context.logger.info('  @Component({');
    context.logger.info('    imports: [NgxsmkDatepickerComponent],');
    context.logger.info('    template: `<ngxsmk-datepicker mode="single" (valueChange)="onDate($event)" />`,');
    context.logger.info('  })');
    context.logger.info('');
    context.logger.info('Docs: https://github.com/NGXSMK/ngxsmk-datepicker#readme');

    return tree;
  };
}

function ensureLuxon(tree: Tree, context: SchematicContext, options: NgAddOptions): void {
  const pkgPath = '/package.json';
  const buffer = tree.read(pkgPath);
  if (!buffer) {
    context.logger.warn('Could not read package.json; please install the "luxon" peer dependency manually.');
    return;
  }

  let pkg: Record<string, Record<string, string> | undefined>;
  try {
    pkg = JSON.parse(buffer.toString());
  } catch {
    context.logger.warn('Could not parse package.json; please install the "luxon" peer dependency manually.');
    return;
  }

  const hasLuxon = Boolean(pkg['dependencies']?.['luxon'] ?? pkg['devDependencies']?.['luxon']);
  if (hasLuxon) {
    return;
  }

  const dependencies = pkg['dependencies'] ?? {};
  dependencies['luxon'] = LUXON_VERSION;
  pkg['dependencies'] = sortKeys(dependencies);
  tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  context.logger.info(`Added missing peer dependency "luxon@${LUXON_VERSION}" to package.json.`);

  if (!options.skipInstall) {
    context.addTask(new NodePackageInstallTask());
  }
}

function sortKeys(record: Record<string, string>): Record<string, string> {
  return Object.keys(record)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = record[key];
      return acc;
    }, {});
}
