import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportSummaryActionsComponent } from './visit-report-summary-actions.component';

describe('VisitReportSummaryActionsComponent', () => {
  let component: VisitReportSummaryActionsComponent;
  let fixture: ComponentFixture<VisitReportSummaryActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportSummaryActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportSummaryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
