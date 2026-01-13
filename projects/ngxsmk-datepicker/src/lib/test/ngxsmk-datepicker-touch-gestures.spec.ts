import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent - Touch Gestures', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    fixture.detectChanges();
  });

  describe('Swipe Gestures', () => {
    function createTouchEvent(type: string, clientX: number, clientY: number): TouchEvent {
      const touch = {
        clientX,
        clientY,
        identifier: 0,
        screenX: clientX,
        screenY: clientY,
        pageX: clientX,
        pageY: clientY,
        target: document.body,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        force: 0
      } as Touch;

      const touches = type === 'touchend' ? [] : [touch];
      const changedTouches = type === 'touchend' ? [touch] : [touch];

      // Create array-like TouchList that supports both item() and array indexing
      const createTouchList = (touchArray: Touch[]): TouchList => {
        // Create a proper array-like object that supports [0] indexing
        const list = Object.assign([...touchArray], {
          length: touchArray.length,
          item: (index: number) => touchArray[index] || null,
          [Symbol.iterator]: function* () { for (const t of touchArray) yield t; }
        });
        return list as unknown as TouchList;
      };

      return {
        type,
        touches: createTouchList(touches),
        changedTouches: createTouchList(changedTouches),
        targetTouches: createTouchList([]),
        preventDefault: () => { },
        stopPropagation: () => { },
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 0,
        timeStamp: Date.now(),
        isTrusted: true,
        currentTarget: null,
        composed: false,
        cancelBubble: false,
        returnValue: true,
        srcElement: null,
        stopImmediatePropagation: () => { },
        initEvent: () => { },
        AT_TARGET: 0,
        BUBBLING_PHASE: 0,
        CAPTURING_PHASE: 0,
        NONE: 0
      } as unknown as TouchEvent;
    }

    it('should initialize swipe state', () => {
      expect(component['calendarSwipeStartX']).toBe(0);
      expect(component['calendarSwipeStartY']).toBe(0);
      expect(component['calendarSwipeStartTime']).toBe(0);
    });

    it('should record swipe start position and time', () => {
      const touchEvent = createTouchEvent('touchstart', 100, 200);
      component.onCalendarSwipeStart(touchEvent);

      // The method accesses event.touches[0], which should be available in our mock
      expect(component['calendarSwipeStartX']).toBe(100);
      expect(component['calendarSwipeStartY']).toBe(200);
      expect(component['calendarSwipeStartTime']).toBeGreaterThan(0);
    });

    it('should handle swipe move', () => {
      const startEvent = createTouchEvent('touchstart', 100, 200);
      component.onCalendarSwipeStart(startEvent);
      fixture.detectChanges();

      const moveEvent = createTouchEvent('touchmove', 150, 210);
      component.onCalendarSwipeMove(moveEvent);
      fixture.detectChanges();

      // calendarSwipeStartX should remain unchanged (it's the start position)
      expect(component['calendarSwipeStartX']).toBe(100);
    });

    it('should navigate to next month on left swipe', () => {
      const initialMonth = component.currentMonth;
      const startEvent = createTouchEvent('touchstart', 200, 100);
      component.onCalendarSwipeStart(startEvent);

      const moveEvent = createTouchEvent('touchmove', 50, 100);
      component.onCalendarSwipeMove(moveEvent);

      const endEvent = createTouchEvent('touchend', 50, 100);
      component.onCalendarSwipeEnd(endEvent);

      const expectedMonth = (initialMonth + 1) % 12;
      expect(component.currentMonth).toBe(expectedMonth);
    });

    it('should navigate to previous month on right swipe', () => {
      const initialMonth = component.currentMonth;
      const startEvent = createTouchEvent('touchstart', 50, 100);
      component.onCalendarSwipeStart(startEvent);

      const moveEvent = createTouchEvent('touchmove', 200, 100);
      component.onCalendarSwipeMove(moveEvent);

      const endEvent = createTouchEvent('touchend', 200, 100);
      component.onCalendarSwipeEnd(endEvent);

      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(component.currentMonth).toBe(expectedMonth);
    });

    it('should not navigate on vertical swipe', () => {
      const initialMonth = component.currentMonth;
      const startEvent = createTouchEvent('touchstart', 100, 100);
      component.onCalendarSwipeStart(startEvent);

      const moveEvent = createTouchEvent('touchmove', 100, 200);
      component.onCalendarSwipeMove(moveEvent);

      const endEvent = createTouchEvent('touchend', 100, 200);
      component.onCalendarSwipeEnd(endEvent);

      expect(component.currentMonth).toBe(initialMonth);
    });

    it('should reset swipe state after swipe end', () => {
      const startEvent = createTouchEvent('touchstart', 100, 200);
      component.onCalendarSwipeStart(startEvent);

      const endEvent = createTouchEvent('touchend', 50, 100);
      component.onCalendarSwipeEnd(endEvent);

      expect(component['calendarSwipeStartX']).toBe(0);
      expect(component['calendarSwipeStartY']).toBe(0);
      expect(component['calendarSwipeStartTime']).toBe(0);
    });
  });
});

