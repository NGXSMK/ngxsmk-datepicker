const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, '../dist/demo-app/browser');
let repoUrl = 'git@github.com:NGXSMK/ngxsmk-datepicker.git';

// Try to get the real repo URL from git remote
try {
    repoUrl = execSync('git remote get-url origin').toString().trim();
} catch (e) {
    console.log('Could not get remote origin URL, using default:', repoUrl);
}

console.log(`Deploying to ${repoUrl} from ${distFolder}...`);

try {
    if (!fs.existsSync(distFolder)) {
        throw new Error(`Distribution folder ${distFolder} does not exist. Run build first.`);
    }

    // Create 404.html and .nojekyll for GitHub Pages
    const indexHtml = path.join(distFolder, 'index.html');
    const fourOhFourHtml = path.join(distFolder, '404.html');
    const noJekyllFile = path.join(distFolder, '.nojekyll');

    if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, fourOhFourHtml);
        console.log('Created 404.html from index.html');
    }
    fs.writeFileSync(noJekyllFile, '');
    console.log('Created .nojekyll file');

    // Save current directory
    const originalCwd = process.cwd();

    // Change to the build directory
    process.chdir(distFolder);

    // Initialize a new git repository
    console.log('Initializing git repository...');
    if (fs.existsSync('.git')) {
        fs.rmSync('.git', { recursive: true, force: true });
    }
    execSync('git init --initial-branch=gh-pages');

    // Add all files
    console.log('Adding files...');
    execSync('git add .');

    // Commit
    console.log('Committing...');
    execSync('git commit -m "Deploy to GitHub Pages"');

    // Push
    console.log('Pushing to remote...');
    execSync(`git push --force "${repoUrl}" gh-pages`);

    // Go back to original directory
    process.chdir(originalCwd);

    console.log('Deployment successful!');
} catch (e) {
    console.error('Deployment failed:', e.message);
    if (e.stdout) console.error('Stdout:', e.stdout.toString());
    if (e.stderr) console.error('Stderr:', e.stderr.toString());
    process.exit(1);
}

