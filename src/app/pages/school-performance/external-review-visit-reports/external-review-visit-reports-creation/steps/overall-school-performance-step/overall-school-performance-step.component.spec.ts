import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallSchoolPerformanceStepComponent } from './overall-school-performance-step.component';

describe('OverallSchoolPerformanceStepComponent', () => {
  let component: OverallSchoolPerformanceStepComponent;
  let fixture: ComponentFixture<OverallSchoolPerformanceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallSchoolPerformanceStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallSchoolPerformanceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
