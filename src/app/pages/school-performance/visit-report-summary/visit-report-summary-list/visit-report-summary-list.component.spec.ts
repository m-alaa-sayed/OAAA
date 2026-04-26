import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportSummaryListComponent } from './visit-report-summary-list.component';

describe('VisitReportSummaryListComponent', () => {
  let component: VisitReportSummaryListComponent;
  let fixture: ComponentFixture<VisitReportSummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportSummaryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
