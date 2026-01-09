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

    // Create a temporary deploy directory with the correct structure
    const deployDir = path.join(__dirname, '../deploy');
    const ngxsmkDir = path.join(deployDir, 'ngxsmk-datepicker');
    
    // Clean and create deploy directories
    if (fs.existsSync(deployDir)) {
        fs.rmSync(deployDir, { recursive: true, force: true });
    }
    fs.mkdirSync(ngxsmkDir, { recursive: true });

    // Copy all files to the ngxsmk-datepicker subdirectory
    console.log('Copying files to deploy directory...');
    // Use fs.copyFileSync for cross-platform compatibility
    const files = fs.readdirSync(distFolder);
    files.forEach(file => {
        const srcPath = path.join(distFolder, file);
        const destPath = path.join(ngxsmkDir, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            // If it's a directory, copy recursively
            fs.mkdirSync(destPath, { recursive: true });
            const subFiles = fs.readdirSync(srcPath);
            subFiles.forEach(subFile => {
                const subSrcPath = path.join(srcPath, subFile);
                const subDestPath = path.join(destPath, subFile);
                fs.copyFileSync(subSrcPath, subDestPath);
            });
        } else {
            // If it's a file, copy directly
            fs.copyFileSync(srcPath, destPath);
        }
    });

    // Create 404.html and .nojekyll for GitHub Pages
    const indexHtml = path.join(ngxsmkDir, 'index.html');
    const fourOhFourHtml = path.join(ngxsmkDir, '404.html');
    const noJekyllFile = path.join(ngxsmkDir, '.nojekyll');

    if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, fourOhFourHtml);
        console.log('Created 404.html from index.html');
    }
    fs.writeFileSync(noJekyllFile, '');
    console.log('Created .nojekyll file');

    // Save current directory
    const originalCwd = process.cwd();

    // Change to the deploy directory
    process.chdir(deployDir);

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

    // Clean up deploy directory
    console.log('Cleaning up deploy directory...');
    fs.rmSync(deployDir, { recursive: true, force: true });

    console.log('Deployment successful!');
} catch (e) {
    console.error('Deployment failed:', e.message);
    if (e.stdout) console.error('Stdout:', e.stdout.toString());
    if (e.stderr) console.error('Stderr:', e.stderr.toString());
    process.exit(1);
}

