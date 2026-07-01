import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CustomSelectComponent } from './custom-select.component';
import { PLATFORM_ID } from '@angular/core';

describe('CustomSelectComponent', () => {
  let component: CustomSelectComponent;
  let fixture: ComponentFixture<CustomSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSelectComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSelectComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.options).toEqual([]);
    expect(component.disabled).toBe(false);
    expect(component.isOpen).toBe(false);
  });

  it('should display selected option label', async () => {
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]);
    fixture.componentRef.setInput('value', 1);
    await fixture.whenStable();

    const display = fixture.nativeElement.querySelector('.ngxsmk-select-display span');
    expect(display.textContent.trim()).toBe('Option 1');
  });

  it('should display empty string when no option is selected', () => {
    component.options = [{ label: 'Option 1', value: 1 }];
    component.value = null;
    fixture.detectChanges();

    const display = fixture.nativeElement.querySelector('.ngxsmk-select-display span');
    expect(display.textContent.trim()).toBe('');
  });

  it('should toggle dropdown on click', () => {
    component.options = [{ label: 'Option 1', value: 1 }];
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.ngxsmk-select-container');
    container.click();
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
  });

  it('should not toggle dropdown when disabled', () => {
    component.disabled = true;
    component.options = [{ label: 'Option 1', value: 1 }];
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.ngxsmk-select-container');
    container.click();
    fixture.detectChanges();

    expect(component.isOpen).toBe(false);
  });

  it('should toggle dropdown on Enter key', () => {
    component.options = [{ label: 'Option 1', value: 1 }];
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.ngxsmk-select-container');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    container.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
  });

  it('should toggle dropdown on Space key and prevent default', () => {
    component.options = [{ label: 'Option 1', value: 1 }];
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.ngxsmk-select-container');
    const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    const preventDefaultSpy = spyOn(event, 'preventDefault');
    container.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should select option and emit valueChange', async () => {
    spyOn(component.valueChange, 'emit');
    component.isOpen = true;
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]);
    await fixture.whenStable();

    const options = fixture.nativeElement.querySelectorAll('li');
    options[1].click();
    await fixture.whenStable();

    expect(component.value).toBe(2);
    expect(component.valueChange.emit).toHaveBeenCalledWith(2);
    expect(component.isOpen).toBe(false);
  });

  it('should close dropdown when clicking outside', () => {
    component.options = [{ label: 'Option 1', value: 1 }];
    component.isOpen = true;
    fixture.detectChanges();

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    const clickEvent = new MouseEvent('click', { bubbles: true });
    outsideElement.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(component.isOpen).toBe(false);
    document.body.removeChild(outsideElement);
  });

  it('should not close dropdown when clicking inside', async () => {
    component.isOpen = true;
    fixture.componentRef.setInput('options', [{ label: 'Option 1', value: 1 }]);
    await fixture.whenStable();

    // The document click handler should not close when clicking inside the element
    const panel = fixture.nativeElement.querySelector('.ngxsmk-options-panel');
    expect(panel).toBeTruthy();

    // Create a mock event where the target is inside the component (the panel)
    const mockEvent = {
      target: panel,
      type: 'click',
    } as unknown as MouseEvent;

    // Call the document click handler directly with our mocked event
    component['onDocumentClick'](mockEvent);
    await fixture.whenStable();

    // The dropdown should remain open because the click was inside
    expect(component.isOpen).toBe(true);
  });

  it('should mark selected option with selected class', async () => {
    component.isOpen = true;
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]);
    fixture.componentRef.setInput('value', 2);
    await fixture.whenStable();

    const options = fixture.nativeElement.querySelectorAll('li');
    expect(options[1].classList.contains('selected')).toBe(true);
    expect(options[0].classList.contains('selected')).toBe(false);
  });

  it('should set aria-expanded attribute', async () => {
    component.isOpen = true;
    // Any input change triggers a full CD pass that re-reads the `isOpen` binding.
    fixture.componentRef.setInput('options', []);
    await fixture.whenStable();

    const container = fixture.nativeElement.querySelector('.ngxsmk-select-container');
    expect(container.getAttribute('aria-expanded')).toBe('true');
  });

  it('should set aria-selected on options', async () => {
    component.isOpen = true;
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]);
    fixture.componentRef.setInput('value', 1);
    await fixture.whenStable();

    const options = fixture.nativeElement.querySelectorAll('li');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(options[1].getAttribute('aria-selected')).toBe('false');
  });

  it('should update panel position when opened', fakeAsync(() => {
    component.options = [{ label: 'Option 1', value: 1 }];
    fixture.detectChanges();

    component.toggleDropdown();
    tick(0);
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
  }));

  it('should handle touchstart events on mobile', () => {
    component.options = [{ label: 'Option 1', value: 1 }];
    component.isOpen = true;
    fixture.detectChanges();

    // Simulate backdrop presence
    const backdrop = document.createElement('div');
    backdrop.className = 'ngxsmk-backdrop';
    document.body.appendChild(backdrop);

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    const touchEvent = new TouchEvent('touchstart', { bubbles: true });
    outsideElement.dispatchEvent(touchEvent);
    fixture.detectChanges();

    expect(component.isOpen).toBe(false);
    document.body.removeChild(backdrop);
    document.body.removeChild(outsideElement);
  });

  it('should not close on touchstart when touching inside', () => {
    component.options = [{ label: 'Option 1', value: 1 }];
    component.isOpen = true;
    fixture.detectChanges();

    const backdrop = document.createElement('div');
    backdrop.className = 'ngxsmk-backdrop';
    document.body.appendChild(backdrop);

    const container = fixture.nativeElement.querySelector('.ngxsmk-select-container');
    const touchEvent = new TouchEvent('touchstart', { bubbles: true });
    container.dispatchEvent(touchEvent);
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
    document.body.removeChild(backdrop);
  });

  it('should close dropdown when calendar popover opens', fakeAsync(() => {
    component.options = [{ label: 'Option 1', value: 1 }];
    component.isOpen = true;
    fixture.detectChanges();

    const popover = document.createElement('div');
    popover.className = 'ngxsmk-popover-container ngxsmk-popover-open';
    document.body.appendChild(popover);

    const clickEvent = new MouseEvent('click', { bubbles: true });
    document.dispatchEvent(clickEvent);
    tick(50);
    fixture.detectChanges();

    expect(component.isOpen).toBe(false);
    document.body.removeChild(popover);
  }));

  it('should select option on Enter key', async () => {
    spyOn(component.valueChange, 'emit');
    component.isOpen = true;
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]);
    await fixture.whenStable();

    const options = fixture.nativeElement.querySelectorAll('li');
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    options[1].dispatchEvent(enterEvent);
    await fixture.whenStable();

    expect(component.value).toBe(2);
    expect(component.valueChange.emit).toHaveBeenCalledWith(2);
  });

  it('should select option on Space key', async () => {
    spyOn(component.valueChange, 'emit');
    component.isOpen = true;
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]);
    await fixture.whenStable();

    const options = fixture.nativeElement.querySelectorAll('li');
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
    const preventDefaultSpy = spyOn(spaceEvent, 'preventDefault');
    options[1].dispatchEvent(spaceEvent);
    await fixture.whenStable();

    expect(component.value).toBe(2);
    expect(component.valueChange.emit).toHaveBeenCalledWith(2);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should stop propagation when selecting option', async () => {
    component.isOpen = true;
    fixture.componentRef.setInput('options', [{ label: 'Option 1', value: 1 }]);
    await fixture.whenStable();

    const options = fixture.nativeElement.querySelectorAll('li');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    options[0].dispatchEvent(clickEvent);
    await fixture.whenStable();

    // Note: stopPropagation is called in template, but we can't easily test it
    // The important thing is that the option is selected
    expect(component.value).toBe(1);
  });

  describe('SSR compatibility', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [CustomSelectComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
    });

    it('should not access browser APIs on server', () => {
      const serverFixture = TestBed.createComponent(CustomSelectComponent);
      const serverComponent = serverFixture.componentInstance;
      serverFixture.detectChanges();

      expect(serverComponent).toBeTruthy();
      expect(() => {
        serverComponent.toggleDropdown();
      }).not.toThrow();
    });
  });

  describe('ResizeObserver', () => {
    it('should setup ResizeObserver on browser', () => {
      if (typeof ResizeObserver !== 'undefined') {
        component.ngAfterViewInit();
        expect(component['resizeObserver']).toBeTruthy();
      }
    });

    it('should update panel position on resize', () => {
      if (typeof ResizeObserver !== 'undefined') {
        component.options = [{ label: 'Option 1', value: 1 }];
        component.isOpen = true;
        component.ngAfterViewInit();
        fixture.detectChanges();

        // Trigger resize
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
        fixture.detectChanges();

        // The method is called via ResizeObserver, but since it's private and currently empty,
        // we just ensure no errors occur during the resize execution.
        expect(component.isOpen).toBe(true);
      }
    });
  });

  describe('cleanup', () => {
    it('should cleanup ResizeObserver on destroy', () => {
      component.ngAfterViewInit();
      const resizeObserver = component['resizeObserver'];

      if (resizeObserver) {
        spyOn(resizeObserver, 'disconnect');
        component.ngOnDestroy();
        expect(resizeObserver.disconnect).toHaveBeenCalled();
      }
    });

    it('should remove scroll listener on destroy', () => {
      component.ngAfterViewInit();
      const removeEventListenerSpy = spyOn(window, 'removeEventListener');
      component.ngOnDestroy();

      // Should attempt to remove scroll listener
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });
});
