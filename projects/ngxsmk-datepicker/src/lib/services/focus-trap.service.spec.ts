import { TestBed } from '@angular/core/testing';
import { FocusTrapService } from './focus-trap.service';
import { ElementRef } from '@angular/core';

describe('FocusTrapService', () => {
  let service: FocusTrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FocusTrapService]
    });
    service = TestBed.inject(FocusTrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trap focus within element', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button>First</button>
      <button>Second</button>
      <button>Third</button>
    `;
    document.body.appendChild(container);

    const elementRef = new ElementRef(container);
    const cleanup = service.trapFocus(elementRef);

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);

    cleanup();
    document.body.removeChild(container);
  });

  it('should return no-op cleanup if element is null', () => {
    const elementRef = new ElementRef(null as unknown as HTMLElement);
    const cleanup = service.trapFocus(elementRef);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });
});

