import { Component, signal, HostListener, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ThemeService } from '@tokiforge/angular';
import { themeConfig } from './theme/theme.config';
import { I18nService, SupportedLanguage } from './i18n/i18n.service';
import { filter } from 'rxjs/operators';

const UI_KIT_PROMO_DISMISSED_KEY = 'ngxsmk-uikit-promo-dismissed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isSidebarOpen = false;
  isLangMenuOpen = false;
  showUiKitPromo = signal(false);

  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);

  toggleLangMenu(event: Event) {
    event.stopPropagation();
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isLangMenuOpen) {
      this.isLangMenuOpen = false;
    }
  }

  changeLang(lang: SupportedLanguage) {
    this.i18n.setLanguage(lang);
    this.isLangMenuOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  npmDownloads = signal<string>('...');

  public themeService = inject(ThemeService);
  public i18n = inject(I18nService);

  constructor() {
    this.themeService.init(themeConfig, {
      defaultTheme: 'dark',
      persist: true,
      watchSystemTheme: true,
    });
    // Sync data-theme attribute so CSS [data-theme="light"] overrides apply
    effect(() => {
      const theme = this.themeService.theme();
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    });
    this.fetchNpmDownloads();
    this.initSeo();
    this.scheduleUiKitPromo();
  }

  private scheduleUiKitPromo() {
    if (typeof localStorage === 'undefined') return;
    if (localStorage.getItem(UI_KIT_PROMO_DISMISSED_KEY)) return;
    setTimeout(() => this.showUiKitPromo.set(true), 2000);
  }

  dismissUiKitPromo() {
    this.showUiKitPromo.set(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(UI_KIT_PROMO_DISMISSED_KEY, '1');
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showUiKitPromo()) {
      this.dismissUiKitPromo();
    }
  }

  private initSeo() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;
        let pageTitle = 'Modern Angular DatePicker & Range Picker';
        let desc =
          'The #1 Signal-based, Zoneless date and range picker component for Angular 17-22+. Light, fast, accessible, with timezone dropdown, i18n, and secondary calendars.';

        if (url.includes('installation')) {
          pageTitle = 'Installation & Setup Guide';
          desc = 'Quick start guide for installing ngxsmk-datepicker via npm or ng add in Angular apps.';
        } else if (url.includes('integrations')) {
          pageTitle = 'Framework Integrations & Signal Forms';
          desc = 'Learn how to integrate ngxsmk-datepicker with Angular Signal Forms, Reactive Forms, Ionic, and SSR.';
        } else if (url.includes('examples')) {
          pageTitle = 'Interactive Code Examples & Demos';
          desc =
            'Explore date range selection, time selection, custom templates, and preset shortcuts with live code snippets.';
        } else if (url.includes('advanced')) {
          pageTitle = 'Advanced Features, Timezones & Secondary Calendars';
          desc =
            'Discover timezone selection, Hijri/Jalali secondary calendars, availability metadata, and natural language date typing.';
        } else if (url.includes('theming')) {
          pageTitle = 'Custom Theming & Design Tokens';
          desc = 'Customize ngxsmk-datepicker visual themes, dark mode, and TokiForge design token integration.';
        } else if (url.includes('architecture')) {
          pageTitle = 'Signal Architecture & Plugin System';
          desc =
            'Deep dive into the Signal-driven reactive engine, performance optimizations, and plugin architecture of ngxsmk-datepicker.';
        } else if (url.includes('api')) {
          pageTitle = 'API Reference & Component Inputs/Outputs';
          desc =
            'Complete API documentation listing all inputs, outputs, types, interfaces, and methods of ngxsmk-datepicker.';
        } else if (url.includes('playground')) {
          pageTitle = 'Interactive Live Playground';
          desc = 'Test all ngxsmk-datepicker configurations in real time with interactive property controls.';
        }

        const fullTitle = `${pageTitle} | NGXSMK DatePicker`;
        const canonicalUrl = `https://ngxsmk.com${url === '/' ? '' : url}`;

        this.title.setTitle(fullTitle);
        this.meta.updateTag({ name: 'description', content: desc });
        this.meta.updateTag({ property: 'og:title', content: fullTitle });
        this.meta.updateTag({ property: 'og:description', content: desc });
        this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
        this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
        this.meta.updateTag({ name: 'twitter:description', content: desc });
      });
  }

  private async fetchNpmDownloads() {
    try {
      const response = await fetch('https://api.npmjs.org/downloads/point/last-month/ngxsmk-datepicker');
      const data = await response.json();
      if (data && data.downloads) {
        this.npmDownloads.set(new Intl.NumberFormat().format(data.downloads));
      }
    } catch {
      this.npmDownloads.set('1k+'); // Fallback
    }
  }

  get navSections() {
    const t = this.i18n.t().nav;
    return [
      {
        label: t.gettingStarted,
        links: [
          { path: '/', label: t.introduction },
          { path: '/installation', label: t.installation },
          { path: '/integrations', label: t.integrations },
        ],
      },
      {
        label: t.usageGuides,
        links: [
          { path: '/examples', label: t.basicExamples },
          { path: '/advanced', label: t.advancedFeatures },
          { path: '/theming', label: t.customTheming },
        ],
      },
      {
        label: t.extensibility,
        links: [{ path: '/architecture', label: t.pluginArchitecture }],
      },
      {
        label: t.references,
        links: [
          { path: '/api', label: t.apiReference },
          { path: '/playground', label: t.playground },
        ],
      },
    ];
  }
}
