# Contributing to ngxsmk-datepicker

Thank you for your interest in contributing to ngxsmk-datepicker! This document provides guidelines and instructions for contributing.

**Last updated:** May 19, 2026 - **Current stable:** v2.2.15

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (see `engines` in package.json)
- npm 10.x or higher
- Angular 17+ knowledge

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ngxsmk-datepicker.git
   cd ngxsmk-datepicker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the demo app:
   ```bash
   npm start
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes
- `perf:` - Performance improvements
- `ci:` - CI/CD configuration changes (GitHub Actions workflows)

Example:
```
feat: add keyboard navigation support
fix: resolve date range selection issue
docs: update README with SSR examples
```

### Pull Request Process

1. Create a feature branch from `main` or `develop`
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Ensure the build succeeds: `npm run build:optimized`
   - This automatically removes source maps from production builds
   - Use `npm run build:analyze` to check bundle size
5. Update documentation if needed
6. Create a pull request with a clear description

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Build succeeds (`npm run build:optimized`)
- [ ] Bundle size checked (`npm run build:analyze`)
- [ ] Linter passes (if configured)

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` over `type` for public APIs
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Angular

- Use standalone components
- Prefer `inject()` over constructor injection
- Use `OnPush` change detection strategy
- Guard browser-only APIs with platform checks

### Testing

- Write unit tests for new features
- Maintain or improve test coverage
- Test edge cases and error scenarios
- Test SSR compatibility when applicable

## Project Structure

```
projects/ngxsmk-datepicker/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # Utility functions
│   │   ├── issues/         # Issue-specific tests
│   │   └── styles/         # CSS files
│   └── public-api.ts       # Public API exports
├── docs/                    # Documentation
└── package.json
```

## Public API Guidelines

### Breaking Changes

Breaking changes require:
1. Major version bump (semver)
2. Migration guide in `MIGRATION.md`
3. Clear documentation in CHANGELOG.md
4. Deprecation notice (if applicable) in previous version

### Adding New Features

1. Update `public-api.ts` if exporting new types/components
2. Add tests
3. Update README.md with examples
4. Add JSDoc comments

### Deprecation Policy

We follow a clear deprecation strategy to ensure smooth upgrades:

- **Deprecation Period**: Deprecated features remain available for at least **2 major versions** before removal
- **Deprecation Warnings**: 
  - `@deprecated` JSDoc tags in code
  - Console warnings in development mode (when applicable)
  - Clear documentation in CHANGELOG.md
- **Migration Path**: 
  - Migration guides provided in `MIGRATION.md`
  - Code examples for upgrading
  - Alternative APIs documented
- **Breaking Changes**: 
  - Only occur in major version releases
  - Clearly documented in CHANGELOG.md
  - Migration guides provided for all breaking changes

#### Example Deprecation Process

1. **Version X.0.0**: Feature marked as deprecated with `@deprecated` tag
2. **Version X+1.0.0**: Feature still available, deprecation warnings continue
3. **Version X+2.0.0**: Feature removed, breaking change documented

## Testing

### Running Tests

```bash
# Run all tests (library + demo app)
npm test

# Run library tests only
npx ng test ngxsmk-datepicker --no-watch --browsers=ChromeHeadless

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npx ng test ngxsmk-datepicker --include="**/issue-13.spec.ts"
```

**Note**: The library tests require Zone.js polyfills, which are automatically configured in `angular.json`. If tests fail, ensure the test configuration includes the polyfills.

**Test Status**: All 353+ tests should pass. The test suite covers:
- Component functionality and edge cases
- Utility functions (date, calendar, timezone, performance)
- RTL support and locale detection
- Touch gestures and swipe handling
- Calendar views (year, decade, timeline, time-slider)
- Recurring dates and pattern matching
- SSR compatibility
- Keyboard navigation

### Writing Tests

- Use Jasmine/Karma
- Test both happy paths and edge cases
- Test SSR compatibility when applicable
- Test accessibility features
- Ensure tests work with OnPush change detection
- Test zone-less operation when applicable
- Use `.toEqual()` instead of `.toBe()` for Date objects and arrays
- Properly mock browser APIs (TouchEvent, document.dir) when testing
- Ensure change detection is called with `fixture.detectChanges()` where needed
- Verify component state after initialization before testing interactions

## Documentation

### README Updates

- Update README.md for user-facing changes
- Add examples for new features
- Update compatibility table if needed

### API Documentation

- Add JSDoc comments for public APIs
- Document parameters and return types
- Include usage examples in comments

## Build and Bundle Optimization

### Build Scripts

- `npm run build` - Development build
- `npm run build:optimized` - Production build with optimizations:
  - Removes source maps automatically
  - Optimized TypeScript compilation
  - Enhanced tree-shaking
- `npm run build:analyze` - Analyze bundle size (excludes source maps)

### Bundle Size Guidelines

- Main bundle target: ~127KB (excluding source maps)
- Source maps are automatically excluded from published package
- Use `npm run build:analyze` to verify bundle size before PR

## Release Process

The npm package **`ngxsmk-datepicker`** is published from `dist/ngxsmk-datepicker` after an `ng-packagr` production build. The `dist/` folder is **not** committed (`/dist` is gitignored), so publishing without building produces broken tarballs (see [issue #230](https://github.com/NGXSMK/ngxsmk-datepicker/issues/230)).

### Automated (recommended)

1. Merge release-worthy commits to `main` using [Conventional Commits](https://www.conventionalcommits.org/) (semantic-release uses them for versioning).
2. Ensure the repository has an **`NPM_TOKEN`** secret (npm Automation token).
3. The [Release workflow](.github/workflows/release.yml) runs `semantic-release`, which **builds the library in `prepare`** then publishes from `dist/ngxsmk-datepicker`.

### Manual publish

1. Run tests: `npm test -- --watch=false --browsers=ChromeHeadless`
2. Run `npm run publish:patch` (or `publish:beta`) — this runs `build:optimized`, copies root docs into `dist/ngxsmk-datepicker`, then `npm publish` from that directory.

Do **not** run `npm publish` from the workspace root (that package is `ngxsmk-datepicker-workspace`, not the library). Do **not** publish from `dist/ngxsmk-datepicker` unless you have just run `npm run build:optimized && npm run prepublish:copy-assets` and `node scripts/assert-dist-lib-ready.cjs` succeeds.

## Finding Issues to Work On

### Good First Issues

Look for issues labeled with `good-first-issue` - these are perfect for new contributors:
- Documentation improvements
- Small bug fixes
- Test additions
- Example code additions

### Help Wanted

Issues labeled with `help-wanted` need community assistance:
- Feature implementations
- Performance optimizations
- Integration examples
- Documentation enhancements

### Roadmap

Check the [Roadmap](ROADMAP.md) to see planned features and improvements. Issues linked to the roadmap are great candidates for contribution!

## Questions?

- Open an issue for questions (use the Question template)
- Check existing issues/PRs
- Review the [documentation](README.md)
- Check the [roadmap](ROADMAP.md) for planned features

## Visibility and discoverability

These steps help users find the library without changing code:

- **GitHub Topics** (repository settings): e.g. `angular`, `datepicker`, `date-range-picker`, `luxon`, `standalone-components`, `i18n`, `ssr`, `angular-universal`, `accessibility`, `ionic`.
- **Awesome lists**: many curated Angular lists accept a short addition via PR; follow each repo’s rules (description + link only, no spam).
- **Content**: technical posts or answers that link the [live demo](https://ngxsmk.github.io/ngxsmk-datepicker/) and state the problem solved (range mode, timezones, Signal Forms, etc.) are more useful than generic “use my package” posts.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.


