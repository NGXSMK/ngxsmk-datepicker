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
        let pageTitle = '#1 Angular DatePicker | NGXSMK Elite Signal-Based Date Selection';
        let desc =
          'The #1 Signal-based, Zoneless date and range picker component for Angular 17-21+. Light, fast, accessible, with timezone dropdown, i18n, presets, and secondary calendars.';
        let keywords =
          'angular datepicker, angular signals datepicker, zoneless angular datepicker, angular range picker, ngxsmk';

        if (url.includes('installation')) {
          pageTitle = 'Installation & Setup Guide | NGXSMK DatePicker';
          desc =
            'Quick start guide for installing ngxsmk-datepicker via npm, yarn, pnpm, or bun in modern Angular apps.';
          keywords =
            'install ngxsmk-datepicker, angular datepicker npm, setup angular calendar, standalone angular datepicker';
        } else if (url.includes('integrations')) {
          pageTitle = 'Framework Integrations & Signal Forms | NGXSMK DatePicker';
          desc =
            'Learn how to integrate ngxsmk-datepicker with Angular Material, Ionic, React, Vue, Signal Forms, and SSR.';
          keywords = 'angular material datepicker, ionic datepicker, reactive forms datepicker, angular signal forms';
        } else if (url.includes('examples')) {
          pageTitle = 'Interactive Code Examples & Selection Modes | NGXSMK DatePicker';
          desc =
            'Explore date range selection, time selection, custom templates, multiple dates, and preset shortcuts with live code snippets.';
          keywords =
            'angular datepicker examples, angular date range demo, angular timepicker example, multi date picker';
        } else if (url.includes('advanced')) {
          pageTitle = 'Advanced Features (Signals, Holidays, Masking, Timezones) | NGXSMK DatePicker';
          desc =
            'Discover timezone selection, Hijri/Jalali secondary calendars, holiday providers, async availability filtering, and natural language date typing.';
          keywords =
            'angular timezone picker, hijri jalali calendar angular, input mask datepicker, holiday provider angular';
        } else if (url.includes('theming')) {
          pageTitle = 'Custom CSS Theming & ThemeBuilderService | NGXSMK DatePicker';
          desc =
            'Customize ngxsmk-datepicker visual themes, CSS custom properties, glassmorphism, and ThemeBuilderService runtime themes.';
          keywords = 'angular datepicker theme, custom css datepicker, dark mode datepicker, themebuilder service';
        } else if (url.includes('architecture')) {
          pageTitle = 'Signal Architecture & Plugin System | NGXSMK DatePicker';
          desc =
            'Deep dive into the Signal-driven reactive engine, performance optimizations, and plugin architecture of ngxsmk-datepicker.';
          keywords = 'angular zoneless architecture, signal based ui component, angular high performance datepicker';
        } else if (url.includes('api')) {
          pageTitle = 'API Reference & Component Specs | NGXSMK DatePicker';
          desc =
            'Complete API documentation listing all inputs, outputs, types, interfaces, directives, and methods of ngxsmk-datepicker.';
          keywords = 'ngxsmk-datepicker api, angular datepicker inputs, datepicker interface types';
        } else if (url.includes('playground')) {
          pageTitle = 'Live Interactive Playground | NGXSMK DatePicker';
          desc =
            'Test and customize all ngxsmk-datepicker configurations in real time with interactive property controls.';
          keywords = 'angular datepicker playground, live demo datepicker, online calendar preview';
        }

        const canonicalUrl = `https://ngxsmk.com${url === '/' ? '' : url}`;

        this.title.setTitle(pageTitle);
        this.meta.updateTag({ name: 'description', content: desc });
        this.meta.updateTag({ name: 'keywords', content: keywords });
        this.meta.updateTag({ property: 'og:title', content: pageTitle });
        this.meta.updateTag({ property: 'og:description', content: desc });
        this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
        this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
        this.meta.updateTag({ name: 'twitter:description', content: desc });
        this.updateCanonicalUrl(canonicalUrl);
      });
  }

  private updateCanonicalUrl(url: string) {
    if (typeof document === 'undefined') return;
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
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
