import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: `<ngxsmk-datepicker [responsive]="responsive" />`,
})
class TestHostComponent {
  responsive = true;
}

describe('Issue #299: Responsive option and CSS overrides', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should default responsive to true and not have ngxsmk-no-responsive class', () => {
    const wrapper = fixture.nativeElement.querySelector('.ngxsmk-datepicker-wrapper');
    expect(wrapper).toBeTruthy();
    expect(wrapper.classList.contains('ngxsmk-no-responsive')).toBeFalse();
  });

  it('should add ngxsmk-no-responsive class when responsive input is false', () => {
    host.responsive = false;
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('.ngxsmk-datepicker-wrapper');
    expect(wrapper).toBeTruthy();
    expect(wrapper.classList.contains('ngxsmk-no-responsive')).toBeTrue();
  });
});
