import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSelectComponent } from '../components/custom-select.component';
import { ThemeBuilderService } from '../services/theme-builder.service';
import { PLATFORM_ID } from '@angular/core';

/**
 * DOM manipulation tests
 * Tests ResizeObserver, element queries, style updates, and DOM interactions
 */
describe('DOM Manipulation Tests', () => {
  describe('ResizeObserver', () => {
    let component: CustomSelectComponent;
    let fixture: ComponentFixture<CustomSelectComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CustomSelectComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(CustomSelectComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should setup ResizeObserver when available', () => {
      if (typeof ResizeObserver !== 'undefined') {
        component.ngAfterViewInit();
        expect(component['resizeObserver']).toBeTruthy();
      }
    });

    it('should handle ResizeObserver not being available', () => {
      const originalResizeObserver = (window as unknown as Record<string, unknown>)['ResizeObserver'];
      delete (window as unknown as Record<string, unknown>)['ResizeObserver'];

      component.ngAfterViewInit();

      // Should not throw
      expect(() => {
        component.toggleDropdown();
      }).not.toThrow();

      (window as unknown as Record<string, unknown>)['ResizeObserver'] = originalResizeObserver;
    });

    it('should cleanup ResizeObserver on destroy', () => {
      if (typeof ResizeObserver !== 'undefined') {
        component.ngAfterViewInit();
        const resizeObserver = component['resizeObserver'];

        if (resizeObserver) {
          spyOn(resizeObserver, 'disconnect');
          component.ngOnDestroy();
          expect(resizeObserver.disconnect).toHaveBeenCalled();
        }
      }
    });

    it('should handle ResizeObserver callback', () => {
      if (typeof ResizeObserver !== 'undefined') {
        component.options = [
          { label: 'Option 1', value: 1 }
        ];
        component.isOpen = true;
        component.ngAfterViewInit();
        fixture.detectChanges();

        // ResizeObserver should be observing
        const resizeObserver = component['resizeObserver'];
        expect(resizeObserver).toBeTruthy();
      }
    });
  });

  describe('Element Queries', () => {
    it('should handle querySelector with existing element', () => {
      const element = document.createElement('div');
      element.className = 'test-element';
      document.body.appendChild(element);

      const found = document.querySelector('.test-element');
      expect(found).toBeTruthy();

      document.body.removeChild(element);
    });

    it('should handle querySelector with non-existent element', () => {
      const found = document.querySelector('.non-existent-element');
      expect(found).toBeNull();
    });

    it('should handle querySelectorAll with multiple elements', () => {
      const element1 = document.createElement('div');
      element1.className = 'test-class';
      const element2 = document.createElement('div');
      element2.className = 'test-class';
      document.body.appendChild(element1);
      document.body.appendChild(element2);

      const found = document.querySelectorAll('.test-class');
      expect(found.length).toBe(2);

      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });

    it('should handle querySelectorAll with no matches', () => {
      const found = document.querySelectorAll('.non-existent');
      expect(found.length).toBe(0);
    });

    it('should handle element.closest()', () => {
      const parent = document.createElement('div');
      parent.className = 'parent';
      const child = document.createElement('div');
      child.className = 'child';
      parent.appendChild(child);
      document.body.appendChild(parent);

      const closest = child.closest('.parent');
      expect(closest).toBe(parent);

      document.body.removeChild(parent);
    });

    it('should handle element.contains()', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);

      expect(parent.contains(child)).toBe(true);
      expect(parent.contains(parent)).toBe(true);
      expect(parent.contains(document.body)).toBe(false);
    });
  });

  describe('Style Updates', () => {
    it('should set CSS custom properties', () => {
      const element = document.createElement('div');
      element.style.setProperty('--test-color', '#ff0000');

      expect(element.style.getPropertyValue('--test-color')).toBe('#ff0000');
    });

    it('should remove CSS custom properties', () => {
      const element = document.createElement('div');
      element.style.setProperty('--test-color', '#ff0000');
      element.style.removeProperty('--test-color');

      expect(element.style.getPropertyValue('--test-color')).toBe('');
    });

    it('should set multiple style properties', () => {
      const element = document.createElement('div');
      element.style.setProperty('--color', '#ff0000');
      element.style.setProperty('--size', '16px');
      element.style.setProperty('--spacing', '8px');

      expect(element.style.getPropertyValue('--color')).toBe('#ff0000');
      expect(element.style.getPropertyValue('--size')).toBe('16px');
      expect(element.style.getPropertyValue('--spacing')).toBe('8px');
    });

    it('should handle getComputedStyle', () => {
      const element = document.createElement('div');
      element.style.setProperty('--test-color', '#ff0000');
      document.body.appendChild(element);

      const computed = window.getComputedStyle(element);
      // getComputedStyle may not return custom properties in all browsers
      // But it should not throw
      expect(computed).toBeTruthy();

      document.body.removeChild(element);
    });
  });

  describe('Theme Service DOM Operations', () => {
    let service: ThemeBuilderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ThemeBuilderService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });
      service = TestBed.inject(ThemeBuilderService);
    });

    afterEach(() => {
      service.cleanupAllThemes();
    });

    it('should create and append style element', () => {
      const theme = {
        colors: { primary: '#6d28d9' }
      };

      service.applyTheme(theme);

      const styleElement = document.querySelector('[data-datepicker-theme]');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
    });

    it('should remove style element on cleanup', () => {
      const theme = {
        colors: { primary: '#6d28d9' }
      };

      service.applyTheme(theme);
      service.cleanupAllThemes();

      const styleElement = document.querySelector('[data-datepicker-theme]');
      expect(styleElement).toBeFalsy();
    });

    it('should set data attributes on elements', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const theme = {
        colors: { primary: '#6d28d9' }
      };

      service.applyTheme(theme, element);

      expect(element.hasAttribute('data-theme-applied')).toBe(true);

      document.body.removeChild(element);
    });

    it('should remove data attributes on cleanup', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const theme = {
        colors: { primary: '#6d28d9' }
      };

      service.applyTheme(theme, element);
      service.removeTheme(element);

      expect(element.hasAttribute('data-theme-applied')).toBe(false);

      document.body.removeChild(element);
    });

    it('should handle multiple scoped style elements', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      document.body.appendChild(element1);
      document.body.appendChild(element2);

      const theme = {
        colors: { primary: '#6d28d9' }
      };

      service.applyTheme(theme, element1);
      service.applyTheme(theme, element2);

      const scopedStyles = document.querySelectorAll('[data-datepicker-theme-scoped]');
      expect(scopedStyles.length).toBe(2);

      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });
  });

  describe('Event Handling', () => {
    it('should handle click events', () => {
      const element = document.createElement('div');
      let clicked = false;

      element.addEventListener('click', () => {
        clicked = true;
      });

      element.click();
      expect(clicked).toBe(true);
    });

    it('should handle touch events', () => {
      const element = document.createElement('div');
      let touched = false;

      element.addEventListener('touchstart', () => {
        touched = true;
      });

      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true
      });

      element.dispatchEvent(touchEvent);
      expect(touched).toBe(true);
    });

    it('should handle keyboard events', () => {
      const element = document.createElement('div');
      element.tabIndex = 0;
      let keyPressed = false;

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          keyPressed = true;
        }
      });

      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true
      });

      element.dispatchEvent(keyEvent);
      expect(keyPressed).toBe(true);
    });

    it('should handle event propagation', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);

      let parentClicked = false;
      let childClicked = false;

      parent.addEventListener('click', () => {
        parentClicked = true;
      });

      child.addEventListener('click', (e) => {
        childClicked = true;
        e.stopPropagation();
      });

      child.click();

      expect(childClicked).toBe(true);
      expect(parentClicked).toBe(false);
    });
  });

  describe('DOM Mutation', () => {
    it('should handle appendChild', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');

      parent.appendChild(child);

      expect(parent.children.length).toBe(1);
      expect(parent.firstChild).toBe(child);
    });

    it('should handle removeChild', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);

      parent.removeChild(child);

      expect(parent.children.length).toBe(0);
    });

    it('should handle insertBefore', () => {
      const parent = document.createElement('div');
      const first = document.createElement('div');
      const second = document.createElement('div');
      parent.appendChild(first);

      parent.insertBefore(second, first);

      expect(parent.children[0]).toBe(second);
      expect(parent.children[1]).toBe(first);
    });

    it('should handle replaceChild', () => {
      const parent = document.createElement('div');
      const oldChild = document.createElement('div');
      const newChild = document.createElement('div');
      parent.appendChild(oldChild);

      parent.replaceChild(newChild, oldChild);

      expect(parent.children.length).toBe(1);
      expect(parent.firstChild).toBe(newChild);
    });
  });

  describe('Attribute Manipulation', () => {
    it('should set and get attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-test', 'value');

      expect(element.getAttribute('data-test')).toBe('value');
    });

    it('should remove attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-test', 'value');
      element.removeAttribute('data-test');

      expect(element.getAttribute('data-test')).toBeNull();
    });

    it('should check attribute existence', () => {
      const element = document.createElement('div');
      element.setAttribute('data-test', 'value');

      expect(element.hasAttribute('data-test')).toBe(true);
      expect(element.hasAttribute('data-other')).toBe(false);
    });

    it('should handle classList operations', () => {
      const element = document.createElement('div');
      element.classList.add('class1', 'class2');

      expect(element.classList.contains('class1')).toBe(true);
      expect(element.classList.contains('class2')).toBe(true);

      element.classList.remove('class1');
      expect(element.classList.contains('class1')).toBe(false);

      element.classList.toggle('class3');
      expect(element.classList.contains('class3')).toBe(true);
    });
  });
});

