import { TestBed } from '@angular/core/testing';
import { KeyboardNavigationService, KeyboardNavigationState, KeyboardNavigationConfig, KeyboardNavigationCallbacks } from './keyboard-navigation.service';
import { DatepickerHooks } from '../interfaces/datepicker-hooks.interface';

describe('KeyboardNavigationService', () => {
  let service: KeyboardNavigationService;
  let state: KeyboardNavigationState;
  let config: KeyboardNavigationConfig;
  let callbacks: KeyboardNavigationCallbacks;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardNavigationService]
    });
    
    service = TestBed.inject(KeyboardNavigationService);
    
    state = {
      currentDate: new Date('2024-01-15'),
      selectedDate: null,
      startDate: null,
      endDate: null,
      selectedDates: [],
      focusedDate: new Date('2024-01-15'),
      isCalendarOpen: true,
      mode: 'single',
      isRtl: false
    };

    config = {
      enableKeyboardShortcuts: true,
      isInlineMode: false
    };

    callbacks = {
      isDateValid: () => true,
      navigateDate: jasmine.createSpy('navigateDate'),
      changeMonth: jasmine.createSpy('changeMonth'),
      changeYear: jasmine.createSpy('changeYear'),
      navigateToFirstDay: jasmine.createSpy('navigateToFirstDay'),
      navigateToLastDay: jasmine.createSpy('navigateToLastDay'),
      selectToday: jasmine.createSpy('selectToday'),
      selectYesterday: jasmine.createSpy('selectYesterday'),
      selectTomorrow: jasmine.createSpy('selectTomorrow'),
      selectNextWeek: jasmine.createSpy('selectNextWeek'),
      onDateClick: jasmine.createSpy('onDateClick'),
      closeCalendar: jasmine.createSpy('closeCalendar'),
      onStateChanged: jasmine.createSpy('onStateChanged')
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when keyboard shortcuts are disabled', () => {
    it('should return false', () => {
      config.enableKeyboardShortcuts = false;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(false);
      expect(callbacks.navigateDate).not.toHaveBeenCalled();
    });
  });

  describe('Arrow keys', () => {
    it('should navigate left in LTR mode', () => {
      state.isRtl = false;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateDate).toHaveBeenCalledWith(-1, 0);
    });

    it('should navigate right in LTR mode', () => {
      state.isRtl = false;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateDate).toHaveBeenCalledWith(1, 0);
    });

    it('should navigate left in RTL mode (reversed)', () => {
      state.isRtl = true;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateDate).toHaveBeenCalledWith(1, 0);
    });

    it('should navigate right in RTL mode (reversed)', () => {
      state.isRtl = true;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateDate).toHaveBeenCalledWith(-1, 0);
    });

    it('should navigate up', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateDate).toHaveBeenCalledWith(0, -1);
    });

    it('should navigate down', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateDate).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('PageUp and PageDown', () => {
    it('should change month on PageUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageUp' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.changeMonth).toHaveBeenCalledWith(-1);
    });

    it('should change year on Shift+PageUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageUp', shiftKey: true });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.changeYear).toHaveBeenCalledWith(-1);
    });

    it('should change month on PageDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageDown' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.changeMonth).toHaveBeenCalledWith(1);
    });

    it('should change year on Shift+PageDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageDown', shiftKey: true });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.changeYear).toHaveBeenCalledWith(1);
    });
  });

  describe('Home and End keys', () => {
    it('should navigate to first day on Home', () => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateToFirstDay).toHaveBeenCalled();
    });

    it('should navigate to last day on End', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateToLastDay).toHaveBeenCalled();
    });
  });

  describe('Enter and Space keys', () => {
    it('should click focused date on Enter', () => {
      state.focusedDate = new Date('2024-01-15');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.onDateClick).toHaveBeenCalledWith(state.focusedDate);
    });

    it('should click focused date on Space', () => {
      state.focusedDate = new Date('2024-01-15');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.onDateClick).toHaveBeenCalledWith(state.focusedDate);
    });

    it('should not click if no focused date', () => {
      state.focusedDate = null;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.onDateClick).not.toHaveBeenCalled();
    });
  });

  describe('Escape key', () => {
    it('should close calendar in non-inline mode', () => {
      config.isInlineMode = false;
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.closeCalendar).toHaveBeenCalled();
    });

    it('should not close calendar in inline mode', () => {
      config.isInlineMode = true;
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.closeCalendar).not.toHaveBeenCalled();
    });
  });

  describe('Shortcut keys (t, y, n, w)', () => {
    it('should select today on t key', () => {
      const event = new KeyboardEvent('keydown', { key: 't' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectToday).toHaveBeenCalled();
    });

    it('should select today on T key', () => {
      const event = new KeyboardEvent('keydown', { key: 'T' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectToday).toHaveBeenCalled();
    });

    it('should not select today on Ctrl+t', () => {
      const event = new KeyboardEvent('keydown', { key: 't', ctrlKey: true });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(false);
      expect(callbacks.selectToday).not.toHaveBeenCalled();
    });

    it('should not select today on Meta+t', () => {
      const event = new KeyboardEvent('keydown', { key: 't', metaKey: true });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(false);
      expect(callbacks.selectToday).not.toHaveBeenCalled();
    });

    it('should select yesterday on y key', () => {
      const event = new KeyboardEvent('keydown', { key: 'y' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectYesterday).toHaveBeenCalled();
    });

    it('should select yesterday on Y key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Y' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectYesterday).toHaveBeenCalled();
    });

    it('should select tomorrow on n key', () => {
      const event = new KeyboardEvent('keydown', { key: 'n' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectTomorrow).toHaveBeenCalled();
    });

    it('should select tomorrow on N key', () => {
      const event = new KeyboardEvent('keydown', { key: 'N' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectTomorrow).toHaveBeenCalled();
    });

    it('should select next week on w key', () => {
      const event = new KeyboardEvent('keydown', { key: 'w' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectNextWeek).toHaveBeenCalled();
    });

    it('should select next week on W key', () => {
      const event = new KeyboardEvent('keydown', { key: 'W' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.selectNextWeek).toHaveBeenCalled();
    });
  });

  describe('custom shortcuts', () => {
    it('should handle custom shortcut', () => {
      const customHandler = jasmine.createSpy('customHandler').and.returnValue(true);
      config.customShortcuts = {
        'Ctrl+s': customHandler  // Key is lowercase in the shortcut key
      };
      
      const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(customHandler).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should not prevent default if custom handler returns false', () => {
      const customHandler = jasmine.createSpy('customHandler').and.returnValue(false);
      config.customShortcuts = {
        'Ctrl+s': customHandler
      };
      
      const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(false);
      expect(customHandler).toHaveBeenCalled();
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should build shortcut key correctly', () => {
      const customHandler = jasmine.createSpy('customHandler').and.returnValue(true);
      config.customShortcuts = {
        'Ctrl+Shift+a': customHandler  // Key is lowercase
      };
      
      const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, shiftKey: true });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(customHandler).toHaveBeenCalled();
    });
  });

  describe('hooks', () => {
    it('should call handleShortcut hook if provided', () => {
      const hooks: DatepickerHooks = {
        handleShortcut: jasmine.createSpy('handleShortcut').and.returnValue(true)
      };
      config.hooks = hooks;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(hooks.handleShortcut).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should not prevent default if hook returns false', () => {
      const hooks: DatepickerHooks = {
        handleShortcut: jasmine.createSpy('handleShortcut').and.returnValue(false)
      };
      config.hooks = hooks;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true); // ArrowLeft is still handled
      expect(hooks.handleShortcut).toHaveBeenCalled();
    });

    it('should fall through to default handlers if hook does not handle', () => {
      const hooks: DatepickerHooks = {
        handleShortcut: jasmine.createSpy('handleShortcut').and.returnValue(false)
      };
      config.hooks = hooks;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(true);
      expect(callbacks.navigateDate).toHaveBeenCalled();
    });
  });

  describe('unknown keys', () => {
    it('should return false for unknown keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'X' });
      
      const result = service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(result).toBe(false);
    });
  });

  describe('context building', () => {
    it('should build correct context for custom shortcuts', () => {
      const customHandler = jasmine.createSpy('customHandler').and.returnValue(true);
      config.customShortcuts = {
        'Ctrl+s': customHandler  // Key is lowercase
      };
      
      const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
      
      service.handleKeyboardNavigation(event, state, config, callbacks);
      
      expect(customHandler).toHaveBeenCalledWith(jasmine.objectContaining({
        currentDate: state.currentDate,
        selectedDate: state.selectedDate,
        startDate: state.startDate,
        endDate: state.endDate,
        selectedDates: state.selectedDates,
        mode: state.mode,
        focusedDate: state.focusedDate,
        isCalendarOpen: state.isCalendarOpen
      }));
    });
  });
});

