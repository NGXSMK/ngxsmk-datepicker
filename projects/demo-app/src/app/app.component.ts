import { Component, signal, HostListener, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ThemeService } from '@tokiforge/angular';
import { themeConfig } from './theme/theme.config';
import { I18nService, SupportedLanguage } from './i18n/i18n.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    isSidebarOpen = false;
    isLangMenuOpen = false;

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
            watchSystemTheme: true
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
    }

    private initSeo() {
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe((event) => {
            const url = event.urlAfterRedirects;
            let pageTitle = 'Elite DatePicker';

            if (url.includes('playground')) pageTitle = 'Interactive Playground';
            else if (url.includes('architecture')) pageTitle = 'Plugin Architecture';
            else if (url.includes('installation')) pageTitle = 'Fast Installation';
            else if (url.includes('examples')) pageTitle = 'Feature Showcase';
            else if (url.includes('advanced')) pageTitle = 'Advanced Features';

            this.title.setTitle(`${pageTitle} | NGXSMK DatePicker`);
            this.meta.updateTag({ name: 'description', content: `Experience ${pageTitle} in NGXSMK DatePicker - The best Signal-based, Zoneless date selection library for Angular.` });
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
                    { path: '/integrations', label: t.integrations }
                ]
            },
            {
                label: t.usageGuides,
                links: [
                    { path: '/examples', label: t.basicExamples },
                    { path: '/advanced', label: t.advancedFeatures },
                    { path: '/theming', label: t.customTheming }
                ]
            },
            {
                label: t.extensibility,
                links: [
                    { path: '/architecture', label: t.pluginArchitecture }
                ]
            },
            {
                label: t.references,
                links: [
                    { path: '/api', label: t.apiReference },
                    { path: '/playground', label: t.playground }
                ]
            }
        ];
    }
}
