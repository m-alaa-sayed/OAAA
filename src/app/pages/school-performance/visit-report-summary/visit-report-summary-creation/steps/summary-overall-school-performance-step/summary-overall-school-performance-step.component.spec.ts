import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOverallSchoolPerformanceStepComponent } from './summary-overall-school-performance-step.component';

describe('SummaryOverallSchoolPerformanceStepComponent', () => {
  let component: SummaryOverallSchoolPerformanceStepComponent;
  let fixture: ComponentFixture<SummaryOverallSchoolPerformanceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryOverallSchoolPerformanceStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryOverallSchoolPerformanceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
