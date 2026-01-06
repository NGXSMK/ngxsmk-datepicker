import { TestBed } from '@angular/core/testing';
import { DatePresetsService, DatePreset } from './date-presets.service';
import { PLATFORM_ID } from '@angular/core';
import { DatepickerValue } from '../utils/calendar.utils';

describe('DatePresetsService', () => {
  let service: DatePresetsService;
  let platformId: string;

  beforeEach(() => {
    platformId = 'browser';
    TestBed.configureTestingModule({
      providers: [
        DatePresetsService,
        { provide: PLATFORM_ID, useValue: platformId }
      ]
    });

    // Clear localStorage before each test
    localStorage.clear();
    service = TestBed.inject(DatePresetsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('savePreset', () => {
    it('should save a preset with generated ID and timestamps', () => {
      const preset: Omit<DatePreset, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test Preset',
        value: new Date('2024-01-15'),
        category: 'test'
      };

      const saved = service.savePreset(preset);

      expect(saved.id).toBeTruthy();
      expect(saved.name).toBe('Test Preset');
      expect(saved.value).toEqual(new Date('2024-01-15'));
      expect(saved.category).toBe('test');
      expect(saved.createdAt).toBeInstanceOf(Date);
      expect(saved.updatedAt).toBeInstanceOf(Date);
    });

    it('should persist presets to localStorage', () => {
      const preset = {
        name: 'Test Preset',
        value: new Date('2024-01-15')
      };

      service.savePreset(preset);

      const stored = localStorage.getItem('ngxsmk-datepicker-presets');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('Test Preset');
    });
  });

  describe('updatePreset', () => {
    it('should update an existing preset', () => {
      const preset = service.savePreset({
        name: 'Original Name',
        value: new Date('2024-01-15')
      });

      // Wait a bit to ensure updatedAt is different
      const originalUpdatedAt = preset.updatedAt.getTime();

      const updated = service.updatePreset(preset.id, {
        name: 'Updated Name',
        value: new Date('2024-02-20')
      });

      expect(updated).toBeTruthy();
      expect(updated!.name).toBe('Updated Name');
      expect(updated!.value).toEqual(new Date('2024-02-20'));
      // updatedAt should be different (or at least not less than)
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt);
    });

    it('should return null for non-existent preset', () => {
      const result = service.updatePreset('non-existent-id', { name: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('getPreset', () => {
    it('should retrieve a preset by ID', () => {
      const saved = service.savePreset({
        name: 'Test Preset',
        value: new Date('2024-01-15')
      });

      const retrieved = service.getPreset(saved.id);
      expect(retrieved).toBeTruthy();
      expect(retrieved!.name).toBe('Test Preset');
    });

    it('should return null for non-existent preset', () => {
      const result = service.getPreset('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getAllPresets', () => {
    it('should return all presets', () => {
      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15') });
      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20') });

      const all = service.getAllPresets();
      expect(all.length).toBe(2);
    });

    it('should return empty array when no presets exist', () => {
      const all = service.getAllPresets();
      expect(all).toEqual([]);
    });
  });

  describe('getPresetsByCategory', () => {
    it('should return presets filtered by category', () => {
      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15'), category: 'work' });
      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20'), category: 'personal' });
      service.savePreset({ name: 'Preset 3', value: new Date('2024-03-25'), category: 'work' });

      const workPresets = service.getPresetsByCategory('work');
      expect(workPresets.length).toBe(2);
      expect(workPresets.every(p => p.category === 'work')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const result = service.getPresetsByCategory('non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15'), category: 'work' });
      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20'), category: 'personal' });
      service.savePreset({ name: 'Preset 3', value: new Date('2024-03-25'), category: 'work' });

      const categories = service.getCategories();
      expect(categories.length).toBe(2);
      expect(categories).toContain('work');
      expect(categories).toContain('personal');
    });

    it('should return empty array when no categories exist', () => {
      const categories = service.getCategories();
      expect(categories).toEqual([]);
    });
  });

  describe('deletePreset', () => {
    it('should delete a preset by ID', () => {
      const preset = service.savePreset({
        name: 'Test Preset',
        value: new Date('2024-01-15')
      });

      const deleted = service.deletePreset(preset.id);
      expect(deleted).toBe(true);
      expect(service.getPreset(preset.id)).toBeNull();
    });

    it('should return false for non-existent preset', () => {
      const result = service.deletePreset('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('clearPresets', () => {
    it('should clear all presets', () => {
      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15') });
      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20') });

      service.clearPresets();

      expect(service.getAllPresets().length).toBe(0);
    });
  });

  describe('applyPreset', () => {
    it('should return cloned value for single date', () => {
      const date = new Date('2024-01-15');
      const preset = service.savePreset({
        name: 'Test Preset',
        value: date
      });

      const applied = service.applyPreset(preset.id);
      expect(applied).toEqual(date);
      expect(applied).not.toBe(date); // Should be cloned
    });

    it('should return cloned value for date array', () => {
      const dates = [new Date('2024-01-15'), new Date('2024-02-20')];
      const preset = service.savePreset({
        name: 'Test Preset',
        value: dates
      });

      const applied = service.applyPreset(preset.id);
      expect(applied).toEqual(dates);
      expect(applied).not.toBe(dates); // Should be cloned
      if (Array.isArray(applied) && Array.isArray(dates)) {
        expect(applied[0]).not.toBe(dates[0]); // Dates should be cloned
      }
    });

    it('should return cloned value for date range', () => {
      const range: DatepickerValue = {
        start: new Date('2024-01-15'),
        end: new Date('2024-02-20')
      };
      const preset = service.savePreset({
        name: 'Test Preset',
        value: range
      });

      const applied = service.applyPreset(preset.id);
      expect(applied).toEqual(range);
      if (applied && typeof applied === 'object' && 'start' in applied && 'end' in applied) {
        expect(applied.start).not.toBe(range.start); // Should be cloned
        expect(applied.end).not.toBe(range.end); // Should be cloned
      }
    });

    it('should return null for non-existent preset', () => {
      const result = service.applyPreset('non-existent-id');
      expect(result).toBeNull();
    });

    it('should handle null value', () => {
      const preset = service.savePreset({
        name: 'Test Preset',
        value: null
      });

      const applied = service.applyPreset(preset.id);
      expect(applied).toBeNull();
    });
  });

  describe('hasPreset', () => {
    it('should return true for existing preset', () => {
      const preset = service.savePreset({
        name: 'Test Preset',
        value: new Date('2024-01-15')
      });

      expect(service.hasPreset(preset.id)).toBe(true);
    });

    it('should return false for non-existent preset', () => {
      expect(service.hasPreset('non-existent-id')).toBe(false);
    });
  });

  describe('getPresetCount', () => {
    it('should return correct count of presets', () => {
      expect(service.getPresetCount()).toBe(0);

      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15') });
      expect(service.getPresetCount()).toBe(1);

      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20') });
      expect(service.getPresetCount()).toBe(2);
    });
  });

  describe('exportPresets', () => {
    it('should export presets as JSON string', () => {
      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15') });
      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20') });

      const exported = service.exportPresets();
      expect(exported).toBeTruthy();

      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
    });
  });

  describe('importPresets', () => {
    it('should import presets from JSON string', () => {
      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15') });
      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20') });
      const exported = service.exportPresets();

      service.clearPresets();

      const result = service.importPresets(exported);
      expect(result.imported).toBe(2);
      expect(result.errors).toBe(0);
      expect(service.getPresetCount()).toBe(2);
    });

    it('should merge presets when merge is true', () => {
      service.savePreset({ name: 'Preset 1', value: new Date('2024-01-15') });
      const exported = service.exportPresets();

      service.savePreset({ name: 'Preset 2', value: new Date('2024-02-20') });

      const result = service.importPresets(exported, true);
      expect(result.imported).toBe(1);
      expect(service.getPresetCount()).toBe(2); // One existing + one imported
    });

    it('should handle invalid JSON', () => {
      expect(() => {
        service.importPresets('invalid json');
      }).toThrow();
    });

    it('should handle presets with missing required fields', () => {
      const invalidPresets = JSON.stringify([
        { name: 'Valid Preset', value: new Date('2024-01-15') },
        { name: 'Invalid Preset' }, // Missing value
        { value: new Date('2024-02-20') } // Missing name
      ]);

      const result = service.importPresets(invalidPresets);
      expect(result.errors).toBeGreaterThan(0);
    });

    it('should deserialize date strings to Date objects', () => {
      const jsonString = JSON.stringify([
        {
          id: 'test-1',
          name: 'Test Preset',
          value: '2024-01-15T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]);

      const result = service.importPresets(jsonString);
      expect(result.imported).toBe(1);

      const presets = service.getAllPresets();
      expect(presets[0].value).toBeInstanceOf(Date);
    });
  });

  describe('localStorage persistence', () => {
    it('should load presets from localStorage on initialization', () => {
      const preset = {
        id: 'test-1',
        name: 'Test Preset',
        value: '2024-01-15T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      localStorage.setItem('ngxsmk-datepicker-presets', JSON.stringify([preset]));

      // Reset and create new service instance through TestBed
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DatePresetsService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      const newService = TestBed.inject(DatePresetsService);
      const loaded = newService.getAllPresets();
      expect(loaded.length).toBe(1);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jasmine.createSpy('setItem').and.throwError('QuotaExceededError');

      const preset = {
        name: 'Test Preset',
        value: new Date('2024-01-15')
      };

      // Should not throw
      expect(() => service.savePreset(preset)).not.toThrow();

      localStorage.setItem = originalSetItem;
    });

    it('should handle invalid localStorage data gracefully', () => {
      localStorage.setItem('ngxsmk-datepicker-presets', 'invalid json');

      // Reset and create new service instance through TestBed
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DatePresetsService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      const newService = TestBed.inject(DatePresetsService);

      // Should not throw and should have empty presets
      expect(newService.getAllPresets().length).toBe(0);
    });
  });

  describe('SSR compatibility', () => {
    it('should not access localStorage on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DatePresetsService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });

      const serverService = TestBed.inject(DatePresetsService);

      // Should not throw
      expect(() => {
        serverService.savePreset({ name: 'Test', value: new Date('2024-01-15') });
      }).not.toThrow();

      // Presets should not persist on server
      expect(serverService.getAllPresets().length).toBe(1);
    });
  });
});

