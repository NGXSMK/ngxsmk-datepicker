import { Injectable, inject } from '@angular/core';
import { DatepickerTranslations } from '../interfaces/datepicker-translations.interface';
import { TranslationRegistryService } from './translation-registry.service';

export interface TranslationService {
  translate(key: string, params?: Record<string, string | number>): string;
  getCurrentLocale(): string;
}

@Injectable({ providedIn: 'root' })
export class DefaultTranslationService implements TranslationService {
  private translations: DatepickerTranslations;
  private locale: string = 'en';
  private readonly translationRegistry = inject(TranslationRegistryService);
  
  constructor() {
    this.translations = this.translationRegistry.getTranslations('en');
  }
  
  initialize(translations: DatepickerTranslations, locale: string = 'en'): void {
    this.translations = translations;
    this.locale = locale;
  }
  
  initializeFromLocale(locale: string): void {
    this.locale = locale;
    this.translations = this.translationRegistry.getTranslations(locale);
  }
  
  translate(key: string, params?: Record<string, string | number>): string {
    const translation = (this.translations as unknown as Record<string, string | ((params?: Record<string, string | number>) => string)>)[key];
    if (!translation) {
      return key;
    }
    
    if (params && typeof translation === 'string') {
      let result = translation;
      for (const [paramKey, paramValue] of Object.entries(params)) {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      }
      return result;
    }
    
    if (typeof translation === 'string') {
      return translation;
    }
    
    if (typeof translation === 'function') {
      return translation(params);
    }
    
    return key;
  }
  
  getCurrentLocale(): string {
    return this.locale;
  }
}

