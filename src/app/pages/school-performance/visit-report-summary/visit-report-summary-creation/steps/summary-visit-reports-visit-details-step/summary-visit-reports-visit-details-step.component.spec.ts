import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryVisitReportsVisitDetailsStepComponent } from './summary-visit-reports-visit-details-step.component';

describe('SummaryVisitReportsVisitDetailsStepComponent', () => {
  let component: SummaryVisitReportsVisitDetailsStepComponent;
  let fixture: ComponentFixture<SummaryVisitReportsVisitDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryVisitReportsVisitDetailsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryVisitReportsVisitDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
