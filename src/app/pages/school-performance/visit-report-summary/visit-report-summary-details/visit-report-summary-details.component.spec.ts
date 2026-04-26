import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportSummaryDetailsComponent } from './visit-report-summary-details.component';

describe('VisitReportSummaryDetailsComponent', () => {
  let component: VisitReportSummaryDetailsComponent;
  let fixture: ComponentFixture<VisitReportSummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportSummaryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
