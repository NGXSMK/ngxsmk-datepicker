import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';
import { DatePipe } from '@angular/common';
import { DayMetadata } from '../interfaces/day-metadata.interface';

describe('NgxsmkDatepickerComponent - dayMetadata', () => {
  let component: NgxsmkDatepickerComponent;
  let fixture: ComponentFixture<NgxsmkDatepickerComponent>;
  const day = new Date(2026, 6, 15);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsmkDatepickerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxsmkDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('merges metadata cssClass into day cell classes', () => {
    component.dayMetadata = () => ({ cssClass: 'sold-out' });
    expect(component.getDayCellCustomClasses(day)).toContain('sold-out');
  });

  it('supports cssClass arrays', () => {
    component.dayMetadata = () => ({ cssClass: ['a', 'b'] });
    const classes = component.getDayCellCustomClasses(day);
    expect(classes).toContain('a');
    expect(classes).toContain('b');
  });

  it('uses metadata tooltip when no hook overrides it', () => {
    component.dayMetadata = () => ({ tooltip: 'Only 2 rooms left' });
    expect(component.getDayCellTooltip(day)).toBe('Only 2 rooms left');
  });

  it('returns null metadata for days the provider skips', () => {
    component.dayMetadata = (d: Date): DayMetadata | null => (d.getDate() === 1 ? { label: 'x' } : null);
    expect(component.getDayMetadata(day)).toBeNull();
    expect(component.getDayMetadata(new Date(2026, 6, 1))).toEqual({ label: 'x' });
  });

  it('tolerates provider errors', () => {
    component.dayMetadata = () => {
      throw new Error('boom');
    };
    expect(component.getDayMetadata(day)).toBeNull();
    expect(component.getDayCellCustomClasses(day)).toEqual([]);
  });
});
