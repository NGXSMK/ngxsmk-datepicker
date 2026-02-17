# Publishing Guide

This document outlines the process for publishing new versions of `ngxsmk-datepicker` to npm.

**Last updated:** February 2026 · **Current stable:** v2.1.6

## Prerequisites

1. **npm Account**: You must have publish access to the `ngxsmk-datepicker` package on npm
2. **GitHub Access**: You must have push access to the repository
3. **Authentication**: Set up npm authentication (see below)

## Authentication Setup

### npm Token

1. Create an npm access token:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create a new "Automation" token
   - Copy the token

2. Add token to GitHub Secrets:
   - Go to repository Settings → Secrets and variables → Actions
   - Add a new secret named `NPM_TOKEN` with your npm token

### Local Publishing (Manual)

If you need to publish manually:

```bash
# Build the library
npm run build:optimized

# Copy assets to dist
npm run prepublish:copy-assets

# Navigate to dist and publish
cd dist/ngxsmk-datepicker
npm publish --tag latest
```

## Automated Publishing

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning and publishing.

### How It Works

1. **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` - New feature (minor version bump)
   - `fix:` - Bug fix (patch version bump)
   - `BREAKING CHANGE:` or `!` - Breaking change (major version bump)
   - `docs:` - Documentation only (no version bump)
   - `style:` - Code style changes (no version bump)
   - `refactor:` - Code refactoring (no version bump)
   - `test:` - Test additions/changes (no version bump)
   - `chore:` - Build process changes (no version bump)

2. **Automatic Versioning**: semantic-release analyzes commits and determines the next version

3. **Automatic Publishing**: When a new version is determined:
   - Creates a GitHub release
   - Publishes to npm
   - Updates CHANGELOG.md
   - Creates a git tag

### Example Commits

```bash
# Patch release (1.10.0 → 1.10.1)
git commit -m "fix: resolve z-index conflict with Ionic modals"

# Minor release (1.10.0 → 1.11.0)
git commit -m "feat: add new keyboard shortcut for next week"

# Major release (1.10.0 → 2.0.0)
git commit -m "feat!: redesign API for better performance

BREAKING CHANGE: The datepicker API has been redesigned. See MIGRATION.md for details."
```

## Version Strategy

- **Major (x.0.0)**: Breaking changes
- **Minor (x.y.0)**: New features, backward compatible
- **Patch (x.y.z)**: Bug fixes, backward compatible

## Pre-Release Checklist

Before triggering a release:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build:optimized`)
- [ ] No console errors
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated (if manual)
- [ ] Version in package.json matches (if manual)

## Post-Release Tasks

After a release:

- [ ] Verify package on npm: https://www.npmjs.com/package/ngxsmk-datepicker
- [ ] Verify GitHub release: https://github.com/NGXSMK/ngxsmk-datepicker/releases
- [ ] Update demo app if needed
- [ ] Announce release (if major/minor)

## Troubleshooting

### Release Failed

1. Check GitHub Actions logs
2. Verify npm token is valid
3. Check if version already exists on npm
4. Ensure commit messages follow conventional format

### Unpublish a Version

If you need to unpublish a version (use with caution):

```bash
npm run unpublish:version
```

**Note**: Unpublishing is only possible within 72 hours of publishing. After that, you must publish a new version.

## Security

- Never commit npm tokens to the repository
- Use GitHub Secrets for CI/CD
- Rotate tokens regularly
- Use "Automation" tokens, not "Publish" tokens for CI/CD

## Resources

- [semantic-release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

