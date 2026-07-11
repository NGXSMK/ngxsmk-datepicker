import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `
    <ngxsmk-datepicker
      [inline]="true"
      [calendarHeaderTemplate]="headerTpl"
      [calendarFooterTemplate]="footerTpl"
    ></ngxsmk-datepicker>
    <ng-template #headerTpl>
      <div class="custom-header">Pick a delivery date</div>
    </ng-template>
    <ng-template #footerTpl let-actions>
      <button type="button" class="custom-clear" (click)="actions.clear()">Reset</button>
      <button type="button" class="custom-close" (click)="actions.close()">Done</button>
    </ng-template>
  `,
})
class SlotsHostComponent {}

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `<ngxsmk-datepicker [inline]="true"></ngxsmk-datepicker>`,
})
class NoSlotsHostComponent {}

describe('NgxsmkDatepickerComponent - header/footer action slots', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotsHostComponent, NoSlotsHostComponent],
      providers: [DatePipe],
    }).compileComponents();
  });

  function create<T>(type: new () => T): ComponentFixture<T> {
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the custom header slot', () => {
    const fixture = create(SlotsHostComponent);
    const header = fixture.nativeElement.querySelector('.ngxsmk-custom-header-slot .custom-header');
    expect(header).withContext('custom header should render').toBeTruthy();
    expect(header.textContent).toContain('Pick a delivery date');
  });

  it('renders the custom footer instead of the default one', () => {
    const fixture = create(SlotsHostComponent);
    expect(fixture.nativeElement.querySelector('.ngxsmk-custom-footer-slot .custom-close')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.ngxsmk-close-button')).toBeNull();
  });

  it('renders no slots by default (inline mode has no default footer)', () => {
    const fixture = create(NoSlotsHostComponent);
    expect(fixture.nativeElement.querySelector('.ngxsmk-custom-header-slot')).toBeNull();
    expect(fixture.nativeElement.querySelector('.ngxsmk-custom-footer-slot')).toBeNull();
  });

  it('wires the clear action to the datepicker clearValue handler', () => {
    const fixture = create(SlotsHostComponent);
    const datepicker = fixture.debugElement.query(By.directive(NgxsmkDatepickerComponent))
      .componentInstance as NgxsmkDatepickerComponent;
    datepicker.selectedDate = new Date(2026, 6, 15);

    fixture.nativeElement.querySelector('.custom-clear').click();
    fixture.detectChanges();

    expect(datepicker.selectedDate).toBeNull();
  });
});
