import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { CustomSelectComponent } from '../components/custom-select.component';
import { DatePipe } from '@angular/common';

function createMockEvent(type: string, path: Node[], target: Node): MouseEvent {
  const event = new MouseEvent(type, { bubbles: true });
  spyOn(event, 'composedPath').and.returnValue(path);
  Object.defineProperty(event, 'target', { value: target, writable: false });
  return event;
}

@Component({
  selector: 'app-shadow-container',
  template: `
    <ngxsmk-datepicker mode="single" [inline]="false" #datepicker></ngxsmk-datepicker>
    <ngxsmk-custom-select [options]="selectOptions" [value]="selectedValue" #customSelect></ngxsmk-custom-select>
  `,
  imports: [NgxsmkDatepickerComponent, CustomSelectComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
})
class ShadowContainerComponent {
  @ViewChild('datepicker') datepicker!: NgxsmkDatepickerComponent;
  @ViewChild('customSelect') customSelect!: CustomSelectComponent;

  selectOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ];
  selectedValue = 1;
}

describe('Shadow DOM & composedPath Compatibility', () => {
  let containerComponent: ShadowContainerComponent;
  let fixture: ComponentFixture<ShadowContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShadowContainerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(ShadowContainerComponent);
    containerComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('NgxsmkDatepickerComponent', () => {
    it('should identify target inside component via composedPath()', () => {
      const datepicker = containerComponent.datepicker;
      const nativeElement = datepicker['elementRef'].nativeElement;

      // Mock a node outside
      const outsideNode = document.createElement('div');
      // Mock a node inside
      const insideNode = document.createElement('span');

      // 1. When event has composedPath including the component's nativeElement
      const mockEvent = {
        composedPath: () => [insideNode, nativeElement, document.body],
      } as unknown as UIEvent;

      expect(datepicker.containsNode(outsideNode, mockEvent)).toBe(true);

      // 2. When event has composedPath NOT including the component's nativeElement
      const mockOutsideEvent = {
        composedPath: () => [outsideNode, document.body],
      } as unknown as UIEvent;

      expect(datepicker.containsNode(outsideNode, mockOutsideEvent)).toBe(false);
    });

    it('should fallback to contains() if composedPath is not available', () => {
      const datepicker = containerComponent.datepicker;
      const nativeElement = datepicker['elementRef'].nativeElement;

      const insideNode = document.createElement('span');
      nativeElement.appendChild(insideNode);

      // Call without event
      expect(datepicker.containsNode(insideNode)).toBe(true);

      const outsideNode = document.createElement('div');
      expect(datepicker.containsNode(outsideNode)).toBe(false);

      // Clean up
      insideNode.remove();
    });

    it('should not close calendar on document click if event composedPath includes nativeElement', fakeAsync(() => {
      const datepicker = containerComponent.datepicker;

      // Open the calendar
      datepicker.isCalendarOpen = true;
      datepicker['cdr'].markForCheck();
      fixture.detectChanges();
      tick(100);

      // Simulate a click event inside
      const nativeElement = datepicker['elementRef'].nativeElement;
      const insideNode = document.createElement('button');
      const mockEvent = createMockEvent('click', [insideNode, nativeElement, document.body], insideNode);

      datepicker.onDocumentClick(mockEvent);
      tick(100);

      expect(datepicker.isCalendarOpen).toBe(true);
    }));

    it('should close calendar on document click if event composedPath does not include nativeElement', fakeAsync(() => {
      const datepicker = containerComponent.datepicker;

      // Open the calendar
      datepicker.isCalendarOpen = true;
      datepicker['cdr'].markForCheck();
      fixture.detectChanges();
      tick(400); // Wait for protection time (300ms)

      // Simulate a click event outside
      const outsideNode = document.createElement('div');
      const mockEvent = createMockEvent('click', [outsideNode, document.body], outsideNode);

      datepicker.onDocumentClick(mockEvent);
      tick(100);

      expect(datepicker.isCalendarOpen).toBe(false);
    }));
  });

  describe('CustomSelectComponent', () => {
    it('should keep custom select open on document click if event composedPath includes nativeElement', fakeAsync(() => {
      const customSelect = containerComponent.customSelect;

      // Open select dropdown
      customSelect.isOpen = true;
      fixture.detectChanges();
      tick(100);

      // Simulate a click event inside
      const nativeElement = customSelect['elementRef'].nativeElement;
      const insideNode = document.createElement('li');
      const mockEvent = createMockEvent('click', [insideNode, nativeElement, document.body], insideNode);

      customSelect.onDocumentClick(mockEvent);
      tick(100);

      expect(customSelect.isOpen).toBe(true);
    }));

    it('should close custom select on document click if event composedPath does not include nativeElement', fakeAsync(() => {
      const customSelect = containerComponent.customSelect;

      // Open select dropdown
      customSelect.isOpen = true;
      fixture.detectChanges();
      tick(100);

      // Simulate a click event outside
      const outsideNode = document.createElement('div');
      const mockEvent = createMockEvent('click', [outsideNode, document.body], outsideNode);

      customSelect.onDocumentClick(mockEvent);
      tick(100);

      expect(customSelect.isOpen).toBe(false);
    }));
  });
});
