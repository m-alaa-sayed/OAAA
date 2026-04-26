import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryVisitReportStepComponent } from './summary-visit-report-step.component';

describe('SummaryVisitReportStepComponent', () => {
  let component: SummaryVisitReportStepComponent;
  let fixture: ComponentFixture<SummaryVisitReportStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryVisitReportStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryVisitReportStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
