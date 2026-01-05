const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, '../dist/demo-app/browser');
const repoUrl = 'git@github.com:NGXSMK/ngxsmk-datepicker.git';

console.log(`Deploying to ${repoUrl} from ${distFolder}...`);

try {
    if (!fs.existsSync(distFolder)) {
        throw new Error(`Distribution folder ${distFolder} does not exist. Run build first.`);
    }

    // Change to the build directory
    process.chdir(distFolder);

    // Initialize a new git repository
    console.log('Initializing git repository...');
    // Check if .git exists and remove it to start fresh
    if (fs.existsSync('.git')) {
        fs.rmSync('.git', { recursive: true, force: true });
    }
    execSync('git init');

    // Checkout a clean gh-pages branch (orphan)
    // Since it's a new repo, the default branch is usually master/main. We rename it to gh-pages.
    execSync('git checkout -b gh-pages');

    // Add all files
    console.log('Adding files...');
    execSync('git add .');

    // Commit
    console.log('Committing...');
    execSync('git commit -m "Deploy to GitHub Pages"');

    // Push
    console.log('Pushing to remote...');
    execSync(`git push --force "${repoUrl}" gh-pages`);

    console.log('Deployment successful!');
} catch (e) {
    console.error('Deployment failed:', e.message);
    if (e.stdout) console.error('Stdout:', e.stdout.toString());
    if (e.stderr) console.error('Stderr:', e.stderr.toString());
    process.exit(1);
}
