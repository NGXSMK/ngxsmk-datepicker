# Contributing to ngxsmk-datepicker

Thank you for your interest in contributing to ngxsmk-datepicker! This document provides guidelines and instructions for contributing.

**Last updated:** February 25, 2026 · **Current stable:** v2.1.9

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

1. Update version in `package.json` and `projects/ngxsmk-datepicker/package.json`
2. Update CHANGELOG.md with all changes
3. Run `npm run build:optimized` to ensure build succeeds
4. Run `npm run build:analyze` to verify bundle size
5. Run all tests: `npm test`
6. Create git tag: `git tag v1.x.x`
7. Push tag: `git push origin v1.x.x`
8. Publish to npm: `npm publish` (or use semantic-release)

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

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

