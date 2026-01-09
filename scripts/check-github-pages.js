const { execSync } = require('child_process');

console.log('Checking GitHub Pages deployment status...\n');

try {
    // Get the latest commit on gh-pages branch
    const commitHash = execSync('git ls-remote origin gh-pages', { encoding: 'utf8' }).trim().split('\t')[0];
    console.log(`Latest commit on gh-pages branch: ${commitHash}`);
    
    // Check if the repository has GitHub Pages enabled
    const repoInfo = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    console.log(`Repository URL: ${repoInfo}`);
    
    console.log('\nTo verify GitHub Pages is working:');
    console.log('1. Go to your repository on GitHub');
    console.log('2. Click on Settings > Pages');
    console.log('3. Make sure "Source" is set to "Deploy from a branch"');
    console.log('4. Select "gh-pages" as the branch and "/ (root)" as the folder');
    console.log('5. Save the settings');
    console.log('\nAfter GitHub Pages processes the deployment (may take a few minutes),');
    console.log('your app should be available at: https://ngxsmk.github.io/ngxsmk-datepicker/');
} catch (error) {
    console.error('Error checking deployment:', error.message);
}