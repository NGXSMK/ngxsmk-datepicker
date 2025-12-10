# 🗺️ Roadmap

This roadmap outlines the planned features, improvements, and enhancements for ngxsmk-datepicker. We welcome community input and contributions!

## 🎯 Current Focus (Q4 2025 - Q1 2026)

### High Priority

- [x] **Accessibility Improvements** ✅ (v1.9.21)
  - Enhanced screen reader support
  - ARIA live regions for dynamic updates
  - Focus trap management in popover mode
  - High contrast mode support
  - *Completed in v1.9.21*

- [x] **Performance Optimizations** ✅ (v1.9.21)
  - Virtual scrolling infrastructure for large date ranges
  - Lazy loading of calendar months with intelligent caching
  - Memoization improvements for date calculations
  - *Completed in v1.9.21 - Infrastructure ready, full implementation in progress*

- [ ] **Enhanced Localization**
  - More locale-specific date formats
  - Custom date format patterns
  - Locale-aware number formatting
  - *Label: `enhancement`, `i18n`, `good-first-issue`*

### Medium Priority

- [x] **Advanced Date Selection** ✅ (v1.9.21)
  - Week selection mode
  - Month selection mode
  - Quarter selection mode
  - Year selection mode
  - *Completed in v1.9.21*

- [x] **Custom Date Formatting** ✅ (Implemented in v1.9.4)
  - Custom format strings (similar to Angular DatePipe) - `[displayFormat]` input
  - Format validation
  - Format presets
  - *Available in v1.9.4+*

- [ ] **Animation Customization**
  - Configurable animation durations
  - Custom animation presets
  - Reduced motion support
  - *Label: `enhancement`, `accessibility`*

- [ ] **Enhanced Time Selection**
  - Seconds selection
  - Timezone-aware time display (✅ Timezone utilities available via `timezone.utils`)
  - Time range selection
  - *Label: `enhancement`, `feature-request`*

## 🔮 Future Considerations

### Features Under Discussion

- [x] **Multi-Calendar Support** ✅ (Implemented in v1.9.12)
  - Display multiple months side-by-side - Available via `[calendarCount]` input
  - Configurable calendar count - Set `calendarCount` from 1 to 12
  - *Available via: `<ngxsmk-datepicker [calendarCount]="2">`*

- [x] **Date Presets** ✅ (Implemented in v1.9.12)
  - User-defined date presets - Available via `DatePresetsService.savePreset()`
  - Preset management API - Full CRUD operations via `DatePresetsService`
  - Preset categories - Supported via `category` property
  - *Available via: `import { DatePresetsService } from 'ngxsmk-datepicker'`*

- [x] **Export/Import Functionality** ✅ (Implemented)
  - Export selected dates to various formats (JSON, CSV, ICS) - Available via `exportToJson`, `exportToCsv`, `exportToIcs`
  - Import dates from external sources - Available via `importFromJson`, `importFromCsv`, `importFromIcs`
  - *Available in utils exports: `import { exportToJson, importFromJson } from 'ngxsmk-datepicker/utils'`*

- [x] **Advanced Styling** ✅ (Implemented in v1.9.12)
  - CSS-in-JS support - Available via `ThemeBuilderService.generateStyleObject()`
  - Theme builder tool - Available via `ThemeBuilderService.applyTheme()`
  - Component variants - Supported via theme customization
  - *Available via: `import { ThemeBuilderService, DatepickerTheme } from 'ngxsmk-datepicker'`*

- [x] **Integration Examples** ✅ (Implemented in v1.9.12)
  - Angular Material integration guide - Available in `docs/INTEGRATION.md`
  - Ionic integration guide - Available in `docs/INTEGRATION.md`
  - Tailwind CSS integration guide - Available in `docs/INTEGRATION.md`
  - *See: `projects/ngxsmk-datepicker/docs/INTEGRATION.md`*

## 🐛 Known Issues & Improvements

### Bug Fixes Needed

- [ ] Investigate and fix any reported accessibility issues
  - *Label: `bug`, `accessibility`*

- [ ] Performance improvements for large date ranges
  - *Label: `bug`, `performance`*

### Documentation Improvements

- [ ] Add more framework integration examples
  - *Label: `documentation`, `good-first-issue`*

- [ ] Create video tutorials
  - *Label: `documentation`, `help-wanted`*

- [ ] Add migration guides for major versions
  - *Label: `documentation`, `good-first-issue`*

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Good First Issues

Issues labeled with `good-first-issue` are perfect for new contributors:
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

### How to Contribute

1. Check the [Contributing Guide](CONTRIBUTING.md)
2. Look for issues labeled `good-first-issue` or `help-wanted`
3. Comment on the issue to let us know you're working on it
4. Submit a pull request following our guidelines

## 📅 Timeline

- **Q4 2025**: Focus on accessibility and performance
- **Q1 2026**: Enhanced localization and custom formatting
- **Q2 2026**: Advanced selection modes and multi-calendar support

*Note: Timeline is subject to change based on community feedback and priorities.*

## 💡 Suggest a Feature

Have an idea that's not on the roadmap? We'd love to hear it!

1. Check if it's already been requested in [issues](https://github.com/NGXSMK/ngxsmk-datepicker/issues)
2. If not, create a [feature request](https://github.com/NGXSMK/ngxsmk-datepicker/issues/new?template=feature_request.yml)
3. Engage with the community in [discussions](https://github.com/NGXSMK/ngxsmk-datepicker/discussions)

## 🏷️ Label Guide

We use labels to help organize issues:

- `good-first-issue` - Great for new contributors
- `help-wanted` - Community assistance needed
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation improvements
- `performance` - Performance-related
- `accessibility` - A11y improvements
- `i18n` - Internationalization
- `styling` - CSS/styling related
- `needs-triage` - Needs review/prioritization

---

**Last Updated**: December 10, 2025

*This roadmap is a living document and will be updated regularly based on community feedback and project needs.*

