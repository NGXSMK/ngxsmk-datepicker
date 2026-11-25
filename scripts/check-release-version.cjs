const workspace = require('../package.json');
const library = require('../projects/ngxsmk-datepicker/package.json');
const lockfile = require('../package-lock.json');

const branch = process.argv[2] ?? process.env.RELEASE_BRANCH ?? '';
const versions = {
  'Library package.json': library.version,
  'Lockfile version': lockfile.version,
  'Lockfile root package version': lockfile.packages[''].version,
};

if (/^\d+\.\d+\.\d+(?:-beta\.\d+)?$/.test(branch)) {
  versions['Release branch'] = branch;
}

const mismatches = Object.entries(versions).filter(([, version]) => version !== workspace.version);
if (mismatches.length) {
  for (const [source, version] of mismatches) {
    console.error(`${source} is ${version}. Expected ${workspace.version} from the workspace package.json.`);
  }
  process.exitCode = 1;
} else {
  console.log(`Release versions agree at ${workspace.version}.`);
}
