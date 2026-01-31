import { Injectable, signal, computed } from '@angular/core';
import { translations } from './translations';

export type SupportedLanguage = 'en' | 'de' | 'es' | 'sv' | 'ko' | 'zh' | 'ja' | 'fr';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private currentLang = signal<SupportedLanguage>('en');

    lang = this.currentLang.asReadonly();

    t = computed(() => translations[this.currentLang()]);

    setLanguage(lang: SupportedLanguage) {
        this.currentLang.set(lang);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('ngxsmk-lang', lang);
        }
    }

    constructor() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('ngxsmk-lang') as SupportedLanguage;
            if (saved && ['en', 'de', 'es', 'sv', 'ko', 'zh', 'ja', 'fr'].includes(saved)) {
                this.currentLang.set(saved);
            }
        }
    }
}
