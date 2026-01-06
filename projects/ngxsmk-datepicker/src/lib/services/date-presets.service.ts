import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DatepickerValue } from '../utils/calendar.utils';

/**
 * Date preset interface
 */
export interface DatePreset {
  id: string;
  name: string;
  value: DatepickerValue;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  description?: string;
}

/**
 * Service for managing date presets with localStorage persistence
 */
@Injectable({
  providedIn: 'root'
})
export class DatePresetsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'ngxsmk-datepicker-presets';
  private presets: Map<string, DatePreset> = new Map();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPresets();
    }
  }

  /**
   * Save a date preset
   */
  savePreset(preset: Omit<DatePreset, 'id' | 'createdAt' | 'updatedAt'>): DatePreset {
    const id = this.generateId();
    const now = new Date();

    const fullPreset: DatePreset = {
      ...preset,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.presets.set(id, fullPreset);
    this.persistPresets();

    return fullPreset;
  }

  /**
   * Update an existing preset
   */
  updatePreset(id: string, updates: Partial<Omit<DatePreset, 'id' | 'createdAt'>>): DatePreset | null {
    const existing = this.presets.get(id);
    if (!existing) {
      return null;
    }

    const updated: DatePreset = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.presets.set(id, updated);
    this.persistPresets();

    return updated;
  }

  /**
   * Get a preset by ID
   */
  getPreset(id: string): DatePreset | null {
    return this.presets.get(id) || null;
  }

  /**
   * Get all presets
   */
  getAllPresets(): DatePreset[] {
    return Array.from(this.presets.values());
  }

  /**
   * Get presets by category
   */
  getPresetsByCategory(category: string): DatePreset[] {
    return Array.from(this.presets.values()).filter(p => p.category === category);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.presets.forEach(preset => {
      if (preset.category) {
        categories.add(preset.category);
      }
    });
    return Array.from(categories);
  }

  /**
   * Delete a preset
   */
  deletePreset(id: string): boolean {
    const deleted = this.presets.delete(id);
    if (deleted) {
      this.persistPresets();
    }
    return deleted;
  }

  /**
   * Clear all presets
   */
  clearPresets(): void {
    this.presets.clear();
    this.persistPresets();
  }

  /**
   * Apply a preset value (returns the value, not the preset object)
   */
  applyPreset(id: string): DatepickerValue | null {
    const preset = this.presets.get(id);
    if (!preset) {
      return null;
    }

    // Deep clone the value to avoid reference issues
    return this.cloneValue(preset.value);
  }

  /**
   * Check if a preset exists
   */
  hasPreset(id: string): boolean {
    return this.presets.has(id);
  }

  /**
   * Get preset count
   */
  getPresetCount(): number {
    return this.presets.size;
  }

  /**
   * Export presets to JSON
   */
  exportPresets(): string {
    const presetsArray = Array.from(this.presets.values());
    return JSON.stringify(presetsArray, null, 2);
  }

  /**
   * Import presets from JSON
   */
  importPresets(jsonString: string, merge: boolean = false): { imported: number; errors: number } {
    try {
      const presetsArray = JSON.parse(jsonString) as DatePreset[];
      let imported = 0;
      let errors = 0;

      presetsArray.forEach(preset => {
        try {
          // Validate preset structure
          if (!preset.id || !preset.name || preset.value === undefined) {
            errors++;
            return;
          }

          // Convert date strings to Date objects
          const processedPreset: DatePreset = {
            ...preset,
            createdAt: preset.createdAt ? new Date(preset.createdAt) : new Date(),
            updatedAt: preset.updatedAt ? new Date(preset.updatedAt) : new Date(),
            value: this.deserializeValue(preset.value),
          };

          if (merge && this.presets.has(processedPreset.id)) {
            // Update existing preset
            this.updatePreset(processedPreset.id, processedPreset);
          } else {
            // Add new preset
            this.presets.set(processedPreset.id, processedPreset);
          }
          imported++;
        } catch {
          errors++;
          // Silently handle import errors
        }
      });

      this.persistPresets();
      return { imported, errors };
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private methods

  private loadPresets(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const presetsArray = JSON.parse(stored) as DatePreset[];
        presetsArray.forEach(preset => {
          // Convert date strings to Date objects
          const processedPreset: DatePreset = {
            ...preset,
            createdAt: preset.createdAt ? new Date(preset.createdAt) : new Date(),
            updatedAt: preset.updatedAt ? new Date(preset.updatedAt) : new Date(),
            value: this.deserializeValue(preset.value),
          };
          this.presets.set(processedPreset.id, processedPreset);
        });
      }
    } catch {
      // Silently handle localStorage load errors
    }
  }

  private persistPresets(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const presetsArray = Array.from(this.presets.values());
      localStorage.setItem(this.storageKey, JSON.stringify(presetsArray));
    } catch {
      // Silently handle localStorage save errors
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private cloneValue(value: DatepickerValue): DatepickerValue {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Date) {
      return new Date(value.getTime());
    }

    if (Array.isArray(value)) {
      return value.map(date => new Date(date.getTime()));
    }

    if (typeof value === 'object' && 'start' in value && 'end' in value) {
      return {
        start: new Date(value.start.getTime()),
        end: new Date(value.end.getTime()),
      };
    }

    return value;
  }

  private deserializeValue(value: unknown): DatepickerValue {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      return new Date(value);
    }

    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'string') {
          return new Date(item);
        }
        return item instanceof Date ? item : new Date(item);
      });
    }

    if (typeof value === 'object' && value !== null && 'start' in value && 'end' in value) {
      const rangeValue = value as { start: unknown; end: unknown };
      const start = typeof rangeValue.start === 'string'
        ? new Date(rangeValue.start)
        : (rangeValue.start instanceof Date ? rangeValue.start : null);
      const end = typeof rangeValue.end === 'string'
        ? new Date(rangeValue.end)
        : (rangeValue.end instanceof Date ? rangeValue.end : null);

      if (start && end) {
        return { start, end };
      }
    }

    return null;
  }
}

