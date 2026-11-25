import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  Injector,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '@tokiforge/angular';
import { themeConfig } from './theme/theme.config';
import { I18nService, SupportedLanguage } from './i18n/i18n.service';

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
  protected readonly isMobileLayout = signal(false);
  private readonly menuToggle = viewChild.required<ElementRef<HTMLButtonElement>>('menuToggle');
  private readonly sidebarNav = viewChild.required<ElementRef<HTMLElement>>('sidebarNav');
  private readonly injector = inject(Injector);

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
    if (this.isSidebarOpen) {
      this.closeSidebar();
      return;
    }
    this.isSidebarOpen = true;
    this.isLangMenuOpen = false;
    afterNextRender(
      () => {
        if (!this.isSidebarOpen) return;
        const navigation = this.sidebarNav().nativeElement;
        const activeLink = navigation.querySelector<HTMLElement>('a[aria-current="page"]');
        (activeLink ?? navigation.querySelector<HTMLElement>('a'))?.focus();
      },
      { injector: this.injector }
    );
  }

  closeSidebar() {
    if (!this.isSidebarOpen) return;
    this.isSidebarOpen = false;
    this.menuToggle().nativeElement.focus();
  }

  @HostListener('window:resize')
  syncSidebarLayout(): void {
    const mobile = window.matchMedia('(max-width: 1024px)').matches;
    this.isMobileLayout.set(mobile);
    if (!mobile) this.isSidebarOpen = false;
  }

  npmDownloads = signal<string>('...');
  hasCopiedInstall = signal(false);

  copyInstallCommand() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('npm install ngxsmk-datepicker');
      this.hasCopiedInstall.set(true);
      setTimeout(() => this.hasCopiedInstall.set(false), 2000);
    }
  }

  public themeService = inject(ThemeService);
  public i18n = inject(I18nService);

  constructor() {
    afterNextRender(() => {
      this.syncSidebarLayout();
      void this.fetchNpmDownloads();
    });
    this.themeService.init(themeConfig, {
      defaultTheme: 'light',
      persist: true,
      watchSystemTheme: false,
    });
    // One-time migration onto schedule board (asphalt / signal yellow)
    if (typeof localStorage !== 'undefined' && !localStorage.getItem('ngxsmk-demo-runway-v4')) {
      this.themeService.setTheme('light');
      localStorage.setItem('ngxsmk-demo-runway-v4', '1');
    }
    // Sync data-theme attribute so CSS [data-theme="light"] overrides apply
    effect(() => {
      const theme = this.themeService.theme();
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isLangMenuOpen = false;
    this.closeSidebar();
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
