# GitHub Pages Deployment Guide

This document explains how the ngxsmk-datepicker demo app is deployed to GitHub Pages.

**Last updated:** February 20, 2026 · **Current stable:** v2.1.7

## Automatic Deployment

The demo app is automatically deployed to GitHub Pages when changes are pushed to the main branch that affect:
- The demo app (`projects/demo-app/**`)
- The datepicker library (`projects/ngxsmk-datepicker/**`)
- The package.json
- The angular.json configuration

### Automatic Deployment Process

1. The GitHub Actions workflow (`.github/workflows/deploy-demo.yml`) is triggered
2. The demo app is built with production configuration
3. Files are copied to the correct directory structure (`ngxsmk-datepicker/` subdirectory)
4. The built files are deployed to the `gh-pages` branch
5. GitHub Pages serves the site from `https://ngxsmk.github.io/ngxsmk-datepicker/`

## Manual Deployment

For manual deployment, use the npm script:

```bash
npm run deploy
```

This will:
1. Build the demo app with production configuration
2. Create the correct directory structure for GitHub Pages
3. Deploy to the gh-pages branch

## Local Testing

To test the built app locally before deployment:

1. Build the app:
   ```bash
   npm run build:demo
   ```

2. For local testing with relative paths:
   ```bash
   npx ng build demo-app --configuration production --base-href ./
   ```
   Then open `dist/demo-app/browser/index.html` in your browser.

3. For testing with the correct GitHub Pages paths:
   ```bash
   npx ng build demo-app --configuration production
   ```
   Then serve the `dist/demo-app/browser` directory from a local server at the `/ngxsmk-datepicker/` path.

## GitHub Pages Configuration

To ensure GitHub Pages works correctly:

1. Go to your repository on GitHub
2. Click on **Settings** > **Pages**
3. Set **Source** to "Deploy from a branch"
4. Select **gh-pages** as the branch
5. Select **/(root)** as the folder
6. Click **Save**

## Troubleshooting

### 404 Errors for Assets

If you're seeing 404 errors for JavaScript or CSS files when opening the built app locally:

1. The app is built with `baseHref="/ngxsmk-datepicker/"` for GitHub Pages deployment
2. For local testing, either:
   - Use `--base-href ./` when building
   - Serve from a local server with the correct path structure
   - Modify the `<base href>` tag in `index.html` to `./`

### Deployment Fails

If deployment fails:

1. Check that you have push access to the repository
2. Verify the remote URL is correct: `git remote get-url origin`
3. Ensure the gh-pages branch exists: `git ls-remote origin gh-pages`

### GitHub Pages Not Updating

If GitHub Pages isn't showing the latest version:

1. Check the GitHub Actions tab to see if the deployment workflow ran successfully
2. Verify the gh-pages branch has the latest commit
3. GitHub Pages may take a few minutes to process changes

## File Structure

The deployed app has this structure on the gh-pages branch:

```
/
└── ngxsmk-datepicker/
    ├── index.html
    ├── main-[hash].js
    ├── polyfills-[hash].js
    ├── styles-[hash].css
    ├── favicon.ico
    ├── 404.html
    ├── .nojekyll
    ├── _redirects
    ├── robots.txt
    └── sitemap.xml
```

This structure ensures the app works correctly with the configured base href.