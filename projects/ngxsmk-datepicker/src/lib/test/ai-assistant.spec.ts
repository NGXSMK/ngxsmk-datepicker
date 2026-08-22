import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { of } from 'rxjs';

describe('NgxsmkDatepickerComponent - AI Assistant Integration', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with enableAi as false by default', () => {
    expect(component.enableAi).toBe(false);
  });

  it('should emit aiPromptSubmitted event when prompt is submitted', async () => {
    spyOn(component.aiPromptSubmitted, 'emit');
    component.enableAi = true;

    await component.onAiPromptSubmitted('tomorrow');

    expect(component.aiPromptSubmitted.emit).toHaveBeenCalledWith('tomorrow');
  });

  it('should resolve natural language prompt using fallback parser when no custom resolver provided', async () => {
    component.enableAi = true;
    component.mode = 'single';

    await component.onAiPromptSubmitted('today');

    expect(component.selectedDate).toBeTruthy();
    const today = new Date();
    expect(component.selectedDate?.getDate()).toBe(today.getDate());
    expect(component.selectedDate?.getMonth()).toBe(today.getMonth());
  });

  it('should support custom Promise-based aiResolver', async () => {
    const customDate = new Date(2026, 11, 25);
    component.enableAi = true;
    component.aiResolver = async (prompt: string) => {
      if (prompt.includes('christmas')) {
        return customDate;
      }
      return null;
    };

    await component.onAiPromptSubmitted('christmas');

    expect(component.selectedDate).toEqual(customDate);
    expect(component.currentMonth).toBe(11);
    expect(component.currentYear).toBe(2026);
  });

  it('should support custom Observable-based aiResolver for date ranges', async () => {
    const range = {
      start: new Date(2026, 5, 1),
      end: new Date(2026, 5, 15),
    };
    component.enableAi = true;
    component.mode = 'range';
    component.aiResolver = () => of(range);

    await component.onAiPromptSubmitted('first half of june');

    expect(component.startDate).toEqual(range.start);
    expect(component.endDate).toEqual(range.end);
    expect(component.currentMonth).toBe(5);
    expect(component.currentYear).toBe(2026);
  });

  it('should have default aiSuggestions array', () => {
    expect(component.aiSuggestions.length).toBeGreaterThan(0);
    expect(component.showAiSuggestions).toBe(true);
  });

  it('should manage isAiResolving loading state during async AI prompt resolution', async () => {
    component.enableAi = true;
    let resolverCalled = false;
    component.aiResolver = () =>
      new Promise((resolve) => {
        resolverCalled = true;
        expect(component.isAiResolving).toBe(true);
        setTimeout(() => resolve(new Date(2026, 7, 22)), 10);
      });

    const promise = component.onAiPromptSubmitted('test date');
    expect(component.isAiResolving).toBe(true);

    await promise;
    expect(resolverCalled).toBe(true);
    expect(component.isAiResolving).toBe(false);
  });

  it('should handle slash shortcut to focus AI input when enableAi is true', () => {
    component.enableAi = true;
    component.isCalendarOpen = true;
    const event = new KeyboardEvent('keydown', { key: '/' });
    spyOn(event, 'preventDefault');

    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
